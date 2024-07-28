import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { NameAvatar } from ".";
import { ConditionType } from "../../components/FilterView";
import { GET_TABLE_DATA } from "../../graphql/generic/queries";
import { createQuery } from "../../utils/common";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InviteMemberDialog from "../../components/InviteMemberDialog";
import DeactivateDeleteDialog from "../../components/DeactivateDeleteDialog";
import { defaultPageLimit } from "../../utils/constants";

const AllZDPMembers = ({
  systemApp,
  isInviteMemberDialogOpen,
  setIsInviteMemberDialogOpen,
}: any) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(undefined);
  const [alertType, setAlertType] = useState<string>("");
  const [memberValEdit, setMemberValEdit] = useState({});
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
        },
      },
      {
        field: "phoneNumber",
        headerName: "Phone Number",
        width: 200,
        renderCell: (params) => {
          return <div></div>;
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
  const handleDeactivateDelete = (row: any, type: string) => {
    setSelectedUserId(row.id);
    setAlertType(type);
    setAlertDialogOpen(true);
  };

  const handleEditPermissions = (row: any) => {
    setIsInviteMemberDialogOpen(true);
    setMemberValEdit(row);
  };

  const handleDialogState = () => {
    setIsInviteMemberDialogOpen(false);
    setMemberValEdit({});
  };

  const onInviteMemberAddUpdate = () => {
    setIsInviteMemberDialogOpen(false);
  };

  const handleAlertDialogState = () => {
    setSelectedUserId(undefined);
    setAlertType("");
    setAlertDialogOpen(false);
  };

  const onDeactivateDeleteDone = () => {
    refetchAllUserData();
    setAlertDialogOpen(false);
  };

  const defaultConditionObject: ConditionType = {
    field: "isActive",
    values: 1,
    condition: "$eq",
  };
  const defaultQuery = createQuery([defaultConditionObject], "User");
  const {
    loading: loadingAllUsersData,
    error: errorAllUsersData,
    data: allUsersData,
    refetch: refetchAllUserData,
  } = useQuery(GET_TABLE_DATA, {
    variables: {
      pagination: { limit: pageSize, offset: 0 },
      DataModelInput: { entity: "User" },
      QueryInput: {
        filterInputString: JSON.stringify(defaultQuery),
      },
    },
  });

  useEffect(() => {
    refetchAllUserData({
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
        rows={allUsersData ? allUsersData?.GetDataByJsonQuery?.info?.data : []}
        columns={columnPending}
        paginationMode={"server"}
        loading={loadingAllUsersData}
        disableSelectionOnClick
        rowsPerPageOptions={[10, 20, 50, 100]}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        pageSize={pageSize}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        getRowId={(row) => row.id}
        rowCount={
          allUsersData
            ? allUsersData?.GetDataByJsonQuery?.info?.totalRecords
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
        refetchAllUserData={refetchAllUserData}
        app={undefined}
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
        refetchAllUserData={refetchAllUserData}
      />
    </Box>
  );
};

export default AllZDPMembers;
