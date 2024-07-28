import { FC, useState } from "react";
import React from "react";
import {
  Box,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";
import {
  GET_COMPANIES_STATS,
  GET_MEMBERS_STATS,
} from "../../graphql/dashboard/queries";
import { useQuery } from "@apollo/client";
import { getFirstTwoLetters } from "../../utils/common";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DoughnutChart from "../../components/Charts/DoughnutChart";
import moment from "moment";
import ActivityBoard from "./ActivityLog";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: FC = () => {
  let navigate = useNavigate();
  const currentDate = moment();
  const endDate = moment().subtract(90, "days");

  const { data: companiesData } = useQuery(GET_COMPANIES_STATS, {
    variables: {},
  });

  const { data: membersData } = useQuery(GET_MEMBERS_STATS, {
    variables: {},
  });

  const membersLabels = [
    `Active: ${membersData?.GetMemberStats?.activeMembers}`,
    `Inactive: ${membersData?.GetMemberStats?.inActiveMembers}`,
    `Pending Invites: ${membersData?.GetMemberStats?.pendingInvites}`,
  ];
  const membersDataChart = [
    membersData?.GetMemberStats?.activeMembers,
    membersData?.GetMemberStats?.inActiveMembers,
    membersData?.GetMemberStats?.pendingInvites,
  ];
  const membersBackgroundColor = ["#005596", "#D1D3D4", "#9EC1EB"];
  const companyLabels = [
    `Active: ${companiesData?.GetCompaniesStats?.activeCompanies}`,
    `Inactive: ${companiesData?.GetCompaniesStats?.inActiveCompanies}`,
  ];
  const companyDataChart = [
    companiesData?.GetCompaniesStats?.activeCompanies,
    companiesData?.GetCompaniesStats?.inActiveCompanies,
  ];

  const companyBackgroundColor = ["#005596", "#D1D3D4"];
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "@media (max-width: 999px)": {
            gap: "10px",
          },
        }}
      >
        <Box sx={{ width: "60%", marginRight: "10%" }}>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <Box sx={{ marginRight: "2%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Typography fontWeight={"bold"} variant="h6">
                  Member Activity
                </Typography>
              </Box>
              <Box
                sx={{
                  padding: "35px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <DoughnutChart
                  data={membersDataChart || []}
                  labels={membersLabels || []}
                  backgroundColor={membersBackgroundColor}
                />
              </Box>
            </Box>
            <Box>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Typography fontWeight={"bold"} variant="h6">
                  Company Activity
                </Typography>
              </Box>
              <Box
                sx={{
                  padding: "35px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <DoughnutChart
                  data={companyDataChart || []}
                  labels={companyLabels || []}
                  backgroundColor={companyBackgroundColor}
                />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",

                "@media (max-width: 999px)": {
                  gap: "10px",
                },
                "@media (max-width: 700px)": {
                  gap: "10px",
                  flexWrap: "wrap",
                },
              }}
            >
              <Box sx={{ marginRight: "2%" }}>
                <Box>
                  <Card
                    sx={{ minWidth: 275, borderRadius: 3, minHeight: "179px" }}
                    variant="outlined"
                  >
                    <CardHeader
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        padding: "8px",
                      }}
                      avatar={
                        <Avatar
                          sx={{ color: "#005596", backgroundColor: "unset" }}
                          aria-label="recipe"
                        >
                          <PeopleAltIcon />
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreHorizIcon />
                        </IconButton>
                      }
                      titleTypographyProps={{
                        variant: "h6",
                        fontWeight: "bold",
                      }}
                      title="Platform Members"
                    />
                    <CardContent>
                      <Box>
                        <Typography fontSize={14} fontWeight="bold">
                          View members of ZDP and their assigned applications
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        sx={{ color: "#005596", fontWeight: "bold" }}
                        onClick={() => navigate("/admin/members")}
                      >
                        View / Manage Members
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              </Box>
              <Box>
                <Box>
                  <Card
                    sx={{ minWidth: 275, borderRadius: 3, minHeight: "179px" }}
                    variant="outlined"
                  >
                    <CardHeader
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        padding: "8px",
                      }}
                      avatar={
                        <Avatar
                          sx={{ color: "#005596", backgroundColor: "unset" }}
                          aria-label="recipe"
                        >
                          <BusinessIcon />
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreHorizIcon />
                        </IconButton>
                      }
                      titleTypographyProps={{
                        variant: "h6",
                        fontWeight: "bold",
                      }}
                      title="Companies"
                    />
                    <CardContent>
                      <Box>
                        <Typography fontSize={14} fontWeight="bold">
                          View companies and groups of ZDP and manage settings.
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        sx={{ color: "#005596", fontWeight: "bold" }}
                        onClick={() => navigate("/admin/companies")}
                      >
                        View / Manage companies
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <ActivityBoard />
      </Box>
    </Box>
  );
};
export default Dashboard;
