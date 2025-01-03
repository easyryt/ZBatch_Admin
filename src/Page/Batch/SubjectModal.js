import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";

const SubjectModal = ({ open, handleClose, id }) => {
  const [formData, setFormData] = useState({
    subject: "",
    totalChapter: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [subjectList, setSubjectList] = useState([]); // List of all subjects
  const token = Cookies.get("token");

  useEffect(() => {
    if (open) {
      fetchSubjects();
      fetchAllSubjects();
    }
  }, [open]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `https://npc-classes.onrender.com/admin/batches/allClass/subjects/getAll/${id}`,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      setSubjects(response.data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const response = await axios.get(
        "https://npc-classes.onrender.com/admin/subjects/getAll",
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      setSubjectList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching all subjects:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://npc-classes.onrender.com/admin/batches/allClass/subjects/create/${id}`,
        formData,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      setFormData({
        subject: "",
        totalChapter: "",
      });
      fetchSubjects(); // Refresh the subject list
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const columns = [
    { field: "subjectName", headerName: "Subject Name", width: 200 },
    { field: "totalChapter", headerName: "Total Chapters", width: 150 },
    {
      field: "icon",
      headerName: "Icon",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="icon"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
  ];

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
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" mb={2}>
          Manage Subjects
        </Typography>

        {/* Form for creating a new subject */}
        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Select Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            margin="normal"
            required
          >
            {subjectList.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                <img
                  src={subject.icon.url}
                  alt="icon"
                  style={{ width: "20px", height: "20px", marginRight: "10px" }}
                />
                {subject.subjectName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Total Chapters"
            name="totalChapter"
            type="number"
            value={formData.totalChapter}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Subject
          </Button>
        </form>

        {/* DataGrid to display subjects */}
        <Box sx={{ height: 400, mt: 4 }}>
          <DataGrid
            rows={subjects}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default SubjectModal;
