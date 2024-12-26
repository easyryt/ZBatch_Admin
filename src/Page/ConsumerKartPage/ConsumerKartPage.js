import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useMediaQuery } from "@mui/material";

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f4f7fc",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "28px",
  color: "#333",
  marginBottom: theme.spacing(4),
  textAlign: "center",
}));

const ProductCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: "8px",
  padding: theme.spacing(2),
  backgroundColor: "#fff",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[12],
  },
}));

const ProductImage = styled("img")(({ theme }) => ({
  width: "100%",
  borderRadius: "8px",
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const InfoText = styled(Typography)(({ theme }) => ({
  color: "#555",
  fontSize: "14px",
}));

const PricingDetails = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  width: "100%",
  maxWidth: "400px",
  boxShadow: theme.shadows[3],
  borderRadius: "8px",
  backgroundColor: "#fff",
}));

const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(1),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 4),
  fontSize: "16px",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const LoadingWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "60vh",
}));

const NoDataText = styled(Typography)(({ theme }) => ({
  color: "#666",
  fontSize: "18px",
  textAlign: "center",
}));

const ConsumerKartPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { id } = useParams();

  useEffect(() => {
    const fetchConsumerKart = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setSnackbarMessage("Authorization token not found.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      try {
        const response = await fetch(
          `https://www.backend.pkpaniwala.com/admin/abandonKart/consumerKart/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": token,
            },
          }
        );
        const result = await response.json();

        if (result.status) {
          setData(result.data);
        } else {
          setSnackbarMessage(result.message || "Failed to fetch data.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("An error occurred while fetching data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConsumerKart();
  }, [id]);

  // Display Loading Spinner
  if (loading) {
    return (
      <LoadingWrapper>
        <CircularProgress size={50} color="primary" />
      </LoadingWrapper>
    );
  }

  // If no data is available
  if (!data || !data.products || data.products.length === 0) {
    return <NoDataText>No products in the cart.</NoDataText>;
  }

  return (
    <PageContainer>
      <Title>Your Cart</Title>

      <Grid container spacing={3} justifyContent="center">
        {/* Product Image and Info */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            {data.products.map((product) => (
              <Grid item key={product.Product_id} xs={12}>
                <ProductCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <ProductImage
                        src={product.Product_image}
                        alt={product.Product_title}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <CardContent>
                        <Typography variant="h6">
                          {product.Product_title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {product.Product_description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Capacity:</strong>{" "}
                          {product.Product_capacityVolume}{" "}
                          {product.Product_measurementUnit}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          <strong>Product Bulk:</strong>{" "}
                          {product.Product_bulk ? "yes" : "No"}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          <strong>Floor No:</strong> {product.floorNo}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          <strong>Floor Per Bottle Charge:</strong>{" "}
                          {product.floorPerBottleCharge}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          <strong>Floor Total Charges :</strong>{" "}
                          {product.floorTotalCharges}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          <strong>Quantity:</strong> {product.Product_qantity}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Price:</strong> ₹{product.Product_Price}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Total:</strong> ₹{product.Product_total}
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Price Summary */}
        <Grid item xs={12} md={4}>
          <PricingDetails>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Pricing Summary
            </Typography>
            <Divider />
            <SummaryItem>
              <Typography variant="body2">Total Item(s):</Typography>
              <Typography variant="body2">{data.totalItem}</Typography>
            </SummaryItem>
            <SummaryItem>
              <Typography variant="body2">Total Product Price:</Typography>
              <Typography variant="body2">₹{data.totalProductPrice}</Typography>
            </SummaryItem>
            <SummaryItem>
              <Typography variant="body2">GST (5%):</Typography>
              <Typography variant="body2">₹{data.gstAmount}</Typography>
            </SummaryItem>
            <SummaryItem>
              <Typography variant="body2">Delivery Charges:</Typography>
              <Typography variant="body2">
                ₹{data.totalDeliveryCharge}
              </Typography>
            </SummaryItem>
            <SummaryItem>
              <Typography variant="body2">Floor Charges:</Typography>
              <Typography variant="body2">₹{data.totalFloorCharge}</Typography>
            </SummaryItem>
            <Divider />
            <SummaryItem>
              <Typography variant="body2" color="textPrimary" fontWeight="bold">
                Grand Total:
              </Typography>
              <Typography variant="body2" color="textPrimary" fontWeight="bold">
                ₹{data.grandTotal}
              </Typography>
            </SummaryItem>

            {/* Proceed to Checkout */}
            <ActionButton
              variant="contained"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
              <LocalShippingIcon sx={{ ml: 1 }} />
            </ActionButton>
          </PricingDetails>
        </Grid>
      </Grid>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ConsumerKartPage;
