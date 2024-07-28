import { FC, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import React from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Switch,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { GET_ACTIVITY_LOGS } from "../../graphql/dashboard/queries";
import { useQuery } from "@apollo/client";
import { getFirstTwoLetters } from "../../utils/common";
import { defaultPaginationParams } from "../../utils/constants";
import theme from "../../mui.theme";
import moment from "moment";

const ActivityBoard: FC = () => {
  const currentDate = moment();
  const endDate = moment().subtract(90, "days");

  const { data: ativityLogsData } = useQuery(GET_ACTIVITY_LOGS, {
    variables: {
      DateInput: {
        startDate: endDate.format("YYYY-MM-DD"),
        endDate: currentDate.format("YYYY-MM-DD"),
      },
      pagination: { ...defaultPaginationParams },
    },
  });

  const handleClick = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    localStorage.setItem("switchState", String(newValue));
  };
  const initialState = localStorage.getItem("switchState") === "true";
  const [isChecked, setIsChecked] = useState(initialState);

  useEffect(() => {}, []);

  return (
    <Box sx={{ width: "30%" }}>
      {ativityLogsData?.GetAllActivityLogs && isChecked === true ? (
        <Card
          sx={{ minWidth: 275, borderRadius: 3, height: 550 }}
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
                <AccessTimeIcon />
              </Avatar>
            }
            action={
              <IconButton aria-label="switch">
                <Switch onClick={handleClick} defaultChecked={isChecked} />
              </IconButton>
            }
            titleTypographyProps={{
              variant: "h6",
              fontWeight: "bold",
            }}
            title="Activity Log"
          />
          <CardContent>
            <Box sx={{ textAlign: "left" }}>
              <Box>
                <Box
                  sx={{
                    height: "450px",
                    overflowY: "auto",
                    marginTop: "10px",
                  }}
                >
                  {ativityLogsData?.GetAllActivityLogs?.data?.map(
                    (logs: any) => (
                      <Box display="flex">
                        <Avatar
                          sx={{
                            bgcolor: "white",
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                            width: "35px",
                            height: "35px",
                          }}
                        >
                          <Typography fontSize={"12px"}>
                            {getFirstTwoLetters(logs?.perfomerName)}
                          </Typography>
                        </Avatar>
                        <Box
                          sx={{
                            marginLeft: "10px",
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "7px",
                          }}
                          component={"div"}
                        >
                          <Typography
                            variant="body1"
                            fontWeight={"bold"}
                            style={{ marginBottom: "1px" }}
                          >
                            {logs?.perfomerName
                              ? logs?.perfomerName
                              : "Default value"}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            style={{ opacity: 0.7 }}
                          >
                            {logs?.description}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : ativityLogsData?.GetAllActivityLogs && isChecked === false ? (
        <Card
          sx={{ minWidth: 275, borderRadius: 3, height: "60px" }}
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
                <AccessTimeIcon />
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <Switch onClick={handleClick} defaultChecked={isChecked} />
              </IconButton>
            }
            titleTypographyProps={{
              variant: "h6",
              fontWeight: "bold",
            }}
            title="Activity Log"
          />
        </Card>
      ) : (
        <Card
          sx={{ minWidth: 275, borderRadius: 3, height: "550px" }}
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
                <AccessTimeIcon />
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <Switch onClick={handleClick} defaultChecked={isChecked} />
              </IconButton>
            }
            titleTypographyProps={{
              variant: "h6",
              fontWeight: "bold",
            }}
            title="Activity Log"
          />
          <CardContent>
            <Box sx={{ textAlign: "center" }}>
              <Box>
                <AccessTimeIcon sx={{ fontSize: "4em" }} color="action" />
              </Box>
              <Box>
                <Typography
                  fontWeight={"bold"}
                  variant="h6"
                  color="text.secondary"
                >
                  Activity Log
                </Typography>
                <Typography
                  fontWeight={"bold"}
                  fontSize={14}
                  color="text.secondary"
                >
                  You do not have any current running events. Check back in a
                  little while or refresh the page.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
export default ActivityBoard;
