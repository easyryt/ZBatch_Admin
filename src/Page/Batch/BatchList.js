import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { id } = useParams();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setSnackbar({
        open: true,
        message: "Authentication token is missing",
        severity: "error",
      });
      return;
    }
    try {
      const response = await axios.get(
        `https://npc-classes.onrender.com/admin/course/batches/getAll/${id}`,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );

      if (response.data.status) {
        setBatches(response.data.data);
        setFilteredBatches(response.data.data);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch batches",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = batches.filter(
      (batch) =>
        batch.title.toLowerCase().includes(query) ||
        batch.board.toLowerCase().includes(query) ||
        batch.clsName.toLowerCase().includes(query)
    );
    setFilteredBatches(filtered);
  };

  const columns = [
    {
      field: "thumbnailImg",
      headerName: "Thumbnail",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.thumbnailImg.url}
          alt={params.row.title}
          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
        />
      ),
    },
    { field: "title", headerName: "Title", width: 200 },
    { field: "clsName", headerName: "Class Name", width: 100 },
    { field: "board", headerName: "Board", width: 100 },
    {
      field: "duration",
      headerName: "Duration",
      width: 200,
      renderCell: (params) => (
        <Typography>{`${params.row.duration.startDate} - ${params.row.duration.endDate}`}</Typography>
      ),
    },
    {
      field: "isFree",
      headerName: "Is Free?",
      width: 100,
      renderCell: (params) => (
        <Typography>{params.row.isFree ? "Yes" : "No"}</Typography>
      ),
    },
    { field: "price", headerName: "Price", width: 100 },
    { field: "mrp", headerName: "MRP", width: 100 },
    { field: "discount", headerName: "Discount", width: 100 },
    { field: "isbatchActive", headerName: "isbatchActive", width: 100 },
    {
      field: "batchTag",
      headerName: "Batch Tag",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
  ];

  return (
    <Box
      sx={{ padding: "24px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Batch List
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <TextField
          label="Search Batches"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          sx={{ maxWidth: "400px" }}
        />
        <Button
          variant="contained"
          onClick={fetchBatches}
          sx={{ marginLeft: "16px" }}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredBatches.map((batch) => ({ ...batch, id: batch._id }))}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BatchList;
