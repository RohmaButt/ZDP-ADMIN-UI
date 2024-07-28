export type PaginationInput = {
  limit: number | undefined;
  offset: number | undefined;
};

export type FilterInputString = {
  filterInputString: string;
};

export type SharedFilterArg = {
  isShared: boolean;
};
