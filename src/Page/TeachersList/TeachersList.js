import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Fetch teachers data from API
  const fetchTeachers = async () => {
    try {
      // Get token from cookies
      const token = Cookies.get("token"); // Replace with your token key
      const response = await axios.get(
        "https://npc-classes.onrender.com/admin/teachers/getAll",
        {
            headers: {
              "x-admin-token": token,
              "Content-Type": "multipart/form-data", // Set content type for file upload
            },
          }
      );
      if (response.data.status) {
        setTeachers(response.data.data);
        setFilteredData(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  // Filter teachers data based on search term
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = teachers.filter((teacher) =>
      teacher.teacherName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Define columns for DataGrid
  const columns = [
    {
      field: "pic",
      headerName: "Profile Picture",
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value.url}
          alt="Teacher"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
    },
    { field: "teacherName", headerName: "Name", width: 200 },
    { field: "expertise", headerName: "Expertise", width: 150 },
    { field: "yearOfEx", headerName: "Experience (Years)", width: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-US"),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%", padding: "20px" }}>
      <TextField
        fullWidth
        label="Search by Teacher Name"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ marginBottom: "20px" }}
      />
      <DataGrid
        rows={filteredData.map((teacher, index) => ({
          id: teacher._id, // Required for DataGrid rows
          pic: teacher.pic,
          teacherName: teacher.teacherName,
          expertise: teacher.expertise,
          yearOfEx: teacher.yearOfEx,
          createdAt: teacher.createdAt,
        }))}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default TeachersList;
