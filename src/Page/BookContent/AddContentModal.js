import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const AddContentModal = ({ open, onClose,setUpdate }) => {
  const [newContent, setNewContent] = useState({
    title: "",
    pdf: null,
    medium: "",
    chapter: "",
  });
const {id} = useParams()
  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    const formData = new FormData();
    formData.append("title", newContent.title);
    formData.append("pdf", newContent.pdf);
    formData.append("medium", newContent.medium);
    formData.append("chapter", newContent.chapter);

    try {
      const response = await axios.post(
        `https://npc-classes.onrender.com/admin/materials/book/content/create/${id}`,
        formData,
        {
          headers: {
            "x-admin-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status) {
        setUpdate(true)
        onClose();
      }
    } catch (error) {
      console.error("Error adding content:", error);
      alert("Failed to add content.");
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Content
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={newContent.title}
              onChange={(e) =>
                setNewContent({ ...newContent, title: e.target.value })
              }
            />
            <TextField
              label="Medium"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={newContent.medium}
              onChange={(e) =>
                setNewContent({ ...newContent, medium: e.target.value })
              }
              select
            >
              <MenuItem value="Hindi">Hindi</MenuItem>
              <MenuItem value="English">English</MenuItem>
            </TextField>
            <TextField
              label="Chapter"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={newContent.chapter}
              onChange={(e) =>
                setNewContent({ ...newContent, chapter: e.target.value })
              }
            />
            <Button
              variant="contained"
              component="label"
              sx={{ mb: 2 }}
              fullWidth
            >
              Upload PDF
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={(e) =>
                  setNewContent({ ...newContent, pdf: e.target.files[0] })
                }
              />
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddContentModal;
