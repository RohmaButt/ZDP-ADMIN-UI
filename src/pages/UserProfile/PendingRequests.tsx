import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { ConditionType } from "../../components/FilterView";
import { GET_TABLE_DATA } from "../../graphql/generic/queries";
import { createQuery } from "../../utils/common";
import {
  defaultPageLimit,
  RolePermissions,
  UserRoles,
} from "../../utils/constants";
import { UserApplicationProps } from "./UserProfileDetails";
import "./index.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../mui.theme";
import moment from "moment";
import {
  ACCEPT_OR_CANCEL_REQUEST,
  RESEND_REQUEST,
} from "../../graphql/users/mutations";
import NotificationContent, {
  notificationOptions,
} from "../../components/NotificationContent";
import { Store } from "react-notifications-component";
const PendingRequests = ({
  user,
  userRequestsByStatusData,
  refetchUserRequestByStatusData,
}: UserApplicationProps) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isPermissionRequestOpen, setIsPermissionRequestOpen] = useState(false);
  const [systemApp, setSystemApp] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColumns<any>>([]);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [moreOptions, setMoreOptions] = useState<any>(null);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const options = ["Resend Request", "Cancel Request"];
  const currentDate = moment();
  const [requestedAppRoles, setRequestedAppRoles] = useState<any[]>([]);
  const [
    acceptOrCancelRequestMutation,
    {
      data: acceptOrCancelRequestData,
      loading: acceptOrCancelRequestLoading,
      error: acceptOrCancelRequestError,
    },
  ] = useMutation(ACCEPT_OR_CANCEL_REQUEST);

  const [
    resendRequestRequestMutation,
    {
      data: resendRequestData,
      loading: resendRequestLoading,
      error: resendRequestError,
    },
  ] = useMutation(RESEND_REQUEST);

  const defaultConditionObject: ConditionType = {
    field: "isActive",
    values: 1,
    condition: "$eq",
  };
  const defaultQuery = createQuery([defaultConditionObject], "ZDPAPP");
  const {
    loading: loadingAppData,
    error: errorAppData,
    data: appData,
    refetch: refetchAppData,
  } = useQuery(GET_TABLE_DATA, {
    variables: {
      pagination: { limit: defaultPageLimit, offset: 0 },
      DataModelInput: { entity: "ZDPAPP" },
      QueryInput: {
        filterInputString: JSON.stringify(defaultQuery),
      },
    },
  });

  const getPermissionStatus = (id: any) => {
    return requestedAppRoles?.filter((x) => x.appId === id) ? (
      RolePermissions[
        UserRoles[
          requestedAppRoles?.filter((x) => x.appId === id)[0]?.roleId
        ] as keyof typeof RolePermissions
      ]
    ) : (
      <p style={{ color: "#878787" }}>No Permission</p>
    );
  };

  const getButtonDisabled = (id: any): boolean => {
    return user?.roles.filter((x) => x.appId === id)[0]?.roleId ===
      UserRoles.admin ||
      user?.roles.filter((x) => x.appId === id)[0]?.inviteStatus === "requested"
      ? true
      : false;
  };

  const handleOpenUserMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: any,
    params: any
  ) => {
    setAnchorElUser(event.currentTarget);
    setMoreOptions(row);
  };
  const handleCloseUserMenu = (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    if (value === "Cancel Request") {
      handleCancel(moreOptions);
    } else if (value === "Resend Request") {
      handleResend(moreOptions);
    }
    setAnchorElUser(null);
  };

  const handleCancel = (row: any) => {
    if (row.id === moreOptions.id) {
      acceptOrCancelRequestMutation({
        variables: {
          requestAction: {
            requestId: row.requestId,
            requestAction: "cancelled",
            sendMail: false,
          },
        },
      });
    }
  };

  const handleResend = (row: any) => {
    if (row.id === moreOptions.id) {
      resendRequestRequestMutation({
        variables: {
          param: { requestId: row.requestId },
        },
      });
    }
  };

  const getInviteStatus = (id: any) => {
    if (userRequestsByStatusData?.getUserRequestsByStatus?.data) {
      const userRequests =
        userRequestsByStatusData.getUserRequestsByStatus.data;
      const matchingRequests = userRequests.filter(
        (item: any) => item.contextId === id
      );
      if (matchingRequests.length > 0) {
        return matchingRequests[0].requestStatus;
      }
    }
    return "";
  };

  const getTimeRemaining = (id: any) => {
    if (userRequestsByStatusData?.getUserRequestsByStatus?.data) {
      const userRequests =
        userRequestsByStatusData.getUserRequestsByStatus.data;
      const matchingRequests = userRequests.filter(
        (item: any) => item.contextId === id
      );
      if (matchingRequests.length > 0) {
        const requestDate = matchingRequests[0].createdAt;
        return currentDate.diff(requestDate, "days");
      }
    }
    return "";
  };

  const makeMuiColumns = useCallback(() => {
    const columns: GridColumns<any> = [
      {
        field: "name",
        headerName: "Application Name",
        width: 200,
        renderCell: (params) => {
          return <div>{params.row.name}</div>;
        },
      },
      {
        field: "company",
        headerName: "Company",
        width: 200,
        renderCell: (params) => {
          return <div>ZONES</div>;
        },
      },
      {
        field: "permissions",
        headerName: "Permissions",
        width: 200,
        renderCell: (params) => <div>{getPermissionStatus(params.row.id)}</div>,
      },
      {
        field: "status",
        headerName: "Status",
        width: 200,
        renderCell: (params) => (
          <Typography
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingX: "13px",
            }}
            className="statusstyle"
            variant="body2"
          >
            {getInviteStatus(params.row.id)}
          </Typography>
        ),
      },
      {
        field: "time",
        headerName: "Time Pending",
        width: 200,
        renderCell: (params) => (
          <div> {getTimeRemaining(params.row.id)} days</div>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 350,
        headerAlign: "left",
        align: "right",
        getActions: (params) => [
          <GridActionsCellItem
            disableRipple={true}
            icon={
              <MoreHorizIcon
                sx={{
                  fontSize: "1.5rem",
                }}
              />
            }
            label={""}
            onClick={(event) => handleOpenUserMenu(event, params.row, params)}
            disabled={getButtonDisabled(params.row.id)}
          />,
        ],
      },
    ];
    setColumns(columns);
  }, [appData, user, userRequestsByStatusData, requestedAppRoles]);

  useEffect(() => {
    let temp: any[] = [];
    appData?.GetDataByJsonQuery?.info?.data?.forEach((item: any) => {
      let obj: any = {};
      let roles =
        userRequestsByStatusData?.getUserRequestsByStatus.data?.filter(
          (x: any) => x.contextId === item.id
        );
      if (roles && roles.length > 0) {
        obj = item;
        obj = { ...obj, requestId: roles[0].id };
        temp.push(obj);
      }
    });
    setFilteredRecords(temp);
    makeMuiColumns();
  }, [makeMuiColumns, appData, userRequestsByStatusData]);

  useEffect(() => {
    setSystemApp(appData?.GetDataByJsonQuery?.info?.data);
  }, [appData]);

  useEffect(() => {
    let temp = userRequestsByStatusData?.getUserRequestsByStatus?.data?.map(
      (x: any) => JSON.parse(x.payload)
    );
    setRequestedAppRoles(temp);
  }, [userRequestsByStatusData]);

  useEffect(() => {
    if (resendRequestError) {
      // Store.addNotification({
      //   content: (
      //     <NotificationContent
      //       type={"danger"}
      //       message={"Unable to resend the request. Please try again later."}
      //     />
      //   ),
      //   ...notificationOptions,
      // });
    } else if (resendRequestData) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Request has been resent successfully"}
          />
        ),
        ...notificationOptions,
      });
      refetchUserRequestByStatusData();
    }
  }, [
    resendRequestData,
    resendRequestError,
    resendRequestLoading,
    refetchUserRequestByStatusData,
  ]);

  useEffect(() => {
    if (acceptOrCancelRequestError) {
      // Store.addNotification({
      //   content: (
      //     <NotificationContent
      //       type={"danger"}
      //       message={"Unable to cancel the request. Please try again later."}
      //     />
      //   ),
      //   ...notificationOptions,
      // });
    } else if (acceptOrCancelRequestData) {
      Store.addNotification({
        content: (
          <NotificationContent
            type={"success"}
            message={"Request has been cancelled successfully"}
          />
        ),
        ...notificationOptions,
      });
      refetchUserRequestByStatusData();
    }
  }, [
    acceptOrCancelRequestData,
    acceptOrCancelRequestError,
    acceptOrCancelRequestLoading,
    refetchUserRequestByStatusData,
  ]);

  return (
    <Box sx={{ height: 450, width: "100%" }}>
      <DataGrid
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        rows={filteredRecords ? filteredRecords : []}
        columns={columns}
        paginationMode={"server"}
        loading={loadingAppData}
        disableSelectionOnClick
        rowsPerPageOptions={[10, 20, 50, 100]}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        pageSize={pageSize}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        getRowId={(row) => row.id}
        rowCount={filteredRecords ? filteredRecords.length : 0}
      />
      <Menu
        id="demo-customized-menu"
        MenuListProps={{ "aria-labelledby": "demo-customized-button" }}
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={(ev) => handleCloseUserMenu(ev, option)}
            sx={{
              color:
                option === "Resend Request"
                  ? theme.palette.primary.main
                  : "#C60000",
            }}
          >
            {option === "Resend Request" ? (
              <EditIcon
                sx={{
                  width: "10%",
                  marginRight: "10px",
                  color: theme.palette.primary.main,
                }}
              />
            ) : (
              <CloseIcon
                sx={{ width: "10%", marginRight: "10px", color: "#C60000" }}
              />
            )}
            <Typography textAlign="center">{option}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
export default PendingRequests;
