import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { DataGrid } from "@mui/x-data-grid";

const OrderDetails = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { id } = useParams();
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [verifyDeliveryModalOpen, setVerifyDeliveryModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
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

  // Open/Close Modals
  const openUpdateStatusModal = () => setUpdateStatusModalOpen(true);
  const closeUpdateStatusModal = () => setUpdateStatusModalOpen(false);
  const openVerifyDeliveryModal = () => setVerifyDeliveryModalOpen(true);
  const closeVerifyDeliveryModal = () => setVerifyDeliveryModalOpen(false);

  // Fetch order data from API
  useEffect(() => {
    const fetchOrderData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setSnackbarMessage("Authorization token not found.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `https://www.backend.pkpaniwala.com/admin/order/particular/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": token,
            },
          }
        );
        setOrderData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order data");
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the product data based on search query
  const filteredItems = orderData?.productData?.items.filter(
    (item) =>
      item.Product_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Product_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Get the payment method display value
  const getPaymentMethod = () => {
    const paymentMethod = orderData?.paymentMethod;
    if (!paymentMethod) return "";
    if (typeof paymentMethod === "object") {
      return `${paymentMethod.cod ? "COD" : ""} ${
        paymentMethod.online ? "Online" : ""
      }`.trim();
    }
    return paymentMethod; // In case it's a string
  };

  const handleUpdateStatusSubmit = async () => {
    const token = Cookies.get("token");
    try {
      // Build payload dynamically based on status
      const payload = {
        orderStatus: orderStatus,
      };

      // Include the reason only if the status is 'Cancelled'
      if (orderStatus === "Cancelled") {
        payload.reason = cancellationReason;
      }

      await axios.put(
        `https://www.backend.pkpaniwala.com/admin/order/updateStatus/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
        }
      );

      setSnackbarMessage("Order status updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      closeUpdateStatusModal();
    } catch (error) {
      setSnackbarMessage("Failed to update order status.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleVerifyDeliverySubmit = async () => {
    const token = Cookies.get("token");
    try {
      await axios.put(
        `https://www.backend.pkpaniwala.com/admin/order/verifyDelivery/${id}`,
        { otp },
        {
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
        }
      );
      setSnackbarMessage("Delivery verified successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      closeVerifyDeliveryModal();
    } catch (error) {
      setSnackbarMessage("Failed to verify delivery.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Define columns for DataGrid
  const columns = [
    {
      field: "Product_image",
      headerName: "Product",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={params.row.Product_image}
            alt={params.row.Product_title}
            style={{
              width: 50,
              height: 50,
              borderRadius: "8px",
              marginRight: 10,
            }}
          />
          {params.row.Product_title}
        </Box>
      ),
    },
    { field: "Product_description", headerName: "Description", width: 250 },
    { field: "Product_Price", headerName: "Price", width: 130 },
    { field: "Product_qantity", headerName: "Quantity", width: 130 },
    {
      field: "floorPerBottleCharge",
      headerName: "Floor Per Bottle Charge",
      width: 150,
    },
    {
      field: "floorTotalCharges",
      headerName: "Floor Total Charges",
      width: 180,
    },
    { field: "Product_total", headerName: "Total", width: 130 },
  ];

  // Define columns for Payment Summary DataGrid
  const paymentSummaryColumns = [
    { field: "label", headerName: "Item", width: 200 },
    { field: "value", headerName: "Amount", width: 200 },
  ];

  // Define rows for Payment Summary DataGrid
  const paymentSummaryRows = [
    {
      id: 1,
      label: "Total Items",
      value: orderData?.productData?.totalItem || "N/A",
    },
    {
      id: 2,
      label: "Total Product Price",
      value: `₹${orderData?.productData?.totalProductPrice || 0}`,
    },
    {
      id: 3,
      label: "Coupon Code",
      value: `${orderData?.productData?.couponCode || 0}`,
    },
    {
      id: 4,
      label: "Coupon Discount Per (%)",
      value: `${orderData?.productData?.couponDiscountPer || 0}`,
    },
    {
      id: 5,
      label: "Price After Coupon",
      value: `₹${orderData?.productData?.priceAfterCoupon || 0}`,
    },
    {
      id: 6,
      label: "GST Amount",
      value: `₹${orderData?.productData?.gstAmount || 0}`,
    },
    {
      id: 7,
      label: "Delivery Charge",
      value: `₹${orderData?.productData?.totalDeliveryCharge || 0}`,
    },
    {
      id: 8,
      label: "Total Floor Charge",
      value: `₹${orderData?.productData?.totalFloorCharge || 0}`,
    },
    {
      id: 9,
      label: "Grand Total",
      value: `₹${orderData?.productData?.grandTotal || 0}`,
    },
    {
      id: 10,
      label: "Payment Method",
      value: getPaymentMethod() || "N/A",
    },
  ];


    // Define columns for Tracking Information DataGrid
    const trackingColumns = [
      { field: "status", headerName: "Status", width: 300 },
      { field: "date", headerName: "Date", width: 250 },
    ];
  
    // Define rows for Tracking Information DataGrid
    const trackingRows = orderData?.trackingDetails?.map((tracking, index) => ({
      id: index + 1,
      status: tracking.trackingStatus,
      date: new Date(tracking.trackingDate).toLocaleString(),
    })) || [];

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={openUpdateStatusModal}
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          Update Order Status
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={openVerifyDeliveryModal}
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          Verify Delivery
        </Button>
      </Box>

      <br />
      {/* Snackbar for Error/Info Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{ fontSize: "1rem", fontWeight: 500 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {loading ? (
        <CircularProgress
          sx={{ display: "block", margin: "auto", color: "#1976d2" }}
        />
      ) : error ? (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" sx={{ fontSize: "1rem", fontWeight: 500 }}>
            {error}
          </Alert>
        </Snackbar>
      ) : (
        <>
          {/* Order Summary Section */}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  boxShadow: 6,
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600 }}
                    gutterBottom
                  >
                    Order Summary
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Order ID: {orderData._id}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Order Date:{" "}
                    {new Date(orderData.orderDate).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Status:{" "}
                    {
                      orderData.trackingDetails?.[
                        orderData.trackingDetails.length - 1
                      ]?.trackingStatus
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  boxShadow: 6,
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600 }}
                    gutterBottom
                  >
                    Shipping Information
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {orderData.shippingInfo.fullName},{" "}
                    {orderData.shippingInfo.houseNo},{" "}
                    {orderData.shippingInfo.StreetNo}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {orderData.shippingInfo.landMark},{" "}
                    {orderData.shippingInfo.villageOrArea},{" "}
                    {orderData.shippingInfo.pincode}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Phone: {orderData.shippingInfo.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Alternate Phone: {orderData.shippingInfo.altPhone}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <br/>
          <Grid container>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#333333" }}
              gutterBottom
            >
              Products
            </Typography>
            <TextField
              label="Search Products"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "gray" }} />,
              }}
              sx={{
                marginBottom: 2,
                "& .MuiInputLabel-root": { fontWeight: 600 },
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
            <Box sx={{ width: isMobile ? "300px" : "100%" }}>
              <DataGrid
                rows={filteredItems || []} // Empty array if no data
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getRowId={(row) => row.Product_id} // Use Product_id as unique identifier
              />
            </Box>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#333333" }}
              gutterBottom
            >
              Payment Summary
            </Typography>

            <Box sx={{ width: isMobile ? "300px" : "100%" }}>
              <DataGrid
                rows={paymentSummaryRows}
                columns={paymentSummaryColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeader": {
                    fontWeight: 600,
                    color: "#333333",
                  },
                  "& .MuiDataGrid-cell": {
                    fontWeight: 500,
                    color: "#333333",
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#333333" }}
              gutterBottom
            >
              Tracking Details
            </Typography>

            <Box sx={{ width: isMobile ? "300px" : "100%" }}>
              <DataGrid
                rows={trackingRows}
                columns={trackingColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeader": {
                    fontWeight: 600,
                    color: "#333333",
                  },
                  "& .MuiDataGrid-cell": {
                    fontWeight: 500,
                    color: "#333333",
                  },
                }}
              />
            </Box>
          </Box>
        </>
      )}
      {/* Update Order Status Modal */}
      <Modal
        open={updateStatusModalOpen}
        onClose={closeUpdateStatusModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={updateStatusModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 4,
              boxShadow: 24,
              width: 400,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Update Order Status
            </Typography>
            <TextField
              select
              variant="outlined"
              fullWidth
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{ mb: 2 }}
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </TextField>

            {orderStatus === "Cancelled" && (
              <TextField
                label="Reason for Cancellation"
                variant="outlined"
                fullWidth
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleUpdateStatusSubmit}
              disabled={
                orderStatus === "Cancelled" && cancellationReason.trim() === ""
              }
            >
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Verify Delivery Modal */}
      <Modal
        open={verifyDeliveryModalOpen}
        onClose={closeVerifyDeliveryModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={verifyDeliveryModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 4,
              boxShadow: 24,
              width: 400,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Verify Delivery
            </Typography>
            <TextField
              label="OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerifyDeliverySubmit}
            >
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default OrderDetails;
