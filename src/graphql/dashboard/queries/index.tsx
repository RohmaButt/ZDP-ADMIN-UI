import { gql } from "@apollo/client";

const GET_PRODUCTS_COUNT_BY_FILE = gql`
  query GetData($page: Float!, $limit: Float!) {
    EdiFeedStatisticGqAll(page: $page, limit: $limit) {
      data {
        processingDate
        totalItemCount
      }
      totalRecords
    }
  }
`;

const GET_EDI_ALL = gql`
  query GetData($page: Float!, $limit: Float!) {
    EdiFeedStatisticGqAll(page: $page, limit: $limit) {
      data {
        id
        partnerId
        processingDate
        totalItemCount
        fileName
        newItemCount
      }
      totalRecords
    }
  }
`;

const GET_PRODUCTS_ALL = gql`
  query GetData(
    $pagination: PaginationInput!
    $filterInput: FilterInputString!
  ) {
    GetAllProductItems(pagination: $pagination, filterInput: $filterInput) {
      data {
        id
        name
        qty
        cost
        catalogNumber
        mfrPartNumber
        classCode
        media
        mfrName
        netWeight
        platform
        serialFlag
        tradingPartnerId
        vendorCatCode
        vendorMfrCode
        vendorPartNumber
        vendorProductStatus
        govCost
        pubCost
      }
      totalRecords
    }
  }
`;

const GET_FILES_COUNT_GROUP_BY_DATE = gql`
  query GetData(
    $pagination: PaginationInput!
    $filterInput: FilterInputString!
  ) {
    EdiFeedStatisticGroupByDateColumn(
      pagination: $pagination
      filterInput: $filterInput
    ) {
      data {
        processingDate
        count
      }
      totalRecords
    }
  }
`;

const GET_EDI_METADATA = gql`
  query {
    GetEdiFeedStatisticMetaData {
      info
    }
  }
`;

const GET_COMPANIES_STATS = gql`
  query GetCompaniesStats {
    GetCompaniesStats {
      activeCompanies
      inActiveCompanies
    }
  }
`;

const GET_MEMBERS_STATS = gql`
  query GetMemberStats {
    GetMemberStats {
      activeMembers
      inActiveMembers
      pendingInvites
    }
  }
`;

const GET_ACTIVITY_LOGS = gql`
query GetAllActivityLogs(
  $DateInput: DateInput!
  $pagination: PaginationInput!
) {
  GetAllActivityLogs(
    DateInput:  $DateInput
    pagination: $pagination
  ) {
    data{
      id
      description
      contextId
      contextType
      payload
      actionType
      perfomerName
    }
    totalRecords
  }
  }
`;
const GET_USER_WITH_APP_AND_INVITE = gql`
  query getUsersWithAppAndInvite(
    $pagination: PaginationInput!
    $param: AppAndInviteInput!
  ) {
    getUsersWithAppAndInvite(pagination: $pagination, param: $param) {
      data {
        id
        email
        authenticationType
        firstName
        userName
        createdAt
        userRole {
          roleId
          appId
          role {
            name
          }
        }
        Request {
          requestStatus
        }
      }
      totalRecords
    }
  }
`;

export {
  GET_PRODUCTS_COUNT_BY_FILE,
  GET_FILES_COUNT_GROUP_BY_DATE,
  GET_EDI_METADATA,
  GET_EDI_ALL,
  GET_PRODUCTS_ALL,
  GET_COMPANIES_STATS,
  GET_MEMBERS_STATS,
  GET_ACTIVITY_LOGS,
  GET_USER_WITH_APP_AND_INVITE
};
