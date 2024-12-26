import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Styled Components
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.primary.main,
  fontSize: "2rem",
}));

const SearchBarWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

const Image = styled("img")({
  width: "30px",
  height: "auto",
  objectFit: "cover",
  borderRadius: "8px",
});

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [limit, setLimit] = useState(10); // Track number of items per page
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
    fetchOrders();
  }, [searchQuery, fromDate, toDate, currentPage, limit]);

  const fetchOrders = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setSnackbarMessage("Authorization token not found.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      let url = "https://www.backend.pkpaniwala.com/admin/order/all";
      const params = {
        page: currentPage, // Use current page state
        limit: limit, // Use limit state
      };
      if (searchQuery) params.orderID = searchQuery;
      if (fromDate) params.fromDate = fromDate; // Added fromDate
      if (toDate) params.toDate = toDate; // Added toDate

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        params,
      });

      if (response.data.status) {
        setOrders(response.data.data);
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError("Failed to fetch order history.");
      setSnackbarMessage("Failed to fetch order history.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1); // Reset to the first page when filters are reset
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const columns = [
    { field: "orderID", headerName: "Order ID", flex: 1 },
    {
      field: "Product_image",
      headerName: "Product Image",
      flex: 1,
      renderCell: (params) => <Image src={params.value} alt="Product" />,
    },
    { field: "totalItem", headerName: "Total Items", flex: 0.5 },
    {
      field: "grandTotal",
      headerName: "Grand Total",
      flex: 0.5,
      renderCell: (params) => `₹${params.value.toFixed(2)}`,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 1,
      renderCell: (params) =>
        params.value.cod ? "Cash on Delivery" : "Online Payment",
    },
    { field: "trackingDetails", headerName: "Tracking Details", flex: 1 },
    {
      field: "orderDate",
      headerName: "Order Date",
      flex: 1,
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
      field: "action",
      headerName: "Order Details",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(`/dashboard/order-details/${params.row.orderId}`)
          }
        >
          <ShoppingCartOutlinedIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Container>
      <Title variant="h4">Order History</Title>

      {/* Search and Date Range Filter */}
      <SearchBarWrapper>
        <TextField
          label="Search Orders"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Box>
        <Button variant="outlined" onClick={resetFilters}>
          Reset Filters
        </Button>
        {/* Pagination Controls */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            label="Items Per Page"
            type="number"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value, 10))}
            variant="outlined"
            sx={{ width: 150 }}
            InputProps={{
              inputProps: {
                min: 1,
              },
            }}
          />
        </Box>
      </SearchBarWrapper>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ padding: 2 }}>
            <DataGrid
              rows={orders}
              columns={columns}
              pageSize={limit}
              rowsPerPageOptions={[5, 10, 25]}
              pagination
              page={currentPage - 1} // Adjust for 0-based indexing
              onPageChange={(page) => setCurrentPage(page + 1)}
              loading={loading}
              disableSelectionOnClick
              getRowId={(row) => row.orderId} // Specify the unique id here
            />
          </Paper>
          <br />
          {/* Pagination Controls */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              variant="contained"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous Page
            </Button>
            <Typography variant="body1">Page {currentPage}</Typography>
            <Button variant="contained" onClick={handleNextPage}>
              Next Page
            </Button>
          </Box>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderHistoryPage;
