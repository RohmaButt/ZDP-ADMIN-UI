import { useQuery } from "@apollo/client";
import React from "react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { GET_USER_WITH_APP_AND_INVITE } from "../../graphql/dashboard/queries";
import { defaultPageLimit } from "../../utils/constants";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InviteMemberDialog from "../../components/InviteMemberDialog";
import DeactivateDeleteDialog from "../../components/DeactivateDeleteDialog";
import theme from "../../mui.theme";
import MuiTypography from "@mui/material/Typography";
import { getFirstTwoLetters } from "../../utils/common";
const PendingInvitesMember = ({
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
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingPageSize, setPendingPageSize] = useState(10);
  const columnPendingInvites = useMemo<GridColumns<any>>(
    () => [
      {
        field: "firstName",
        headerName: "User",
        width: 300,
        renderCell: (params) => {
          return (
            <Box style={{ display: "flex" }}>
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
                  {getFirstTwoLetters(params.row.firstName)}
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
                <MuiTypography>{params.row.firstName}</MuiTypography>
                <MuiTypography variant="body2">
                  {params.row.email}
                </MuiTypography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "inviteStatus",
        headerName: "Status",
        width: 300,
        renderCell: (params) => {
          return (
            <div>
              <Chip label={params.row.Request[0].requestStatus} />
            </div>
          );
          // {params.value ? "Active" : "InActive"}
        },
      },
      {
        field: "timePending",
        headerName: "Time Pending",
        width: 200,
        renderCell: (params) => <div></div>,
      },
      {
        field: "company",
        headerName: "Company",
        width: 200,
        renderCell: (params) => {
          return <div>ZONES</div>;
          // {params.value ? "Active" : "InActive"}
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 350,
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
    loading: loadingPendingMembers,
    error: errorPendingMembers,
    data: pendingMembersData,
    refetch: refetchPendingMembers,
  } = useQuery(GET_USER_WITH_APP_AND_INVITE, {
    variables: {
      pagination: { limit: defaultPageLimit, offset: 0 },
      param: { appId: app?.id, status: "pending" },
    },
  });

  useEffect(() => {
    refetchPendingMembers({
      pagination: {
        offset: pendingPage,
        limit: pendingPageSize || defaultPageLimit,
      },
    });
  }, [pendingPage, pendingPageSize]);

  return (
    <Box sx={{ height: 450, width: "100%" }}>
      <DataGrid
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        rows={
          pendingMembersData
            ? pendingMembersData?.getUsersWithAppAndInvite?.data
            : []
        }
        columns={columnPendingInvites}
        paginationMode={"server"}
        loading={loadingPendingMembers}
        disableSelectionOnClick
        rowsPerPageOptions={[10, 20, 50, 100]}
        onPageSizeChange={(newPage) => setPendingPageSize(newPage)}
        pageSize={pendingPageSize}
        page={pendingPage}
        onPageChange={(newPage) => setPendingPage(newPage)}
        getRowId={(row) => row.id}
        rowCount={
          pendingMembersData
            ? pendingMembersData?.getUsersWithAppAndInvite?.totalRecords
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
        refetchAllUserData={refetchPendingMembers}
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
        refetchAllUserData={refetchPendingMembers}
      />
    </Box>
  );
};

export default PendingInvitesMember;
