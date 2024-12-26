import React, { useState, useEffect } from "react";
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
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UpdateProduct.module.css";

// Custom Styled Components
const CustomForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
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

const UpdateProduct = () => {
  const [productImg, setProductImg] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [capacityVolume, setCapacityVolume] = useState("");
  const [bulkAvailable, setBulkAvailable] = useState(false);
  const [bulkMinQuantity, setBulkMinQuantity] = useState("");
  const [loading, setLoading] = useState(true); // Initially set to true for loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { id } = useParams(); // Get product id from the URL
  const navigate = useNavigate(); // To navigate after successful update
  const [showImages, setImages] = useState([]);

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProductData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setSnackbarMessage("Authorization token not found.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        navigate("/login"); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch(
          `https://www.backend.pkpaniwala.com/public/product/singleProduct/${id}`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const product = data.data;

          // Populate form with fetched data
          setTitle(product.title || "");
          setDescription(product.description || "");
          setSellingPrice(product.sellingPrice || "");
          setMrp(product.mrp || "");
          setMeasurementUnit(product.measurementUnit || "");
          setCapacityVolume(product.capacityVolume || "");
          setBulkAvailable(product.bulkAvailable);
          setBulkMinQuantity(product.bulkMinQuantity || "");
          setImages(product.productImg || []); // Assuming productImg is an array of image URLs, if available
        } else {
          setSnackbarMessage("Failed to fetch product data.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setSnackbarMessage(
          "An error occurred while fetching the product data."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false); // Set loading to false when fetch is complete
      }
    };

    fetchProductData();
  }, [id, navigate]);

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
      setSnackbarOpen(true);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      setSnackbarMessage("Authorization token not found.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    productImg.forEach((img) => formData.append("productImg", img));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("sellingPrice", sellingPrice);
    formData.append("mrp",mrp);
    formData.append("measurementUnit", measurementUnit);
    formData.append("capacityVolume", capacityVolume);
    formData.append("bulkAvailable", bulkAvailable);
    formData.append("bulkMinQuantity", bulkMinQuantity);

    try {
      setLoading(true);

      const response = await fetch(
        `https://www.backend.pkpaniwala.com/admin/product/update/${id}`,
        {
          method: "PUT",
          headers: {
            "x-admin-token": token,
          },
          body: formData, // Properly send FormData without setting Content-Type
        }
      );

      setLoading(false);

      if (response.ok) {
        setSnackbarMessage("Product updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/dashboard/all-product"); // Redirect to the products page after success
      } else {
        const errorData = await response.json();
        setSnackbarMessage(
          `Failed to update product: ${errorData.message || "Unknown error"}`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
      setSnackbarMessage("An error occurred while submitting the form.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
        Update Product
      </Typography>
      <CustomForm>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {showImages.map((img) => (
                <div>
                  <img
                    src={img.url}
                    alt="Product Image"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              ))}
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
                label="Product Description"
                fullWidth
                multiline
                minRows={4}
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

            <Grid item xs={12} sm={6}>
              <TextField
                label="Selling Price"
                type="number"
                fullWidth
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Measurement Unit"
                fullWidth
                required
                value={measurementUnit}
                onChange={(e) => setMeasurementUnit(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Capacity/Volume"
                type="number"
                fullWidth
                required
                value={capacityVolume}
                onChange={(e) => setCapacityVolume(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bulkAvailable}
                    onChange={() => setBulkAvailable(!bulkAvailable)}
                    color="primary"
                  />
                }
                label="Available in Bulk"
              />
              {bulkAvailable && (
                <TextField
                  label="Bulk Minimum Quantity"
                  type="number"
                  fullWidth
                  value={bulkMinQuantity}
                  onChange={(e) => setBulkMinQuantity(e.target.value)}
                />
              )}
            </Grid>

            <Grid item xs={12} className={styles.buttons}>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ margin: "5px" }}
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "5px" }}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Product"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CustomForm>

      {/* Snackbar for notifications */}
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
    </Box>
  );
};

export default UpdateProduct;
