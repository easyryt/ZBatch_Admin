import React, { useState } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Cookies from "js-cookie"; // For managing cookies
import axios from "axios"; // For API requests
import styles from "./CreateSubjectModal.module.css"; // Optional module CSS for styling

const CreateSubjectModal = ({ open, onClose, setUpdate }) => {
  const [newSubject, setNewSubject] = useState({ subjectName: "" });
  const [iconFile, setIconFile] = useState(null); // For storing the selected file
  const [loading, setLoading] = useState(false); // For button loading state
  const [error, setError] = useState(null); // For displaying errors (optional)

  // Handle input change for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setIconFile(e.target.files[0]);
  };

  // Handle Create Subject
  const handleCreateSubject = async () => {
    const token = Cookies.get("token"); // Retrieve token from cookies
    if (!token) {
      alert("Authentication token not found. Please log in.");
      return;
    }

    if (!newSubject.subjectName || !iconFile) {
      alert("Please fill in all fields and upload an icon.");
      return;
    }

    const formData = new FormData();
    formData.append("subjectName", newSubject.subjectName);
    formData.append("icon", iconFile); // Add the selected file to FormData

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post(
        "https://zbatch.onrender.com/admin/subjects/create", // API endpoint
        formData,
        {
            headers: {
              "x-admin-token": token,
              "Content-Type": "multipart/form-data", // Set content type for file upload
            },
          }
      );
      setNewSubject({ subjectName: "" }); // Reset form
      setIconFile(null); // Clear the file input
      setUpdate(true)
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={styles.modal}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              Create New Subject
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            margin="normal"
            label="Subject Name"
            name="subjectName"
            value={newSubject.subjectName}
            onChange={handleInputChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ margin: "16px 0" }}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateSubject}
            fullWidth
            disabled={loading}
            className={styles.createButton}
          >
            {loading ? "Creating..." : "Create Subject"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateSubjectModal;
