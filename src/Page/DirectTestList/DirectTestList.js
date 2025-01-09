import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import CreateDirectTestModal from "./CreateDirectTestModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DirectTestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const token = Cookies.get("token");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      const response = await axios.get(
        `https://npc-classes.onrender.com/admin/directTest/getAll?clsId=${id}`,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      setTests(response.data.data);
    } catch (err) {
      setError("Failed to fetch tests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleModalClose = () => setModalOpen(false);

  const handleUpdateTests = () => {
    fetchTests();
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "totalMarks", headerName: "Total Marks", flex: 1 },
    { field: "duration", headerName: "Duration (mins)", flex: 1 },
    {
      field: "wrongAnswerDeduction",
      headerName: "Wrong Answer Deduction",
      flex: 1,
    },
    {
      field: "unattemptedDeduction",
      headerName: "Unattempted Deduction",
      flex: 1,
    },
    {
      field: "isFreeTest",
      headerName: "Is Free",
      flex: 1,
      valueGetter: (params) => (params.row?.isFreeTest ? "Yes" : "No"),
    },
    { field: "price", headerName: "Price ($)", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      renderCell: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="tertiary"
          onClick={() => navigate(`/dashboard/question-list/${params.row._id}`)}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" gutterBottom>
          Test List
        </Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Create Test
        </Button>
      </Box>
      <br />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      ) : (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={tests}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
          />
        </Box>
      )}
      <CreateDirectTestModal
        open={modalOpen}
        handleClose={handleModalClose}
        setUpdate={handleUpdateTests}
      />
    </Box>
  );
};

export default DirectTestList;
