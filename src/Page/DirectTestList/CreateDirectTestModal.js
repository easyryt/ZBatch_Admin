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
import { useParams } from "react-router-dom";

const CreateDirectTestModal = ({ open, handleClose, setUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalMarks: "",
    duration: "",
    wrongAnswerDeduction: "",
    numberOfTests: "",
    isFreeTest: false,
    price: "",
    file: null,
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = Cookies.get("token");
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    try {
      await axios.post(
        `https://npc-classes.onrender.com/admin/directTest/create/${id}`,
        formDataToSubmit,
        {
          headers: {
            "x-admin-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUpdate(true);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
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
          width: "90%",
          maxWidth: 800,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          component="h2"
          mb={2}
          sx={{ fontWeight: "bold" }}
        >
          Create Direct Test
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Test Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Total Marks"
            name="totalMarks"
            type="number"
            value={formData.totalMarks}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Wrong Answer Deduction"
            name="wrongAnswerDeduction"
            type="number"
            value={formData.wrongAnswerDeduction}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Number of Tests"
            name="numberOfTests"
            type="number"
            value={formData.numberOfTests}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                name="isFreeTest"
                checked={formData.isFreeTest}
                onChange={handleChange}
              />
            }
            label="Is Free Test"
          />

          {!formData.isFreeTest && (
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              required
            />
          )}

          <Typography variant="body2" mb={1}>
            Upload File (DOCX)
          </Typography>
          <TextField
            fullWidth
            type="file"
            name="file"
            inputProps={{ accept: ".docx" }}
            onChange={handleChange}
            margin="normal"
          />

          {error && (
            <Typography variant="body2" color="error" mb={2}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Test"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateDirectTestModal;
