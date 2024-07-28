import { GET_EDI_METADATA } from "./dashboard/queries";

const EDI_METADATA_MOCK = {
  request: {
    query: GET_EDI_METADATA,
  },
  result: {
    data: {
      GetEdiFeedStatisticMetaData: {
        info: [
          {
            name: "EdiFeedStatisticGq",
            type: "DTO",
            metadata: {
              displayName: "EDI Feed Statistics",
            },
            fields: [
              {
                name: "id",
                metadata: {
                  friendlyName: "Id",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "fileName",
                metadata: {
                  friendlyName: "File Name",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "partnerId",
                metadata: {
                  friendlyName: "Partner Id",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "processingDate",
                metadata: {
                  friendlyName: "Processing Date",
                  dataType: "date",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "fileCreationTime",
                metadata: {
                  friendlyName: "File Creation Time",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "totalItemCount",
                metadata: {
                  friendlyName: "Total Item Count",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "newItemCount",
                metadata: {
                  friendlyName: "New Item Count",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "newCategoryCount",
                metadata: {
                  friendlyName: "New Category Count",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "distinctCategoryCount",
                metadata: {
                  friendlyName: "Distinct Category Count",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "errorCount",
                metadata: {
                  friendlyName: "Error Count",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
            ],
          },
          {
            name: "ProductItemSchemaGQ",
            type: "DTO",
            metadata: {
              displayName: "Product Items",
            },
            fields: [
              {
                name: "id",
                metadata: {
                  friendlyName: "Id",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "catalogNumber",
                metadata: {
                  friendlyName: "Catalog Number",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "classCode",
                metadata: {
                  friendlyName: "Class Code",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "media",
                metadata: {
                  friendlyName: "Media",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "mfrName",
                metadata: {
                  friendlyName: "Mfr Name",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "mfrPartNumber",
                metadata: {
                  friendlyName: "Mfr Part Number",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "name",
                metadata: {
                  friendlyName: "Name",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "netWeight",
                metadata: {
                  friendlyName: "Net Weight",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "platform",
                metadata: {
                  friendlyName: "Platform",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "cost",
                metadata: {
                  friendlyName: "Cost",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "qty",
                metadata: {
                  friendlyName: "qty",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "serialFlag",
                metadata: {
                  friendlyName: "Serial Flag",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "tradingPartnerId",
                metadata: {
                  friendlyName: "Trading Partner Id",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "vendorCatCode",
                metadata: {
                  friendlyName: "Vendor Cat Code",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "vendorMfrCode",
                metadata: {
                  friendlyName: "Vendor Mfr Code",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "vendorPartNumber",
                metadata: {
                  friendlyName: "Vendor Part Number",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "vendorUpc",
                metadata: {
                  friendlyName: "Vendor Upc",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "warrantyPeriod",
                metadata: {
                  friendlyName: "Warranty Period",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "govCost",
                metadata: {
                  friendlyName: "Gov Cost",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "pubCost",
                metadata: {
                  friendlyName: "Pub Cost",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "createdAt",
                metadata: {
                  friendlyName: "Created At",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "modifiedAt",
                metadata: {
                  friendlyName: "Modified At",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "createdBy",
                metadata: {
                  friendlyName: "Created By",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "modifiedBy",
                metadata: {
                  friendlyName: "Modified By",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
            ],
          },
          {
            name: "ProductExclusion",
            type: "DTO",
            metadata: {
              displayName: "Product Exclusion",
            },
            fields: [
              {
                name: "id",
                metadata: {
                  friendlyName: "Id",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "sourceVersion",
                metadata: {
                  friendlyName: "Source Version",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "sourceId",
                metadata: {
                  friendlyName: "Source Id",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "sourceSystem",
                metadata: {
                  friendlyName: "Source System",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "ediVendorId",
                metadata: {
                  friendlyName: "Edi Vendor Id",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "vendorCatCode",
                metadata: {
                  friendlyName: "Vendor Cat Code",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "vendorMfrCode",
                metadata: {
                  friendlyName: "Vendor Mfr Code",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "countryCode",
                metadata: {
                  friendlyName: "Country Code",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "manufacturerName",
                metadata: {
                  friendlyName: "Manufacturer Name",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "exclusionReason",
                metadata: {
                  friendlyName: "Exclusion Reason",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "excludedAt",
                metadata: {
                  friendlyName: "Excluded At",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "createdAt",
                metadata: {
                  friendlyName: "Created At",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "createdByUsername",
                metadata: {
                  friendlyName: "Created By Username",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "createdBy",
                metadata: {
                  friendlyName: "Created By",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "updatedAt",
                metadata: {
                  friendlyName: "Updated At",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "deletedAt",
                metadata: {
                  friendlyName: "Deleted At",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "updatedBy",
                metadata: {
                  friendlyName: "Updated By",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "updatedByUsername",
                metadata: {
                  friendlyName: "Updated By Username",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
            ],
          },
          {
            name: "MediaEntity",
            type: "DTO",
            metadata: {
              displayName: "Media",
            },
            fields: [
              {
                name: "id",
                metadata: {
                  friendlyName: "Id",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "createdAt",
                metadata: {
                  friendlyName: "Created At",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "createdBy",
                metadata: {
                  friendlyName: "Created By",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "createdByUsername",
                metadata: {
                  friendlyName: "Created By Username",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "updatedAt",
                metadata: {
                  friendlyName: "Updated At",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "updatedBy",
                metadata: {
                  friendlyName: "Updated By",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "updatedByUsername",
                metadata: {
                  friendlyName: "Updated By Username",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "deletedAt",
                metadata: {
                  friendlyName: "Deleted At",
                  dataType: "date-time",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "sourceSystem",
                metadata: {
                  friendlyName: "Source System",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "sourceVersion",
                metadata: {
                  friendlyName: "Source Version",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "sourceID",
                metadata: {
                  friendlyName: "Source ID",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "countryCode",
                metadata: {
                  friendlyName: "Country Code",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "description",
                metadata: {
                  friendlyName: "Description",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "mediaTypeAlias",
                metadata: {
                  friendlyName: "Media Type Alias",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "active",
                metadata: {
                  friendlyName: "Active",
                  dataType: "integer",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: true,
                },
              },
              {
                name: "taxItemGroupID",
                metadata: {
                  friendlyName: "Tax Item Group ID",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
              {
                name: "externalCode",
                metadata: {
                  friendlyName: "External Code",
                  dataType: "string",
                  isFilterable: true,
                  isSortable: true,
                  isRequired: false,
                },
              },
            ],
          },
        ],
      },
    },
  },
};

export const graphqlMocks = [EDI_METADATA_MOCK];
