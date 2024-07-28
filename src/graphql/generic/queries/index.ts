import { gql } from "@apollo/client";

const GET_TABLE_DATA = gql`
  query GetDataByJsonQuery(
    $pagination: PaginationInput!
    $DataModelInput: DataModelInput!
    $QueryInput: FilterInputString!
  ) {
    GetDataByJsonQuery(
      pagination: $pagination
      DataModelInput: $DataModelInput
      QueryInput: $QueryInput
    ) {
      info
    }
  }
`;

const GET_TABLE_DATA_WITH_JOIN = gql`
  query GetDataByJsonQueryWithJoin(
    $pagination: PaginationInput!
    $DataModelInput: DataModelInput!
    $QueryInput: FilterInputString!
    $QueryInput2: FilterInputString!
  ) {
    GetDataByJsonQueryWithJoin(
      pagination: $pagination
      DataModelInput: $DataModelInput
      QueryInput: $QueryInput
      QueryInput2: $QueryInput2
    ) {
      info
    }
  }
`;

export {
    GET_TABLE_DATA,
    GET_TABLE_DATA_WITH_JOIN
  };