import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient();

/**
 * Post-confirmation trigger: assigns the user to the correct Cognito group
 * based on the custom:role attribute from the signup flow.
 *
 * UserProfile creation happens on the client side after first login
 * (via a GraphQL mutation) to avoid a circular dependency between
 * the auth and data CloudFormation stacks.
 */
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const { userPoolId, userName } = event;
  const role =
    (event.request.userAttributes['custom:role'] as
      | 'TEACHER'
      | 'PARENT'
      | undefined) ?? 'PARENT';

  await cognitoClient.send(
    new AdminAddUserToGroupCommand({
      GroupName: role,
      UserPoolId: userPoolId,
      Username: userName,
    })
  );

  return event;
};
