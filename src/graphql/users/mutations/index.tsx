import { gql } from "@apollo/client";

export type ShareFilterInputArgs = {
  userIds: Array<any>;
  filterId: number;
};

var SHARE_FILTER = gql`
  mutation CreateUserFilter($shareFilterInput: ShareFilterInputArgs!) {
    createUserFilter(shareFilterInput: $shareFilterInput) {
      filterId
      userId
    }
  }
`;

var UpdateUserRole = gql`
  mutation updateUserRole($updateUserRoleInput: Input!) {
    updateUserRole(updateUserRoleInput: $updateUserRoleInput) {
      id
      updatedAt
      createdAt
      updatedByUsername
      createdByUsername
      roleId
      userId
      updatedBy
      createdBy
    }
  }
`;

var UpdateUser = gql`
  mutation UpdateUser($param: UserParams!, $input: UserUpdateInput!) {
    updateUser(param: $param, input: $input) {
      id
      userName
      isActive
    }
  }
`;

var DeleteUser = gql`
  mutation deleteUser($param: UserParams!) {
    deleteUser(param: $param) {
      id
      userName
      deletedAt
    }
  }
`;

var Request_Role_Permission = gql`
  mutation requestAppPermission($requestAppPermissionInput: UserAppRole!) {
    requestAppPermission(
      requestAppPermissionInput: $requestAppPermissionInput
    ) {
      requestStatus
      payload
      contextId
      requestType
    }
  }
`;

var ACCEPT_OR_CANCEL_REQUEST = gql`
mutation requestAcceptOrCancel($requestAction:RequestProcessInput!){
  requestAcceptOrCancel(requestAction:$requestAction){
      id
      requestStatus
      payload
      requestType
  }
}
`;

var RESEND_REQUEST = gql`
mutation resendRequest($param:GetRequestParam!){
  resendRequest(param:$param){
     id
    requestStatus
    payload
    userId
    contextId
  }
}
`;

export {
  SHARE_FILTER,
  UpdateUserRole,
  UpdateUser,
  DeleteUser,
  Request_Role_Permission,
  ACCEPT_OR_CANCEL_REQUEST,
  RESEND_REQUEST
};
