import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Container
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const {id}  = useParams()

  // Fetch data from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/materials/book/getAll?clsId=${id}`
        );
        if (response.data.status) {
          setBooks(response.data.data);
          setFilteredBooks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    const filtered = books.filter((book) =>
      book.subjectName.toLowerCase().includes(value) ||
      book.title.toLowerCase().includes(value)
    );
    setFilteredBooks(filtered);
  };

  // Define columns for the DataGrid
  const columns = [
    {
      field: "icon",
      headerName: "Icon",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="icon"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    { field: "subjectName", headerName: "Subject Name", width: 200 },
    { field: "title", headerName: "Title", width: 300 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        NCERT Books
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchText}
          onChange={handleSearch}
          sx={{ width: "300px" }}
        />
      </Box>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredBooks.map((book) => ({ id: book._id, ...book }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </Box>
    </Container>
  );
};

export default BookList;
