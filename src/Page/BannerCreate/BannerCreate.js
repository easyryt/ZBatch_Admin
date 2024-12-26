import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Cookies from "js-cookie";

const BannerCreate = () => {
  const [bannerImgs, setBannerImgs] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle Image Upload and Preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setBannerImgs((prevImages) => [...prevImages, ...newImages]);
  };

  // Remove a specific image
  const handleRemoveImage = (index) => {
    setBannerImgs((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (bannerImgs.length === 0) {
      setError("Please upload at least one banner image.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");
      const formData = new FormData();

      bannerImgs.forEach((img, index) => {
        formData.append(`bannerImg`, img.file);
      });
      formData.append("isActive", isActive);

      await axios.post(
        "https://www.backend.pkpaniwala.com/admin/banner/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-admin-token": token,
          },
        }
      );

      setSuccess("Banners created successfully!");
      setBannerImgs([]);
      setIsActive(false);
    } catch (err) {
      setError("Failed to create banners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Inline styles
  const styles = {
    container: {
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    imageUpload: {
      marginBottom: "20px",
    },
    label: {
      fontSize: "16px",
      fontWeight: "500",
      marginBottom: "8px",
    },
    previewContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "10px",
    },
    previewImageWrapper: {
      position: "relative",
      width: "120px",
      height: "120px",
    },
    previewImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "8px",
    },
    removeButton: {
      position: "absolute",
      top: "5px",
      right: "5px",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    switch: {
      marginBottom: "20px",
    },
    submitButton: {
      backgroundColor: "#3f51b5",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "600",
      padding: "12px 20px",
      borderRadius: "4px",
      textTransform: "none",
      "&:disabled": {
        backgroundColor: "#b0bec5",
      },
    },
    error: {
      marginTop: "10px",
      color: "red",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
    },
    success: {
      marginTop: "10px",
      color: "green",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
    },
  };

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.heading}>Create New Banners</Typography>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Upload Images */}
        <Box sx={styles.imageUpload}>
          <Typography sx={styles.label}>Upload Banner Images</Typography>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {bannerImgs.length > 0 && (
            <Box sx={styles.previewContainer}>
              {bannerImgs.map((img, index) => (
                <Box key={index} sx={styles.previewImageWrapper}>
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    style={styles.previewImage}
                  />
                  <IconButton
                    sx={styles.removeButton}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Active Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="Active"
          sx={styles.switch}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          sx={styles.submitButton}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Create Banners"}
        </Button>

        {/* Error/Success Messages */}
        {error && <Typography sx={styles.error}>{error}</Typography>}
        {success && <Typography sx={styles.success}>{success}</Typography>}
      </form>
    </Box>
  );
};

export default BannerCreate;
