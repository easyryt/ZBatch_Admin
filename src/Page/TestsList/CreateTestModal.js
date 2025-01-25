import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const CreateTestModal = ({ open, handleClose, setUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalMarks: "",
    duration: "",
    wrongAnswerDeduction: "",
    unattemptedDeduction: "",
    numberOfTests: "",
    file: null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = Cookies.get("token");
  const { chapterId } = useParams();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const validateFile = (file) => {
    if (!file) return "Please upload a file.";
    const allowedTypes = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) return "Only DOC or DOCX files are allowed.";
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const fileError = validateFile(formData.file);
    if (fileError) {
      setError(fileError);
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.post(
        `https://zbatch.onrender.com/admin/directTest/chapter/questions/create/${chapterId}`,
        formDataToSend,
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

        <Typography variant="h5" component="h2" mb={2} sx={{ fontWeight: "bold" }}>
          Create Test
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
            label="Unattempted Deduction"
            name="unattemptedDeduction"
            type="number"
            value={formData.unattemptedDeduction}
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

          <Typography variant="body1" mt={2} mb={1}>
            Upload DOC/DOCX (Max size: 5MB):
          </Typography>
          <input
            type="file"
            name="file"
            accept=".doc,.docx"
            onChange={handleChange}
            required
          />

          {error && (
            <Typography variant="body2" color="error" mt={2}>
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

export default CreateTestModal;
