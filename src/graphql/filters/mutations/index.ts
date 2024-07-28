import { gql } from "@apollo/client";

export type FilterCreateInput = {
  name: String;
  value: String;
  dto: String;
};

export type FilterParams = {
  id: number;
};

export type FilterUpdateInput = {
  name?: String;
  value?: String;
  dto?: String;
  isArchived?: Boolean;
};

var CreateFilter = gql`
  mutation SaveFilter($createFilterInput: FilterCreateInput!) {
    createFilter(createFilterInput: $createFilterInput) {
      id
      name
      value
      dto
      createdAt
      createdBy
    }
  }
`;

var UpdateFilter = gql`
  mutation UpdateFilter(
    $param: FilterParams!
    $updateFilterInput: FilterUpdateInput!
  ) {
    updateFilter(param: $param, updateFilterInput: $updateFilterInput) {
      id
      name
      value
      dto
      createdAt
      createdBy
    }
  }
`;

var ArchiveFilter = gql`
  mutation ArchiveFilter($archiveUserFilter: ArchiveUserFilter!) {
    archiveUserFilter(archiveUserFilter: $archiveUserFilter) {
      userId
      filterId
      isActive
    }
  }
`;

const CREATE_USER_FILTER = gql`mutation
createUserFilter($shareFilterInput: ShareFilterInputArgs!)
{  
  createUserFilter(shareFilterInput: $shareFilterInput){
    filterId
    userId
  }
}`;

var CloneFilter = gql`
  mutation CloneFilter($cloneFilterInput: CloneFilterInputArgs!) {
    cloneFilter(cloneFilterInput: $cloneFilterInput) {
      userId
      filterId
    }
  }
`;

var UnshareFilter = gql`
mutation unshareFilter($unshareFilterInput: UnshareFilterInput!){
  unshareFilter(unshareFilterInput: $unshareFilterInput) {
      userId
        filterId
        id
        isActive
  }
}`;

export { CreateFilter, UpdateFilter, ArchiveFilter, CREATE_USER_FILTER, CloneFilter, UnshareFilter };
