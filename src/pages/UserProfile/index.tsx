import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import { GET_USER_REQUEST_BY_STATUS } from "../../graphql/users/queries";
import { getFullName } from "../../utils/common";
import { defaultPaginationParams } from "../../utils/constants";
import PendingRequests from "./PendingRequests";
import UserApplications from "./UserApplications";
import UserProfileDetails from "./UserProfileDetails";

const UserProfile = () => {
  const [value, setValue] = useState<number>(0);
  const user = useAppSelector(selectUser);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const {
    data: userRequestsByStatusData,
    refetch: refetchUserRequestByStatusData,
    error: userRequestByStatusDataError,
  } = useQuery(GET_USER_REQUEST_BY_STATUS, {
    variables: {
      param: { id: user?.id },
      inviteStatus: "requested",
      pagination: { ...defaultPaginationParams },
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h4">
          Welcome, {getFullName(user?.user?.firstName, user?.user?.lastName)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography>
          Manage your info, privacy and security to work better for you.
        </Typography>
      </Box>
      <UserProfileDetails user={user} />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Data tabs">
          <Tab
            sx={{ textTransform: "none", fontWeight: "bold" }}
            label="Applications"
            {...a11yProps(0)}
          />
          <Tab
            sx={{ textTransform: "none", fontWeight: "bold" }}
            label="Pending Request"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      {value === 0 ? (
        <UserApplications
          user={user}
          userRequestsByStatusData={userRequestsByStatusData}
          refetchUserRequestByStatusData={refetchUserRequestByStatusData}
        />
      ) : (
        <PendingRequests
          user={user}
          userRequestsByStatusData={userRequestsByStatusData}
          refetchUserRequestByStatusData={refetchUserRequestByStatusData}
        />
      )}
    </Box>
  );
};
export default UserProfile;

export function a11yProps(index: number) {
  return {
    id: `data-tab-${index}`,
    "aria-controls": `data-tabpanel-${index}`,
  };
}
