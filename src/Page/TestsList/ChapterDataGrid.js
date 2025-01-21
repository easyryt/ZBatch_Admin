import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import axios from "axios";
import { useParams } from "react-router-dom";
import CreateChapterModal from "./CreateChapterModal ";


const ChapterDataGrid = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State for modal
  const { id } = useParams(); // SubjectTest ID

  useEffect(() => {
    const fetchChapters = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/directTest/subjects/chapter/getAll/${id}`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );

        setChapters(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch chapters.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id]);

  const columns = [
    { field: "chapterNo", headerName: "Chapter No", width: 130 },
    { field: "chapterName", headerName: "Chapter Name", width: 250 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 250,
      renderCell: (params) => new Date(params?.row?.createdAt).toLocaleString(),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Chapters
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)} // Open the modal
        sx={{ mb: 2 }}
      >
        Create Chapter
      </Button>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box height={400}>
          <DataGrid
            rows={chapters.map((chapter) => ({ ...chapter, id: chapter._id }))}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      )}

      {/* Render the modal */}
      <CreateChapterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        clsId={chapters[0]?.clsId || ""}
        subjectTest={id}
        refreshChapters={() => {
          setLoading(true);
          setError(null);
        }}
      />
    </Box>
  );
};

export default ChapterDataGrid;
