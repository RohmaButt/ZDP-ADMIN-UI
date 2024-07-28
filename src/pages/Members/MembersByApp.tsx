import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import admin from "../../assets/icon/admin.png";
import datasourcing from "../../assets/icon/datasourcing.png";
import pim from "../../assets/icon/pim.png";
import { useNavigate } from "react-router-dom";

const MembersByApp = ({ systemApp }: any) => {
  const navigate = useNavigate();
  const handleAppNameClick = (row: any) => {
    let appName = row.name.replace(/ /g, "");
    navigate(`/admin/members/${appName}`, {
      state: { app: row },
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "20px",
        display: "flex",
      }}
    >
      {systemApp?.map((x: any) => {
        return (
          <Card key={x.id} sx={{ width: 345, marginRight: "10px" }}>
            <CardHeader
              sx={{ backgroundColor: "#005596" }}
              action={
                <IconButton aria-label="settings" sx={{ color: "white" }}>
                  {/* <MoreVertIcon /> */}
                </IconButton>
              }
            />
            <CardContent
              sx={{
                height: 255,
                backgroundColor: "#005596",
                padding: "10px",
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  sx={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "white",
                    zIndex: "1",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                    color: "red",
                  }}
                  aria-label="recipe"
                >
                  {x.name === "PIM" ? (
                    <img src={pim} />
                  ) : x.name === "ADMIN" ? (
                    <img src={admin} />
                  ) : (
                    <img src={datasourcing} />
                  )}
                </Avatar>
              </Box>
              <Box
                sx={{
                  paddingTop: "50px",
                  backgroundColor: "white",
                  position: "absolute",
                  top: "62px",
                  width: "325px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "white",
                    textAlign: "center",
                    padding: "0px 5px",
                  }}
                >
                  {/* <Typography fontWeight={"bold"}>{x.name}</Typography> */}
                  <Button
                    variant="text"
                    disableRipple={true}
                    disableFocusRipple={true}
                    disableTouchRipple={true}
                    onClick={(ev) => handleAppNameClick(x)}
                  >
                    {x.name}
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "white",
                    textAlign: "center",
                    padding: "0px 5px",
                  }}
                >
                  <Typography>
                    Contains members of {x.name} and their Permissions
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "200px",
                  display: "flex",
                  justifyContent: "center",
                  width: "325px",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "bold" }}>
                  Admin:{" "}
                  {x.name === "PIM"
                    ? "Sallar Bhutto"
                    : x.name === "ADMIN"
                    ? "Hassan Iqbal"
                    : "Ali Bukhari"}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "223px",
                  display: "flex",
                  justifyContent: "center",
                  width: "325px",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "bold" }}>
                  Members:{" "}
                  {x.name === "PIM" ? "5" : x.name === "ADMIN" ? "4" : "1"}{" "}
                  Members
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default MembersByApp;
