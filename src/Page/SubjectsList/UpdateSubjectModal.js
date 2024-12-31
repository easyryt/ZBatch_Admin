import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const UpdateSubjectModal = ({ open, onClose, setUpdate, subject }) => {
  const [formData, setFormData] = useState({
    subjectName: "",
    icon: null,
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill the form when the selected subject changes
  useEffect(() => {
    if (subject) {
      setFormData({
        subjectName: subject.subjectName || "",
        icon: null, // Icon is not pre-filled
      });
    }
  }, [subject]);

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (event) => {
    setFormData({ ...formData, icon: event.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const token = Cookies.get("token");
    const formDataToSend = new FormData();
    formDataToSend.append("subjectName", formData.subjectName);
    if (formData.icon) {
      formDataToSend.append("icon", formData.icon);
    }

    try {
      const response = await axios.put(
        `https://npc-classes.onrender.com/admin/subjects/update/${subject._id}`,
        formDataToSend,
        {
          headers: {
            "x-admin-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        setUpdate(true); // Trigger re-fetching of the subjects list
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating subject:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Subject</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Subject Name */}
          <TextField
            label="Subject Name"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            required
          />
          {/* Icon Upload */}
          <Button variant="outlined" component="label">
            Upload Icon
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {formData.icon && (
            <Box>
              <Typography variant="body2">
                Selected file: {formData.icon.name}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateSubjectModal;
