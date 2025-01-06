import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import CreateTestModal from "../ViewBatchDetails/CreateTestModal";

const TestsList = () => {
  const { batchId, subjectId } = useParams();
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");
  const [contentModalOpen, setContentModalOpen] = useState(false);

  const fetchTests = async () => {
    try {
      const response = await axios.get(
        `https://npc-classes.onrender.com/admin/batches/test/subjects/tests/getAll/${subjectId}`,
        {
          headers: { "x-admin-token": token },
        }
      );
      setTests(response.data.data);
      setFilteredTests(response.data.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [subjectId]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTests(
      tests.filter(
        (test) =>
          test.name.toLowerCase().includes(query) ||
          test.description.toLowerCase().includes(query)
      )
    );
  };

  const columns = [
    { field: "name", headerName: "Test Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "totalMarks", headerName: "Total Marks", flex: 0.5 },
    { field: "duration", headerName: "Duration (mins)", flex: 0.5 },
    { field: "wrongAnswerDeduction", headerName: "Wrong Deduction", flex: 0.5 },
    {
      field: "unattemptedDeduction",
      headerName: "Unattempted Deduction",
      flex: 0.5,
    },
    { field: "totalQues", headerName: "Total Questions", flex: 0.5 },
    {
      field: "isFreeTest",
      headerName: "Free Test",
      flex: 0.5,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: ( params ) => new Date(params.row.createdAt).toLocaleString(),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Tests Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          label="Search Tests"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setContentModalOpen(true)}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Create New Test
        </Button>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredTests}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Box>
      )}
      <CreateTestModal
        open={contentModalOpen}
        handleClose={() => setContentModalOpen(false)}
        subjectId={subjectId}
        batchId={batchId}
      />
    </Box>
  );
};

export default TestsList;
