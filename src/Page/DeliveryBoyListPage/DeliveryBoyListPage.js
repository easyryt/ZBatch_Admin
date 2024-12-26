import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.primary.main,
  fontSize: "2rem",
}));

const DeliveryBoyListPage = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    password: "",
    isDeleted: false,
  });

  const [filter, setFilter] = useState(false); // Filter for isDeleted=false

  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    // Function to update widthType based on window width
    const updateWidthType = () => {
      const width = window.innerWidth;
      if (width < 500) {
        setMobile(true);
      }
    };

    // Listen for window resize events
    window.addEventListener("resize", updateWidthType);

    // Set initial widthType
    updateWidthType();

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", updateWidthType);
    };
  }, []);

  // Columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 250 },
    { field: "updatedAt", headerName: "Updated At", width: 250 },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditClick(params.row)}
            sx={{
              borderRadius: "20px",
              padding: "8px 16px",
              fontWeight: 600,
              marginRight: "10px",
            }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleStatusClick(params.row.id)}
            sx={{ borderRadius: "20px", padding: "8px 16px", fontWeight: 600 }}
          >
            Status
          </Button>
        </>
      ),
    },
  ];

  const handleStatusClick = (id) => {
    navigate(`/dashboard/delivery-boy-order/${id}`);
  };

  // Define the fetchData function
  const fetchData = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.backend.pkpaniwala.com/admin/deliveryBoy/credentials/getAll?isDeleted=${filter}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
        }
      );

      if (response.data.status) {
        const formattedData = response.data.data.map((item) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          createdAt: new Date(item.createdAt).toLocaleString(),
          updatedAt: new Date(item.updatedAt).toLocaleString(),
        }));
        setDeliveryBoys(formattedData);
      } else {
        setError("Failed to fetch delivery boys");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call the fetchData function on mount or when filter changes
  }, [filter]);

  // Handle edit button click
  const handleEditClick = (row) => {
    setSelectedDeliveryBoy(row);
    setUpdatedData({
      name: row.name,
      email: row.email,
      password: "",
      isDeleted: row.isDeleted,
    });
    setOpenDialog(true);
  };

  // Handle the update form submission
  const handleUpdate = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setSnackbarSeverity("error");
      setSnackbarMessage("No token found");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(
        `https://www.backend.pkpaniwala.com/admin/deliveryBoy/credentials/update/${selectedDeliveryBoy.id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
        }
      );

      if (response.data.status) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Delivery boy updated successfully");
        setSnackbarOpen(true);
        // Re-fetch data after update
        fetchData();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to update delivery boy");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("An error occurred while updating");
      setSnackbarOpen(true);
    } finally {
      setOpenDialog(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Title variant="h4">Delivery Boy List</Title>

      <Button
        variant="outlined"
        onClick={() => setFilter(!filter)} // Toggle the filter between true/false
        sx={{ marginBottom: 2 }}
      >
        {filter ? "Show All" : "Show Active Delivery Boys"}
      </Button>
      {loading ? (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      ) : (
        <div>
          <Box sx={{ width: isMobile ? "300px" : "100%" }}>
            <DataGrid
              rows={deliveryBoys}
              columns={columns} // Ensure that columns is correctly passed here
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  fontWeight: 600,
                  color: "primary.main",
                },
                "& .MuiDataGrid-cell": {
                  fontWeight: 400,
                },
              }}
            />
          </Box>

          {/* Snackbar for success/error */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Dialog for Update */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Update Delivery Boy</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                fullWidth
                value={updatedData.name}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, name: e.target.value })
                }
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              <TextField
                label="Email"
                fullWidth
                value={updatedData.email}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, email: e.target.value })
                }
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              <TextField
                label="Password"
                type="text"
                fullWidth
                value={updatedData.password}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, password: e.target.value })
                }
                sx={{ marginBottom: 2 }}
                variant="outlined"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={updatedData.isDeleted}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        isDeleted: e.target.checked,
                      })
                    }
                    color="primary"
                  />
                }
                label="Is Deleted"
                sx={{ marginBottom: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDialog(false)}
                color="secondary"
                sx={{ borderRadius: "20px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                color="primary"
                sx={{ borderRadius: "20px" }}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Box>
  );
};

export default DeliveryBoyListPage;
