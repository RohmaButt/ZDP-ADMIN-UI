import { useQuery } from "@apollo/client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { GET_USER_WITH_APP_AND_INVITE } from "../../graphql/dashboard/queries";
import { defaultPageLimit } from "../../utils/constants";
import { NameAvatar } from "../Members";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InviteMemberDialog from "../../components/InviteMemberDialog";
import DeactivateDeleteDialog from "../../components/DeactivateDeleteDialog";

const MembersOfApp = ({
  app,
  handleEditPermissions,
  handleDeactivateDelete,
  handleDialogState,
  isInviteMemberDialogOpen,
  onInviteMemberAddUpdate,
  systemApp,
  memberValEdit,
  handleAlertDialogState,
  alertDialogOpen,
  onDeactivateDeleteDone,
  alertType,
  selectedUserId,
}: any) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
              </Box>
            </Box>
          );
        },
      },
      {
        field: "email",
        headerName: "Email",
        width: 300,
        renderCell: (params) => {
          return <div>{params.row.email}</div>;
          // {params.value ? "Active" : "InActive"}
        },
      },
      {
        field: "company",
        headerName: "Company",
        width: 200,
        renderCell: (params) => <div>ZONES</div>,
      },
      {
        field: "userType",
        headerName: "User Type",
        width: 200,
        renderCell: (params) => {
          return <div>Internal</div>;
          // {params.value ? "Active" : "InActive"}
        },
      },
      {
        field: "phoneNumber",
        headerName: "Phone Number",
        width: 200,
        renderCell: (params) => {
          return <div></div>;
          // {params.value ? "Active" : "InActive"}
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 150,
        headerAlign: "right",
        align: "right",
        getActions: (params) => [
          <GridActionsCellItem
            sx={{ color: "#132640" }}
            icon={<CreateOutlinedIcon sx={{ color: "#005596" }} />}
            label="Edit Permissions"
            onClick={(ev) => handleEditPermissions(params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            sx={{ color: "#132640" }}
            icon={<PersonRemoveOutlinedIcon sx={{ color: "#005596" }} />}
            label="Deactive Member"
            onClick={(ev) => handleDeactivateDelete(params.row, "deactivate")}
            showInMenu
          />,
          <GridActionsCellItem
            sx={{ color: "#C60000" }}
            icon={<DeleteOutlineOutlinedIcon sx={{ color: "#C60000" }} />}
            label="Delete"
            onClick={(ev) => handleDeactivateDelete(params.row, "delete")}
            showInMenu
          />,
        ],
      },
    ],
    []
  );

  const {
    loading: loadingAllMembers,
    error: errorAllMembers,
    data: allMembersData,
    refetch: refetchAllMembers,
  } = useQuery(GET_USER_WITH_APP_AND_INVITE, {
    variables: {
      pagination: { limit: defaultPageLimit, offset: 0 },
      param: { appId: app?.id, status: "accepted" },
    },
  });

  useEffect(() => {
    refetchAllMembers({
      pagination: {
        offset: page,
        limit: pageSize || defaultPageLimit,
      },
    });
  }, [page, pageSize]);

  return (
    <Box sx={{ height: 450, width: "100%" }}>
      <DataGrid
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        rows={
          allMembersData ? allMembersData?.getUsersWithAppAndInvite?.data : []
        }
        columns={columnPending}
        paginationMode={"server"}
        loading={loadingAllMembers}
        disableSelectionOnClick
        rowsPerPageOptions={[10, 20, 50, 100]}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        pageSize={pageSize}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        getRowId={(row) => row.id}
        rowCount={
          allMembersData
            ? allMembersData?.getUsersWithAppAndInvite?.totalRecords
            : 0
        }
      />
      <InviteMemberDialog
        handleClose={() => handleDialogState()}
        isOpen={isInviteMemberDialogOpen}
        onDone={() => onInviteMemberAddUpdate()}
        title={"Invite Member"}
        rows={systemApp}
        memberValEdit={memberValEdit}
        refetchAllUserData={refetchAllMembers}
        app={app}
      />
      <DeactivateDeleteDialog
        handleClose={() => handleAlertDialogState()}
        isOpen={alertDialogOpen}
        onDone={() => onDeactivateDeleteDone()}
        title={
          alertType == "deactivate" ? "Deactivate Member" : "Delete Member"
        }
        userId={selectedUserId}
        alertType={alertType}
        refetchAllUserData={refetchAllMembers}
      />
    </Box>
  );
};

export default MembersOfApp;
