import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { Edit, Delete } from "@mui/icons-material";
import styles from "./SubjectsList.module.css"; // Module CSS for styling
import CreateSubjectModal from "./CreateSubjectModal";
import UpdateSubjectModal from "./UpdateSubjectModal";

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]); // For filtering
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // For the search bar
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [update, setUpdate] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setOpenUpdateModal(true);
  };

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          "https://npc-classes.onrender.com/admin/subjects/getAll",
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        if (response.data.status) {
          setSubjects(response.data.data);
          setFilteredSubjects(response.data.data); // Initialize filteredSubjects
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
        setUpdate(false);
      }
    };

    fetchSubjects();
  }, [update]);

  // Handle search input
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = subjects.filter((subject) =>
      subject.subjectName.toLowerCase().includes(value)
    );
    setFilteredSubjects(filtered);
  };

  // Open delete confirmation dialog
  const openDeleteConfirmation = (id) => {
    setDeleteSubjectId(id);
    setOpenDeleteDialog(true);
  };

  // Handle Delete Subject
  const handleDelete = async () => {
    const token = Cookies.get("token");

    try {
      const response = await axios.delete(
        `https://npc-classes.onrender.com/admin/subjects/delete/${deleteSubjectId}`,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      if (response.data.status) {
        setUpdate(true); // Trigger a re-fetch of data
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    } finally {
      setOpenDeleteDialog(false); // Close the dialog
    }
  };

  // Columns definition for DataGrid
  const columns = [
    {
      field: "icon",
      headerName: "Icon",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.icon.url}
          alt={params.row.subjectName}
          className={styles.icon}
        />
      ),
    },
    {
      field: "subjectName",
      headerName: "Subject Name",
      width: 200,
    },
    {
      field: "_id",
      headerName: "ID",
      width: 250,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            title="Edit"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => openDeleteConfirmation(params.row._id)}
            color="error"
            title="Delete"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title} gutterBottom>
        Subjects List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedSubject(null); // Reset selected subject
          setOpenModal(true);
        }}
      >
        Create Subject
      </Button>
      <TextField
        label="Search Subjects"
        variant="outlined"
        fullWidth
        className={styles.searchBar}
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Type to search by subject name..."
        margin="normal"
      />
      {loading ? (
        <Box className={styles.loaderContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className={styles.dataGridContainer}>
          <DataGrid
            rows={filteredSubjects.map((subject) => ({
              ...subject,
              id: subject._id,
            }))}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
          />
        </Box>
      )}
      {/* Create Subject Modal */}
      <CreateSubjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        setUpdate={setUpdate}
      />
      <UpdateSubjectModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        setUpdate={setUpdate} // Use setUpdate instead of triggerUpdate
        subject={selectedSubject} // Pass the selected subject for editing
      />
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this subject? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectsList;
