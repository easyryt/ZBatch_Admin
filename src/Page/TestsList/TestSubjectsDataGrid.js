import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import styles from "./TestSubjectsDataGrid.module.css"; // Module CSS for styling
import CreateTestSubjectModal from "./CreateTestSubjectModal";
import { useParams } from "react-router-dom";

const TestSubjectsDataGrid = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]); // For filtering
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // For the search bar
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [update, setUpdate] = useState(false);
  const { id } = useParams(); // Fetch id from URL

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      const token = Cookies.get("token"); // Fetch token from cookies
      try {
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/directTest/subjects/getAll/${id}`,
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
  }, [id, update]); // Depend on id and update

  // Handle search input
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = subjects.filter((subject) =>
      subject.subjectName?.toLowerCase().includes(value)
    );
    setFilteredSubjects(filtered);
  };

  // Columns definition for DataGrid
  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    { field: "clsId", headerName: "Class ID", width: 150 },
    {
      field: "subjectName",
      headerName: "Subject",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={params.row.subject?.icon?.url}
            alt={params.row.subject?.subjectName}
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <Typography>{params.row.subject?.subjectName}</Typography>
        </Box>
      ),
    },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
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
      <CreateTestSubjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        setUpdate={setUpdate}
      />
    </Box>
  );
};

export default TestSubjectsDataGrid;
