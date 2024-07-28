import { gql } from "@apollo/client";

export type UserCreateInput = {
  externalUserId: String;
  authenticationType: String;
  firstName: String;
  lastName?: String;
  email: String;
  userName: String;
  fromSignin: Boolean;
};

export type PimUser = {
  createdAt: String;
  updatedAt: String;
  deletedAt: String;
  createdBy: String;
  updatedBy: String;
  isActive: String;
  id: number;
  externalUserId: String;
  authenticationType: String;
  firstName: String;
  lastName: String;
  email: String;
  userName: String;
};

var CreateOrGetUser = gql`
  mutation CreateOrGetUser($input: UserCreateInput!) {
    createUser(input: $input) {
      createdAt
      updatedAt
      deletedAt
      createdBy
      updatedBy
      isActive
      id
      externalUserId
      authenticationType
      firstName
      lastName
      email
      userName
    }
  }
`;

var SignInAzureAD = gql`
  mutation signInAzureAD($input: AzureAdInput!) {
    signInAzureAD(input: $input) {
      id
      user {
        id
        externalUserId
        userName
        firstName
        lastName
        authenticationType
        email
        isActive
        profilePic
      }
      roles {
        roleId
        userId
        appId
      }
      auth_token
    }
  }
`;

export { CreateOrGetUser, SignInAzureAD };
