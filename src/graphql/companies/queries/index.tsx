import { gql } from "@apollo/client";

const GET_ALL_COMPANIES = gql`
  query getAllCompanies {
    getAllCompanies {
      companies {
        id
        name
        logo
        description
        address
        admin
        totalGroups
        totalUsers
      }
    }
  }
`;

const GET_ALL_GROUPS = gql`
  query getAllGroups($input: GetAllGroupParams!) {
    getAllGroups(input: $input) {
      groups {
        id
        name
        logo
        admin
        totalUsers
      }
    }
  }
`;

const GET_ALL_USERS_WITH_GROUPS = gql`
  query getAllUsersWithGroups(
    $input: GetAllGroupUsersParams!
    $pagination: PaginationInput!
  ) {
    getAllUserWithGroups(input: $input, pagination: $pagination) {
      data {
        userId
        groupId
        user {
          firstName
          email
        }
      }
      totalRecords
    }
  }
`;
export { GET_ALL_COMPANIES, GET_ALL_GROUPS, GET_ALL_USERS_WITH_GROUPS };
