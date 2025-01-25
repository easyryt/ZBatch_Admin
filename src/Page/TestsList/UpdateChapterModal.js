import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const UpdateChapterModal = ({ open, onClose, chapter, refreshChapters }) => {
  const [chapterName, setChapterName] = useState(chapter.chapterName || "");
  const [chapterNo, setChapterNo] = useState(chapter.chapterNo || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `https://zbatch.onrender.com/admin/directTest/subjects/chapter/update/${chapter._id}`,
        { chapterName, chapterNo },
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );

      if (response.data.status) {
        onClose();
        refreshChapters();
      } else {
        setError(response.data.message || "Failed to update chapter.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update chapter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Update Chapter
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Chapter Name"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chapter No"
          type="number"
          value={chapterNo}
          onChange={(e) => setChapterNo(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateChapterModal;
