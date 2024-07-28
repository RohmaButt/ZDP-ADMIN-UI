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
import AddIcon from "@mui/icons-material/Add";
import { visuallyHidden } from "@mui/utils";
import { useMutation, useQuery } from "@apollo/client";
import { InputText } from "../../components";
import { GET_ACTIVE_USERS, GET_USERS } from "../../graphql/users/queries";
import { defaultPaginationParams } from "../../utils/constants";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import theme from "../../mui.theme";
import MuiTypography from "@mui/material/Typography";
import { getFirstTwoLetters } from "../../utils/common";
import { GET_ALL_COMPANIES } from "../../graphql/companies/queries";
import {
  CREATE_COMPANY,
  DELETE_COMPANY,
  UPDATE_COMPANY,
} from "../../graphql/companies/mutations";
import { Store } from "react-notifications-component";
import NotificationContent, {
  notificationOptions,
} from "../../components/NotificationContent";

const Companies = () => {
  let navigate = useNavigate();
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
  const [selectedCompanyId, setSelectedCompanyId] =
    useState<number | undefined>();
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [openElemWhen, setOpenElemWhen] = useState(null);
  const [anchorElWhen, setAnchorElWhen] = useState(null);
  const [rows, setRows] = useState<Company[]>([]);
  const [emptyRows, setEmptyRows] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteCompanyId, setDeleteCompleteId] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

  const handleClickAnchorWhen = (elem: any, event: any) => {
    setAnchorElWhen(event.currentTarget);
    setOpenElemWhen(elem);
  };

  const handleCloseAnchorWhen = () => {
    setAnchorElWhen(null);
    setOpenElemWhen(null);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Company
  ) => {
    let getProperty: string = property;
    if (getProperty === "companyName") {
      property = "name";
    } else if (getProperty === "groups") {
      property = "totalGroups";
    } else if (getProperty === "members") {
      property = "totalUsers";
    } else if (getProperty === "companyAdmin") {
      property = "admin";
    }
    setOrderBy(property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleDialogState = (
    isOpen: boolean,
    companyId?: number,
    company?: Company
  ) => {
    setCompany(company!);
    setSelectedCompanyId(companyId);
    setIsCompanyDialogOpen(isOpen);
  };

  const onCompanyAddUpdate = () => {
    refectusers();
    setIsCompanyDialogOpen(false);
  };

  const handleClick = (company: Company) => {
    if (company) {
      setCompany(company);
    }
    setIsCompanyDialogOpen(true);
    handleCloseAnchorWhen();
  };
  const handleDelete = (company: Company) => {
    setCompany(company);
    setDeleteCompleteId(company.id);
    handleCloseAnchorWhen();
    setOpenAlert(true);
  };
  const handleMoreClick = (
    event: React.MouseEvent<HTMLElement>,
    item?: any
  ) => {
    handleClickAnchorWhen(item, event);
  };

  const handleCompanyNameClick = (company: Company) => {
    let tempCompanyName = company.name.replace(/ /g, "");
    navigate(`/admin/companies/${tempCompanyName}`, {
      state: { company: company },
    });
  };

  const handleClose = () => {
    setDeleteCompleteId(0);
    setCompany({
      admin: "",
      id: 0,
      logo: "",
      name: "",
      address: "",
      description: "",
      totalGroups: 0,
      totalUsers: 0,
    });
  };

  const { refetch: refectusers } = useQuery(GET_USERS, {
    variables: {
      pagination: { ...defaultPaginationParams },
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: companies,
    refetch: refetchCompanies,
    loading: companiesLoading,
  } = useQuery(GET_ALL_COMPANIES, {
    variables: {},
    notifyOnNetworkStatusChange: true,
  });

  const [
    deleteCompanyMutation,
    {
      data: deleteCompanyRes,
      loading: deleteCompanyLoading,
      error: deleteCompanyError,
    },
  ] = useMutation(DELETE_COMPANY);

  const handleCompanyDelete = () => {
    deleteCompanyMutation({
      variables: {
        params: { id: deleteCompanyId },
      },
    });
  };

  useEffect(() => {
    if (companies) {
      setRows(companies?.getAllCompanies?.companies);
      setEmptyRows(companies?.getAllCompanies?.companies?.length);
    }
  }, [companies]);

  useEffect(() => {
    if (!deleteCompanyError && deleteCompanyRes) {
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
      refetchCompanies();
    }
  }, [deleteCompanyRes, deleteCompanyError]);

  return (
    <Box>
      <Box>
        <Typography variant="h6" fontWeight="bold">
          View/ Manage Companies
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "90%" }}>
          <Typography fontSize={14}>
            Manage companies that exists in ZDP
          </Typography>
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
            Add Company
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
              label="ZDP Companies"
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
                rowCount={rows.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return companiesLoading ? (
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
                              onClick={() => handleCompanyNameClick(row)}
                            >
                              {row.name}
                            </Button>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.totalGroups} Groups
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.totalUsers} Members
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
                {emptyRows === 0 && companiesLoading === false && (
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
          <CompanyDialog
            contentText="Hello world"
            handleClose={() => handleDialogState(false, undefined)}
            isOpen={isCompanyDialogOpen}
            onDone={() => onCompanyAddUpdate()}
            title={
              company?.id === 0 || company?.id === undefined
                ? "Create New Company"
                : "Update Company"
            }
            companyId={selectedCompanyId}
            company={company}
            setCompany={setCompany}
            companies={companies}
            refetchCompanies={refetchCompanies}
          />
          <DeleteAlertDialog
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            handleClose={handleClose}
            company={company}
            deleteCompanyLoading={deleteCompanyLoading}
            handleCompanyDelete={handleCompanyDelete}
          />
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default Companies;

export const DeleteAlertDialog = ({
  openAlert,
  setOpenAlert,
  handleClose,
  company,
  deleteCompanyLoading,
  handleCompanyDelete,
}: any) => {
  const handleCloseHandler = () => {
    setOpenAlert(false);
    handleClose();
  };

  const handleDone = () => {
    handleCompanyDelete();
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
          <DialogTitle id="alert-dialog-title">Delete Company</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete {company?.name} company?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {deleteCompanyLoading ? (
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
    return -1; // [a,b]
  }
  if (b[orderBy] > a[orderBy]) {
    return 1; //[b,a]
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
    property: keyof Company
  ) => void;

  order: Order;
  orderBy: string;
  rowCount: number;
}

const headCells: readonly any[] = [
  {
    id: "companyName",
    numeric: false,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "groups",
    numeric: false,
    disablePadding: false,
    label: "Groups",
  },
  {
    id: "members",
    numeric: false,
    disablePadding: false,
    label: "Members",
  },
  {
    id: "companyAdmin",
    numeric: false,
    disablePadding: false,
    label: "Company Admin",
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
    (property: keyof Company) => (event: React.MouseEvent<unknown>) => {
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

type CompanyDialog = {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  contentText: string;
  containerStyle?: any;
  contentContainerStyle?: any;
  onDone: () => void;
  isLoading?: boolean;
  companyId: number | undefined;
  company: Company;
  setCompany: (value: any) => void;
  companies: any;
  refetchCompanies: () => void;
};

const CompanyDialog: FC<CompanyDialog> = ({
  isOpen,
  handleClose,
  title,
  company,
  setCompany,
  companies,
  refetchCompanies,
}: CompanyDialog) => {
  const [fileMetaData, setFileMetaData] = useState<any>({});
  const [file, setFile] = useState("");
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState("");
  const [adminVal, setAdminVal] = useState<any>({});
  const [editCompanyId, setEditCompanyId] = useState<number>(0);

  const [
    createCompanyMutation,
    {
      data: createCompanyRes,
      loading: createCompanyLoading,
      error: createCompanyError,
    },
  ] = useMutation(CREATE_COMPANY);

  const [
    updateCompanyMutation,
    {
      data: updateCompanyRes,
      loading: updateCompanyLoading,
      error: updateCompanyError,
    },
  ] = useMutation(UPDATE_COMPANY);

  const handleCloseHandler = () => {
    setFileMetaData({});
    setCompanyLogo("");
    setAdminVal(0);
    setEditCompanyId(0);
    handleClose();
  };

  const handleDone = () => {
    if (editCompanyId === 0 || editCompanyId === undefined) {
      createCompanyMutation({
        variables: {
          input: {
            name: company.name,
            address: company.address,
            desription: company.description,
            logo: company.logo,
            adminId: +company.admin,
          },
        },
      });
    } else {
      let tempAdmin = users?.getAllUser?.data.find(
        (option: any) => option.firstName == company?.admin
      );
      setCompany({
        ...company,
        admin: tempAdmin ? +tempAdmin.id : +adminVal,
      });
      updateCompanyMutation({
        variables: {
          params: { id: editCompanyId },
          company: {
            name: company.name,
            address: company.address,
            description: company.description,
            logo: company.logo,
            adminId: +company.admin,
          },
        },
      });
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

  const handleOnChange = (ev: any, value: any) => {
    if (value) {
      setCompany({ ...company, admin: value?.id });
      setAdminVal(value);
    }
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
        setCompany({ ...company, logo: result });
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

  const isCreate = () => {
    if (
      company &&
      company.address &&
      company.name &&
      company.admin &&
      company.description &&
      (fileObj || company.logo)
    )
      return true;
    return false;
  };

  useEffect(() => {
    if (company) {
      setEditCompanyId(company.id);
      setCompanyLogo(company.logo);
    }
  }, [company]);

  useEffect(() => {
    if (!createCompanyError && createCompanyRes) {
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
      companies && refetchCompanies();
    }
  }, [createCompanyRes, createCompanyError]);

  useEffect(() => {
    if (!updateCompanyError && updateCompanyRes) {
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
      companies && refetchCompanies();
    }
  }, [updateCompanyRes, updateCompanyError]);

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
                <Avatar alt="C" src={companyLogo}></Avatar>
              </Box>
              <Box sx={{ marginTop: "10px", marginLeft: "10px" }}>
                <input
                  style={{ display: "none" }}
                  id="contained-button-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    e?.target?.files &&
                      getFile(e.target.value, e.target.files[0]);
                    e?.target?.files &&
                      setCompanyLogo(URL.createObjectURL(e.target.files[0]));
                    e?.target?.files && getBase64(e.target.files[0]);
                  }}
                />
                <label
                  htmlFor="contained-button-file"
                  style={{ color: "#00AEEF", textDecorationLine: "underline" }}
                >
                  {fileMetaData.fileName
                    ? fileMetaData.fileName
                    : "Create Company Logo"}
                </label>
              </Box>
            </Box>
            <Box mt={"20px"}>
              <InputText
                onChange={(e) =>
                  setCompany({ ...company, name: e.target.value })
                }
                label="Company Name"
                value={company?.name}
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
                    : users && company
                    ? users?.getAllUser?.data.find(
                        (option: any) => option.firstName == company?.admin
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
                label="Company Address"
                onChange={(e) =>
                  setCompany({ ...company, address: e.target.value })
                }
                value={company?.address}
                multiline={true}
                rows={4}
              />
            </Box>
            <Box mt={"20px"}>
              <InputText
                label="Description"
                onChange={(e) =>
                  setCompany({ ...company, description: e.target.value })
                }
                value={company?.description}
                multiline={true}
                rows={4}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          {updateCompanyLoading || createCompanyLoading ? (
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
                {editCompanyId === 0 || editCompanyId === undefined
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

export type Company = {
  admin: string;
  id: number;
  logo: string;
  name: string;
  address: string;
  description: string;
  totalGroups: number;
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
