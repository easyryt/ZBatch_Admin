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
import styles from "./SubjectsList.module.css"; // Module CSS for styling
import CreateSubjectModal from "./CreateSubjectModal";

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]); // For filtering
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // For the search bar
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [update, setUpate] = useState(false);

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
        setUpate(false);
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
        setUpate={setUpate}
      />
    </Box>
  );
};

export default SubjectsList;
