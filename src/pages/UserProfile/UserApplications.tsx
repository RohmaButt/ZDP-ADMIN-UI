import { useQuery } from "@apollo/client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConditionType } from "../../components/FilterView";
import { GET_TABLE_DATA } from "../../graphql/generic/queries";
import { createQuery } from "../../utils/common";
import {
  defaultPageLimit,
  RolePermissions,
  UserRoles,
} from "../../utils/constants";
import { UserApplicationProps } from "./UserProfileDetails";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RequestPermission from "./RequestPermission";
import "./index.css";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { GET_USER_BY_ID } from "../../graphql/users/queries";

const UserApplications = ({
  user,
  userRequestsByStatusData,
  refetchUserRequestByStatusData,
}: UserApplicationProps) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isPermissionRequestOpen, setIsPermissionRequestOpen] = useState(false);
  const [systemApp, setSystemApp] = useState<any[]>([]);
  const [permissionRequestEdit, setPermissionRequestEdit] = useState<any>({});
  const [columns, setColumns] = useState<GridColumns<any>>([]);
  const [requestedAppRoles, setRequestedAppRoles] = useState<any[]>([]);

  const getIconColor = (id: any): string => {
    return userData?.getUserById?.userRole.filter((x: any) => x.appId === id)[0]
      ?.roleId === UserRoles.admin
      ? "adminColoredIcon"
      : requestedAppRoles &&
        requestedAppRoles?.filter((x) => x.appId === id).length > 0
      ? "requestColoredIcon"
      : "assignedColoredIcon";
  };

  const getButtonName = (id: any): string => {
    if (
      userData?.getUserById?.userRole.filter((x: any) => x.appId === id)[0]
        ?.roleId === UserRoles.admin
    )
      return "Admin Permission";
    if (
      requestedAppRoles &&
      requestedAppRoles?.filter((x) => x.appId === id).length > 0
    )
      return "In Process";
    else return "Update Permission";
  };

  const getPermissionStatus = (id: any) => {
    return requestedAppRoles &&
      requestedAppRoles?.filter((x) => x.appId === id).length > 0 ? (
      <p style={{ color: "#878787" }}>No Permissions</p>
    ) : userData?.getUserById?.userRole.filter((x: any) => x.appId === id) &&
      userData?.getUserById?.userRole.filter((x: any) => x.appId === id)
        .length > 0 ? (
      RolePermissions[
        UserRoles[
          userData?.getUserById?.userRole.filter((x: any) => x.appId === id)[0]
            ?.roleId
        ] as keyof typeof RolePermissions
      ]
    ) : (
      <p style={{ color: "#878787" }}>No Permissions</p>
    );
  };

  const getButtonDisabled = (id: any): boolean => {
    return userData?.getUserById?.userRole.filter((x: any) => x.appId === id)[0]
      ?.roleId === UserRoles.admin ||
      (requestedAppRoles &&
        requestedAppRoles?.filter((x) => x.appId === id).length > 0)
      ? true
      : false;
  };

  const checkRequestedStatus = (id: any): boolean => {
    return requestedAppRoles &&
      requestedAppRoles?.filter((x) => x.appId === id).length > 0
      ? true
      : false;
  };

  const handleDialogState = () => {
    setIsPermissionRequestOpen(false);
  };

  const onInviteMemberAddUpdate = () => {
    setIsPermissionRequestOpen(false);
  };

  const handlePermissionRequest = (row: any) => {
    let temp = { ...row };
    let appRole = userData?.getUserById?.userRole.filter(
      (x: any) => x.appId === temp.id
    );
    if (appRole && appRole?.length > 0) {
      temp.roleId = appRole[0]?.roleId;
    } else {
      temp.roleId = undefined;
    }
    setIsPermissionRequestOpen(true);
    setPermissionRequestEdit(temp);
  };

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

  const {
    data: userData,
    refetch: refetchUserData,
    error: userDataError,
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      param: { id: user?.id },
    },
  });

  const makeMuiColumns = useCallback(() => {
    const columns: GridColumns<any> = [
      {
        field: "name",
        headerName: "Application Name",
        width: 300,
        renderCell: (params) => {
          return <div>{params.row.name.toUpperCase()}</div>;
        },
      },
      {
        field: "company",
        headerName: "Company",
        width: 300,
        renderCell: (params) => {
          return <div>ZONES</div>;
        },
      },
      {
        field: "permissions",
        headerName: "Permissions",
        width: 550,
        renderCell: (params) => <div>{getPermissionStatus(params.row.id)}</div>,
      },
      {
        field: "actions",
        type: "actions",
        width: 200,
        headerAlign: "left",
        align: "left",
        getActions: (params) => [
          <GridActionsCellItem
            disableRipple={true}
            icon={
              <Box>
                <Typography className={getIconColor(params.row.id)}>
                  {checkRequestedStatus(params.row.id) ? (
                    <TimerOutlinedIcon
                      style={{
                        verticalAlign: "middle",
                        display: "inline-flex",
                      }}
                      className={getIconColor(params.row.id)}
                    />
                  ) : (
                    <LockOutlinedIcon
                      style={{
                        verticalAlign: "middle",
                        display: "inline-flex",
                      }}
                      className={getIconColor(params.row.id)}
                    />
                  )}
                  &nbsp;
                  {getButtonName(params.row.id)}
                </Typography>
              </Box>
            }
            label={""}
            onClick={() => handlePermissionRequest(params.row)}
            disabled={getButtonDisabled(params.row.id)}
          />,
        ],
      },
    ];
    setColumns(columns);
  }, [appData, user, requestedAppRoles, userData, userRequestsByStatusData]);

  useEffect(() => {
    setSystemApp(appData?.GetDataByJsonQuery?.info?.data);
  }, [appData]);

  useEffect(() => {
    let temp = userRequestsByStatusData?.getUserRequestsByStatus?.data?.map(
      (x: any) => JSON.parse(x.payload)
    );
    setRequestedAppRoles(temp);
  }, [userData, userRequestsByStatusData]);

  useEffect(() => {
    makeMuiColumns();
  }, [
    makeMuiColumns,
    appData,
    userData,
    userRequestsByStatusData,
    requestedAppRoles,
  ]);

  return (
    <Box sx={{ height: 450, width: "100%" }}>
      <DataGrid
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        rows={appData ? appData?.GetDataByJsonQuery?.info?.data : []}
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
        rowCount={appData ? appData?.GetDataByJsonQuery?.info?.totalRecords : 0}
      />

      <RequestPermission
        handleClose={() => handleDialogState()}
        isOpen={isPermissionRequestOpen}
        onDone={() => onInviteMemberAddUpdate()}
        title={`${permissionRequestEdit?.name} Permission Request`}
        permissionRequestEdit={permissionRequestEdit}
        refetchAppData={refetchAppData}
        user={user}
        requestedAppRoles={requestedAppRoles}
        userRequestsByStatusData={userRequestsByStatusData}
        refetchUserRequestByStatusData={refetchUserRequestByStatusData}
        userData={userData}
        refetchUserData={refetchUserData}
      />
    </Box>
  );
};
export default UserApplications;
