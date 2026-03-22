import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';

export const auth = defineAuth({
  loginWith: { email: true },
  groups: ['TEACHER', 'PARENT', 'STUDENT'],
  userAttributes: {
    'custom:role': {
      dataType: 'String',
      mutable: false,
      minLen: 5,
      maxLen: 7,
    },
  },
  triggers: {
    postConfirmation,
  },
  access: (allow) => [
    allow.resource(postConfirmation).to(['addUserToGroup']),
  ],
});
