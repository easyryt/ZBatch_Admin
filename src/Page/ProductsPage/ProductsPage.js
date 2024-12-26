import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { Search, FilterList, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkFilter, setBulkFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        "https://www.backend.pkpaniwala.com/public/product/products?bulkAvailable=true&bulkAvailable=false"
      )
      .then((response) => {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterProducts(e.target.value, bulkFilter);
  };

  const handleBulkFilter = (e) => {
    setBulkFilter(e.target.value);
    filterProducts(searchQuery, e.target.value);
  };

  const filterProducts = (searchQuery, bulkFilter) => {
    let filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (bulkFilter) {
      filtered = filtered.filter(
        (product) => product.bulkAvailable === (bulkFilter === "true")
      );
    }
    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = (productId) => {
    setOpenDialog(true);
    setSelectedProduct(productId);
  };

  const confirmDelete = () => {
    const token = Cookies.get("token");
    if (selectedProduct) {
      axios
        .delete(
          `https://www.backend.pkpaniwala.com/admin/product/delete/${selectedProduct}`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        )
        .then(() => {
          setSnackbarMessage("Product deleted successfully");
          setOpenSnackbar(true);
          setProducts((prev) =>
            prev.filter((product) => product._id !== selectedProduct)
          );
          setFilteredProducts((prev) =>
            prev.filter((product) => product._id !== selectedProduct)
          );
        })
        .catch((error) => {
          setSnackbarMessage("Error deleting product");
          setOpenSnackbar(true);
        });
    }
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: "bold" }}>
        Products
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ flexGrow: 1, marginRight: 2 }}
          InputProps={{
            startAdornment: <Search sx={{ color: "gray", marginRight: 1 }} />,
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Bulk Available</InputLabel>
          <Select
            value={bulkFilter}
            onChange={handleBulkFilter}
            label="Bulk Available"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ width: "100%", textAlign: "center", marginTop: 5 }}
            >
              No products found
            </Typography>
          ) : (
            filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card
                  sx={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.productImg[0]?.url}
                    alt={product.title}
                    sx={{
                      borderRadius: "12px 12px 0 0",
                      height: "150px", // Set a smaller height
                      width: "100%", // Set width to fit the container
                      objectFit: "contain", // Maintain the aspect ratio without cropping
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {product.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: 1 }}
                    >
                      {product.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ marginTop: 1 }}
                    >
                      MRP: ₹{product.mrp}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ marginTop: 1 }}
                    >
                      Price: ₹{product.sellingPrice}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: 1 }}
                    >
                      {product.bulkAvailable
                        ? `Min Quantity: ${product.bulkMinQuantity}`
                        : "Single purchase"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ marginRight: 1 }}
                        startIcon={<Edit />}
                        onClick={() =>
                          navigate(`/dashboard/update-product/${product._id}`)
                        } // Correct the dynamic ID route
                      >
                        Edit
                      </Button>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ProductsPage;
