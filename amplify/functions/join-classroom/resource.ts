import { defineFunction } from '@aws-amplify/backend';

export const joinClassroomFn = defineFunction({
  name: 'join-classroom',
  entry: './handler.ts',
  resourceGroupName: 'data',
});
