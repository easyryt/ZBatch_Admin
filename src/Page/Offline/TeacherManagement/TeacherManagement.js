import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  IconButton,
  Grid,
} from "@mui/material";
import { Search, Add, Edit, Delete, Close } from "@mui/icons-material";
import styles from "./TeacherManagement.module.css";
import KeyIcon from "@mui/icons-material/Key";
import { useNavigate } from "react-router-dom";

const TeacherManagement = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    email: "",
    accessCode: "",
  });

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk4M2VhODQ5OTRlMDllNTJjMWIxYyIsImlhdCI6MTczNDk2ODQxNX0.0mxzxb4WBh_GAWHfyfMudWl5cPn6thbigI8VH_AFV8A";

  useEffect(() => {
    fetchTeachers();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.expertise.trim())
      newErrors.expertise = "Expertise is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.accessCode.trim())
      newErrors.accessCode = "Access code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://zbatch.onrender.com/admin/offline/teacher/getAll",
        { headers: { "x-admin-token": token } }
      );
      setTeachers(response.data.data || []);
    } catch (error) {
      showSnackbar("Failed to fetch teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = selectedTeacher
        ? `https://zbatch.onrender.com/admin/offline/teacher/update/${selectedTeacher._id}`
        : "https://zbatch.onrender.com/admin/offline/teacher/create";

      const method = selectedTeacher ? "put" : "post";

      await axios[method](url, formData, {
        headers: { "x-admin-token": token },
      });

      showSnackbar(
        `Teacher ${selectedTeacher ? "updated" : "created"} successfully`,
        "success"
      );
      handleCloseDialog();
      fetchTeachers();
    } catch (error) {
      showSnackbar(
        `Teacher ${selectedTeacher ? "update" : "creation"} failed`,
        "error"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://zbatch.onrender.com/admin/offline/teacher/delete/${selectedTeacher._id}`,
        { headers: { "x-admin-token": token } }
      );
      showSnackbar("Teacher deleted successfully", "success");
      setOpenDeleteDialog(false);
      fetchTeachers();
    } catch (error) {
      showSnackbar("Delete failed", "error");
    }
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      expertise: teacher.expertise,
      email: teacher.email,
      accessCode: teacher.accessCode,
    });
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTeacher(null);
    setFormData({
      name: "",
      expertise: "",
      email: "",
      accessCode: "",
    });
    setErrors({});
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredTeachers = teachers.filter((teacher) =>
    Object.values(teacher).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Container maxWidth="xl" className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          Teacher Management
        </Typography>
        <div className={styles.controls}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search teachers..."
            InputProps={{ startAdornment: <Search /> }}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            New Teacher
          </Button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Expertise</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Access Code</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Access</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.expertise}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.accessCode}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(teacher)}>
                      <Edit color="primary" />
                    </IconButton>
                    {/* <IconButton
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Delete color="error" />
                    </IconButton> */}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/dashboard/teacher-access-management/${teacher._id}`)}>
                      <KeyIcon color="secondary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedTeacher ? "Edit Teacher" : "Create New Teacher"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  error={!!errors.expertise}
                  helperText={errors.expertise}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Access Code"
                  name="accessCode"
                  value={formData.accessCode}
                  onChange={handleInputChange}
                  error={!!errors.accessCode}
                  helperText={errors.accessCode}
                  required
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTeacher ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedTeacher?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        sx={{
          backgroundColor:
            snackbar.severity === "error" ? "error.main" : "success.main",
          color: "white",
        }}
      />
    </Container>
  );
};

export default TeacherManagement;
