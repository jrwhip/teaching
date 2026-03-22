import { defineBackend } from '@aws-amplify/backend';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createStudentFn } from './functions/create-student/resource';
import { joinClassroomFn } from './functions/join-classroom/resource';
import { linkStudentFn } from './functions/link-student/resource';

const backend = defineBackend({
  auth,
  data,
  createStudentFn,
  joinClassroomFn,
  linkStudentFn,
});

// ── Post-confirmation Lambda ─────────────────────────────────────────────
// Defined in auth/resource.ts via triggers + access (grants addUserToGroup).
// NOT included in defineBackend — it's internal to the auth stack.
// UserProfile creation happens client-side after first login to avoid
// circular dependency between auth and data stacks.

const userPool = backend.auth.resources.userPool;

// ── Custom mutation Lambdas → table grants ────────────────────────────────

const tables = backend.data.resources.tables;

const lambdaGrants: { lambda: LambdaFunction; tableNames: string[] }[] = [
  {
    lambda: backend.createStudentFn.resources.lambda as LambdaFunction,
    tableNames: ['UserProfile', 'Classroom', 'ClassroomEnrollment', 'ParentStudentLink'],
  },
  {
    lambda: backend.joinClassroomFn.resources.lambda as LambdaFunction,
    tableNames: ['UserProfile', 'Classroom', 'ClassroomEnrollment', 'ProblemAttempt', 'PerformanceCounter', 'Assignment'],
  },
  {
    lambda: backend.linkStudentFn.resources.lambda as LambdaFunction,
    tableNames: ['UserProfile', 'ParentStudentLink', 'ProblemAttempt', 'PerformanceCounter', 'Assignment'],
  },
];

for (const { lambda, tableNames } of lambdaGrants) {
  for (const tableName of tableNames) {
    const table = tables[tableName];
    if (!table) {
      throw new Error(
        `Table "${tableName}" not found in data resources. ` +
        `Verify the model name in data/resource.ts matches.`
      );
    }

    table.grantReadWriteData(lambda);
    lambda.addEnvironment(`${toEnvName(tableName)}_TABLE_NAME`, table.tableName);
  }
}

// ── create-student Lambda → Cognito User Pool ─────────────────────────────

const createStudentLambda = backend.createStudentFn.resources.lambda as LambdaFunction;
userPool.grant(
  createStudentLambda,
  'cognito-idp:AdminCreateUser',
  'cognito-idp:AdminAddUserToGroup'
);
createStudentLambda.addEnvironment('USER_POOL_ID', userPool.userPoolId);

/** Convert PascalCase model name to UPPER_SNAKE_CASE for env var prefix */
function toEnvName(pascalCase: string): string {
  return pascalCase
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toUpperCase();
}
