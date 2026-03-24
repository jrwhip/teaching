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

interface LinkStudentArgs {
  studentId: string;
  relationship?: string;
}

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const USER_PROFILE_TABLE_NAME = requireEnv('USER_PROFILE_TABLE_NAME');
const PARENT_STUDENT_LINK_TABLE_NAME = requireEnv('PARENT_STUDENT_LINK_TABLE_NAME');
const PROBLEM_ATTEMPT_TABLE_NAME = requireEnv('PROBLEM_ATTEMPT_TABLE_NAME');
const PERFORMANCE_COUNTER_TABLE_NAME = requireEnv('PERFORMANCE_COUNTER_TABLE_NAME');
const ASSIGNMENT_TABLE_NAME = requireEnv('ASSIGNMENT_TABLE_NAME');

export const handler: AppSyncResolverHandler<LinkStudentArgs, unknown> = async (
  event
) => {
  const { studentId, relationship } = event.arguments;
  const callerSub = event.identity && 'sub' in event.identity
    ? event.identity.sub
    : undefined;

  if (!callerSub) {
    throw new Error('Unauthorized: caller identity not found');
  }

  // 1. Get caller's profile (parent) by sub via GSI
  const callerQuery = await ddbClient.send(
    new QueryCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      IndexName: 'userProfilesByCognitoSub',
      KeyConditionExpression: 'cognitoSub = :sub',
      ExpressionAttributeValues: { ':sub': callerSub },
    })
  );

  const callerProfile = callerQuery.Items?.[0];
  if (!callerProfile) {
    throw new Error('Caller profile not found');
  }

  if (callerProfile.role !== 'PARENT') {
    throw new Error('Only parents can link to students');
  }

  // 2. Check for existing link (prevent duplicates)
  const existingLink = await ddbClient.send(
    new QueryCommand({
      TableName: PARENT_STUDENT_LINK_TABLE_NAME,
      IndexName: 'parentStudentLinksByParentId',
      KeyConditionExpression: 'parentId = :pid',
      FilterExpression: 'studentId = :sid',
      ExpressionAttributeValues: {
        ':pid': callerProfile.id as string,
        ':sid': studentId,
      },
    })
  );

  if (existingLink.Items && existingLink.Items.length > 0) {
    throw new Error('Parent is already linked to this student');
  }

  // 3. Get student profile
  const studentProfile = await ddbClient.send(
    new GetCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      Key: { id: studentId },
    })
  );

  if (!studentProfile.Item) {
    throw new Error(`Student ${studentId} not found`);
  }

  if (studentProfile.Item.role !== 'STUDENT') {
    throw new Error('Target user is not a student');
  }

  const studentSub = studentProfile.Item.cognitoSub as string;
  const now = new Date().toISOString();

  // 4. Create ParentStudentLink
  // readAccess includes parent, student, and any teachers already in student's readAccess
  const linkReadAccess = [callerSub, studentSub];
  const studentReadAccessList = (studentProfile.Item.readAccess as string[] | undefined) ?? [];
  for (const sub of studentReadAccessList) {
    if (sub !== studentSub && !linkReadAccess.includes(sub)) {
      linkReadAccess.push(sub);
    }
  }

  const link = {
    id: crypto.randomUUID(),
    parentId: callerProfile.id as string,
    studentId,
    relationship: relationship ?? 'guardian',
    readAccess: linkReadAccess,
    createdAt: now,
    updatedAt: now,
  };

  await ddbClient.send(
    new PutCommand({
      TableName: PARENT_STUDENT_LINK_TABLE_NAME,
      Item: link,
    })
  );

  // 5. Atomically add parent sub to student's UserProfile readAccess
  await ddbClient.send(
    new UpdateCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      Key: { id: studentId },
      UpdateExpression: 'SET #ra = list_append(if_not_exists(#ra, :empty), :subs), updatedAt = :now',
      ConditionExpression: 'NOT contains(#ra, :parentSub)',
      ExpressionAttributeNames: { '#ra': 'readAccess' },
      ExpressionAttributeValues: {
        ':subs': [callerSub],
        ':empty': [] as string[],
        ':parentSub': callerSub,
        ':now': now,
      },
    })
  ).catch((err: Error) => {
    if (err.name !== 'ConditionalCheckFailedException') throw err;
  });

  // 6. Fan-out parent sub into readAccess on all student's existing records
  await fanOutReadAccess(ddbClient, studentId, callerSub, [
    { tableName: PROBLEM_ATTEMPT_TABLE_NAME, indexName: 'problemAttemptsByStudentIdAndAttemptedAt' },
    { tableName: PERFORMANCE_COUNTER_TABLE_NAME, indexName: 'performanceCountersByStudentId' },
    { tableName: ASSIGNMENT_TABLE_NAME, indexName: 'assignmentsByStudentId' },
  ]);

  return link;
};
