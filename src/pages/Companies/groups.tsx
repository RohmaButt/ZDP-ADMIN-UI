import { FC, useEffect, useState } from "react";
import React from "react";
import {
  alpha,
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
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Paper,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { visuallyHidden } from "@mui/utils";
import AddIcon from "@mui/icons-material/Add";
import { Company } from ".";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ACTIVE_USERS } from "../../graphql/users/queries";
import { defaultPaginationParams } from "../../utils/constants";
import { UpdateUserRole } from "../../graphql/users/mutations";
import { InputText } from "../../components";
import { GET_ALL_GROUPS } from "../../graphql/companies/queries";
import theme from "../../mui.theme";
import MuiTypography from "@mui/material/Typography";
import { getFirstTwoLetters } from "../../utils/common";
import {
  CREATE_GROUP,
  DELETE_GROUP,
  UPDATE_GROUP,
} from "../../graphql/companies/mutations";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../../components/NotificationContent";

const Groups = () => {
  const navigate = useNavigate();
  const { state }: { state: any } = useLocation();
  const [group, setGroup] = useState<Group>({
    admin: "",
    id: 0,
    logo: "",
    name: "",
    description: "",
    totalUsers: 0,
  });
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [openElemWhen, setOpenElemWhen] = useState(null);
  const [anchorElWhen, setAnchorElWhen] = useState(null);
  const [value, setValue] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [company, setCompany] = useState<Company>({
    admin: "",
    id: 0,
    logo: "",
    name: "",
    address: "",
    description: "",
    totalGroups: 0,
    totalUsers: 0,
  });
  const [rows, setRows] = useState<Group[]>([]);
  const [emptyRows, setEmptyRows] = useState<number>(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState(0);

  const handleDialogState = (
    isOpen: boolean,
    groupId?: number,
    group?: Group
  ) => {
    setGroup(group!);
    setSelectedGroupId(groupId);
    setIsGroupDialogOpen(isOpen);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Group
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleGroupNameClick = (group: Group) => {
    navigate(
      `/admin/companies/${company.name.replace(/ /g, "")}/${group.name.replace(
        / /g,
        ""
      )}`,
      {
        state: { group: group },
      }
    );
  };

  const handleMoreClick = (
    event: React.MouseEvent<HTMLElement>,
    item?: any
  ) => {
    handleClickAnchorWhen(item, event);
  };

  const handleClickAnchorWhen = (elem: any, event: any) => {
    setAnchorElWhen(event.currentTarget);
    setOpenElemWhen(elem);
  };

  const handleCloseAnchorWhen = () => {
    setAnchorElWhen(null);
    setOpenElemWhen(null);
  };

  const handleClick = (group: any) => {
    if (group) setGroup(group);
    setIsGroupDialogOpen(true);
    handleCloseAnchorWhen();
  };

  const handleDelete = (group: Group) => {
    setGroup(group);
    setDeleteGroupId(group.id);
    handleCloseAnchorWhen();
    setOpenAlert(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onGroupAddUpdate = () => {
    refetchGroups();
    setIsGroupDialogOpen(false);
  };

  const handleClose = () => {
    setDeleteGroupId(0);
    setGroup({
      admin: "",
      id: 0,
      logo: "",
      name: "",
      description: "",
      totalUsers: 0,
    });
  };

  const {
    data: groups,
    refetch: refetchGroups,
    loading: groupsLoading,
  } = useQuery(GET_ALL_GROUPS, {
    variables: {
      input: { companyId: state.company?.id },
    },
  });

  const [
    deleteGroupMutation,
    {
      data: deleteGroupRes,
      loading: deleteGroupLoading,
      error: deleteGroupError,
    },
  ] = useMutation(DELETE_GROUP);

  const handleGroupDelete = () => {
    deleteGroupMutation({
      variables: {
        params: { id: deleteGroupId },
      },
    });
  };

  useEffect(() => {
    if (!deleteGroupError && deleteGroupRes) {
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
      refetchGroups();
    }
  }, [deleteGroupRes, deleteGroupError]);

  useEffect(() => {
    if (state?.company && groups) {
      setCompany(state.company);
      setRows(groups?.getAllGroups?.groups);
      setEmptyRows(groups?.getAllGroups?.groups?.length);
    }
  }, [groups]);

  return (
    <Box>
      <Box>
        <Typography variant="h6" fontWeight="bold">
          {`View/ Manage ${company?.name} Groups`}
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "91%" }}>
          <Typography
            fontSize={14}
          >{`Manage groups that exists in ${company?.name}`}</Typography>
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
            New Group
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
              label={company?.name}
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
      </Box>
      {value === 0 ? (
        <Box sx={{ height: 550, width: "100%" }}>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table
              sx={{
                minWidth: 700,
                borderCollapse: "separate",
                borderSpacing: "0 15px",
              }}
              aria-label="customized table"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                rowCount={rows?.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return groupsLoading ? (
                      <TableRow>
                        <TableCell align="center" colSpan={6}>
                          <CircularProgress
                            size={"20px"}
                            sx={{ marginRight: "15px" }}
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <StyledTableRow key={index}>
                        <StyledTableCell>
                          {" "}
                          <Box
                            sx={{
                              marginLeft: "10px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img src={row.logo} width={20} height={20} />
                            <Button
                              variant="text"
                              disableRipple={true}
                              disableFocusRipple={true}
                              disableTouchRipple={true}
                              onClick={() => handleGroupNameClick(row)}
                            >
                              {row.name}
                            </Button>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.totalUsers}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.admin}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton
                            onClick={(ev) => handleMoreClick(ev, row.name)}
                            aria-label="aria-Filters"
                          >
                            <MoreHorizIcon />
                          </IconButton>
                          <StyledMenu
                            id={"long-menu" + index}
                            MenuListProps={{
                              "aria-labelledby": "demo-customized-button",
                            }}
                            anchorEl={anchorElWhen}
                            keepMounted
                            open={openElemWhen === row.name}
                            onClose={handleCloseAnchorWhen}
                          >
                            <MenuItem
                              onClick={() => handleClick(row)}
                              disableRipple
                              style={{
                                paddingTop: "0px",
                                paddingBottom: "5px",
                                color: "#1890ff",
                                minWidth: "0px",
                              }}
                            >
                              <EditIcon style={{ color: "#1890ff" }} />
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleDelete(row)}
                              disableRipple
                              style={{
                                paddingTop: "0px",
                                paddingBottom: "0px",
                                color: "#d32f2f",
                                minWidth: "0px",
                              }}
                            >
                              <DeleteOutlineIcon style={{ color: "#d32f2f" }} />
                              Delete
                            </MenuItem>
                          </StyledMenu>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                {emptyRows === 0 && groupsLoading === false && (
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      No Rows
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <GroupDialog
            contentText="Hello world"
            handleClose={() => handleDialogState(false, undefined)}
            isOpen={isGroupDialogOpen}
            onDone={() => onGroupAddUpdate()}
            title={
              group?.id === 0 || group?.id === undefined
                ? "Create New Group"
                : "Update Group"
            }
            groupId={selectedGroupId}
            group={group}
            setGroup={setGroup}
            company={company}
            groupsData={groups}
            refetchGroups={refetchGroups}
          />
          <DeleteAlertDialog
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            handleClose={handleClose}
            group={group}
            deleteGroupLoading={deleteGroupLoading}
            handleGroupDelete={handleGroupDelete}
          />
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};
export default Groups;

export const DeleteAlertDialog = ({
  openAlert,
  setOpenAlert,
  handleClose,
  group,
  deleteGroupLoading,
  handleGroupDelete,
}: any) => {
  const handleCloseHandler = () => {
    setOpenAlert(false);
    handleClose();
  };

  const handleDone = () => {
    handleGroupDelete();
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
          <DialogTitle id="alert-dialog-title">Delete Group</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete {group?.name} group?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {deleteGroupLoading ? (
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

type GroupDialog = {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  contentText: string;
  containerStyle?: any;
  contentContainerStyle?: any;
  onDone: () => void;
  isLoading?: boolean;
  groupId: number | undefined;
  group: Group;
  setGroup: (value: any) => void;
  company: Company;
  groupsData: any;
  refetchGroups: () => void;
};

const GroupDialog: FC<GroupDialog> = ({
  isOpen,
  handleClose,
  title,
  group,
  setGroup,
  company,
  groupsData,
  refetchGroups,
}: GroupDialog) => {
  const [fileMetaData, setFileMetaData] = useState<any>({});
  const [file, setFile] = useState("");
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [groupLogo, setGroupLogo] = useState("");
  const [adminVal, setAdminVal] = useState<any>({});
  const [editGroupId, setEditGroupId] = useState<number>(0);
  const [imgSize, setImgSize] = useState<any>(null);

  const [updateRoleMutation] = useMutation(UpdateUserRole, {
    notifyOnNetworkStatusChange: true,
  });

  const handleCloseHandler = () => {
    setFileMetaData({});
    setGroupLogo("");
    setAdminVal(0);
    setEditGroupId(0);
    handleClose();
  };

  const [
    updateGroupMutation,
    {
      data: updateGroupRes,
      loading: updateGroupLoading,
      error: updateGroupError,
    },
  ] = useMutation(UPDATE_GROUP);

  const handleDone = () => {
    if (editGroupId === 0 || editGroupId === undefined) {
      createGroupMutation({
        variables: {
          input: {
            name: group.name,
            description: group.description,
            logo: group.logo,
            isActive: true,
            companyId: company.id,
            adminId: +group.admin,
          },
        },
      });
    } else {
      let tempAdmin = users?.getAllUser?.data.find(
        (option: any) => option.firstName == group?.admin
      );
      setGroup({
        ...group,
        admin: tempAdmin ? +tempAdmin.id : +adminVal,
      });
      updateGroupMutation({
        variables: {
          params: { id: editGroupId },
          group: {
            name: group.name,
            description: group.description,
            logo: group.logo,
            isActive: true,
            adminId: +group.admin,
          },
        },
      });
    }
  };

  const handleOnChange = (ev: any, value: any) => {
    if (value) {
      setGroup({ ...group, admin: value?.id });
      setAdminVal(value);
    }
  };

  const getFile = (file: string, fileobj: File | null) => {
    setFile(file);
    setFileMetaData({
      fileName: fileobj?.name,

      fileType: fileobj?.type,
    });
    setFileObj(fileobj);
  };

  const isCreate = () => {
    if (
      group &&
      group.name &&
      group.admin &&
      group.description &&
      (fileObj || group.logo)
    )
      return true;
    return false;
  };

  const convertBase64 = (file: File) => {
    return new Promise((resolve) => {
      let baseURL: any = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const getBase64 = (file: File) => {
    convertBase64(file)
      .then((result) => {
        setGroup({ ...group, logo: result });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { data: users, loading: usersLoading } = useQuery(GET_ACTIVE_USERS, {
    variables: {
      pagination: { ...defaultPaginationParams },
    },
  });

  const [
    createGroupMutation,
    {
      data: createGroupRes,
      loading: createGroupLoading,
      error: createGroupError,
    },
  ] = useMutation(CREATE_GROUP);

  useEffect(() => {
    if (group) {
      setEditGroupId(group.id);
      setGroupLogo(group.logo);
    }
  }, [group]);

  useEffect(() => {
    if (!updateGroupError && updateGroupRes) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Record updated successfully."}
          />
        ),
        ...notificationOptions,
      });
      handleCloseHandler();
      refetchGroups();
    }
  }, [updateGroupRes, updateGroupError]);

  useEffect(() => {
    if (!createGroupError && createGroupRes) {
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
      groupsData && refetchGroups();
    }
  }, [createGroupRes, createGroupError]);
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
            <Box display="flex">
              <Box>
                <Avatar alt="G" src={groupLogo}></Avatar>
              </Box>
              <Box sx={{ marginTop: "10px", marginLeft: "10px" }}>
                <input
                  style={{ display: "none" }}
                  id="contained-button-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (
                      e &&
                      e.target &&
                      e.target.files &&
                      e.target.files[0] &&
                      e.target.files[0].size < 2000000
                    ) {
                      setImgSize(null);
                      e?.target?.files &&
                        getFile(e.target.value, e.target.files[0]);
                      e?.target?.files &&
                        setGroupLogo(URL.createObjectURL(e.target.files[0]));
                      e?.target?.files && getBase64(e.target.files[0]);
                    } else {
                      setImgSize("Please upload image below 2MB. ");
                    }
                  }}
                />
                <label
                  htmlFor="contained-button-file"
                  style={{ color: "#00AEEF", textDecorationLine: "underline" }}
                >
                  {fileMetaData.fileName
                    ? fileMetaData.fileName
                    : "Create Group Logo"}
                </label>
                <Typography>{imgSize}</Typography>
              </Box>
            </Box>
            <Box mt={"20px"}>
              <InputText
                onChange={(e) => setGroup({ ...group, name: e.target.value })}
                label="Group Name"
                value={group?.name}
              />
            </Box>
            <Box mt={"20px"}>
              <Autocomplete
                loading={usersLoading}
                id="multiple-limit-tags"
                options={users ? users?.getAllUser?.data : []}
                getOptionLabel={(option: any) => option?.firstName}
                value={
                  Object.keys(adminVal).length > 0
                    ? adminVal
                    : users && group
                    ? users?.getAllUser?.data.find(
                        (option: any) => option.firstName == group?.admin
                      )
                    : null
                }
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
                    label="Company Admin"
                    placeholder="Select Admin"
                    size="small"
                  />
                )}
                onChange={handleOnChange}
              />
            </Box>
            <Box mt={"20px"}>
              <InputText
                label="Description"
                onChange={(e) =>
                  setGroup({ ...group, description: e.target.value })
                }
                value={group?.description}
                multiline={true}
                rows={4}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          {updateGroupLoading || createGroupLoading ? (
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
                {editGroupId === 0 || editGroupId === undefined
                  ? "Create"
                  : "Update"}
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `data-tab-${index}`,
    "aria-controls": `data-tabpanel-${index}`,
  };
}

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {},
  th: {
    height: "40px",
    border: "none",
    boxShadow: "none",
    padding: "0px",
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  td: {
    height: "50px",
    borderTop: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    boxShadow: "0px 3px 0px 0px #e0e0e0",
    padding: "0px",
  },
  "td:first-child": {
    borderLeft: "1px solid #e0e0e0",
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
  },
  "td:last-child": {
    borderRight: "1px solid #e0e0e0",
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F9FBFC",
    color: "black",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

type Order = "asc" | "desc";

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Group
  ) => void;

  order: Order;
  orderBy: string;
  rowCount: number;
}

const headCells: readonly any[] = [
  {
    id: "groupName",
    numeric: false,
    disablePadding: false,
    label: "Group Name",
  },
  {
    id: "groupMembers",
    numeric: false,
    disablePadding: false,
    label: "Members",
  },
  {
    id: "groupAdmin",
    numeric: false,
    disablePadding: false,
    label: "Admin",
  },
  {
    id: undefined,
    numeric: true,
    disablePadding: false,
    label: "",
  },
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Group) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <StyledTableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}

export type Group = {
  admin: string;
  id: number;
  logo: string;
  name: string;
  description: string;
  totalUsers: number;
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 0,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.secondary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
