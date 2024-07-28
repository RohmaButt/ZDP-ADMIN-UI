import {
  Tabs,
  Tab,
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  DialogActions,
  IconButton,
  InputBase,
  InputAdornment,
  Theme,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import CreateFilter from "./CreateFilter";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Padding, Share } from "@mui/icons-material";
import { Footer } from "./Footer";
import montserrat from "./fonts/Montserrat-Bold.ttf";
import Switch, { SwitchProps } from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useLayoutEffect } from "react";
import { Column } from "@ant-design/plots";

import { GET_SAVED_FILTERS_MERCH } from "../../graphql/filters/queries";
import { pimClient } from "../../providers";
import { useAppSelector } from "../../app/hooks";
import DialogComponent from "./Dialog";
import imgicon from "../../../assets/icon/current.png";
import ShareDialog from "./ShareDialog";
import CardDropDown from "./CardDropDown";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import Dialog from "@mui/material/Dialog";
import {
  CREATE_USER_FILTER,
  CloneFilter,
  UnshareFilter,
} from "../../graphql/filters/mutations";
import { number } from "prop-types";
import { selectUser } from "../../features/user/userSlice";
import { useDebounce } from "use-debounce";
import React from "react";

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

interface ViewFilterProps {
  column: any;
  onClose: () => void;
  runWithOutSave: (filters: any) => void;
  transformValues: (filters: any) => any[];
  runSavedFilters: (val: any) => void;
  dto: string;
}

const IOSSwitch = styled((props: JSX.IntrinsicAttributes & SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 22,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 18,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const label = { inputProps: { "aria-label": "Switch demo" } };

const ViewFilter: React.FC<ViewFilterProps> = ({
  column,
  onClose,
  runWithOutSave,
  transformValues,
  runSavedFilters,
  dto,
}) => {
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

  const [shareFilter, { loading, error, data }] = useMutation(
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
    onClose();
  };

  // ---------------------------------------

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

  // ALL FILTERS
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

  // MY FILTERS
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

  // SHARED BY ME FILTERS
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

  // SHARED WITH ME FILTERS
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
  // ---------------------------------------------

  // ----------------------------------------------
  // SHARE WALA KAAM

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

  // ----------------------------------------------
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

  // USE EFFECT FOR SEARCH ON VIEW FILTERS
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
      column: column,
    });

  const onChange = (fieldName: keyof CreateFilterValues, value: string) => {
    setCreateFilterValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  return createFilter ? (
    <CreateFilter
      refetchViewAllFilters={AllFiltersRefetch}
      refetchViewMyFilters={MyFiltersRefetch}
      runWithOutSave={runWithOutSave}
      setCreateFilters={setCreateFilter}
      column={column}
      onClose={onClose}
      createFilterValues={createFilterValues}
      dto={dto}
      onChange={onChange}
      transformValues={transformValues}
    />
  ) : (
    <Box sx={{}}>
      {}
      <Box sx={{ padding: "25px" }}>
        <Box mb={2} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">Product Data Filters</Typography>
          <Button
            sx={{ padding: "3px", minWidth: "0%" }}
            onClick={onClose}
            color="inherit"
            data-testid="close"
          >
            <CloseIcon sx={{ color: "#7A7E8B" }} />
          </Button>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            marginTop: 3,
            marginBottom: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {" "}
          <InputBase
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange}
            autoFocus
            data-testid="search-field"
            sx={{
              height: "35px",
              padding: "4px",
              borderRadius: "5px",
              marginRight: "15px",
              border: "1px solid #E2E5E9",
            }}
            startAdornment={
              <InputAdornment position="start">
                <IconButton>
                  <SearchRoundedIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            style={{
              textTransform: "none",
              fontWeight: "bold",
              height: "fit-content",
              marginRight: "5px",
              width: "100px",
            }}
            size="small"
            onClick={onCreateFilterClick}
            variant="contained"
            data-testid="create-filter"
          >
            Create Filter
          </Button>
        </Box>
      </Box>
      {/* Table and tabs starts from here */}
      <Box sx={{ float: "left", width: "100%", marginBottom: "30px" }}>
        <Tabs
          sx={{
            borderBottom: "1px solid #E2E5E9",
            "& .MuiTabs-indicator": { backgroundColor: "#005596" },
          }}
          value={selectedTab}
          onChange={handleTabChange}
        >
          <Tab
            label="All Filters"
            sx={{
              textTransform: "none",
              "&.Mui-selected": { color: "#005596" },
              color: "#132640",
              fontSize: "14px",
            }}
          />
          <Tab
            label="My Filters"
            sx={{
              textTransform: "none",
              "&.Mui-selected": { color: "#005596" },
              color: "#132640",
              fontSize: "14px",
            }}
          />
          <Tab
            label="Shared By Me"
            sx={{
              textTransform: "none",
              "&.Mui-selected": { color: "#005596" },
              color: "#132640",
              fontSize: "14px",
            }}
          />
          <Tab
            label="Shared With Me"
            sx={{
              textTransform: "none",
              "&.Mui-selected": { color: "#005596" },
              color: "#132640",
              fontSize: "14px",
            }}
          />
        </Tabs>
        <div>
          {selectedTab === 0 &&
            viewFilterTables(AllFiltersData?.userFilterGetAll?.data)}
          {selectedTab === 1 &&
            viewFilterTables(MyFiltersData?.userFilterGetAll?.data)}
          {selectedTab === 2 &&
            ViewFilterSharedTables(
              SharedByMeFiltersData?.userFilterGetAll?.data
            )}
          {selectedTab === 3 &&
            ViewFilterSharedTables(
              SharedWithMeFiltersData?.userFilterGetAll?.data
            )}

          {/* {selectedTab === 1 && (
              <Box
                m={2}
                paddingTop={0}
                sx={{ height: '300px', overflow: 'auto' }}
              >
                <Table
                  stickyHeader={true}
                  size="small"
                  sx={{
                    border: '1px solid #E2E5E9',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight={'bold'} color={'#323E4D'}>
                          Filter Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={'bold'} color={'#323E4D'}>
                          Description
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={'bold'} color={'#323E4D'}>
                          Created By
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button>
                          <MoreHorizIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sharedData &&
                      sharedData?.userFilterGetAll?.data?.length > 0 &&
                      sharedData?.userFilterGetAll?.data?.map((row1: any) => {
                        return (
                          <TableRow
                            key={row1.filterId}
                            sx={{ fontSize: '13px', color: '#323E4D' }}
                          >
                            <TableCell>{row1.filterId}</TableCell>
                            <TableCell>{row1.Filter.name}</TableCell>
                            <TableCell>
                              <AccountCircleRoundedIcon
                                sx={{ verticalAlign: 'bottom' }}
                              />{' '}
                              {row1.userId}
                            </TableCell>
                            <TableCell align="right">
                              <Button>
                                <MoreHorizIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {sharedData &&
                      sharedData?.userFilterGetAll?.data?.length === 0 && (
                        <TableRow
                          role="data-rows"
                          sx={{ fontSize: '13px', color: '#323E4D' }}
                        >
                          <TableCell colSpan={4} align="center">
                            No record found
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </Box>
            )} 
              
            {selectedTab === 2 && (
              <Box
                m={2}
                paddingTop={0}
                sx={{ height: '300px', overflow: 'auto' }}
              >
                <Typography variant="h5">Tab 3 Content</Typography>
                <Typography>
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </Typography>
              </Box>
            )}
            {selectedTab === 3 && (
              <Box
                m={2}
                paddingTop={0}
                sx={{ height: '300px', overflow: 'auto' }}
              >
                <Typography variant="h5">Tab 4 Content</Typography>
                <Typography>
                  Sed do eiusmod tempor et dolore magna aliqua.
                </Typography>
              </Box>
            )}*/}
        </div>
        <DialogComponent
          open={openShare}
          handleClose={onCloseShare}
          dialogChildrenStyle={{ paddingX: "0px" }}
          firstDivider={false}
          handleSave={saveDataShare}
          saveButtonText={"Share"}
          isLoading={loading}
        >
          <ShareDialog
            values={values}
            onSetValue={onSetValue}
            title={"Share via Filters"}
            userType="ZDP"
          />
        </DialogComponent>
      </Box>
      {/* Table ends here */}
      <br />
      <Footer
        onClose={onClose}
        onRun={() => OnClickRun(selectedRowvalue)}
        onSave={onClose}
        isCreateFilter={false}
      />
    </Box>
  );
};
export default ViewFilter;
