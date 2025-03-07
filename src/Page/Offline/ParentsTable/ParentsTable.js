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
  LinearProgress,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  InputAdornment,
  Container,
  IconButton,
  Skeleton,
  useTheme,
} from "@mui/material";
import { Edit, Add, Search, Close, Key } from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";
import styles from "./ParentsTable.module.css";
import { useNavigate } from "react-router-dom";

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
        Add Parent
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search parents..."
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
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": { bgcolor: "transparent" },
          }}
        />
      </div>
    </GridToolbarContainer>
  );
}

const ParentsTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    accessCode: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const columns = [
    {
      field: "parentName",
      headerName: "Parent Name",
      flex: 1,
      minWidth: 180,
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
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 120,
      headerClassName: styles.header,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.2,
      minWidth: 180,
      headerClassName: styles.header,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1.2,
      minWidth: 180,
      headerClassName: styles.header,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
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
          onClick={() =>
            navigate(`/dashboard/parent-access-management/${params.id}`)
          }
          sx={{ color: theme.palette.secondary.main }}
        />,
      ],
    },
  ];

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const { data } = await axios.get(
          "https://zbatch.onrender.com/admin/offline/parent/getAll",
          { headers: { "x-admin-token": API_TOKEN } }
        );
        if (data.status) {
          setParents(data.data);
          setFilteredParents(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchParents();
  }, []);

  useEffect(() => {
    const filtered = parents.filter((parent) =>
      Object.values(parent).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredParents(filtered);
  }, [searchTerm, parents]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setEditData(null);
    setFormData({ parentName: "", email: "", accessCode: "" });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditData(null);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setFormData({
      parentName: row.parentName,
      email: row.email,
      accessCode: row.accessCode,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.parentName || !formData.email || !formData.accessCode) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    try {
      const url = editData
        ? `https://zbatch.onrender.com/admin/offline/parent/update/${editData._id}`
        : "https://zbatch.onrender.com/admin/offline/parent/create";

      const method = editData ? "put" : "post";

      const { data } = await axios[method](url, formData, {
        headers: { "x-admin-token": API_TOKEN },
      });

      if (data.status) {
        setSnackbar({
          open: true,
          message: editData ? "Parent updated!" : "Parent created!",
          severity: "success",
        });
        setParents((prev) =>
          editData
            ? prev.map((p) => (p._id === editData._id ? data.data : p))
            : [...prev, data.data]
        );
        handleDialogClose();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Operation failed",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div className={styles.header}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Parent Management
        </Typography>
      </div>

      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: theme.shadows[3] }}>
        <StyledDataGrid
          rows={filteredParents}
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
          {editData ? "Edit Parent" : "New Parent"}
          <IconButton onClick={handleDialogClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3, minWidth: 400 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Parent Name"
            name="parentName"
            value={formData.parentName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, parentName: e.target.value }))
            }
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Access Code"
            name="accessCode"
            value={formData.accessCode}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, accessCode: e.target.value }))
            }
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
            {editData ? "Save Changes" : "Create Parent"}
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

export default ParentsTable;
