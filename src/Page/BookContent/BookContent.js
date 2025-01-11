import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const BookContent = () => {
  const [content, setContent] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();


  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/materials/book/content/getAll/${id}`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        if (response.data.status) {
          setContent(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        alert("Failed to fetch content.");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Filtered content based on search
  const filteredContent = content.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.chapter.toString().includes(search)
  );

  // Columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "title", headerName: "Title", width: 300 },
    { field: "medium", headerName: "Medium", width: 150 },
    { field: "chapter", headerName: "Chapter", width: 100 },
    {
      field: "pdfUrl",
      headerName: "PDF Link",
      width: 250,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          href={params.url}
          target="_blank"
        >
          View PDF
        </Button>
      ),
    },
  ];

  // Rows for the DataGrid
  const rows = filteredContent.map((item) => ({
    id: item._id,
    title: item.title,
    medium: item.medium,
    chapter: item.chapter,
    pdfUrl: item.pdf.url,
  }));

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book Content
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <TextField
          label="Search by Title or Chapter"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mr: 2 }}
        />
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          disableSelectionOnClick
        />
      )}
    </Box>
  );
};

export default BookContent;
