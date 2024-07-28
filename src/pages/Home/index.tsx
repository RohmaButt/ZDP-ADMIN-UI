import "./index.css";
import React, { FC, useState } from "react";
import { ProcessedRecords } from "../../components";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

const Home: FC = () => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={6} md={6}>
        <Typography fontWeight={"bold"} variant="h6" gutterBottom>
          Dashboard
        </Typography>
        <ProcessedRecords
          showDrawer={showDrawer}
          onClose={onClose}
          visible={visible}
        />
      </Grid>
    </Grid>
  );
};

export default Home;