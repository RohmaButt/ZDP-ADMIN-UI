import { useMsal } from "@azure/msal-react";
import React from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { getAllUsersRequest } from "../../config/authConfig";
import { callMsGetAllUsersGraph } from "../../services/msGraphApi";
import { createQuery, getFirstTwoLetters } from "../../utils/common";
import theme from "../../mui.theme";
import MuiTypography from "@mui/material/Typography";
import {
  defaultPageLimit,
  RolePermissions,
  UserRoles,
} from "../../utils/constants";
import { Radio } from "antd";
import { GET_TABLE_DATA } from "../../graphql/generic/queries";
import { useMutation, useQuery } from "@apollo/client";
import { ConditionType } from "../../components/FilterView";
import { INVITE_USER_TO_THE_APP } from "../../graphql/dashboard/mutations";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../../components/NotificationContent";
import { User } from "../../pages/Members";

type InviteMemberDialog = {
  handleClose: () => void;
  isOpen: boolean;
  onDone: () => void;
  title: string;
  rows: any;
  memberValEdit: any;
  refetchAllUserData: () => void;
  app: any;
};

const InviteMemberDialog: FC<InviteMemberDialog> = ({
  handleClose,
  isOpen,
  onDone,
  title,
  rows,
  memberValEdit,
  refetchAllUserData,
  app,
}: InviteMemberDialog) => {
  const [memberVal, setMemberVal] = useState<any>({});
  const [users, setUser] = useState<User[]>();
  const [usersOnLoad, setUsersOnLoad] = useState<User[]>();
  const { instance, accounts } = useMsal();
  const [selectedRights, setSelectedRights] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const columns = RolePermissions;

  const handleOnChange = (ev: any, value: any) => {
    if (value && value !== undefined && value !== null) {
      setMemberVal(value);
    } else {
      setMemberVal({});
    }
  };

  const handleOnTextboxChange = (value: any) => {
    setSearchParam(value);
  };

  const handleCloseHandler = () => {
    setMemberVal({});
    setSelectedRights([]);
    setSelectAll("");
    handleClose();
  };

  const getAllUsers = (searchParam?: string) => {
    const request = {
      ...getAllUsersRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        callMsGetAllUsersGraph(response.accessToken, searchParam).then(
          (response) => setUser(response.value)
        );
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          callMsGetAllUsersGraph(response.accessToken, searchParam).then(
            (response) => console.log(response)
          );
        });
      });
  };

  const getAllUsersOnLoad = () => {
    const request = {
      ...getAllUsersRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        callMsGetAllUsersGraph(response.accessToken).then((response) =>
          setUsersOnLoad(response.value)
        );
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          callMsGetAllUsersGraph(response.accessToken).then((response) =>
            console.log(response)
          );
        });
      });
  };

  const handleDone = () => {
    let filteredSelectedRights = selectedRights.filter(
      (x: any) => x.roleId !== 0
    );
    inviteUserToTheAppMutation({
      variables: {
        inviteUserInput: {
          externalUserId: memberVal.id,
          authenticationType: "AZURE",
          firstName: memberVal.displayName,
          email: memberVal.mail,
          userName: memberVal.userPrincipalName,
          userRoles: filteredSelectedRights,
        },
      },
    });
  };

  const handleRadioChange = (event: any, row: any) => {
    let temp = [...selectedRights];
    let targetIndex = temp.findIndex((f) => f.appId === row.id);
    if (targetIndex !== -1) {
      temp[targetIndex].roleId = event.target.value;
    } else {
      temp.push({ appId: row.id, roleId: event.target.value });
    }
    setSelectedRights(temp);
    setSelectAll("");
  };

  const isCreate = () => {
    if (
      memberVal &&
      Object.keys(memberVal).length > 0 &&
      selectedRights.length > 0
    )
      return true;
    return false;
  };

  const onSelectAllChange = (ev: any) => {
    let temp: any = [];
    rows?.forEach((element: any) => {
      temp.push({ appId: element.id, roleId: ev.target.value });
    });
    setSelectedRights(temp);
    setSelectAll(ev.target.value);
  };

  const [
    inviteUserToTheAppMutation,
    {
      data: inviteUserToTheAppRes,
      loading: inviteUserToTheAppLoading,
      error: inviteUserToTheAppError,
    },
  ] = useMutation(INVITE_USER_TO_THE_APP);

  const defaultConditionObject: ConditionType = {
    field: "userId",
    values: memberValEdit.id,
    condition: "$eq",
  };

  const radioButtonDisabled = (appName: string) => {
    if (app === undefined || app === null) return false;
    else {
      if (app && app?.name === appName) return false;
      return true;
    }
  };

  const defaultQuery = createQuery([defaultConditionObject], "UserRole");
  const {
    loading: loadingUserRole,
    error: errorUserRole,
    data: userRoleData,
    refetch: refetchUserRole,
  } = useQuery(GET_TABLE_DATA, {
    variables: {
      pagination: { limit: defaultPageLimit, offset: 0 },
      DataModelInput: { entity: "UserRole" },
      QueryInput: {
        filterInputString: JSON.stringify(defaultQuery),
      },
    },
  });

  useEffect(() => {
    getAllUsers();
    getAllUsersOnLoad();
  }, []);

  useEffect(() => {
    if (searchParam) {
      let arr = usersOnLoad?.filter((user: any) =>
        user.displayName.toLowerCase().startsWith(searchParam.toLowerCase())
      );
      if (arr?.length === 0) getAllUsers(searchParam);
      else {
        setUser(arr);
      }
    } else {
      setUser(usersOnLoad);
    }
  }, [searchParam]);

  useEffect(() => {
    if (Object.keys(memberValEdit).length > 0) {
      setMemberVal({
        id: memberValEdit.externalUserId,
        authenticationType: memberValEdit.authenticationType,
        displayName: memberValEdit.firstName,
        mail: memberValEdit.email,
        userPrincipalName: memberValEdit.userName,
      });
      refetchUserRole();
      if (
        userRoleData?.GetDataByJsonQuery?.info?.data &&
        userRoleData?.GetDataByJsonQuery?.info?.data?.length > 0
      ) {
        let arr: any[] = [];
        userRoleData?.GetDataByJsonQuery?.info?.data?.forEach(
          (element: any) => {
            arr.push({
              appId: element.appId,
              roleId: element.roleId,
            });
          }
        );
        setSelectedRights(arr);
      }
    }
  }, [memberValEdit, userRoleData]);

  // useEffect(() => {
  //   if (!inviteUserToTheAppError && inviteUserToTheAppRes) {
  //     Store.addNotification({
  //       content: (
  //         <NotificationContent
  //           type={"success"}
  //           message={"Record created successfully."}
  //         />
  //       ),
  //       ...notificationOptions,
  //     });
  //     handleCloseHandler();
  //     refetchAllUserData();
  //   }
  //   // else if (inviteUserToTheAppError) {
  //   //   Store.addNotification({
  //   //     content: (
  //   //       <NotificationContent
  //   //         type={"danger"}
  //   //         message={"Unable to update the Record. Please try again later."}
  //   //       />
  //   //     ),
  //   //     ...notificationOptions,
  //   //   });
  //   // }
  // }, [inviteUserToTheAppRes, inviteUserToTheAppError]);

  useEffect(() => {
    if (!inviteUserToTheAppError && inviteUserToTheAppRes) {
      const existingRecord = selectedRights.length;

      if (!existingRecord) {
        Store.addNotification({
          content: (
            <NotificationContent
              type={"success"}
              message={"Record created successfully."}
            />
          ),
          ...notificationOptions,
        });
        handleCloseHandler();
        refetchAllUserData();
      } else {
        Store.addNotification({
          content: (
            <NotificationContent
              type={"success"}
              message={"User already Exists with Assigned Rights."}
            />
          ),
          ...notificationOptions,
        });
      }
    }
  }, [inviteUserToTheAppRes, inviteUserToTheAppError]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleCloseHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box mt={"20px"}>
              <Autocomplete
                //  loading={usersLoading}
                // multiple
                // limitTags={2}
                disabled={Object.keys(memberValEdit).length > 0 ? true : false}
                id="multiple-limit-tags"
                // options={users ? users?.getAllUser?.data : []}
                options={users ? users : []}
                getOptionLabel={(option: any) => option?.displayName}
                //  value={setAdminValue}
                value={Object.keys(memberVal).length > 0 ? memberVal : null}
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
                        {getFirstTwoLetters(option?.displayName)}
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
                      <MuiTypography>{option?.displayName}</MuiTypography>
                      <MuiTypography variant="body2">
                        {option?.mail}
                      </MuiTypography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Member"
                    placeholder="Select User"
                    size="small"
                    onChange={(ev) => handleOnTextboxChange(ev.target.value)}
                  />
                )}
                onChange={handleOnChange}
              />
            </Box>
            <Box mt={"20px"}>
              <MuiTypography variant="body1" style={{ fontWeight: "bold" }}>
                Assign Member App and Permissions
              </MuiTypography>
              <TableContainer>
                <Table sx={{ minWidth: 550 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      {Object.values(RolePermissions)
                        .filter((value) => value !== "id")
                        .map((value: any) => (
                          <TableCell
                            key={value}
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            {value}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold" }}>
                        Select All
                      </TableCell>
                      {Object.keys(RolePermissions)
                        .filter((key) => key !== "id")
                        .map((key: any) => (
                          <TableCell
                            align="right"
                            style={{ fontWeight: "bold" }}
                          >
                            <Radio
                              disabled={app && app !== undefined ? true : false}
                              value={UserRoles[key] ? UserRoles[key] : 0}
                              onChange={(ev) => onSelectAllChange(ev)}
                              checked={
                                selectAll === UserRoles[key] ? true : false
                              }
                            />
                          </TableCell>
                        ))}
                    </TableRow>
                    {rows?.map((row: any) => (
                      <TableRow key={row.name}>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ fontWeight: "bold" }}
                        >
                          {row.name}
                        </TableCell>
                        {Object.keys(RolePermissions)
                          .filter((key) => key !== "id")
                          .map((key: any) => (
                            <TableCell key={key} align="right">
                              <Radio
                                disabled={radioButtonDisabled(row.name)}
                                value={UserRoles[key] ? UserRoles[key] : 0}
                                onChange={(ev) => handleRadioChange(ev, row)}
                                checked={
                                  selectedRights.filter(
                                    (x) =>
                                      x.appId == row.id &&
                                      x.roleId == UserRoles[key]
                                  ).length > 0
                                    ? true
                                    : false
                                }
                              />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          {inviteUserToTheAppLoading ? (
            <CircularProgress size={"20px"} sx={{ marginRight: "15px" }} />
          ) : (
            <Box>
              <Button
                style={{
                  color: "#005596",
                }}
                variant="text"
                size="small"
                onClick={handleCloseHandler}
              >
                Cancel
              </Button>
              <Button
                disabled={!isCreate()}
                style={
                  isCreate()
                    ? {
                        borderRadius: "25px",
                        borderColor: "#005596",
                        color: "white",
                        backgroundColor: "#005596",
                      }
                    : { borderRadius: "25px" }
                }
                variant="contained"
                size="small"
                onClick={() => handleDone()}
              >
                {Object.keys(memberValEdit).length === 0 ? "Invite" : "Update"}
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InviteMemberDialog;
