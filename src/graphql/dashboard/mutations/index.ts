import { gql } from "@apollo/client";

var INVITE_USER_TO_THE_APP = gql`
mutation inviteUserToApp($inviteUserInput: UserCreateInput!) {
    inviteUserToApp(inviteUserInput: $inviteUserInput) {
      id
      firstName
      email
      externalUserId
      Request {
        id
        requestStatus
      }
    }
  }
`;

export { INVITE_USER_TO_THE_APP };