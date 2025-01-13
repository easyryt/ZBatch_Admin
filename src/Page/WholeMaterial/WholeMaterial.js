import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import TitlesDataGrid from "./TitlesDataGrid";
import ContentsDataGrid from "./ContentsDataGrid";
import SubjectsDataGrid from "./SubjectsDataGrid";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function WholeMaterial() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Material Tabs"
        variant="fullWidth"
        sx={{
          "& .MuiTabs-indicator": {
            bgcolor: "primary.main",
          },
          "& .MuiTab-root": {
            fontSize: "1rem",
            textTransform: "none",
            fontWeight: "bold",
          },
        }}
      >
        <Tab label="Titles" {...a11yProps(0)} />
        <Tab label="Subjects" {...a11yProps(1)} />
        <Tab label="Contents" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <TitlesDataGrid />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <SubjectsDataGrid />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ContentsDataGrid />
      </TabPanel>
    </Box>
  );
}

export default WholeMaterial;
