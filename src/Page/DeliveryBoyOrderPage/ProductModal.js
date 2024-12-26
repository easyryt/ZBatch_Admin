import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  borderRadius: "12px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
  marginBottom: theme.spacing(2),
  "& .MuiCardMedia-root": {
    width: "auto",
    height: "250px",
    borderRadius: "8px 8px 0 0",
  },
  "& .MuiCardContent-root": {
    padding: theme.spacing(2),
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.grey[500],
  zIndex: 1,
}));

const ProductModal = ({ open, onClose, productData }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ fontWeight: "bold", textAlign: "center", position: "relative" }}
      >
        Product Details
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <Grid container spacing={3}>
          {productData?.items?.map((product, index) => (
            <Grid item xs={12} sm={6} md={12} key={index}>
              <StyledCard>
                <CardMedia
                  component="img"
                  image={product.Product_image}
                  alt={product.Product_title}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {product.Product_title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: 1, textAlign: "center" }}
                  >
                    {product.Product_description}
                  </Typography>
                  <Box sx={{ marginTop: 2 }}>
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
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            marginTop: 4,
            padding: 2,
            background: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Order Summary
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Total Product Price:</strong> ₹
            {productData?.totalProductPrice}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Total GST:</strong> ₹{productData?.gstAmount}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Total Delivery Charges:</strong> ₹
            {productData?.totalDeliveryCharge}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Total Floor Charges:</strong> ₹
            {productData?.totalFloorCharge}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginTop: 2, color: "primary.main" }}
          >
            Grand Total: ₹{productData?.grandTotal}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
