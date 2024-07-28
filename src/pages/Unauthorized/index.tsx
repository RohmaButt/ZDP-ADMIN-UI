import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";
import React from "react";

const UnauthorizedUser = () => {
  const drawerWidth = 240;
  const primary = purple[500];

  return (
    <Card variant="outlined" sx={{ marginTop: "100px", border: "none" }}>
      <CardContent
        sx={{
          minWidth: 275,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h1" component="div">
          401!
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          You are not allow to access this app.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UnauthorizedUser;
