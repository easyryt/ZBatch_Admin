import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import CreateTitleModal from "./CreateTitleModal";

const TitlesDataGrid = () => {
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const token = Cookies.get("token");
  const [modalOpen, setModalOpen] = useState(false);
  const [update, setUpdate] = useState(false); // Trigger updates

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    const fetchTitles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/materials/title/subjects/content/getAllTitle?clsId=${id}`,
          {
            headers: { "x-admin-token": token },
          }
        );
        if (response.data.status) {
          setTitles(response.data.data);
          setFilteredTitles(response.data.data);
          setUpdate(false)
        } else {
          console.error("Failed to fetch titles:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, [id, token,update]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = titles.filter((title) =>
      title.title.toLowerCase().includes(query)
    );
    setFilteredTitles(filtered);
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 300,
    },

    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      renderCell: (params) => new Date(params.row.updatedAt).toLocaleString(),
    },
  ];

  return (
    <Box sx={{ height: 550, width: "100%", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Material Titles
      </Typography>
      <TextField
        label="Search by Title"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ textTransform: "none", fontWeight: "bold" }}
        onClick={handleOpen}
      >
        Create New Titles
      </Button>
      <CreateTitleModal
        open={modalOpen}
        handleClose={handleClose}
        setUpdate={setUpdate}
      />
      <DataGrid
        rows={filteredTitles}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        disableSelectionOnClick
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        sx={{
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      />
    </Box>
  );
};

export default TitlesDataGrid;
