import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  Skeleton,
} from "@mui/material";
import { Search, Add, Edit, Delete, Close, Key } from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import styles from "./TeacherManagement.module.css";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk4M2VhODQ5OTRlMDllNTJjMWIxYyIsImlhdCI6MTczNDk2ODQxNX0.0mxzxb4WBh_GAWHfyfMudWl5cPn6thbigI8VH_AFV8A";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

function CustomToolbar({ handleOpen, searchTerm, handleSearch }) {
  const theme = useTheme();

  return (
    <GridToolbarContainer className={styles.toolbar}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        }}
      >
        Add Teacher
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search teachers..."
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        sx={{
          maxWidth: 400,
          ml: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 25,
            backgroundColor: theme.palette.background.paper,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
      />
      <div className={styles.toolbarRight}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          sx={{ color: theme.palette.text.secondary, "&:hover": { bgcolor: "transparent" } }}
        />
      </div>
    </GridToolbarContainer>
  );
}

const TeacherManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    email: "",
    accessCode: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
      headerClassName: styles.header,
    },
    {
      field: "expertise",
      headerName: "Expertise",
      flex: 1,
      minWidth: 150,
      headerClassName: styles.header,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 250,
      headerClassName: styles.header,
    },
    {
      field: "accessCode",
      headerName: "Access Code",
      flex: 1,
      minWidth: 150,
      headerClassName: styles.header,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      minWidth: 180,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
          sx={{ color: theme.palette.text.secondary }}
        />,
        <GridActionsCellItem
          icon={<Key />}
          label="Access"
          onClick={() => navigate(`/dashboard/teacher-access-management/${params.id}`)}
          sx={{ color: theme.palette.secondary.main }}
        />,
      ],
    },
  ];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await axios.get(
          "https://zbatch.onrender.com/admin/offline/teacher/getAll",
          { headers: { "x-admin-token": API_TOKEN } }
        );
        if (data.data) {
          setTeachers(data.data);
          setFilteredTeachers(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const filtered = teachers.filter(teacher =>
      Object.values(teacher).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    ));
    setFilteredTeachers(filtered);
  }, [searchTerm, teachers]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.expertise.trim()) newErrors.expertise = "Expertise is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.accessCode.trim()) newErrors.accessCode = "Access code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setSelectedTeacher(null);
    setFormData({ name: "", expertise: "", email: "", accessCode: "" });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTeacher(null);
    setErrors({});
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      expertise: teacher.expertise,
      email: teacher.email,
      accessCode: teacher.accessCode,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://zbatch.onrender.com/admin/offline/teacher/delete/${selectedTeacher._id}`,
        { headers: { "x-admin-token": API_TOKEN } }
      );
      setSnackbar({
        open: true,
        message: "Teacher deleted successfully",
        severity: "success",
      });
      setTeachers(prev => prev.filter(t => t._id !== selectedTeacher._id));
      setDeleteDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Delete failed",
        severity: "error",
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const url = selectedTeacher
        ? `https://zbatch.onrender.com/admin/offline/teacher/update/${selectedTeacher._id}`
        : "https://zbatch.onrender.com/admin/offline/teacher/create";

      const method = selectedTeacher ? "put" : "post";

      const { data } = await axios[method](url, formData, {
        headers: { "x-admin-token": API_TOKEN }
      });

      setSnackbar({
        open: true,
        message: selectedTeacher ? "Teacher updated!" : "Teacher created!",
        severity: "success",
      });
      setTeachers(prev => selectedTeacher
        ? prev.map(t => t._id === selectedTeacher._id ? data.data : t)
        : [...prev, data.data]
      );
      handleDialogClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Operation failed",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        <Skeleton width="60%" height={40} sx={{ mt: 2 }} />
        <Skeleton width="80%" />
      </Container>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", bgcolor: "error.light" }}>
        <Typography variant="h6" color="error">
          Error Loading Data: {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div className={styles.header}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Teacher Management
        </Typography>
      </div>

      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: theme.shadows[3] }}>
        <StyledDataGrid
          rows={filteredTeachers}
          columns={columns}
          autoHeight
          density="comfortable"
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          slots={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                handleOpen={handleDialogOpen}
                searchTerm={searchTerm}
                handleSearch={(e) => setSearchTerm(e.target.value)}
              />
            ),
            loadingOverlay: LinearProgress,
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
          }}
          getRowId={(row) => row._id}
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {selectedTeacher ? "Edit Teacher" : "New Teacher"}
          <IconButton onClick={handleDialogClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3, minWidth: 400 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={!!errors.name}
            helperText={errors.name}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Expertise"
            name="expertise"
            value={formData.expertise}
            onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
            error={!!errors.expertise}
            helperText={errors.expertise}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={!!errors.email}
            helperText={errors.email}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Access Code"
            name="accessCode"
            value={formData.accessCode}
            onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
            error={!!errors.accessCode}
            helperText={errors.accessCode}
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDialogClose} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            {selectedTeacher ? "Save Changes" : "Create Teacher"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedTeacher?.name}?
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            alignItems: "center",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TeacherManagement;