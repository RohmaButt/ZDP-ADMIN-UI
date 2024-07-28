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

const GLOBAL_SEARCH = gql`
  query companySearch($companySearchArg: SearchInput!) {
    companySearch(companySearchArg: $companySearchArg) {
      res {
        id
        name
        description
        email
        firstName
        username
        type
        companyId
      }
    }
  }
`;
const GET_DATA_BY_ID = gql`
  query GetDataById(
    $DataModelInput: DataModelInput!
    $param: CommonParams!
  ) {
    GetDataById(DataModelInput: $DataModelInput, param: $param) {
     info
    }
  }
`;
export { GET_ALL_COMPANIES, GLOBAL_SEARCH, GET_DATA_BY_ID };
