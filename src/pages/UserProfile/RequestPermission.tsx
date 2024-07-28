import { useMutation } from "@apollo/client";
import React from "react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import NotificationContent, {
  notificationOptions,
} from "../../components/NotificationContent";
import { loginRequest } from "../../config/authConfig";
import { addUser, selectUser } from "../../features/user/userSlice";
import { SignInAzureAD } from "../../graphql/auth/mutation";
import { Request_Role_Permission } from "../../graphql/users/mutations";
import {
  AppIds,
  RolePermissions,
  userLocalStorageKey,
  UserRoles,
} from "../../utils/constants";

type RequestPermissionDialog = {
  handleClose: () => void;
  isOpen: boolean;
  onDone: () => void;
  title: string;
  permissionRequestEdit: any;
  refetchAppData: () => void;
  user: any;
  requestedAppRoles: any;
  userRequestsByStatusData: any;
  refetchUserRequestByStatusData: () => void;
  refetchUserData: () => void;
  userData: any;
};

const RequestPermission: FC<RequestPermissionDialog> = ({
  handleClose,
  isOpen,
  onDone,
  title,
  permissionRequestEdit,
  refetchAppData,
  user,
  requestedAppRoles,
  userRequestsByStatusData,
  refetchUserRequestByStatusData,
  refetchUserData,
  userData,
}: RequestPermissionDialog) => {
  const [selectedRole, setSelectedRole] = useState("");
  const rows = UserRoles;
  const { instance } = useMsal();
  const dispatch = useAppDispatch();
  const userTset = useAppSelector(selectUser);

  const handleCloseHandler = () => {
    setSelectedRole("");
    handleClose();
  };

  const handleRadioChange = (ev: any, nu: any) => {
    setSelectedRole(ev.target.value);
  };

  const handleDone = () => {
    requestPermissionMutation({
      variables: {
        requestAppPermissionInput: {
          appId: +permissionRequestEdit.id,
          roleId: +selectedRole,
        },
      },
    });
  };

  const [
    signInAzureAD,
    {
      data: userSignInData,
      loading: userSignInLoading,
      error: userSignInError,
    },
  ] = useMutation(SignInAzureAD, {
    notifyOnNetworkStatusChange: true,
  });

  const getAccessToken = async () => {
    try {
      const accountInfo = instance.getAllAccounts()[0];
      const result = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accountInfo,
      });
      signInAzureAD({
        variables: {
          input: {
            token: `Bearer ${result.accessToken}`,
            appId: AppIds.ADMIN,
          },
        },
      });
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        return instance.acquireTokenRedirect(loginRequest);
      }
    }
  };

  const [
    requestPermissionMutation,
    {
      data: requestPermissionRes,
      loading: requestPermissionLoading,
      error: requestPermissionError,
    },
  ] = useMutation(Request_Role_Permission);

  useEffect(() => {
    if (!requestPermissionError && requestPermissionRes) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Record created successfully."}
          />
        ),
        ...notificationOptions,
      });
      refetchUserRequestByStatusData();
      handleCloseHandler();
      //  getAccessToken();
    }
    // else if (requestPermissionError) {
    //   Store.addNotification({
    //     content: (
    //       <NotificationContent
    //         type={"danger"}
    //         message={"Unable to update the Record. Please try again later."}
    //       />
    //     ),
    //     ...notificationOptions,
    //   });
    // }
  }, [requestPermissionRes, requestPermissionError]);

  useEffect(() => {
    if (userSignInData) {
      dispatch(addUser(userSignInData?.signInAzureAD));
      localStorage.setItem(
        userLocalStorageKey,
        JSON.stringify(userSignInData?.signInAzureAD)
      );
    }
  }, [userSignInData]);

  useEffect(() => {
    refetchUserData();
    refetchAppData();
  }, [
    user,
    userSignInData,
    requestedAppRoles,
    userData,
    userRequestsByStatusData,
  ]);

  useEffect(() => {
    setSelectedRole(permissionRequestEdit?.roleId);
  }, [permissionRequestEdit]);

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
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              {Object.keys(RolePermissions)
                .filter((x) => x !== "none")
                .map((key: any) => (
                  <FormControlLabel
                    control={
                      <Radio
                        onChange={(ev) => handleRadioChange(ev, UserRoles[key])}
                        value={UserRoles[key] ? UserRoles[key] : 0}
                        checked={selectedRole == UserRoles[key]}
                      />
                    }
                    label={RolePermissions[key as keyof typeof RolePermissions]}
                  />
                ))}
            </RadioGroup>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          {requestPermissionLoading ? (
            <CircularProgress size={"20px"} sx={{ marginRight: "15px" }} />
          ) : (
            <Box>
              <Button
                style={{
                  borderRadius: "25px",
                  color: "#005596",
                  marginRight: "5px",
                }}
                variant="outlined"
                size="small"
                onClick={handleCloseHandler}
              >
                Cancel
              </Button>
              <Button
                disabled={selectedRole ? false : true}
                style={
                  selectedRole
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
                {Object.keys(permissionRequestEdit).length === 0
                  ? "Request"
                  : "Request"}
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default RequestPermission;

export type RolePermissionsType = {
  none: string;
  read_only: string;
  write: string;
  admin: string;
};
