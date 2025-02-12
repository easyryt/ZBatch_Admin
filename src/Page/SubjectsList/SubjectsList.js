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
import styles from "./SubjectsList.module.css";
import CreateSubjectModal from "./CreateSubjectModal";
import UpdateSubjectModal from "./UpdateSubjectModal";

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [page, setPage] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
    const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 5,
    });

  useEffect(() => {
    const fetchSubjects = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          "https://zbatch.onrender.com/admin/subjects/getAll",
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        if (response.data.status) {
          setSubjects(response.data.data);
          setFilteredSubjects(response.data.data);
          setPage(0);
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

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = subjects.filter((subject) =>
      subject.subjectName.toLowerCase().includes(value)
    );
    setFilteredSubjects(filtered);
    setPage(0); // Reset to first page when searching
  };

  const openDeleteConfirmation = (id) => {
    setDeleteSubjectId(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.delete(
        `https://zbatch.onrender.com/admin/subjects/delete/${deleteSubjectId}`,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      if (response.data.status) {
        setUpdate(true);
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setOpenUpdateModal(true);
  };

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
        onClick={() => setOpenModal(true)}
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
            page={page}
            rowCount={filteredSubjects.length}
            disableSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
          />
        </Box>
      )}

      <CreateSubjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        setUpdate={setUpdate}
      />
      <UpdateSubjectModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        setUpdate={setUpdate}
        subject={selectedSubject}
      />

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