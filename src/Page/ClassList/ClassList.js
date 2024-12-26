import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Pagination,
  Button,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./ClassList.module.css"; // Module-level CSS
import CreateClassModal from "./CreateClassModal";

const ClassList = () => {
  const initialClasses = [
    {
      clsName: "6th Class",
      clsNum: 6,
      section: "E",
      totalStudents: 20,
    },
    {
      clsName: "7th Class",
      clsNum: 7,
      section: "C",
      totalStudents: 60,
    },
    {
      clsName: "8th Class",
      clsNum: 8,
      section: "A",
      totalStudents: 40,
    },
    {
      clsName: "9th Class",
      clsNum: 9,
      section: "B",
      totalStudents: 35,
    },
  ];

  const [classes, setClasses] = useState(initialClasses);
  const [filteredClasses, setFilteredClasses] = useState(initialClasses);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open/close modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = classes.filter(
      (cls) =>
        cls.clsName.toLowerCase().includes(value) ||
        cls.clsNum.toString().includes(value)
    );
    setFilteredClasses(filtered);
    setPage(1); // Reset to first page
  };

  // Handle pagination
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Handle delete class
  const handleDelete = (clsNum) => {
    const updatedClasses = classes.filter((cls) => cls.clsNum !== clsNum);
    setClasses(updatedClasses);
    setFilteredClasses(updatedClasses);
  };

  // Pagination logic
  const paginatedClasses = filteredClasses.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className={styles.container}>
      {/* Title */}
      <Typography variant="h4" gutterBottom className={styles.heading}>
        Class List
      </Typography>

      {/* Add New Class Button */}
      <div>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add New Class
        </Button>

        {/* Create Class Modal */}
        <CreateClassModal open={isModalOpen} handleClose={handleCloseModal} />
      </div>
      <br />

      {/* Search Bar */}
      <TextField
        label="Search Classes"
        variant="outlined"
        fullWidth
        className={styles.searchBar}
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Class Table */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <b>Class Name</b>
              </TableCell>
              <TableCell align="center">
                <b>Class Number</b>
              </TableCell>
              <TableCell align="center">
                <b>Section</b>
              </TableCell>
              <TableCell align="center">
                <b>Total Students</b>
              </TableCell>
              <TableCell align="center">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClasses.length > 0 ? (
              paginatedClasses.map((cls, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{cls.clsName}</TableCell>
                  <TableCell align="center">{cls.clsNum}</TableCell>
                  <TableCell align="center">{cls.section || "N/A"}</TableCell>
                  <TableCell align="center">{cls.totalStudents || 0}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(cls.clsNum)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No classes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredClasses.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        className={styles.pagination}
      />
    </div>
  );
};

export default ClassList;
