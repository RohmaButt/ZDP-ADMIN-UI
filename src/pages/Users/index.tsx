import React, { FC, useMemo, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USERS } from "../../graphql/users/queries";
import { defaultPaginationParams } from "../../utils/constants";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { getFirstTwoLetters } from "../../utils/common";
import { useTheme } from "@mui/material/styles";
import SecurityIcon from "@mui/icons-material/Security";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import "./index.css";
import { UpdateUser, UpdateUserRole } from "../../graphql/users/mutations";
import { InputText } from "../../components";
import { useMsal } from "@azure/msal-react";
import { getAllUsersRequest } from "../../config/authConfig";
import { callMsGetAllUsersGraph } from "../../services/msGraphApi";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function a11yProps(index: number) {
  return {
    id: `data-tab-${index}`,
    "aria-controls": `data-tabpanel-${index}`,
  };
}
function NameAvatar({ name }: any) {
  const theme = useTheme();

  return (
    <Avatar
      sx={{
        bgcolor: "white",
        color: theme.palette.primary.main,
        border: `2px solid ${theme.palette.primary.main}`,
        height: "35px",
        width: "35px",
      }}
    >
      <Typography>{getFirstTwoLetters(name)}</Typography>
    </Avatar>
  );
}

export type RoleObject = {
  label: string;
  key: string;
  value: number;
};

export type RolesType = {
  read_only: RoleObject;
  write: RoleObject;
  admin: RoleObject;
  super_admin: RoleObject;
};

export type PossibleRoles = "read_only" | "write" | "admin" | "super_admin";

const Roles: RolesType = {
  read_only: { label: "READ ONLY", key: "read_only", value: 1 },
  write: { label: "WRITE", key: "write", value: 2 },
  admin: { label: "ADMIN", key: "admin", value: 3 },
  super_admin: { label: "SUPER ADMIN", key: "super_admin", value: 4 },
};

export default function Users() {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [selectedUser, setSelectedUser] = useState<any | undefined>();
  const { instance, accounts } = useMsal();
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const {
    data: users,
    refetch: refectusers,
    loading: usersLoading,
  } = useQuery(GET_USERS, {
    variables: {
      pagination: { ...defaultPaginationParams },
    },
    notifyOnNetworkStatusChange: true,
  });

  const [
    updateUserMutation,
    {
      data: updateUserMutationRes,
      loading: updateUserMutationLoading,
      error: updateUserMutationError,
    },
  ] = useMutation(UpdateUser, {
    notifyOnNetworkStatusChange: true,
  });

  const handleDialogState = (isOpen: boolean, userId?: number, user?: any) => {
    setSelectedUser(user);
    setSelectedUserId(userId);
    setIsRoleDialogOpen(isOpen);
  };

  const handleDeactivateDialog = (
    open: boolean,
    userId?: number,
    user?: any
  ) => {
    setSelectedUser(user);
    setSelectedUserId(userId);
    setIsDeactivateDialogOpen(open);
  };

  const handleDeactivateUser = () => {
    if (selectedUserId) {
      updateUserMutation({
        variables: {
          param: { id: +selectedUserId },
          input: { isActive: !(selectedUser as any)?.isActive },
        },
      });
    }
  };

  useEffect(() => {
    if (updateUserMutationRes) {
      handleDeactivateDialog(false);
      refectusers();
    }
  }, [updateUserMutationRes, updateUserMutationError]);

  const columns = useMemo<GridColumns<any>>(
    () => [
      {
        field: "firstName",
        headerName: "User",
        width: 300,
        renderCell: (params) => {
          return (
            <Box display={"flex"}>
              <NameAvatar name={params.row.firstName} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingX: "14px",
                }}
                component={"div"}
              >
                <Typography>{params.row.firstName}</Typography>
                <Typography variant="body2">{params.row.email}</Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "email",
        headerName: "Company",
        width: 200,
        renderCell: () => <div>ZONES</div>,
      },
      {
        field: "userRole",
        headerName: "Permissions",
        width: 200,
        renderCell: (params) => {
          const role = params.row?.userRole[0]?.role?.name as PossibleRoles;
          return <div>{Roles[role].label}</div>;
        },
      },
      {
        field: "actions",
        type: "actions",
        width: 450,
        headerAlign: "right",
        align: "right",

        getActions: (params) => [
          <GridActionsCellItem
            icon={<SecurityIcon color={"primary"} />}
            label="Edit Permissions"
            onClick={() => handleDialogState(true, params.row?.id, params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<FileCopyIcon color={"primary"} />}
            label={params.row?.isActive ? "Deactive" : "Active"}
            onClick={() =>
              handleDeactivateDialog(true, params.row?.id, params.row)
            }
            showInMenu
          />,
        ],
      },
    ],
    []
  );

  const columnPending = useMemo<GridColumns<any>>(
    () => [
      {
        field: "firstName",
        headerName: "User",
        width: 300,
        renderCell: (params) => {
          return (
            <Box display={"flex"}>
              <NameAvatar name={params.row.firstName} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingX: "14px",
                }}
                component={"div"}
              >
                <Typography>{params.row.firstName}</Typography>
                <Typography variant="body2">{params.row.email}</Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "isActive",
        headerName: "Status",
        width: 200,
        renderCell: (params) => {
          return (
            <div className="statusstyle">
              <Typography
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingX: "13px",
                }}
                variant="body2"
              >
                {params.value ? "Active" : "InActive"}
              </Typography>
            </div>
          );
        },
      },
      {
        field: "timePending",
        headerName: "Time Pending",
        width: 200,
        renderCell: () => {
          return <div></div>;
        },
      },
      {
        field: "email",
        headerName: "Company",
        width: 200,
        renderCell: () => <div>ZONES</div>,
      },
      {
        field: "userRole",
        headerName: "Permissions",
        width: 200,
        renderCell: (params) => {
          const role = params.row?.userRole[0]?.role?.name as PossibleRoles;
          return <div>{Roles[role].label}</div>;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 250,
        headerAlign: "right",
        align: "right",
        getActions: (params) => [
          <GridActionsCellItem
            icon={<SecurityIcon color={"primary"} />}
            label="Edit Permissions"
            onClick={() => handleDialogState(true, params.row?.id, params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<FileCopyIcon color={"primary"} />}
            label={params.row?.isActive ? "Deactive" : "Active"}
            onClick={() =>
              handleDeactivateDialog(true, params.row?.id, params.row)
            }
            showInMenu
          />,
        ],
      },
    ],
    []
  );

  const onRoleUpdate = () => {
    refectusers();
    setIsRoleDialogOpen(false);
  };

  const getAllUsers = () => {
    const request = {
      ...getAllUsersRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        callMsGetAllUsersGraph(response.accessToken).then((response) =>
          console.log(response)
        );
      })
      .catch(() => {
        instance.acquireTokenPopup(request).then((response) => {
          callMsGetAllUsersGraph(response.accessToken).then((response) =>
            console.log(response)
          );
        });
      });
  };

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          PIM Members
        </Typography>
        <Button
          variant="contained"
          style={{
            borderRadius: "25px",
            backgroundColor: "#005596",
          }}
          startIcon={<PersonAddIcon />}
          onClick={getAllUsers}
        >
          INVITE
        </Button>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Data tabs">
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label="PIM Members"
              {...a11yProps(0)}
            />
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label="Pending Invites"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
      </Box>
      {value === 0 ? (
        <Box sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={users ? users?.getUsers?.data : []}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            loading={usersLoading}
          />
          <EditRoleDialog
            contentText="Hello world"
            handleClose={() => handleDialogState(false, undefined)}
            isOpen={isRoleDialogOpen}
            onDone={() => onRoleUpdate()}
            title={"Edit Member Permissions"}
            userId={selectedUserId}
            user={selectedUser}
          />
          <Dialog
            open={isDeactivateDialogOpen}
            onClose={() => handleDeactivateDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmation!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`Are you sure you want to make this user ${
                  selectedUser?.isActive ? "Deactive" : "Active"
                }?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeactivateDialogOpen(false)}>
                Cancel
              </Button>
              {updateUserMutationLoading ? (
                <CircularProgress
                  size={"20px"}
                  sx={{ marginLeft: "15px", marginRight: "15px" }}
                />
              ) : (
                <Button onClick={handleDeactivateUser} autoFocus>
                  Done
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <Box sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={users ? users?.getUsers?.data : []}
            columns={columnPending}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            loading={usersLoading}
          />
          <EditRoleDialog
            contentText="Hello world"
            handleClose={() => handleDialogState(false, undefined)}
            isOpen={isRoleDialogOpen}
            onDone={() => onRoleUpdate()}
            title={"Edit Member Permissions"}
            userId={selectedUserId}
            user={selectedUser}
          />
          <Dialog
            open={isDeactivateDialogOpen}
            onClose={() => handleDeactivateDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmation!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`Are you sure you want to make this user ${
                  selectedUser?.isActive ? "Deactive" : "Active"
                }?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeactivateDialogOpen(false)}>
                Cancel
              </Button>
              {updateUserMutationLoading ? (
                <CircularProgress
                  size={"20px"}
                  sx={{ marginLeft: "15px", marginRight: "15px" }}
                />
              ) : (
                <Button onClick={handleDeactivateUser} autoFocus>
                  Done
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}
type EditRoleDialog = {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  contentText: string;
  containerStyle?: any;
  contentContainerStyle?: any;
  onDone: () => void;
  isLoading?: boolean;
  userId: number | undefined;
  user: any;
};

const EditRoleDialog: FC<EditRoleDialog> = ({
  isOpen,
  handleClose,
  title,
  userId,
  onDone,
  user,
}: EditRoleDialog) => {
  const [roleId, setRoleId] = useState("");
  const [
    updateRoleMutation,
    {
      data: updateRoleMutationRes,
      loading: updateRoleMutationLoading,
      error: updateRoleMutationError,
    },
  ] = useMutation(UpdateUserRole, {
    notifyOnNetworkStatusChange: true,
  });

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRoleId(event.target.value as string);
  };

  const handleCloseHandler = () => {
    handleClose();
  };

  const handleDone = () => {
    if (userId) {
      updateRoleMutation({
        variables: {
          updateUserRoleInput: { userId: +userId, roleId: roleId },
        },
      });
    }
  };

  useEffect(() => {
    if (updateRoleMutationRes) {
      setRoleId("");
      onDone();
    }
  }, [updateRoleMutationRes, updateRoleMutationError]);

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
              <InputText
                onChange={() => null}
                label="Name"
                value={user?.firstName}
                disabled={true}
              />
              <InputText
                onChange={() => null}
                label="Role"
                value={
                  Roles[user?.userRole[0]?.role?.name as PossibleRoles]?.label
                }
                disabled={true}
                style={{ marginTop: "20px" }}
              />
            </Box>
            <Box sx={{ marginTop: "30px" }}>
              <Typography variant="subtitle1">
                Assign PIM Member New Permissions
              </Typography>
              <Box sx={{ minWidth: 120 }} mt={"10px"}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={roleId}
                    label="Role"
                    onChange={handleRoleChange}
                  >
                    {Object.entries(Roles).map((item) => {
                      const roleObj = item[1];
                      return (
                        roleObj.key !== user?.userRole[0]?.role?.name && (
                          <MenuItem value={roleObj.value}>
                            {roleObj.label}
                          </MenuItem>
                        )
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          {updateRoleMutationLoading ? (
            <CircularProgress size={"20px"} sx={{ marginRight: "15px" }} />
          ) : (
            <Button
              disabled={!roleId}
              sx={{ marginRight: "15px" }}
              variant="contained"
              size="small"
              onClick={handleDone}
            >
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
