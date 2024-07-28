import type { NotificationPlacement } from "antd/es/notification";

export const NOTIFICATION_VIEW_TIME_SEC = 5;
export const NOTIFICATION_PLACEMENT: NotificationPlacement = "bottomLeft";
export const NOTIFICATION_STYLES = {
  marginLeft: "60px",
};
export const defaultPage = 0;
export const defaultPageLimit = 100;
export const defaultPaginationParams2 = {
  page: defaultPage,
  limit: defaultPageLimit,
  filter: JSON.stringify({}),
};

export const defaultPaginationParams = {
  offset: defaultPage,
  limit: defaultPageLimit,
};

export const defaultFilterInput = {
  filterInputString: JSON.stringify({}),
};

export const userLocalStorageKey = "type";

export enum ButtonTypes {
  White = 'white',
  Black = 'black',
  BlackDisabled = 'blackDisabled',
}


export const BreadCrumbsMapper: { [key: string]: string } = {
  EdiFeedStatisticGq: "Edi Feed Statistics",
  ProductItemEntity: "Product Items",
  rawquery: "Query",
  querygenerator: "Query Generator",
  visualizequery: "Visualize Query",
  errorvalidation: "Error Menu",
  userprofile: "User Profile",
};

export enum UserRoles {
  none = 0,
  read_only = 1,
  write = 2,
  admin = 3,
  super_admin = 4,
}
export const RolePermissions = {
  none: "None",
  read_only: "Read Only",
  write: "Write",
  admin: "Admin"
}
export const SystemApps = [
  { name: "PIM", isActive: true },
  { name: "Merchandising", isActive: false }
]

export enum TextFieldTypes {
  Enable = 'enable',
  Disable = 'disable',
  Search = 'search'
}

export enum AppIds { PIM = 1, ADMIN = 2, DATASOURCING = 3 }
