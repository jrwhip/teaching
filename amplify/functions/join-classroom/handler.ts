import type { AppSyncResolverHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { requireEnv } from '../shared/env';
import { fanOutReadAccess } from '../shared/fan-out';

interface JoinClassroomArgs {
  inviteCode: string;
  studentId: string;
}

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const USER_PROFILE_TABLE_NAME = requireEnv('USER_PROFILE_TABLE_NAME');
const CLASSROOM_TABLE_NAME = requireEnv('CLASSROOM_TABLE_NAME');
const CLASSROOM_ENROLLMENT_TABLE_NAME = requireEnv('CLASSROOM_ENROLLMENT_TABLE_NAME');
const PROBLEM_ATTEMPT_TABLE_NAME = requireEnv('PROBLEM_ATTEMPT_TABLE_NAME');
const PERFORMANCE_COUNTER_TABLE_NAME = requireEnv('PERFORMANCE_COUNTER_TABLE_NAME');
const ASSIGNMENT_TABLE_NAME = requireEnv('ASSIGNMENT_TABLE_NAME');

export const handler: AppSyncResolverHandler<JoinClassroomArgs, unknown> = async (
  event
) => {
  const { inviteCode, studentId } = event.arguments;
  const callerSub = event.identity && 'sub' in event.identity
    ? event.identity.sub
    : undefined;

  if (!callerSub) {
    throw new Error('Unauthorized: caller identity not found');
  }

  // 1. Look up classroom by invite code (GSI query)
  const classroomQuery = await ddbClient.send(
    new QueryCommand({
      TableName: CLASSROOM_TABLE_NAME,
      IndexName: 'classroomsByInviteCode',
      KeyConditionExpression: 'inviteCode = :code',
      ExpressionAttributeValues: { ':code': inviteCode },
    })
  );

  const classroom = classroomQuery.Items?.[0];
  if (!classroom) {
    throw new Error('Invalid invite code');
  }

  if (!classroom.isActive) {
    throw new Error('Classroom is no longer active');
  }

  // 2. Check for existing enrollment (prevent duplicates)
  const existingEnrollment = await ddbClient.send(
    new QueryCommand({
      TableName: CLASSROOM_ENROLLMENT_TABLE_NAME,
      IndexName: 'classroomEnrollmentsByStudentId',
      KeyConditionExpression: 'studentId = :sid',
      FilterExpression: 'classroomId = :cid',
      ExpressionAttributeValues: {
        ':sid': studentId,
        ':cid': classroom.id as string,
      },
    })
  );

  if (existingEnrollment.Items && existingEnrollment.Items.length > 0) {
    throw new Error('Student is already enrolled in this classroom');
  }

  // 3. Get student profile for their sub
  const studentProfile = await ddbClient.send(
    new GetCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      Key: { id: studentId },
    })
  );

  if (!studentProfile.Item) {
    throw new Error(`Student ${studentId} not found`);
  }

  const studentSub = studentProfile.Item.cognitoSub as string;

  // 4. Get teacher profile for their sub
  const teacherProfile = await ddbClient.send(
    new GetCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      Key: { id: classroom.teacherId as string },
    })
  );

  const teacherSub = teacherProfile.Item?.cognitoSub as string | undefined;
  if (!teacherSub) {
    throw new Error('Classroom teacher profile not found');
  }

  // Resolve caller's profile ID for enrolledById
  const callerQuery = await ddbClient.send(
    new QueryCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      IndexName: 'userProfilesByCognitoSub',
      KeyConditionExpression: 'cognitoSub = :sub',
      ExpressionAttributeValues: { ':sub': callerSub },
    })
  );
  const callerProfileId = callerQuery.Items?.[0]?.id as string | undefined;

  const now = new Date().toISOString();
  const enrollmentId = crypto.randomUUID();

  // Build enrollment readAccess: student, teacher, and caller (parent if different)
  const enrollmentReadAccess = [studentSub, teacherSub];
  if (!enrollmentReadAccess.includes(callerSub)) {
    enrollmentReadAccess.push(callerSub);
  }

  // 5. Create enrollment record
  const enrollment = {
    id: enrollmentId,
    classroomId: classroom.id as string,
    studentId,
    enrolledBy: callerSub === teacherSub ? 'TEACHER' : 'PARENT',
    enrolledById: callerProfileId ?? callerSub,
    isActive: true,
    readAccess: enrollmentReadAccess,
    enrolledAt: now,
    createdAt: now,
    updatedAt: now,
  };

  await ddbClient.send(
    new PutCommand({
      TableName: CLASSROOM_ENROLLMENT_TABLE_NAME,
      Item: enrollment,
    })
  );

  // 6. Atomically add student sub to classroom readAccess
  await ddbClient.send(
    new UpdateCommand({
      TableName: CLASSROOM_TABLE_NAME,
      Key: { id: classroom.id as string },
      UpdateExpression: 'SET #ra = list_append(if_not_exists(#ra, :empty), :subs), updatedAt = :now',
      ConditionExpression: 'NOT contains(#ra, :studentSub)',
      ExpressionAttributeNames: { '#ra': 'readAccess' },
      ExpressionAttributeValues: {
        ':subs': [studentSub],
        ':empty': [] as string[],
        ':studentSub': studentSub,
        ':now': now,
      },
    })
  ).catch((err: Error) => {
    // ConditionalCheckFailedException means sub is already in readAccess — that's fine
    if (err.name !== 'ConditionalCheckFailedException') throw err;
  });

  // 7. Atomically add teacher sub to student's UserProfile readAccess
  await ddbClient.send(
    new UpdateCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      Key: { id: studentId },
      UpdateExpression: 'SET #ra = list_append(if_not_exists(#ra, :empty), :subs), updatedAt = :now',
      ConditionExpression: 'NOT contains(#ra, :teacherSub)',
      ExpressionAttributeNames: { '#ra': 'readAccess' },
      ExpressionAttributeValues: {
        ':subs': [teacherSub],
        ':empty': [] as string[],
        ':teacherSub': teacherSub,
        ':now': now,
      },
    })
  ).catch((err: Error) => {
    if (err.name !== 'ConditionalCheckFailedException') throw err;
  });

  // 8. Fan-out teacher sub into readAccess on all student's existing records
  await fanOutReadAccess(ddbClient, studentId, teacherSub, [
    { tableName: PROBLEM_ATTEMPT_TABLE_NAME, indexName: 'problemAttemptsByStudentIdAndAttemptedAt' },
    { tableName: PERFORMANCE_COUNTER_TABLE_NAME, indexName: 'performanceCountersByStudentId' },
    { tableName: ASSIGNMENT_TABLE_NAME, indexName: 'assignmentsByStudentId' },
  ]);

  return enrollment;
};
