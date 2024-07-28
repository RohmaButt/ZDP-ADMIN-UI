import { gql } from "@apollo/client";

var CREATE_COMPANY = gql`
  mutation createCompany($input: CompanyCreateInput!) {
    createCompany(input: $input) {
      id
      name
      companyAdmin {
        id
        userId
        companyId
      }
      isActive
    }
  }
`;

var UPDATE_COMPANY = gql`
  mutation updateCompany(
    $params: CompanyParams!
    $company: CompanyUpdateInput!
  ) {
    updateCompany(params: $params, company: $company) {
      id
      description
    }
  }
`;

var DELETE_COMPANY = gql`
  mutation deleteCompany($params: CompanyParams!) {
    deleteCompany(params: $params) {
      id
      name
    }
  }
`;

var CREATE_GROUP = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      id
      name
      companyId
      UserGroup {
        id
        userId
        groupId
      }
    }
  }
`;

var UPDATE_GROUP = gql`
  mutation updateGroup($params: GroupParams!, $group: UpdateGroupInput!) {
    updateGroup(params: $params, group: $group) {
      id
      name
      logo
    }
  }
`;

var DELETE_GROUP = gql`
  mutation deleteGroup($params: GroupParams!) {
    deleteGroup(params: $params) {
      id
      name
      logo
    }
  }
`;

var CREATE_MEMBER = gql`
  mutation CreateUserGroup($input: CreateUserGroupInput!) {
    createUserGroup(input: $input) {
      userId
      groupId
    }
  }
`;

var DELETE_MEMBER = gql`
  mutation deleteUsersFromGroup($input: DeleteUsersFromGroup!) {
    deleteUsersFromGroup(input: $input) {
      userId
    }
  }
`;

export {
  CREATE_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  CREATE_MEMBER,
  DELETE_MEMBER,
};
