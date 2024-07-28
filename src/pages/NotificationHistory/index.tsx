import { FC, useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_TABLE_DATA } from "../../graphql/generic/queries";
import { defaultPageLimit, userLocalStorageKey } from "../../utils/constants";
import { GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "typeface-montserrat";
import { GET_DATA_BY_JSON } from "../../graphql/notifications/queries";
import { useNavigate } from "react-router-dom";
import { UPDATE_NOTIFICATION_ACTION } from "../../graphql/notifications/mutations";
import { useDebounce } from "use-debounce";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import { HistoryParentComponent } from "@zdp-pim/zdp-ui-kit";
import {
  CREATE_USER_FILTER,
  CloneFilter,
  UnshareFilter,
} from "../../graphql/filters/mutations";
import { GET_SAVED_FILTERS_MERCH } from "../../graphql/filters/queries";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import montserrat from "./fonts/Montserrat-Bold.ttf";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CardDropDown from "./CardDropDown";
import { CreateFilter } from "../../graphql/filters/mutations";
import { useMsal } from "@azure/msal-react";
import { callMsGetAllUsersGraph } from "../../services/msGraphApi";
import { getAllUsersRequest } from "../../config/authConfig";
import React from "react";

type User = {
  businessPhones: [];
  displayName: string;
  givenName: string;
  id: string;
  jobTitle: string | null;
  mail: string;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  surname: string;
  userPrincipalName: string;
};

interface Filter {
  FilterKey: string;
  FilterCondition: string;
  FilterValue?: string;
  GreaterValue?: string;
  LesserValue?: string;
  GreaterEqualValue?: string;
  LesserEqualValue?: string;
}

interface OptionType {
  inputValue: string;
  name: string;
  email: string;
  id?: string;
}

interface CreateFilterValues {
  filterName: string;
  filterDescription: string;
  filterKey: string;
  filterCondition: string;
  filterValue: string;
  column: any[];
}

interface Filter {
  FilterKey: string;
  FilterCondition: string;
  FilterValue?: string;
  GreaterValue?: string;
  LesserValue?: string;
  GreaterEqualValue?: string;
  LesserEqualValue?: string;
}

const GetESFilters = (filters: Filter[]): any[] => {
  let newFilters = [];
  for (let i = 0; i < filters.length; i++) {
    if (filters[i].FilterCondition == "between") {
      newFilters.push({
        range: {
          name: filters[i].FilterKey,
          greaterOrEqualValue: filters[i].GreaterEqualValue,
          lessOrEqualValue: filters[i].LesserEqualValue,
        },
      });
    } else if (filters[i].FilterCondition == "greaterValue") {
      newFilters.push({
        range: {
          name: filters[i].FilterKey,
          greaterValue: filters[i].GreaterValue,
        },
      });
    } else if (filters[i].FilterCondition == "lessValue") {
      newFilters.push({
        range: {
          name: filters[i].FilterKey,
          lessValue: filters[i].LesserValue,
        },
      });
    } else if (filters[i].FilterCondition == "greaterOrEqualValue") {
      newFilters.push({
        range: {
          name: filters[i].FilterKey,
          greaterOrEqualValue: filters[i].GreaterEqualValue,
        },
      });
    } else if (filters[i].FilterCondition == "lessOrEqualValue") {
      newFilters.push({
        range: {
          name: filters[i].FilterKey,
          lessOrEqualValue: filters[i].LesserEqualValue,
        },
      });
    } else if (
      filters[i].FilterCondition == "isEmpty" ||
      filters[i].FilterCondition == "isNotEmpty"
    ) {
      newFilters.push({
        [filters[i].FilterCondition]: { name: filters[i].FilterKey },
      });
    } else {
      newFilters.push({
        [filters[i].FilterCondition]: {
          name: filters[i].FilterKey,
          value: filters[i].FilterValue,
        },
      });
    }
  }
  return newFilters;
};

const NotificationHistory: FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [actionableChanged, setActionableChanged] = useState(0);

  const navigate = useNavigate();

  const handleView = (row: any) => {
    navigate(row?.url);
  };

  const [
    updateNotificationAction,
    {
      data: updateNotificationData,
      loading: updateNotificationLoading,
      error: updateNotificationError,
    },
  ] = useMutation(UPDATE_NOTIFICATION_ACTION);

  const handleApproveDeny = (row: any, action1: any) => {
    updateNotificationAction({
      variables: {
        param: {
          id: row?.id,
        },
        input: {
          action: action1,
        },
      },
    })
      .then((result) => {
        console.log("Updated Notification: ", result);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    setActionableChanged(1);
  };

  const columnPending = useMemo<GridColumns<any>>(
    () => [
      {
        field: "content",
        headerName: "Notification Message",
        sortable: false,
        width: 300,
        renderCell: (params) => {
          return (
            <Box display={"flex"}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingX: "14px",
                  paddingLeft: "0px",
                }}
                component={"div"}
              >
                {params.row.content}
              </Box>
            </Box>
          );
        },
      },
      {
        field: "type",
        headerName: "Notification Type",
        sortable: false,
        width: 300,
        renderCell: (params) => {
          return <div>{params.row.type}</div>;
        },
      },
      {
        field: "createdAt",
        headerName: "Date Sent",
        sortable: false,
        width: 300,
        renderCell: (params) => <div>{params.row.createdAt}</div>,
      },
      {
        field: "createdByUsername",
        headerName: "Sent By",
        sortable: false,
        width: 180,
        renderCell: (params) => {
          return <div>{params.row.createdByUsername}</div>;
        },
      },
      {
        field: "actionPerformed",
        headerName: "Action Performed",
        sortable: false,
        width: 180,
        renderCell: (params) => {
          return <div>{params.row.actionPerformed}</div>;
        },
      },
      {
        field: "actions",
        sortable: false,
        customHeadRender: (MoreHorizIcon: any) => (
          <th>
            <MoreHorizIcon
              sx={{
                color: "black",
              }}
            />
          </th>
        ),
        type: "actions",
        width: 50,
        headerAlign: "center",
        align: "center",
        getActions: (params) => [
          <GridActionsCellItem
            sx={{ color: "#132640" }}
            icon={<VisibilityIcon sx={{ color: "#7A7E8B" }} />}
            label="View"
            onClick={(ev) => handleView(params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            sx={{ color: "#7A7E8B" }}
            icon={<CheckCircleOutlineIcon sx={{ color: "#7A7E8B" }} />}
            label="Approve"
            onClick={(ev) => handleApproveDeny(params.row, "APPROVED")}
            showInMenu
            hidden={params.row.type != "ACTIONABLE" ? true : false}
          />,
          <GridActionsCellItem
            sx={{ color: "#C60000" }}
            icon={<HighlightOffIcon sx={{ color: "#C60000" }} />}
            label="Deny"
            onClick={(ev) => handleApproveDeny(params.row, "DENIED")}
            showInMenu
            hidden={params.row.type != "ACTIONABLE" ? true : false}
          />,
        ],
      },
    ],
    []
  );

  const IdLookup = () => {
    const userId = localStorage.getItem(userLocalStorageKey);
    if (userId) {
      const userIdObj = JSON.parse(userId);
      return userIdObj.id;
    } else {
      return null;
    }
  };

  let id = String(IdLookup());

  let object = {
    $or: {
      $and: [
        {
          "Notification.to": {
            $eq: id,
          },
        },
      ],
    },
  };
  const defaultSearch = JSON.stringify(object);

  const {
    loading: notificationLoading,
    error: notificationError,
    data: notificationData,
    refetch: notificationRefetch,
  } = useQuery(GET_DATA_BY_JSON, {
    variables: {
      pagination: { limit: pageSize, offset: 0 },
      DataModelInput: { entity: "Notification" },
      QueryInput: {
        filterInputString: defaultSearch,
      },
    },
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.trim().length > 1) {
      let object = {
        $and: {
          $or: [
            {
              "Notification.type": {
                $like: search.trim(),
              },
            },
            {
              "Notification.createdByUsername": {
                $like: search.trim(),
              },
            },
            {
              "Notification.content": {
                $like: search.trim(),
              },
            },
            {
              "Notification.actionPerformed": {
                $like: search.trim(),
              },
            },
          ],
          $and: [
            {
              "Notification.to": {
                $eq: id,
              },
            },
          ],
        },
      };
      notificationRefetch({
        pagination: {
          offset: page,
          limit: pageSize || defaultPageLimit,
        },
        QueryInput: {
          filterInputString: JSON.stringify(object),
        },
      });
    } else if (search === "") {
      notificationRefetch({
        pagination: {
          offset: page,
          limit: pageSize || defaultPageLimit,
        },
        QueryInput: {
          filterInputString: defaultSearch,
        },
      });
    }
  }, [page, pageSize, search, actionableChanged]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<typeof pageSize>) => {
    const {
      target: { value },
    } = event;
    setPageSize(typeof value === "string" ? parseInt(value) : value);
  };

  const PaginationBar = () => {
    return (
      <Box
        sx={{
          width: "100%",
          height: "48px",
          justifyContent: "space-between",
          display: "inline-list-item",
          paddingBottom: 7,
        }}
        display={"inline-list-item"}
      >
        <Select
          onChange={handlePageSizeChange}
          value={pageSize}
          IconComponent={() => <ExpandMoreIcon sx={{ color: "#7A7E8B" }} />}
          sx={{
            border: "0.50px #E2E5E9 solid",
            height: "40px",
            padding: "10px",
            color: "#323E4D",
            pl: "0px",
            ml: "16px",
            mt: "4px",
          }}
        >
          <MenuItem key="10" value="10">
            10
          </MenuItem>
          <MenuItem key="20" value="20">
            20
          </MenuItem>
          <MenuItem key="50" value="50">
            50
          </MenuItem>
          <MenuItem key="100" value="100">
            100
          </MenuItem>
        </Select>
        <Typography
          sx={{
            color: "#7A7E8B",
            fontSize: 14,
            fontFamily: "Open Sans",
            fontWeight: "400",
            mt: "14px",
          }}
        >
          {1 + pageSize * page}-
          {pageSize * (page + 1) >
          notificationData?.GetDataByJsonQuery?.info?.totalRecords
            ? notificationData?.GetDataByJsonQuery?.info?.totalRecords
            : pageSize * (page + 1)}{" "}
          of {notificationData?.GetDataByJsonQuery?.info?.totalRecords}
        </Typography>
        <Stack
          spacing={2}
          sx={{
            marginTop: "8px",
            mr: "16px",
          }}
        >
          <Pagination
            shape="rounded"
            count={
              notificationData
                ? Math.ceil(
                    notificationData?.GetDataByJsonQuery?.info?.totalRecords /
                      pageSize
                  )
                : 1
            }
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            renderItem={(item) => (
              <PaginationItem
                sx={{
                  border: "0.50px #ECEEF0 solid",
                }}
                {...item}
              />
            )}
          />
        </Stack>
      </Box>
    );
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const [openFilterPopup, setOpenFilterPopup] = useState(false);
  const [gridFilters, setGridFilters] = useState<any>([]);
  const [searchFilter, setSearchFilter] = useState<string>(defaultSearch);

  const onFilterClick = () => {
    setOpenFilterPopup(true);
  };

  const handleCloseHandler = () => {
    setOpenFilterPopup(false);
  };

  const runWithOutSave = (filters: any) => {
    console.log("filters", filters);
    setGridFilters(GetESFilters(filters));

    let andConditions: any[] = [];

    for (let i = 0; i < filters.length; i++) {
      if (filters[i].FilterCondition == "between") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $between: [
              parseInt(filters[i].LesserEqualValue),
              parseInt(filters[i].GreaterEqualValue),
            ],
          },
        });
      } else if (filters[i].FilterCondition == "greaterValue") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $gt: parseInt(filters[i].GreaterValue),
          },
        });
      } else if (filters[i].FilterCondition == "lessValue") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $lt: parseInt(filters[i].LesserValue),
          },
        });
      } else if (filters[i].FilterCondition == "greaterOrEqualValue") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $gte: parseInt(filters[i].GreaterEqualValue),
          },
        });
      } else if (filters[i].FilterCondition == "lessOrEqualValue") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $lte: parseInt(filters[i].LesserEqualValue),
          },
        });
      } else if (filters[i].FilterCondition == "isEmpty") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $isNull: true,
          },
        });
      } else if (filters[i].FilterCondition == "isNotEmpty") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $isNotNull: true,
          },
        });
      } else if (filters[i].FilterCondition == "term") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $eq: filters[i].FilterValue,
          },
        });
      } else if (filters[i].FilterCondition == "isNot") {
        andConditions.push({
          [filters[i].FilterKey]: {
            $ne: filters[i].FilterValue,
          },
        });
      } else {
        andConditions.push({
          [filters[i].FilterKey]: {
            $like: filters[i].FilterValue,
          },
        });
      }
    }

    let object = {
      $or: {
        $and: [
          {
            "Notification.to": {
              $eq: id,
            },
          },
          ...andConditions,
        ],
      },
    };

    setSearchFilter(JSON.stringify(object, null, 2));
  };

  useEffect(() => {
    notificationRefetch({
      pagination: {
        offset: page,
        limit: pageSize || defaultPageLimit,
      },
      QueryInput: {
        filterInputString: searchFilter,
      },
    });
  }, [searchFilter, actionableChanged]);

  const transformValues = (filters: any) => {
    return GetESFilters(filters);
  };

  const runSavedFilters = (val: any) => {
    let query = JSON.parse(val);
    console.log(query);

    let andConditions: any[] = [];

    for (let i = 0; i < query.length; i++) {
      if (query[i]?.between != (undefined || null)) {
        andConditions.push({
          [query[i]?.between?.name]: {
            $between: [
              parseInt(query[i]?.between?.lessOrEqualValue),
              parseInt(
                query[i]?.between?.lessOrEqualValue?.greaterOrEqualValue
              ),
            ],
          },
        });
      } else if (query[i]?.greaterValue != (undefined || null)) {
        andConditions.push({
          [query[i]?.greaterValue?.name]: {
            $gt: parseInt(query[i]?.greaterValue?.value),
          },
        });
      } else if (query[i]?.lessValue != (undefined || null)) {
        andConditions.push({
          [query[i]?.lessValue?.name]: {
            $lt: parseInt(query[i]?.lessValue?.value),
          },
        });
      } else if (query[i]?.greaterOrEqualValue != (undefined || null)) {
        andConditions.push({
          [query[i]?.greaterOrEqualValue?.name]: {
            $gte: parseInt(query[i]?.greaterOrEqualValue?.value),
          },
        });
      } else if (query[i]?.lessOrEqualValue?.name) {
        andConditions.push({
          [query[i]?.lessOrEqualValue?.name]: {
            $lte: parseInt(query[i]?.lessOrEqualValue?.value),
          },
        });
      } else if (query[i]?.isEmpty != (undefined || null)) {
        andConditions.push({
          [query[i]?.isEmpty?.name]: {
            $isNull: query[i].isEmpty.value,
          },
        });
      } else if (query[i]?.isNotEmpty != (undefined || null)) {
        andConditions.push({
          [query[i]?.isNotEmpty?.name]: {
            $isNotNull: query[i]?.isNotEmpty?.value,
          },
        });
      } else if (query[i]?.term != (undefined || null)) {
        andConditions.push({
          [query[i]?.term?.name]: {
            $eq: query[i]?.term?.value,
          },
        });
      } else if (query[i]?.isNot != (undefined || null)) {
        andConditions.push({
          [query[i]?.isNot?.name]: {
            $ne: query[i]?.isNot?.value,
          },
        });
      } else {
        andConditions.push({
          [query[i]?.contains?.name]: {
            $like: query[i]?.contains?.value,
          },
        });
      }
    }

    let object = {
      $or: {
        $and: [
          {
            "Notification.to": {
              $eq: id,
            },
          },
          ...andConditions,
        ],
      },
    };

    setSearchFilter(JSON.stringify(object, null, 2));
  };

  const [createFilter, setCreateFilter] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [debounceVal] = useDebounce(searchValue, 300);
  const [selectedRowColor, setSelectedRowColor] = useState(null);
  const [selectedRowvalue, setSelectedRowvalue] = useState("");
  const [selectedRowFilterId, setSelectedFilterId] = useState("");
  const [selectedRowId, setSelectedRowId] = useState("");
  const [selectedRowisActive, setSelectedRowisActive] = useState(true);
  const [openShare, setOpenShare] = useState(false);
  const [values, setValues] = useState<OptionType[]>([]);
  const [UseridsArray, setUserIdsArray] = useState<number[]>([]);
  const clonefilter = selectedTab === 3 ? false : true;
  const [cloneOrshare, setcloneOrshare] = useState(true);
  const current_user = useAppSelector(selectUser);

  const disableToggleButton = selectedTab === 3 ? true : false;

  const [shareFilter, { loading: loading1, error, data }] = useMutation(
    CREATE_USER_FILTER,
    {}
  );

  const [
    cloneFilter,
    { loading: cloneLoad, error: cloneError, data: cloneData },
  ] = useMutation(CloneFilter, {});

  const [
    unshareFilter,
    { loading: unshareLoad, error: unshareError, data: unshareData },
  ] = useMutation(UnshareFilter, {});

  const handleShareFilterApi = async () => {
    try {
      const shareFilterInput = {
        userIds: 122,
        filterId: selectedRowFilterId,
      };

      shareFilter({
        variables: {
          shareFilterInput: {
            userIds: UseridsArray,
            filterId: selectedRowFilterId,
          },
        }, // Pass the variables here
      })
        .then((response) => {
          // Handle the response data here
          console.log("Mutation response:", response.data);
          setOpenShare(false);
          AllFiltersRefetch();
          SharedWithMeFiltersRefetch();
          setValues([]);
        })
        .catch((error) => {
          // Handle errors here
          console.error("Mutation error:", error);
        });
    } catch {
      console.log(error);
    }
  };

  const handleCloneFilterApi = async () => {
    try {
      const cloneFilterInput = {
        filterId: selectedRowFilterId,
      };

      cloneFilter({
        variables: {
          cloneFilterInput: {
            filterId: selectedRowFilterId,
          },
        }, // Pass the variables here
      })
        .then((response) => {
          // Handle the response data here
          console.log("Mutation response:", response.data);
        })
        .catch((error) => {
          console.log("HERE H");
          // Handle errors here
          console.error("Mutation error:", error);
        });
    } catch {
      console.log(error);
    }
  };

  const onSetValue = (val: OptionType[]) => {
    setValues(val);
    const idsArray = val.map((item) => Number(item.id));
    setUserIdsArray(idsArray);
  };

  const OnClickRun = (val: any) => {
    runSavedFilters(val);
    handleCloseHandler();
  };

  const dto = "Notification";

  const getDefaultFilterArguments = {
    $and: {
      $and: [{ "filter.dto": { $eq: dto } }],
    }, // For Tables
  };

  const getDefaultFilterArgumentsWithSearch = {
    $and: {
      $and: [
        { "filter.dto": { $eq: dto } },
        { "filter.name": { $like: searchValue } },
      ], // For Tables
    },
  };

  const {
    error: AllFiltersError,
    data: AllFiltersData,
    loading: AllFiltersLoading,
    refetch: AllFiltersRefetch,
  } = useQuery(GET_SAVED_FILTERS_MERCH, {
    fetchPolicy: "cache-first",
    variables: {
      pagination: {
        limit: 1000,
        offset: 0,
      },
      filterInput: {
        filterInputString: JSON.stringify(getDefaultFilterArguments),
      },
      sharedFilterArg: {
        isShared: true,
        sharedByMe: true,
      },
    },
  });

  const {
    error: MyFiltersError,
    data: MyFiltersData,
    loading: MyFiltersLoading,
    refetch: MyFiltersRefetch,
  } = useQuery(GET_SAVED_FILTERS_MERCH, {
    fetchPolicy: "cache-first",
    variables: {
      pagination: {
        limit: 1000,
        offset: 0,
      },
      filterInput: {
        filterInputString: JSON.stringify(getDefaultFilterArguments),
      },
      sharedFilterArg: {
        isShared: false,
        sharedByMe: false,
      },
    },
  });

  const {
    error: SharedByMeFiltersError,
    data: SharedByMeFiltersData,
    loading: SharedByMeFiltersLoading,
    refetch: SharedByMeFiltersRefetch,
  } = useQuery(GET_SAVED_FILTERS_MERCH, {
    fetchPolicy: "cache-first",
    variables: {
      pagination: {
        limit: 1000,
        offset: 0,
      },
      filterInput: {
        filterInputString: JSON.stringify(getDefaultFilterArguments),
      },
      sharedFilterArg: {
        isShared: false,
        sharedByMe: true,
      },
    },
  });

  const {
    error: SharedWithMeFiltersError,
    data: SharedWithMeFiltersData,
    loading: SharedWithMeFiltersLoading,
    refetch: SharedWithMeFiltersRefetch,
  } = useQuery(GET_SAVED_FILTERS_MERCH, {
    fetchPolicy: "cache-first",
    variables: {
      pagination: {
        limit: 1000,
        offset: 0,
      },
      filterInput: {
        filterInputString: JSON.stringify(getDefaultFilterArguments),
      },
      sharedFilterArg: {
        isShared: true,
        sharedByMe: false,
      },
    },
  });

  const onCloseShare = () => {
    setOpenShare(false);
  };

  const onClickShare = (cardData: any) => {
    //setConnectionID(cardData.id);
    setOpenShare(true);
  };

  const onCloneShare = (cardData: any) => {
    handleCloneFilterApi();
  };

  const featureFlagActionShareConnection = useFeatureIsOn(
    "dataflow-action-share-connection"
  );

  const featureFlagActionDuplicateConnection = useFeatureIsOn(
    "dataflow-action-duplicate-connection"
  );
  const saveDataShare = async () => {
    handleShareFilterApi();
  };

  const SharedWithMeView = () => {};

  const handleUnshareFilterApi = (event: any, user: any) => {
    try {
      const newValue = event.target.checked;
      setSelectedRowisActive(newValue);
      unshareFilter({
        variables: {
          unshareFilterInput: {
            id: user.id,
            isActive: newValue,
          },
        }, // Pass the variables here
      })
        .then((response) => {
          // Handle the response data here
          SharedByMeFiltersRefetch();
          // AllFiltersRefetch();
          console.log("Mutation response:", response.data);
        })
        .catch((error) => {
          // Handle errors here
          console.error("Mutation error:", error);
        });
    } catch {
      console.log(error);
    }
  };

  const viewFilterTables = (users: any) => {
    AllFiltersRefetch();
    MyFiltersRefetch();
    const onClickRow = (index: any, user: any) => {
      if (current_user?.user.id == user.createdBy) {
        setcloneOrshare(true);
      } else {
        setcloneOrshare(false);
      }
      setSelectedRowColor(index);
      setSelectedRowvalue(user.Filter.value);
      setSelectedFilterId(user.filterId);
    };
    return (
      <Box m={2} paddingTop={0} sx={{ height: "300px", overflow: "auto" }}>
        <Table
          stickyHeader={true}
          size="small"
          sx={{
            border: "1px solid #E2E5E9",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  fontWeight={"bold"}
                  color={"#323E4D"}
                  fontFamily={montserrat}
                  fontSize="14px"
                >
                  FILTER NAME
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  fontWeight={"bold"}
                  color={"#323E4D"}
                  fontFamily={montserrat}
                  fontSize="14px"
                  sx={{ marginRight: "10px" }}
                >
                  DESCRIPTION
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  fontWeight={"bold"}
                  color={"#323E4D"}
                  fontFamily={montserrat}
                  fontSize="14px"
                >
                  CREATED BY
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Button sx={{ color: "#7A7E8B", paddingY: "15px" }}></Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.length === 0 ? (
              <TableRow
                role="data-rows"
                sx={{ fontSize: "13px", color: "#323E4D" }}
              >
                <TableCell colSpan={4} align="center">
                  No record found
                </TableCell>
              </TableRow>
            ) : (
              ""
            )}
            {users?.map((user: any, index: Number) => (
              <TableRow
                sx={{
                  fontSize: "13px",
                  color: "#323E4D",
                  backgroundColor:
                    selectedRowColor === index ? "#C8E9E9" : "transparent",
                }}
                role="data-rows"
                onClick={() => onClickRow(index, user)}
              >
                <TableCell
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: "200px",
                    color: "#323E4D",
                  }}
                >
                  {user.Filter.name}
                </TableCell>
                <TableCell
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: "200px",
                    color: "#323E4D",
                  }}
                >
                  {user.Filter.description.length != 0
                    ? user.Filter.description
                    : "No Description"}
                </TableCell>
                <TableCell sx={{ color: "#323E4D" }}>
                  <AccountCircleRoundedIcon
                    sx={{ verticalAlign: "bottom", marginRight: "5px" }}
                  />
                  {user.createdByUsername}
                </TableCell>
                <TableCell align="right">
                  <CardDropDown
                    {...{
                      SharedWith: cloneOrshare,
                      item: user,
                      onClickDetail: () => {},
                      featureFlagActionEditConnection: false,
                      onClickEdit: () => {},
                      featureFlagActionShareConnection,
                      setOpenShare,
                      featureFlagActionDuplicateConnection,
                      featureFlagActionDeleteConnection: false,
                      onClickDuplicate: () => {},
                      onClickDelete: () => {},
                      onClickShare,
                      onCloneShare,
                    }}
                  />
                  {}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  };

  const ViewFilterSharedTables = (users: any) => {
    const onClickRow = (index: any, user: any) => {
      setSelectedRowColor(index);
      setSelectedRowvalue(user.Filter.value);
      setSelectedFilterId(user.filterId);
      setSelectedRowId(user.id);
      setSelectedRowisActive(user.isActive);
      if (current_user?.user.id == user.createdBy) {
        setcloneOrshare(true);
      } else {
        setcloneOrshare(false);
      }
    };

    SharedWithMeFiltersRefetch();
    SharedByMeFiltersRefetch();

    if (selectedTab == 3) {
      return (
        <Box m={2} paddingTop={0} sx={{ height: "300px", overflow: "auto" }}>
          <Table
            stickyHeader={true}
            size="small"
            sx={{
              border: "1px solid #E2E5E9",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    FILTER NAME
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    DESCRIPTION
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    CREATED BY
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    SHARED WITH
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    SHARED
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button sx={{ color: "#7A7E8B", paddingY: "15px" }}></Button>

                  {/* <Button sx={{ color: '#7A7E8B' }}>
                      <MoreHorizIcon />
                    </Button> */}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.length === 0 ? (
                <TableRow
                  role="data-rows"
                  sx={{ fontSize: "13px", color: "#323E4D" }}
                >
                  <TableCell colSpan={4} align="center">
                    No record found
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}

              {users?.map(
                (user: any, index: number) =>
                  user.isActive == true ? ( // Check if user.isActive is true
                    <TableRow
                      sx={{
                        fontSize: "13px",
                        color: "#323E4D",
                        backgroundColor:
                          selectedRowColor === index
                            ? "#C8E9E9"
                            : "transparent",
                      }}
                      role="data-rows"
                      onClick={() => onClickRow(index, user)}
                      key={index}
                    >
                      <TableCell
                        sx={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          maxWidth: "200px",
                          color: "#323E4D",
                        }}
                      >
                        {user.Filter.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          maxWidth: "200px",
                          color: "#323E4D",
                        }}
                      >
                        {user.Filter.description.length != 0
                          ? user.Filter.description
                          : "No Description"}
                      </TableCell>
                      <TableCell sx={{ color: "#323E4D" }}>
                        <AccountCircleRoundedIcon
                          sx={{ verticalAlign: "bottom", marginRight: "5px" }}
                        />
                        {user.createdByUsername}
                      </TableCell>
                      <TableCell sx={{ color: "#323E4D" }}>
                        <AccountCircleRoundedIcon
                          sx={{ verticalAlign: "bottom", marginRight: "5px" }}
                        />
                        {user.User.firstName}
                      </TableCell>
                      <TableCell sx={{ color: "#323E4D" }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={user.isActive}
                                disabled={disableToggleButton}
                              />
                            }
                            label=""
                          />
                        </FormGroup>
                        {/* <FormControlLabel
                      control={<IOSSwitch sx={{ m: 1 }} />}
                      label=""
                    /> */}
                      </TableCell>
                      <TableCell align="right">
                        <CardDropDown
                          {...{
                            SharedWith: clonefilter,
                            item: user,
                            onClickDetail: () => {},
                            featureFlagActionEditConnection: false,
                            onClickEdit: () => {},
                            featureFlagActionShareConnection,
                            setOpenShare,
                            featureFlagActionDuplicateConnection,
                            featureFlagActionDeleteConnection: false,
                            onClickDuplicate: () => {},
                            onClickDelete: () => {},
                            onClickShare,
                            onCloneShare,
                          }}
                        />
                        {/* <Button sx={{ color: '#7A7E8B' }}>
                      <MoreHorizIcon />
                    </Button> */}
                      </TableCell>
                    </TableRow>
                  ) : null // If user.isActive is false, return null to skip rendering the row
              )}
            </TableBody>
          </Table>
        </Box>
      );
    } else {
      return (
        <Box m={2} paddingTop={0} sx={{ height: "300px", overflow: "auto" }}>
          <Table
            stickyHeader={true}
            size="small"
            sx={{
              border: "1px solid #E2E5E9",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    FILTER NAME
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    DESCRIPTION
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    CREATED BY
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    SHARED WITH
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight={"bold"}
                    color={"#323E4D"}
                    fontFamily={montserrat}
                    fontSize="14px"
                  >
                    SHARED
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button sx={{ color: "#7A7E8B", paddingY: "15px" }}></Button>

                  {/* <Button sx={{ color: '#7A7E8B' }}>
                    <MoreHorizIcon />
                  </Button> */}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.length === 0 ? (
                <TableRow
                  role="data-rows"
                  sx={{ fontSize: "13px", color: "#323E4D" }}
                >
                  <TableCell colSpan={4} align="center">
                    No record found
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}
              {users?.map((user: any, index: Number) => (
                <TableRow
                  sx={{
                    fontSize: "13px",
                    color: "#323E4D",
                    backgroundColor:
                      selectedRowColor === index ? "#C8E9E9" : "transparent",
                  }}
                  role="data-rows"
                  onClick={() => onClickRow(index, user)}
                >
                  <TableCell
                    sx={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      maxWidth: "200px",
                      color: "#323E4D",
                    }}
                  >
                    {user.Filter.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      maxWidth: "200px",
                      color: "#323E4D",
                    }}
                  >
                    {user.Filter.description.length != 0
                      ? user.Filter.description
                      : "No Description"}
                  </TableCell>
                  <TableCell sx={{ color: "#323E4D" }}>
                    <AccountCircleRoundedIcon
                      sx={{ verticalAlign: "bottom", marginRight: "5px" }}
                    />
                    {user.createdByUsername}
                  </TableCell>
                  <TableCell sx={{ color: "#323E4D" }}>
                    <AccountCircleRoundedIcon
                      sx={{ verticalAlign: "bottom", marginRight: "5px" }}
                    />
                    {user.User.firstName}
                  </TableCell>
                  <TableCell sx={{ color: "#323E4D" }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={user.isActive}
                            disabled={disableToggleButton}
                            onChange={(e: any) => {
                              handleUnshareFilterApi(e, user);
                            }}
                          />
                        }
                        label=""
                      />
                    </FormGroup>
                    {/* <FormControlLabel
                      control={<IOSSwitch sx={{ m: 1 }} />}
                      label=""
                    /> */}
                  </TableCell>
                  <TableCell align="right">
                    <CardDropDown
                      {...{
                        SharedWith: clonefilter,
                        item: user,
                        onClickDetail: () => {},
                        featureFlagActionEditConnection: false,
                        onClickEdit: () => {},
                        featureFlagActionShareConnection,
                        setOpenShare,
                        featureFlagActionDuplicateConnection,
                        featureFlagActionDeleteConnection: false,
                        onClickDuplicate: () => {},
                        onClickDelete: () => {},
                        onClickShare,
                        onCloneShare,
                      }}
                    />
                    {/* <Button sx={{ color: '#7A7E8B' }}>
                      <MoreHorizIcon />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      );
    }
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const onCreateFilterClick = () => {
    setCreateFilter(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    console.log(searchValue);
    if (selectedTab === 0) {
      if (searchValue.length > 0) {
        AllFiltersRefetch({
          pagination: {
            limit: 1000,
            offset: 0,
          },
          filterInput: {
            filterInputString: JSON.stringify(
              getDefaultFilterArgumentsWithSearch
            ),
          },
          sharedFilterArg: {
            isShared: true,
            sharedByMe: true,
          },
        });
      } else if (searchValue.length === 0) {
        AllFiltersRefetch({
          pagination: {
            limit: 1000,
            offset: 0,
          },
          filterInput: {
            filterInputString: JSON.stringify(getDefaultFilterArguments),
          },
          sharedFilterArg: {
            isShared: true,
            sharedByMe: true,
          },
        });
      }
    } else if (selectedTab === 1) {
      if (searchValue.length > 0) {
        MyFiltersRefetch({
          pagination: {
            limit: 1000,
            offset: 0,
          },
          filterInput: {
            filterInputString: JSON.stringify(
              getDefaultFilterArgumentsWithSearch
            ),
          },
          sharedFilterArg: {
            isShared: false,
            sharedByMe: false,
          },
        });
      } else if (searchValue.length === 0) {
        MyFiltersRefetch({
          pagination: {
            limit: 1000,
            offset: 0,
          },
          filterInput: {
            filterInputString: JSON.stringify(getDefaultFilterArguments),
          },
          sharedFilterArg: {
            isShared: false,
            sharedByMe: false,
          },
        });
      }
    } else if (selectedTab === 2) {
      if (searchValue.length > 0) {
        SharedByMeFiltersRefetch({
          pagination: {
            limit: 1000,
            offset: 0,
          },
          filterInput: {
            filterInputString: JSON.stringify(
              getDefaultFilterArgumentsWithSearch
            ),
          },
          sharedFilterArg: {
            isShared: false,
            sharedByMe: true,
          },
        });
      } else if (searchValue.length === 0) {
        SharedByMeFiltersRefetch({
          pagination: {
            limit: 1000,
            offset: 0,
          },
          filterInput: {
            filterInputString: JSON.stringify(getDefaultFilterArguments),
          },
          sharedFilterArg: {
            isShared: false,
            sharedByMe: true,
          },
        });
      }
    } else if (selectedTab === 3) {
      if (searchValue.length > 0) {
        SharedWithMeFiltersRefetch({
          pagination: {
            limit: 1000,
            offset: 0,
          },
          filterInput: {
            filterInputString: JSON.stringify(
              getDefaultFilterArgumentsWithSearch
            ),
          },
          sharedFilterArg: {
            isShared: true,
            sharedByMe: false,
          },
        });
      } else if (searchValue.length === 0) {
        SharedWithMeFiltersRefetch({
          pagination: {
            limit: 1000,
            offset: 0,
          },
          filterInput: {
            filterInputString: JSON.stringify(getDefaultFilterArguments),
          },
          sharedFilterArg: {
            isShared: true,
            sharedByMe: false,
          },
        });
      }
    }
  }, [debounceVal]);

  const [createFilterValues, setCreateFilterValues] =
    useState<CreateFilterValues>({
      filterName: "",
      filterDescription: "",
      filterKey: "Key Field",
      filterCondition: "Conditions",
      filterValue: "",
      column: columnPending,
    });

  const onChange = (fieldName: keyof CreateFilterValues, value: string) => {
    setCreateFilterValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const [createFilter1] = useMutation(CreateFilter, {});

  const [filters, setFilters] = useState<Filter[]>([
    { FilterKey: "", FilterCondition: "", FilterValue: "" },
  ]);

  const OnClickRun1 = () => {
    runWithOutSave(filters);
    handleCloseHandler();
  };

  const ResetFilterValues = () => {
    // const newFilters = filters.map(filter => ({
    //   ...filter,
    //   FilterKey: '',
    //   FilterCondition: '',
    //   FilterValue: '',
    // }));

    // setFilters(newFilters);
    let temp = [{ FilterKey: "", FilterCondition: "", FilterValue: "" }];
    console.log(temp);
    setFilters(temp);
  };

  const {
    filterName,
    filterDescription,
    filterKey,
    filterCondition,
    filterValue,
  } = createFilterValues;

  const handleCreateFilterApi = async () => {
    try {
      const createFilterInput = {
        name: filterName,
        description: filterDescription,
        value: JSON.stringify(transformValues(filters)),
        dto: dto,
      };

      createFilter1({
        variables: { createFilterInput }, // Pass the variables here
      })
        .then((response) => {
          // Handle the response data here
          console.log("Mutation response:", response.data);
          setCreateFilter(false);
          AllFiltersRefetch();
          MyFiltersRefetch();
        })
        .catch((error) => {
          // Handle errors here
          console.error("Mutation error:", error);
        });
    } catch {
      console.log(error);
    }
  };

  const [users, setUser] = useState<User[]>();
  const [optionsVal, setOptionsVal] = useState<OptionType[]>([]);
  const { instance, accounts } = useMsal();
  const title = "Share via Email";
  const userType = "AD";
  const [textVal, setTextVal] = useState("");

  const setTextValue = (value: string) => {
    setTextVal(value);
  };

  const [getZDPusers] = useLazyQuery(GET_TABLE_DATA, {
    variables: {
      pagination: { offset: 0, limit: 10 },
      DataModelInput: { entity: "user" },
      QueryInput: {
        filterInputString: "{}",
      },
    },
  });

  const getAllUsers = (searchParam?: string) => {
    if (userType === "AD") {
      const request = {
        ...getAllUsersRequest,
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(request)
        .then((response) => {
          callMsGetAllUsersGraph(response.accessToken, searchParam).then(
            (response) => {
              setUser(response.value);
              const copyArr = [...response.value];

              const optionArr = copyArr.map((item: User) => {
                console.log(item);
                return {
                  name: item.displayName,
                  inputValue: "",
                  email: item.userPrincipalName,
                  id: item.id,
                };
              });
              setOptionsVal(optionArr);
            }
          );
        })
        .catch((e) => {
          instance.acquireTokenPopup(request).then((response) => {
            callMsGetAllUsersGraph(response.accessToken, searchParam).then(
              (response) => console.log(response)
            );
          });
        });
    } else if (userType == "ZDP") {
      getZDPusers({
        variables: {
          pagination: { offset: 0, limit: 10 },
          DataModelInput: { entity: "user" },
          QueryInput: {
            filterInputString: JSON.stringify(getDefaultFilterArguments),
          },
        },
      }).then((response) => {
        console.log(response.data);
        setUser(response.data);
        const copyArr = [...response.data.GetDataByJsonQuery.info.data];
        console.log(copyArr);
        const optionArr = copyArr.map((item: any) => {
          console.log(item);
          return {
            name: item.firstName,
            inputValue: "",
            email: item.email,
            id: item.id,
          };
        });
        setOptionsVal(optionArr);
      });
    }
  };

  const [debounceVal1] = useDebounce(textVal, 300);

  const getDefaultFilterArguments1 = {
    $and: {
      $and: [{ first_name: { $like: debounceVal1 } }],
    },
  };

  useEffect(() => {
    getAllUsers(debounceVal1);
  }, [debounceVal1]);

  return (
    <HistoryParentComponent
      runWithOutSave={runWithOutSave}
      transformValues={transformValues}
      runSavedFilters={runSavedFilters}
      onSearchChange={onSearchChange}
      search={search}
      notificationData={notificationData}
      columnPending={columnPending}
      notificationLoading={notificationLoading}
      openFilterPopup={openFilterPopup}
      handleCloseHandler={handleCloseHandler}
      PaginationBar={PaginationBar}
      onFilterClick={onFilterClick}
      createFilter={createFilter}
      setCreateFilter={setCreateFilter}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      searchValue={searchValue}
      debounceVal={debounceVal}
      selectedRowColor={selectedRowColor}
      setSelectedRowColor={setSelectedRowColor}
      selectedRowvalue={selectedRowvalue}
      setSelectedRowvalue={setSelectedRowvalue}
      selectedRowFilterId={selectedRowFilterId}
      setSelectedFilterId={setSelectedFilterId}
      setSelectedRowId={setSelectedRowId}
      setSelectedRowisActive={setSelectedRowisActive}
      openShare={openShare}
      setOpenShare={setOpenShare}
      values={values}
      setValues={setValues}
      UseridsArray={UseridsArray}
      setUserIdsArray={setUserIdsArray}
      clonefilter={clonefilter}
      cloneOrshare={cloneOrshare}
      setcloneOrshare={setcloneOrshare}
      current_user={current_user}
      disableToggleButton={disableToggleButton}
      shareFilter={shareFilter}
      loading={loading1}
      error={error}
      cloneFilter={cloneFilter}
      unshareFilter={unshareFilter}
      handleShareFilterApi={handleShareFilterApi}
      handleCloneFilterApi={handleCloneFilterApi}
      onSetValue={onSetValue}
      OnClickRun={OnClickRun}
      AllFiltersData={AllFiltersData}
      AllFiltersRefetch={AllFiltersRefetch}
      MyFiltersData={AllFiltersData}
      MyFiltersRefetch={MyFiltersData}
      SharedByMeFiltersData={SharedByMeFiltersData}
      SharedByMeFiltersRefetch={SharedByMeFiltersRefetch}
      SharedWithMeFiltersData={SharedWithMeFiltersData}
      SharedWithMeFiltersRefetch={SharedWithMeFiltersRefetch}
      onCloseShare={onCloseShare}
      onClickShare={onClickShare}
      onCloneShare={onCloneShare}
      featureFlagActionShareConnection={featureFlagActionShareConnection}
      featureFlagActionDuplicateConnection={
        featureFlagActionDuplicateConnection
      }
      saveDataShare={saveDataShare}
      handleUnshareFilterApi={handleUnshareFilterApi}
      viewFilterTables={viewFilterTables}
      ViewFilterSharedTables={ViewFilterSharedTables}
      handleTabChange={handleTabChange}
      onCreateFilterClick={onCreateFilterClick}
      handleSearchChange={handleSearchChange}
      createFilterValues={createFilterValues}
      setCreateFilterValues={setCreateFilterValues}
      onChange={onChange}
      createFilter1={createFilter1}
      loading1={loading1}
      filters={filters}
      setFilters={setFilters}
      OnClickRun1={OnClickRun1}
      ResetFilterValues={ResetFilterValues}
      handleCreateFilterApi={handleCreateFilterApi}
      setUser={setUser}
      optionsVal={optionsVal}
      setOptionsVal={setOptionsVal}
      instance={instance}
      accounts={accounts}
      textVal={textVal}
      setTextVal={setTextVal}
      setTextValue={setTextValue}
      getZDPusers={getZDPusers}
      getAllUsers={getAllUsers}
      debounceVal1={debounceVal1}
    />
  );
};

export default NotificationHistory;
