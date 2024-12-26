import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import Widget1 from "./Widgets/Widget1";
import LineChartWidget from "./Widgets/LineChartWidget";
import Widget2 from "./Widgets/Widget2";
import Widget3 from "./Widgets/Widget3";
import Widget4 from "./Widgets/Widget4";

function DashboardHome() {
  return (
    <Box
      sx={{
        padding: { xs: "10px", sm: "20px" },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={3}>
        {/* Widgets in One Row */}
        <Grid item xs={12} sm={12} md={4} lg={3}>
          <Widget1 />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3}>
          <Widget2 />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3}>
          <Widget3 />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3}>
          <Widget4 />
        </Grid>
      </Grid>

      {/* Divider between widgets and chart */}
      <Divider sx={{ marginY: 4 }} />

      {/* Footer */}
      <Box sx={{ marginTop: 5, textAlign: "center", color: "#888" }}>
        <Typography variant="body2">
          © 2024 NCP Classes. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default DashboardHome;
