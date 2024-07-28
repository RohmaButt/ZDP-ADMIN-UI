import { FC, useCallback, useEffect, useState } from "react";
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
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Group } from "./groups";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ACTIVE_USERS, GET_USERS } from "../../graphql/users/queries";
import { defaultPaginationParams } from "../../utils/constants";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumns,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import theme from "../../mui.theme";
import MuiTypography from "@mui/material/Typography";
import { getFirstTwoLetters } from "../../utils/common";
import { GET_ALL_USERS_WITH_GROUPS } from "../../graphql/companies/queries";
import {
  CREATE_MEMBER,
  DELETE_MEMBER,
} from "../../graphql/companies/mutations";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../../components/NotificationContent";

const Members = () => {
  const { state }: { state: any } = useLocation();
  const [group, setGroup] = useState<Group>({
    admin: "",
    id: 0,
    logo: "",
    name: "",
    description: "",
    totalUsers: 0,
  });

  const [member, setMember] = useState<Member>({
    id: 0,
    groupId: 0,
    email: "",
    firstName: "",
    lastName: "",
    userIds: [],
  });
  const [selectedMemberId, setSelectedMemberId] =
    useState<number | undefined>();
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [value, setValue] = useState<number>(0);
  const [rows, setRows] = useState<Member[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columns, setColumns] = useState<GridColumns<any>>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteMember, setDeleteMember] = useState<any>({});

  const tableColumns: GridColDef[] = [
    {
      field: "user.firstName",
      headerName: "Name",
      width: 1300,
    },
  ];

  const handleDialogState = (
    isOpen: boolean,
    memberId?: number,
    member?: Member
  ) => {
    setMember(member!);
    setSelectedMemberId(memberId);
    setIsMemberDialogOpen(isOpen);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleDelete = (row: any) => {
    setDeleteMember(row);
    setOpenAlert(true);
  };

  const {
    loading: loadingTableData,
    error: errorTableData,
    data: tableData,
    refetch: refetchData,
  } = useQuery(GET_ALL_USERS_WITH_GROUPS, {
    variables: {
      input: { groupId: state.group.id },
      pagination: { limit: pageSize, offset: 0 },
    },
  });

  const makeMuiColumns = useCallback(() => {
    const columns: GridColumns<any> =
      tableColumns &&
      tableColumns?.map((field: any) => {
        if (field.field) {
          //&& field?.dataType === "json"
          return {
            field: field.field,
            headerName: field.headerName,
            width: field.width,
            renderCell: (params: GridRenderCellParams) => {
              return (
                <Box display={"flex"}>
                  <NameAvatar name={`${params.row.user.firstName}`} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      paddingX: "14px",
                    }}
                    component={"div"}
                  >
                    <Typography>{params.row.user.firstName}</Typography>
                    <Typography variant="body2">
                      {params.row.user.email}
                    </Typography>
                  </Box>
                </Box>
              );
            },
          };
        }
        return {
          field: field.field,
          headerName: field.headerName,
          width: field.width,
        };
      });

    columns.push({
      field: "actions",
      type: "actions",
      headerName: "",
      headerAlign: "right",
      align: "right",
      width: 50,
      cellClassName: "actions",
      headerClassName: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteOutlineIcon style={{ color: "#d32f2f" }} />}
          label="Delete"
          onClick={() => handleDelete(params.row)}
          showInMenu
        />,
      ],
    });
    setColumns(columns);
  }, [tableData]); //[tableData, rowModesModel]

  const {
    data: users,
    refetch: refectusers,
    error: usersError,
    loading: usersLoading,
  } = useQuery(GET_USERS, {
    variables: {
      pagination: { ...defaultPaginationParams },
    },
    notifyOnNetworkStatusChange: true,
  });

  const onMemberDelete = () => {
    refectusers();
    setIsMemberDialogOpen(false);
  };

  const handleClose = () => {
    setDeleteMember({});
  };

  const [
    deleteMemberMutation,
    {
      data: deleteMemberRes,
      loading: deleteMemberLoading,
      error: deleteMemberError,
    },
  ] = useMutation(DELETE_MEMBER);

  const handleMemberDelete = () => {
    deleteMemberMutation({
      variables: {
        input: {
          groupId: deleteMember?.groupId,
          userIds: [deleteMember?.userId],
        },
      },
    });
  };

  useEffect(() => {
    if (!deleteMemberError && deleteMemberRes) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Record delete successfully."}
          />
        ),
        ...notificationOptions,
      });
      setOpenAlert(false);
      refetchData();
    }
    // else if (deleteMemberError) {
    //   Store.addNotification({
    //     content: (
    //       <NotificationContent
    //         type={"danger"}
    //         message={"Unable to delete the Record. Please try again later."}
    //       />
    //     ),
    //     ...notificationOptions,
    //   });
    // }
  }, [deleteMemberRes, deleteMemberError]);

  useEffect(() => {
    if (state?.group && tableData) {
      setGroup(state.group);
      // let dataRows = data.filter((e: Member) => e.groupId === state.group.id);
      setRows(tableData?.getAllUserWithGroups?.data);
    }
  }, [state]);

  useEffect(() => {
    makeMuiColumns();
  }, [state]);

  return (
    <Box>
      <Box>
        <Typography variant="h6" fontWeight="bold">
          {state?.group?.name}
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "94%" }}>
          <Typography
            fontSize={14}
          >{`Members of ${state?.group?.name}`}</Typography>
        </Box>
        <Box>
          <Button
            size="small"
            variant="outlined"
            style={{
              borderRadius: "25px",
              borderColor: "#005596",
              color: "#005596",
            }}
            startIcon={<AddIcon />}
            onClick={() => handleDialogState(true, undefined, undefined)}
          >
            Invite
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Data tabs">
            <Tab
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                color: "text.secondary",
              }}
              label={group?.name || state?.group?.name}
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
      </Box>
      {value === 0 ? (
        <div style={{ height: 637 }}>
          <DataGrid
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            getRowId={(row) => Math.random()}
            rows={tableData ? tableData?.getAllUserWithGroups?.data : []}
            columns={columns}
            paginationMode={"server"}
            filterMode={"server"}
            loading={loadingTableData} // || updateRecordDataLoading
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageSizeChange={(newPage) => setPageSize(newPage)}
            pageSize={pageSize}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            rowCount={
              tableData ? tableData?.getAllUserWithGroups?.totalRecords : 0
            }
          />
          <MemberDialog
            contentText="Hello world"
            handleClose={() => handleDialogState(false, undefined)}
            isOpen={isMemberDialogOpen}
            onDone={() => onMemberDelete()}
            title={"Invite Group Member"}
            memberId={selectedMemberId}
            member={member}
            setMember={setMember}
            group={group?.id === 0 ? state?.group : group}
            tableData={tableData}
            refetchData={refetchData}
          />
          <DeleteAlertDialog
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            handleClose={handleClose}
            deleteMemberLoading={deleteMemberLoading}
            handleMemberDelete={handleMemberDelete}
          />
        </div>
      ) : (
        ""
      )}
    </Box>
  );
};
export default Members;

export const DeleteAlertDialog = ({
  openAlert,
  setOpenAlert,
  handleClose,
  deleteMemberLoading,
  handleMemberDelete,
}: any) => {
  const handleCloseHandler = () => {
    setOpenAlert(false);
    handleClose();
  };

  const handleDone = (value: any) => {
    handleMemberDelete();
    handleClose();
  };

  return (
    <Box>
      <Dialog
        open={openAlert}
        onClose={handleCloseHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ m: 2 }}>
          <DialogTitle id="alert-dialog-title">Delete Group Member</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              `Are you sure you want to delete this record?`
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {deleteMemberLoading ? (
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
                  style={{
                    borderRadius: "25px",
                    borderColor: "#005596",
                    color: "white",
                    backgroundColor: "#d32f2f",
                  }}
                  onClick={handleDone}
                >
                  Delete
                </Button>
              </Box>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

type MemberDialog = {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  contentText: string;
  containerStyle?: any;
  contentContainerStyle?: any;
  onDone: () => void;
  isLoading?: boolean;
  memberId: number | undefined;
  member: Member;
  setMember: (value: any) => void;
  group: any;
  tableData: any;
  refetchData: () => void;
};

const MemberDialog: FC<MemberDialog> = ({
  isOpen,
  handleClose,
  title,
  contentText,
  containerStyle,
  contentContainerStyle,
  isLoading = false,
  memberId,
  onDone,
  member,
  setMember,
  group,
  tableData,
  refetchData,
}: MemberDialog) => {
  const handleCloseHandler = () => {
    handleClose();
  };

  const handleDone = () => {
    createMemberMutation({
      variables: {
        input: { userIds: member.userIds, groupId: group.id },
      },
    });
  };

  const handleOnChange = (ev: any, value: Array<any>) => {
    let userIdsTemp = value.map((x: any) => {
      return +x.id;
    });
    setMember({ ...member, userIds: userIdsTemp });
  };

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

  const isCreate = () => {
    if (member && member.userIds) return true;
    return false;
  };

  const [
    createMemberMutation,
    {
      data: createMemberRes,
      loading: createMemberLoading,
      error: createMemberError,
    },
  ] = useMutation(CREATE_MEMBER);

  useEffect(() => {
    if (!createMemberError && createMemberRes) {
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
      tableData && refetchData();
    }
    // else if (createMemberError) {
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
  }, [createMemberRes, createMemberError]);

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
                loading={usersLoading}
                multiple
                limitTags={2}
                id="multiple-limit-tags"
                options={users ? users?.getAllUser?.data : []}
                getOptionLabel={(option: any) => option?.firstName}
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
                        {getFirstTwoLetters(option?.firstName)}
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
                      <MuiTypography>{option?.firstName}</MuiTypography>
                      <MuiTypography variant="body2">
                        {option?.userName}
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
          {createMemberLoading ? (
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
                style={{
                  borderRadius: "25px",
                  borderColor: "#005596",
                  color: "white",
                  backgroundColor: "#005596",
                }}
                variant="contained"
                size="small"
                onClick={() => handleDone()}
              >
                Create
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export type Member = {
  id: number;
  groupId: number;
  firstName: string;
  lastName: string;
  email: string;
  userIds: [];
};

function a11yProps(index: number) {
  return {
    id: `data-tab-${index}`,
    "aria-controls": `data-tabpanel-${index}`,
  };
}

function createData(
  id: number,
  groupId: number,
  firstName: string,
  lastName: string,
  email: string
) {
  return { id, groupId, firstName, lastName, email };
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
