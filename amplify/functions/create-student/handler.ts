import type { AppSyncResolverHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminSetUserPasswordCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { requireEnv } from '../shared/env';

interface CreateStudentArgs {
  email: string;
  displayName: string;
  password: string;
  classroomId?: string;
  parentId?: string;
}

const cognitoClient = new CognitoIdentityProviderClient();
const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const USER_POOL_ID = requireEnv('USER_POOL_ID');
const USER_PROFILE_TABLE_NAME = requireEnv('USER_PROFILE_TABLE_NAME');
const CLASSROOM_TABLE_NAME = requireEnv('CLASSROOM_TABLE_NAME');
const CLASSROOM_ENROLLMENT_TABLE_NAME = requireEnv('CLASSROOM_ENROLLMENT_TABLE_NAME');
const PARENT_STUDENT_LINK_TABLE_NAME = requireEnv('PARENT_STUDENT_LINK_TABLE_NAME');

export const handler: AppSyncResolverHandler<CreateStudentArgs, unknown> = async (
  event
) => {
  const { email, displayName, password, classroomId, parentId } = event.arguments;
  const callerSub = event.identity && 'sub' in event.identity
    ? event.identity.sub
    : undefined;

  if (!callerSub) {
    throw new Error('Unauthorized: caller identity not found');
  }

  // Resolve caller's profile ID (for enrolledById)
  const callerQuery = await ddbClient.send(
    new QueryCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      IndexName: 'userProfilesByCognitoSub',
      KeyConditionExpression: 'cognitoSub = :sub',
      ExpressionAttributeValues: { ':sub': callerSub },
    })
  );
  const callerProfileId = callerQuery.Items?.[0]?.id as string | undefined;

  // 1. Create Cognito user with a temporary password (student never self-registers)
  let createUserResult;
  try {
    createUserResult = await cognitoClient.send(
      new AdminCreateUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'custom:role', Value: 'STUDENT' },
        ],
        MessageAction: 'SUPPRESS',
      })
    );
  } catch (err) {
    if (err instanceof UsernameExistsException) {
      throw new Error(`A user with email "${email}" already exists`);
    }
    throw err;
  }

  // Set a permanent password so the student never hits NEW_PASSWORD_REQUIRED
  await cognitoClient.send(
    new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    })
  );

  const studentSub = createUserResult.User?.Attributes?.find(
    (attr) => attr.Name === 'sub'
  )?.Value;

  if (!studentSub) {
    throw new Error('Failed to retrieve sub from created user');
  }

  // 2. Assign to STUDENT group
  await cognitoClient.send(
    new AdminAddUserToGroupCommand({
      GroupName: 'STUDENT',
      UserPoolId: USER_POOL_ID,
      Username: email,
    })
  );

  // 3. Build readAccess — includes the student and the creator
  const readAccess = [studentSub, callerSub];

  // If a parentId is provided, look up the parent's sub to add to readAccess
  if (parentId) {
    const parentProfile = await ddbClient.send(
      new GetCommand({
        TableName: USER_PROFILE_TABLE_NAME,
        Key: { id: parentId },
      })
    );
    const parentSub = parentProfile.Item?.cognitoSub as string | undefined;
    if (parentSub && !readAccess.includes(parentSub)) {
      readAccess.push(parentSub);
    }
  }

  const now = new Date().toISOString();
  const profileId = crypto.randomUUID();

  // 4. Create UserProfile
  const profile = {
    id: profileId,
    cognitoSub: studentSub,
    email,
    displayName,
    role: 'STUDENT',
    readAccess,
    createdAt: now,
    updatedAt: now,
  };

  await ddbClient.send(
    new PutCommand({
      TableName: USER_PROFILE_TABLE_NAME,
      Item: profile,
    })
  );

  // 5. If classroomId provided, create enrollment
  if (classroomId) {
    const classroom = await ddbClient.send(
      new GetCommand({
        TableName: CLASSROOM_TABLE_NAME,
        Key: { id: classroomId },
      })
    );

    if (!classroom.Item) {
      throw new Error(`Classroom ${classroomId} not found`);
    }

    const enrollmentReadAccess = [studentSub, callerSub];
    const teacherProfile = await ddbClient.send(
      new GetCommand({
        TableName: USER_PROFILE_TABLE_NAME,
        Key: { id: classroom.Item.teacherId as string },
      })
    );
    const teacherSub = teacherProfile.Item?.cognitoSub as string | undefined;
    if (teacherSub && !enrollmentReadAccess.includes(teacherSub)) {
      enrollmentReadAccess.push(teacherSub);
    }

    await ddbClient.send(
      new PutCommand({
        TableName: CLASSROOM_ENROLLMENT_TABLE_NAME,
        Item: {
          id: crypto.randomUUID(),
          classroomId,
          studentId: profileId,
          enrolledBy: parentId ? 'PARENT' : 'TEACHER',
          enrolledById: callerProfileId ?? callerSub,
          isActive: true,
          readAccess: enrollmentReadAccess,
          enrolledAt: now,
          createdAt: now,
          updatedAt: now,
        },
      })
    );

    // Atomically add student sub to classroom readAccess
    // (New student has no history, so no fan-out needed)
    await ddbClient.send(
      new UpdateCommand({
        TableName: CLASSROOM_TABLE_NAME,
        Key: { id: classroomId },
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
      if (err.name !== 'ConditionalCheckFailedException') throw err;
    });
  }

  // 6. If parentId provided, create ParentStudentLink
  if (parentId) {
    await ddbClient.send(
      new PutCommand({
        TableName: PARENT_STUDENT_LINK_TABLE_NAME,
        Item: {
          id: crypto.randomUUID(),
          parentId,
          studentId: profileId,
          relationship: 'guardian',
          readAccess: [callerSub, studentSub],
          createdAt: now,
          updatedAt: now,
        },
      })
    );
  }

  return profile;
};
