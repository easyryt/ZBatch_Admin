import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";

const StudentDataGrid = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    phone: "",
    gender: "",
    role: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
  });

  useEffect(() => {
    fetchStudentData();
  }, [filters, pagination.page]);

  const fetchStudentData = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.phone && { phone: filters.phone }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.role && { role: filters.role }),
      };

      const response = await axios.get(
        "https://npc-classes.onrender.com/admin/student/analytics/allStudentData",
        {
          headers: { "x-admin-token": token },
          params,
        }
      );

      const { data: students, pagination: apiPagination } = response.data;
      setData(students);
      setPagination((prev) => ({
        ...prev,
        totalPages: apiPagination.totalPages,
        totalCount: apiPagination.totalCount,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const columns = [
    {
      field: "profilePic",
      headerName: "Profile Pic",
      renderCell: (params) => (
        <img
          src={params?.row?.profilePic?.url}
          alt={params?.row?.fullName}
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
      width: 100,
    },
    { field: "fullName", headerName: "Full Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 120 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "city", headerName: "City", width: 120 },
    { field: "state", headerName: "State", width: 120 },
    { field: "dob", headerName: "Date of Birth", width: 120 },
  ];

  const filteredRows = data.filter((row) =>
    row?.fullName?.toLowerCase().includes(search?.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Student Data
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search by Name"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: 250 }}
        />

        <TextField
          label="Phone"
          name="phone"
          variant="outlined"
          value={filters.phone}
          onChange={handleFilterChange}
          sx={{ width: 200 }}
        />

        <TextField
          select
          label="Gender"
          name="gender"
          variant="outlined"
          value={filters.gender}
          onChange={handleFilterChange}
          sx={{ width: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>

        <TextField
          select
          label="Role"
          name="role"
          variant="outlined"
          value={filters.role}
          onChange={handleFilterChange}
          sx={{ width: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={pagination.limit}
          rowCount={pagination.totalCount}
          paginationMode="server"
          onPageChange={handlePageChange}
          getRowId={(row) => row._id}
          autoHeight
          sx={{ border: "none" }}
        />
      )}
    </Box>
  );
};

export default StudentDataGrid;
