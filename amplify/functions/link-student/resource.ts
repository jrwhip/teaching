import { defineFunction } from '@aws-amplify/backend';

export const linkStudentFn = defineFunction({
  name: 'link-student',
  entry: './handler.ts',
  resourceGroupName: 'data',
});
