import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Cookies from "js-cookie";

const ContentModal = ({ open, handleClose,batchId ,subjectId }) => {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    part: "",
    videoUrl: "",
    isFreeContent: false,
    contentType: "",
    thumbnailImg: null,
    pdf: null,
  });
const token = Cookies.get("token");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post(
        `https://npc-classes.onrender.com/admin/allClass/subjects/contents/create/${batchId}/${subjectId}`,
        data,
        {
            headers: {
              "x-admin-token": token,
            },
          }
      );
      console.log("Content created successfully:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: "scroll",
          height: "95vh",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" mb={2}>
          Create Content
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Part"
            name="part"
            value={formData.part}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Video URL"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                name="isFreeContent"
                checked={formData.isFreeContent}
                onChange={handleChange}
              />
            }
            label="Is Free Content"
          />

          <TextField
            fullWidth
            label="Content Type"
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Typography variant="body2" mt={2}>
            Thumbnail Image:
          </Typography>
          <TextField
            fullWidth
            type="file"
            name="thumbnailImg"
            onChange={handleChange}
            margin="normal"
          />

          <Typography variant="body2" mt={2}>
            PDF File:
          </Typography>
          <TextField
            fullWidth
            type="file"
            name="pdf"
            onChange={handleChange}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ContentModal;
