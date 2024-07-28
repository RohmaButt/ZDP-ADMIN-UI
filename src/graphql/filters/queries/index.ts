import { gql } from "@apollo/client";

const GET_SAVED_FILTERS_FILTER_TABLE = gql`
  query GetSavedFilters(
    $pagination: PaginationInput!
    $filterInput: FilterInputString!
    $sharedFilterArg: SharedFilterArg!
  ) {
    FilterGetAll(
      pagination: $pagination
      filterInput: $filterInput
      sharedFilterArg: $sharedFilterArg
    ) {
      data {
        id
        name
        value
        dto
      }
      totalRecords
    }
  }
`;

const GET_SAVED_FILTERS = gql`
  query GetSavedFilters(
    $pagination: PaginationInput!
    $filterInput: FilterInputString!
    $sharedFilterArg: ShareFilterArg!
  ) {
    userFilterGetAll(
      pagination: $pagination
      filterInput: $filterInput
      sharedFilterArg: $sharedFilterArg
    ) {
      data {
        # id
        filterId
        userId
        isActive
        Filter {
          value
          id
          name
          dto
        }
      }
      totalRecords
    }
  }
`;

const GET_SAVED_FILTERS_MERCH = gql`
  query GetSavedFilters(
    $pagination: PaginationInput!
    $filterInput: FilterInputString!
    $sharedFilterArg: ShareFilterArg!
  ) {
    userFilterGetAll(
      pagination: $pagination
      filterInput: $filterInput
      sharedFilterArg: $sharedFilterArg
    ) {
      data {
        id,
        createdByUsername
        filterId,
        userId,
        createdBy,
        createdAt,
        isActive
        Filter{
          dto
          name
          value
          description
        }
        User{
          firstName
        }
      }
      totalRecords
    
    }
  }
`;

export { GET_SAVED_FILTERS, GET_SAVED_FILTERS_MERCH };