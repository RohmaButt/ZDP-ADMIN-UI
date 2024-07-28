import { Tag, Typography } from "antd";
import React, { useMemo, FC, useState, useCallback, useEffect } from "react";
import { ConditionType } from "../FilterView";
import IosShareIcon from "@mui/icons-material/IosShare";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { defaultPaginationParams } from "../../utils/constants";
import { GET_ACTIVE_USERS } from "../../graphql/users/queries";
import { useMutation, useQuery } from "@apollo/client";
import CircularProgress from "../external/CircularProgress";
import {
  SHARE_FILTER,
  ShareFilterInputArgs,
} from "../../graphql/users/mutations";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../NotificationContent";
import MuiTypography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import theme from "../../mui.theme";
import { getFirstTwoLetters } from "../../utils/common";
import { ArchiveFilter } from "../../graphql/filters/mutations";

const { Text } = Typography;

type SavedFilterProps = {
  filter: any;
  setUserConditions: (conditions: Array<ConditionType>) => void;
  executeRawQuery: (query: string, filter: any) => void;
  currentFilter: any;
  updateFilter: (id: number, isArchived: boolean) => void;
  handleRefectFilters: () => void;
  setEditMode?: (mode: boolean, filterName: string, filterId: number) => void;
  fieldsFromMetaData: any;
  isEditable?: boolean;
  isShareable?: boolean;
};

export const getConditionsObjectFromServerQuery = async (
  filterString: string,
  fieldsFromMetaData: any
) => {
  const obj = await JSON.parse(filterString);
  const conditions: Array<ConditionType> = obj.$and.map((item: any) => {
    const keyName = Object.keys(item)[0];
    const currentFiled = fieldsFromMetaData.filter(
      (item: any) => item.name === keyName
    );
    const conditionValue = Object.keys(item[keyName])[0];
    let Condition: ConditionType = {
      field: keyName,
      label: currentFiled.length && currentFiled[0].metadata.friendlyName,
      condition: conditionValue,
      isDone: true,
      values: item[keyName][conditionValue],
      keyIndentifier: Math.random() + "-" + conditionValue,
    };
    return Condition;
  });
  return conditions;
};

const SavedFilter = ({
  filter,
  executeRawQuery,
  currentFilter,
  updateFilter,
  handleRefectFilters,
  setUserConditions,
  setEditMode,
  fieldsFromMetaData,
  isEditable = false,
  isShareable = false,
}: SavedFilterProps) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isSharingFilters, setIsSharingFilters] = useState(false);
  const [
    shareFilterMutateFunction,
    {
      data: shareFilterMutationRes,
      loading: shareFilterMutationLoading,
      error: shareFilterMutationError,
    },
  ] = useMutation(SHARE_FILTER);

  const [
    archiveFilterMutateFunction,
    {
      data: archiveFilterResFromServer,
      error: archiveFilterError,
      loading: archiveFilterLoading,
    },
  ] = useMutation(ArchiveFilter, {
    notifyOnNetworkStatusChange: true,
  });

  //for archive filter response notif
  useEffect(() => {
    if (!archiveFilterError && archiveFilterResFromServer) {
      const { archiveUserFilter } = archiveFilterResFromServer;
      const { isActive } = archiveUserFilter;

      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={
              isActive
                ? "Filter unarchived successfully."
                : "Filter archived successfully."
            }
          />
        ),
        ...notificationOptions,
      });
      handleRefectFilters();
    }
    // else if (archiveFilterError) {
    //   Store.addNotification({
    //     content: (
    //       <NotificationContent
    //         type={"danger"}
    //         message={"Unable to archive the filter."}
    //       />
    //     ),
    //     ...notificationOptions,
    //   });
    // }
  }, [archiveFilterResFromServer, archiveFilterError]);

  const handleArchiveFilter = (id: number, isArchived: boolean) => {
    archiveFilterMutateFunction({
      variables: {
        archiveUserFilter: {
          filterId: id,
          isActive: isArchived,
        },
      },
    });
  };

  const isCurrentFilter = useMemo(() => {
    if (currentFilter?.Filter?.id === filter?.Filter?.id) {
      return true;
    }
    return false;
  }, [currentFilter]);

  const runRawFilter = async (condition: string) => {
    if (isCurrentFilter) {
      executeRawQuery("{}", undefined);
    } else {
      executeRawQuery(condition, filter);
    }
  };

  const handleUpdate = () => {
    updateFilter(filter.id, true);
  };

  const handleArchive = (isArchive: boolean) => {
    handleArchiveFilter(filter.Filter.id, isArchive);
  };

  const handleUserDialogOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleUserDialogClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (shareFilterMutationRes) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Filter shared successfully."}
          />
        ),
        ...notificationOptions,
      });
      handleUserDialogClose();
    }
    // else if (shareFilterMutationError) {
    //   Store.addNotification({
    //     content: (
    //       <NotificationContent
    //         type={"danger"}
    //         message={"Unable to share filter."}
    //       />
    //     ),
    //     ...notificationOptions,
    //   });
    // }
  }, [shareFilterMutationRes, shareFilterMutationError]);

  const handleOnUserSelected = useCallback(
    (users: Array<any>) => {
      const userIds = users.map((user) => parseInt(user.id));
      const payload: ShareFilterInputArgs = {
        userIds: userIds,
        filterId: parseInt(filter.Filter.id),
      };
      shareFilterMutateFunction({
        variables: {
          shareFilterInput: payload,
        },
      });
      setIsSharingFilters(true);
    },
    [isSharingFilters]
  );

  const handleEditFilter = async () => {
    const conditions = await getConditionsObjectFromServerQuery(
      filter.Filter.value,
      fieldsFromMetaData
    );
    setUserConditions(conditions);
    setEditMode && setEditMode(true, filter.Filter.name, filter.Filter.id);
  };

  return (
    <div
      style={{
        display: "flex",
        marginTop: "10px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          overflow: "clip",
        }}
      >
        <Tag
          style={{
            fontSize: isCurrentFilter ? 16 : 14,
            backgroundColor: theme.palette.primary.main,
            padding: 4,
            border: 0,
            paddingInline: "12px",
            maxWidth: "95%",
          }}
        >
          <Text
            ellipsis={
              filter.Filter.name && filter.Filter.name.length > 30
                ? { tooltip: filter.Filter.name }
                : false
            }
            style={{
              color: "white",
              fontWeight: isCurrentFilter ? "bold" : "normal",
            }}
          >
            {filter.Filter.name}
          </Text>
        </Tag>
      </div>
      <div
        style={{
          justifyContent: "flex-end",
          display: "flex",
          alignItems: "center",
          alignSelf: "flex-end",
          flex: 1,
        }}
      >
        <div>
          <Tooltip title={!isCurrentFilter ? "Run" : "Reset"}>
            <IconButton
              disabled={!filter.isActive}
              color={"primary"}
              onClick={() => runRawFilter(filter.Filter.value)}
            >
              {!isCurrentFilter ? (
                <PlayCircleOutlinedIcon />
              ) : (
                <PauseCircleOutlineOutlinedIcon
                  style={{ color: "lightcoral" }}
                />
              )}
            </IconButton>
          </Tooltip>
        </div>
        {isEditable && (
          <div>
            <Tooltip title={"Edit"}>
              <IconButton disabled={isCurrentFilter} onClick={handleEditFilter}>
                <ModeEditOutlineOutlinedIcon
                  style={{
                    color: isCurrentFilter
                      ? theme.palette.action.disabled
                      : theme.palette.primary.main,
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {isShareable && (
          <div>
            <Tooltip title={"Share"}>
              <IconButton
                disabled={!filter.isActive}
                onClick={handleUserDialogOpen}
              >
                <IosShareIcon
                  style={{
                    color: !filter.isActive
                      ? theme.palette.action.disabled
                      : theme.palette.primary.main,
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        )}
        <div>
          <Tooltip title={filter.isActive ? "Archive" : "Unarchive"}>
            <IconButton
              disabled={isCurrentFilter}
              onClick={() => handleArchive(!filter.isActive)}
            >
              {archiveFilterLoading ? (
                <Box
                  component={"div"}
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  <CircularProgress size={"15px"} sx={{ marginRight: "8px" }} />
                </Box>
              ) : (
                <Box
                  component={"div"}
                  sx={{ alignItems: "center", display: "flex" }}
                >
                  {filter.isActive ? (
                    <ArchiveOutlinedIcon
                      style={{
                        color: isCurrentFilter
                          ? theme.palette.action.disabled
                          : theme.palette.primary.main,
                      }}
                    />
                  ) : (
                    <UnarchiveOutlinedIcon
                      style={{ color: theme.palette.primary.main }}
                    />
                  )}
                </Box>
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <SelectUsersDialog
        onDone={handleOnUserSelected}
        title={"Share Filter"}
        contentText={
          "Colaborate with others on updating and maintaining product information"
        }
        isOpen={isOpen}
        handleClose={handleUserDialogClose}
        contentContainerStyle={{ width: "70%" }}
        isLoading={shareFilterMutationLoading}
      />
    </div>
  );
};

export default SavedFilter;

type SelectUsersDialog = {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  contentText: string;
  containerStyle?: any;
  contentContainerStyle?: any;
  onDone: (users: Array<any>) => void;
  isLoading?: boolean;
};

const SelectUsersDialog: FC<SelectUsersDialog> = ({
  isOpen,
  handleClose,
  title,
  contentText,
  containerStyle,
  contentContainerStyle,
  isLoading = false,
  onDone,
}: SelectUsersDialog) => {
  const [selectedUsers, setSelectedUsers] = useState<Array<any>>([]);
  const {
    data: users,
    refetch: refectusers,
    error: usersError,
    loading: usersLoading,
  } = useQuery(GET_ACTIVE_USERS, {
    variables: {
      pagination: { ...defaultPaginationParams },
    },
  });

  const handleCloseHandler = () => {
    handleClose();
  };

  const handleDone = (value: any) => {
    onDone(selectedUsers);
  };

  const handleOnChange = (ev: any, value: Array<any>) => {
    setSelectedUsers(value);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleCloseHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={false}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {contentText}
            <Box sx={{ marginTop: "20px" }}>
              <Autocomplete
                loading={usersLoading}
                multiple
                limitTags={2}
                id="multiple-limit-tags"
                options={users?.getAllUser?.data}
                getOptionLabel={(option: any) => option.firstName}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar
                      sx={{
                        bgcolor: "white",
                        color: theme.palette.primary.main,
                        border: `2px solid ${theme.palette.primary.main}`,
                        width: "30px",
                        height: "30px",
                      }}
                    >
                      <MuiTypography fontSize={"12px"}>
                        {getFirstTwoLetters(option.firstName)}
                      </MuiTypography>
                    </Avatar>
                    <Box
                      sx={{
                        marginLeft: "10px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      component={"div"}
                    >
                      <MuiTypography>{option.firstName}</MuiTypography>
                      <MuiTypography variant="body2">
                        {option.userName}
                      </MuiTypography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Users"
                    placeholder="Select Users"
                    size="small"
                  />
                )}
                onChange={handleOnChange}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          {isLoading ? (
            <CircularProgress size={"20px"} sx={{ marginRight: "15px" }} />
          ) : (
            <Button
              disabled={!selectedUsers.length}
              sx={{ marginRight: "15px" }}
              variant="contained"
              size="small"
              onClick={handleDone}
            >
              Share
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
