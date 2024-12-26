import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Cookies from "js-cookie";
import styles from "./CreateProduct.module.css"; // Import module-level CSS

// Custom Styled Components
const CustomForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  margin: "auto",
}));

const ImageUploadContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.grey[400]}`,
  padding: theme.spacing(3),
  borderRadius: "12px",
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.grey[100],
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

const ThumbnailContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "16px",
});

const Thumbnail = styled(Box)({
  position: "relative",
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
});

const ThumbnailImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const RemoveButton = styled(IconButton)({
  position: "absolute",
  top: "4px",
  right: "4px",
  backgroundColor: "#ffffff",
  padding: "4px",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});

const CreateProduct = () => {
  const [productImg, setProductImg] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [capacityVolume, setCapacityVolume] = useState("");
  const [bulkAvailable, setBulkAvailable] = useState(false);
  const [bulkMinQuantity, setBulkMinQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImg([...productImg, ...files]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...productImg];
    newImages.splice(index, 1);
    setProductImg(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setSnackbarMessage("Title is required.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      setSnackbarMessage("Authorization token not found.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    productImg.forEach((img) => formData.append("productImg", img));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("sellingPrice", sellingPrice);
    formData.append("mrp", mrp);
    formData.append("measurementUnit", measurementUnit);
    formData.append("capacityVolume", capacityVolume);
    formData.append("bulkAvailable", bulkAvailable);
    formData.append("bulkMinQuantity", bulkMinQuantity);

    try {
      setLoading(true);

      const response = await fetch(
        "https://www.backend.pkpaniwala.com/admin/product/create",
        {
          method: "POST",
          headers: {
            "x-admin-token": token,
          },
          body: formData, // Properly send FormData without setting Content-Type
        }
      );

      setLoading(false);

      if (response.ok) {
        setSnackbarMessage("Product created successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        resetForm();
      } else {
        const errorData = await response.json();
        setSnackbarMessage(
          `Failed to create product: ${errorData.message || "Unknown error"}`
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
      setSnackbarMessage("An error occurred while submitting the form.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setProductImg([]);
    setTitle("");
    setDescription("");
    setSellingPrice("");
    setMeasurementUnit("");
    setCapacityVolume("");
    setBulkAvailable(false);
    setBulkMinQuantity("");
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Product
      </Typography>
      <CustomForm>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <label htmlFor="productImg">
                <ImageUploadContainer>
                  <AddPhotoAlternateIcon fontSize="large" />
                  <Typography variant="body2">
                    {productImg.length > 0
                      ? `${productImg.length} image(s) selected`
                      : "Click to upload product images"}
                  </Typography>
                </ImageUploadContainer>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="productImg"
                />
              </label>
              <ThumbnailContainer>
                {productImg.map((img, index) => (
                  <Thumbnail key={index}>
                    <ThumbnailImage src={URL.createObjectURL(img)} />
                    <RemoveButton onClick={() => handleRemoveImage(index)}>
                      <DeleteIcon fontSize="small" />
                    </RemoveButton>
                  </Thumbnail>
                ))}
              </ThumbnailContainer>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Product Title"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="MRP"
                type="number"
                fullWidth
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Selling Price"
                type="number"
                fullWidth
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                label="Measurement Unit"
                fullWidth
                required
                value={measurementUnit}
                onChange={(e) => setMeasurementUnit(e.target.value)}
              >
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Capacity Volume"
                type="number"
                fullWidth
                required
                value={capacityVolume}
                onChange={(e) => setCapacityVolume(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bulkAvailable}
                    onChange={(e) => setBulkAvailable(e.target.checked)}
                  />
                }
                label="Bulk Available"
              />
            </Grid>

            {bulkAvailable && (
              <Grid item xs={6}>
                <TextField
                  label="Minimum Bulk Quantity"
                  type="number"
                  fullWidth
                  required
                  value={bulkMinQuantity}
                  onChange={(e) => setBulkMinQuantity(e.target.value)}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CustomForm>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProduct;
