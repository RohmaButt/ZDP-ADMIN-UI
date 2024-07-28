import { gql } from "@apollo/client";

const GET_EDI_SUMMARY = gql`
  query EdiFeedStatisticFilterByDateAndGroupByColumn(
    $pagination: PaginationInput!
    $day: Float!
    $groupByColumn: String!
    $filterColumn: String!
    $opCode: String!
    $opColumn: String!
  ) {
    EdiFeedStatisticFilterByDateAndGroupByColumn(
      pagination: $pagination
      day: $day
      groupByColumn: $groupByColumn
      filterColumn: $filterColumn
      opCode: $opCode
      opColumn: $opColumn
    ) {
      data {
        partnerId
        sum
        count
        min
        max
      }
      totalRecords
    }
  }
`;

const GET_PRODUCTEXCLUSION_ALL = gql`
  query GetProductExlusionRecords(
    $pagination: PaginationInput!
    $filterInput: FilterInputString!
  ) {
    GetAllProductExclusion(pagination: $pagination, filterInput: $filterInput) {
      data {
        id
        sourceVersion
        sourceId
        sourceSystem
        ediVendorId
        vendorCatCode
        vendorMfrCode
        countryCode
        manufacturerName
        exclusionReason
      }
      totalRecords
    }
  }
`;

const GET_MEDIA_ALL = gql`
  query GetAllMediaItems(
    $pagination: PaginationInput!
    $filterInput: FilterInputString!
  ) {
    GetAllMediaItems(pagination: $pagination, filterInput: $filterInput) {
      data {
        id
        sourceSystem
        sourceVersion
        sourceID
        countryCode
        description
        mediaTypeAlias
        active
        taxItemGroupID
        externalCode
      }
      totalRecords
    }
  }
`;
const GET_MEDIA_RECORDS = gql`
  query {
    GetTotalRecords {
      totalRecords
    }
  }
`;

const COUNT_PRODUCTEXCLUSION_ALL = gql`
  query CountAllProductExclusion {
    CountAllProductExclusion {
      totalRecords
    }
  }
`;

export {
  GET_EDI_SUMMARY,
  GET_PRODUCTEXCLUSION_ALL,
  GET_MEDIA_ALL,
  GET_MEDIA_RECORDS,
  COUNT_PRODUCTEXCLUSION_ALL,
};
