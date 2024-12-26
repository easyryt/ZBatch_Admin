import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import Cookies from "js-cookie";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.primary.main,
}));

const DeliveryChargesPage = () => {
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editingCharge, setEditingCharge] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDeliveryCharge, setNewDeliveryCharge] = useState("");
  const [isBulkFilter, setIsBulkFilter] = useState(""); // Changed to support "All" option
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChargeToDelete, setSelectedChargeToDelete] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchDeliveryCharges();
  }, [isBulkFilter]);

  const fetchDeliveryCharges = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setSnackbarMessage("Authorization token not found.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      const url = isBulkFilter
        ? `https://www.backend.pkpaniwala.com/admin/deliveryCharge/getAll?isBulk=${isBulkFilter}`
        : "https://www.backend.pkpaniwala.com/admin/deliveryCharge/getAll";

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
      });

      if (response.data.status) {
        setDeliveryCharges(response.data.data);
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError("Failed to fetch delivery charges");
      setSnackbarMessage("Failed to fetch delivery charges");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (charge) => {
    setSelectedChargeToDelete(charge);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.delete(
        `https://www.backend.pkpaniwala.com/admin/deliveryCharge/delete/${selectedChargeToDelete._id}`,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      if (response.data.status) {
        setSnackbarMessage("Delivery charge deleted successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setDeliveryCharges(
          deliveryCharges.filter(
            (charge) => charge._id !== selectedChargeToDelete._id
          )
        );
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Failed to delete delivery charge.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEdit = (charge) => {
    setEditingCharge(charge);
    setNewDeliveryCharge(charge.deliveryCharge);
    setOpenDialog(true);
  };

  const handleSaveEdit = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.put(
        `https://www.backend.pkpaniwala.com/admin/deliveryCharge/update/${editingCharge._id}`,
        { deliveryCharge: newDeliveryCharge },
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      if (response.data.status) {
        setSnackbarMessage("Delivery charge updated successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setDeliveryCharges(
          deliveryCharges.map((charge) =>
            charge._id === editingCharge._id
              ? { ...charge, deliveryCharge: newDeliveryCharge }
              : charge
          )
        );
        setOpenDialog(false);
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Failed to update delivery charge.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Define columns for DataGrid
  const columns = [
    { field: "deliveryCharge", headerName: "Delivery Charge", width: 180 },
    { field: "isBulk", headerName: "Is Bulk?", width: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      valueGetter: (params) => {
        const date = new Date(params); // Correct usage of params.value
        if (isNaN(date)) {
          return "Invalid Date";
        }
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 180,
      valueGetter: (params) => {
        const date = new Date(params); // Correct usage of params.value
        if (isNaN(date)) {
          return "Invalid Date";
        }
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              onClick={() =>
                navigate(
                  `/dashboard/delivery-update-charges/${params.row.isBulk}`
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Title variant="h4">Delivery Charges</Title>

      {/* Filter Section */}
      <FormControl fullWidth>
        <InputLabel>Filter by Is Bulk</InputLabel>
        <Select
          value={isBulkFilter}
          onChange={(e) => setIsBulkFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <br />
      {loading ? (
        <Box display="flex" justifyContent="center" padding={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: isMobile ? "300px" : "100%" }}>
          <DataGrid
            rows={deliveryCharges}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id} // Specify the unique identifier field
            sx={{
              width: "100%",
              "& .MuiDataGrid-columnHeader": {
                textAlign: "center",
              },
              "& .MuiDataGrid-cell": {
                textAlign: "center",
              },
            }}
          />
        </Box>
      )}

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this delivery charge?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Delivery Charge</DialogTitle>
        <DialogContent>
          <TextField
            label="New Delivery Charge"
            value={newDeliveryCharge}
            onChange={(e) => setNewDeliveryCharge(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<CancelIcon />}
            onClick={() => setOpenDialog(false)}
            color="default"
          >
            Cancel
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={handleSaveEdit}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeliveryChargesPage;
