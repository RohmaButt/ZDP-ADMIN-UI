import { gql } from "@apollo/client";

const GET_ACTIVE_USERS = gql`
  query GetAllUser($pagination: PaginationInput!) {
    getAllUser(pagination: $pagination) {
      data {
        id
        firstName
        userName
        externalUserId
        authenticationType
        email
        isActive
      }
      totalRecords
    }
  }
`;

const GET_USERS = gql`
  query getUsers($pagination: PaginationInput!) {
    getUsers(pagination: $pagination) {
      data {
        id
        firstName
        userName
        externalUserId
        authenticationType
        email
        isActive
        userRole {
          id
          roleId
          role {
            name
          }
        }
        # userRole {
        #   id
        #   roleId
        #   role {
        #       name
        #   }
      }
      totalRecords
    }
  }
`;

const GET_USER_REQUEST_BY_STATUS = gql`
query getUserRequestsByStatus($param:UserParams!, $inviteStatus:String!, $pagination:PaginationInput!){
  getUserRequestsByStatus(param:$param, inviteStatus:$inviteStatus, pagination:$pagination){
    data{
       id
      requestStatus
      payload
      requestType
      contextId
      createdAt
    }
  }
}
`;

const GET_USER_BY_ID = gql`
  query getUserById($param: UserParams!) {
    getUserById(param: $param) {
      id
      firstName
      userName
      externalUserId
      authenticationType
      email
      isActive
      userRole {
        roleId
        userId
        appId
      }
    }
  }
`;

export { GET_ACTIVE_USERS, GET_USERS, GET_USER_REQUEST_BY_STATUS, GET_USER_BY_ID };
