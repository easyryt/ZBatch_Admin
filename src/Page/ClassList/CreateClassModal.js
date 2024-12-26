import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import styles from "./CreateClassModal.module.css"; // Module-level CSS

const CreateClassModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    clsName: "",
    clsNum: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // POST request to create class
    try {
      const response = await fetch("http://localhost:3001/admin/classes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Class created successfully!");
        handleClose();
      } else {
        alert("Failed to create class. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalBox}>
        <Typography variant="h5" className={styles.title}>
          Create a New Class
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Class Name */}
          <TextField
            label="Class Name"
            name="clsName"
            value={formData.clsName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          {/* Class Number */}
          <TextField
            label="Class Number"
            name="clsNum"
            type="number"
            value={formData.clsNum}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={styles.submitButton}
          >
            Create Class
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateClassModal;
