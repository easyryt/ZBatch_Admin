import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const UpdateTitleModal = ({ open, handleClose, setUpdate, selectedTitle }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  // Prefill the title field when selectedTitle changes
  useEffect(() => {
    if (selectedTitle) {
      setTitle(selectedTitle.title || "");
    }
  }, [selectedTitle]);

  const handleUpdateTitle = async () => {
    if (!title.trim()) {
      alert("Title cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `https://zbatch.onrender.com/admin/materials/title/subjects/content/updateTitle/${selectedTitle._id}`,
        { title },
        {
          headers: { "x-admin-token": token },
        }
      );

      if (response.data.status) {
        setUpdate((prev) => !prev); // Trigger a refresh
        handleClose(); // Close the modal
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating title:", error);
      alert("An error occurred while updating the title. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="update-title-modal"
      aria-describedby="update-title-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="update-title-modal" variant="h6" gutterBottom>
          Update Title
        </Typography>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateTitle}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateTitleModal;
