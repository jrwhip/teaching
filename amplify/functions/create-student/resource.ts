import { defineFunction } from '@aws-amplify/backend';

export const createStudentFn = defineFunction({
  name: 'create-student',
  entry: './handler.ts',
  resourceGroupName: 'data',
});
