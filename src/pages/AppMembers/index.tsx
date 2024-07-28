import { useMsal } from "@azure/msal-react";
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllUsersRequest } from "../../config/authConfig";
import { callMsGetAllUsersGraph } from "../../services/msGraphApi";
import {
  createQuery,
  createQueryCondition,
  getFirstTwoLetters,
} from "../../utils/common";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { defaultPageLimit } from "../../utils/constants";
import { GET_TABLE_DATA } from "../../graphql/generic/queries";
import { useQuery } from "@apollo/client";
import { ConditionType } from "../../components/FilterView";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../Members";
import MembersOfApp from "./MemberOfApp";
import PendingInvitesMember from "./PendingInvitesMember";

type App = {
  id: number;
  name: string;
  description: string;
  logo: string;
};

const AppMembers = () => {
  const { instance, accounts } = useMsal();
  const [users, setUser] = useState<User[]>();
  const [value, setValue] = useState<number>(0);
  const [isInviteMemberDialogOpen, setIsInviteMemberDialogOpen] =
    useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] =
    useState<number | null | undefined>(null);
  const [alertType, setAlertType] = useState<string>("");
  const [getAllUsersLoader, setGetAllUsersLoader] = useState(false);
  const [systemApp, setSystemApp] = useState<any[]>([]);

  const navigate = useNavigate();
  const { state }: { state: any } = useLocation();
  const [app, setApp] = useState<App>({
    id: 0,
    description: "",
    logo: "",
    name: "",
  });
  const [memberValEdit, setMemberValEdit] = useState({});
  const [tablePage, setTablePage] = useState(0);
  const [tableRowsPerPage, setTableRowsPerPage] = useState(10);
  const [emptyRows, setEmptyRows] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getAllUsers = () => {
    setGetAllUsersLoader(true);
    const request = {
      ...getAllUsersRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        callMsGetAllUsersGraph(response.accessToken).then((response) => {
          setGetAllUsersLoader(false);
          setUser(response.value);
        });
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          callMsGetAllUsersGraph(response.accessToken).then((response) => {
            setGetAllUsersLoader(false);
            console.log(response);
          });
        });
      });
  };

  const handleEditPermissions = (row: any) => {
    setIsInviteMemberDialogOpen(true);
    setMemberValEdit(row);
  };

  const handleDeactivateDelete = (row: any, type: string) => {
    setSelectedUserId(parseInt(row.id, 10)!);
    setAlertType(type);
    setAlertDialogOpen(true);
  };

  const handleDialogState = () => {
    setIsInviteMemberDialogOpen(false);
  };

  const onInviteMemberAddUpdate = () => {
    getAllUsers();
    setIsInviteMemberDialogOpen(false);
  };

  const handleAlertDialogState = () => {
    setSelectedUserId(undefined);
    setAlertType("");
    setAlertDialogOpen(false);
  };

  const onDeactivateDeleteDone = () => {
    // refetctUsers
    setAlertDialogOpen(false);
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

  const appIdConditionObject: ConditionType = {
    field: "t2.app_id",
    values: app?.id,
    condition: "$eq",
  };

  const inviteConditionObject: ConditionType = {
    field: "t2.invite_status",
    values: "accepted",
    condition: "$eq",
  };

  const appIdObj: any = {};
  appIdObj.$and = [createQueryCondition(appIdConditionObject)];

  const inviteObj: any = {};
  inviteObj.$and = [createQueryCondition(inviteConditionObject)];

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setSystemApp(appData?.GetDataByJsonQuery?.info?.data);
  }, [appData]);

  useEffect(() => {
    if (state?.app) {
      setApp(state.app);
    }
  }, [state?.app]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          View/Manage {app.name} Members
        </Typography>
        <Button
          variant="contained"
          style={{
            borderRadius: "25px",
            backgroundColor: "#005596",
          }}
          startIcon={<PersonAddIcon />}
          onClick={() => setIsInviteMemberDialogOpen(true)}
        >
          INVITE
        </Button>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Data tabs">
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label={`${app.name} Members`}
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
        <MembersOfApp
          app={app}
          handleEditPermissions={handleEditPermissions}
          handleDeactivateDelete={handleDeactivateDelete}
          handleDialogState={handleDialogState}
          isInviteMemberDialogOpen={isInviteMemberDialogOpen}
          onInviteMemberAddUpdate={onInviteMemberAddUpdate}
          systemApp={systemApp}
          memberValEdit={memberValEdit}
          handleAlertDialogState={handleAlertDialogState}
          alertDialogOpen={alertDialogOpen}
          onDeactivateDeleteDone={onDeactivateDeleteDone}
          alertType={alertType}
          selectedUserId={selectedUserId}
        />
      ) : (
        <PendingInvitesMember
          app={app}
          handleEditPermissions={handleEditPermissions}
          handleDeactivateDelete={handleDeactivateDelete}
          handleDialogState={handleDialogState}
          isInviteMemberDialogOpen={isInviteMemberDialogOpen}
          onInviteMemberAddUpdate={onInviteMemberAddUpdate}
          systemApp={systemApp}
          memberValEdit={memberValEdit}
          handleAlertDialogState={handleAlertDialogState}
          alertDialogOpen={alertDialogOpen}
          onDeactivateDeleteDone={onDeactivateDeleteDone}
          alertType={alertType}
          selectedUserId={selectedUserId}
        />
      )}
    </Box>
  );
};

export default AppMembers;

function a11yProps(index: number) {
  return {
    id: `data-tab-${index}`,
    "aria-controls": `data-tabpanel-${index}`,
  };
}
