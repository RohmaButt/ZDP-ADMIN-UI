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
import { useEffect, useMemo, useState } from "react";
import { getAllUsersRequest } from "../../config/authConfig";
import { callMsGetAllUsersGraph } from "../../services/msGraphApi";
import { createQuery, getFirstTwoLetters } from "../../utils/common";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { defaultPageLimit } from "../../utils/constants";
import "./index.css";
import { GET_TABLE_DATA } from "../../graphql/generic/queries";
import { useQuery } from "@apollo/client";
import { ConditionType } from "../../components/FilterView";
import { useNavigate } from "react-router-dom";
import AllZDPMembers from "./AllZDPMembers";
import MembersByApp from "./MembersByApp";

const Members = () => {
  const { instance, accounts } = useMsal();
  const [users, setUser] = useState<User[]>();
  const [value, setValue] = useState<number>(0);

  const [getAllUsersLoader, setGetAllUsersLoader] = useState(false);
  const [systemApp, setSystemApp] = useState<any[]>([]);
  const [isInviteMemberDialogOpen, setIsInviteMemberDialogOpen] =
    useState(false);
  const navigate = useNavigate();
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

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setSystemApp(appData?.GetDataByJsonQuery?.info?.data);
  }, [appData]);

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
          View/Manage ZDP Members
        </Typography>
        {value === 0 ? (
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
        ) : null}
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Data tabs">
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label="All ZDP Members"
              {...a11yProps(0)}
            />
            <Tab
              sx={{ textTransform: "none", fontWeight: "bold" }}
              label="Members by Application"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
      </Box>
      {value === 0 ? (
        <AllZDPMembers
          systemApp={systemApp}
          isInviteMemberDialogOpen={isInviteMemberDialogOpen}
          setIsInviteMemberDialogOpen={setIsInviteMemberDialogOpen}
        />
      ) : (
        <MembersByApp systemApp={systemApp} />
      )}
    </Box>
  );
};
export default Members;

export type User = {
  businessPhones: [];
  displayName: string;
  givenName: string;
  id: string;
  jobTitle: string | null;
  mail: string;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  surname: string;
  userPrincipalName: string;
};

export function NameAvatar({ name }: any) {
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

export function a11yProps(index: number) {
  return {
    id: `data-tab-${index}`,
    "aria-controls": `data-tabpanel-${index}`,
  };
}
