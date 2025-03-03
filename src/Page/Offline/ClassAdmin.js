import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Paper,
  CircularProgress,
  Typography,
  Container,
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ClassAdmin.module.css";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

const ClassAdmin = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [editedClassName, setEditedClassName] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk4M2VhODQ5OTRlMDllNTJjMWIxYyIsImlhdCI6MTczNDk2ODQxNX0.0mxzxb4WBh_GAWHfyfMudWl5cPn6thbigI8VH_AFV8A";

  const fetchNestedData = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: { "x-admin-token": token },
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchClassData = async (cls) => {
    try {
      const subjects = await fetchNestedData(
        `https://zbatch.onrender.com/admin/offline/class-subject-year-student/subject/getAll/${cls._id}`
      );

      const batchYearsPromises = subjects.map((subject) =>
        fetchNestedData(
          `https://zbatch.onrender.com/admin/offline/class-subject-year-student/batchYear/getAll/${subject._id}`
        )
      );
      const batchYearsResults = await Promise.all(batchYearsPromises);
      const batchYears = batchYearsResults.flat();

      const studentsPromises = batchYears.map((batchYear) =>
        fetchNestedData(
          `https://zbatch.onrender.com/admin/offline/class-subject-year-student/enrollStudent/getAll/${batchYear._id}`
        )
      );
      const studentsResults = await Promise.all(studentsPromises);

      return {
        ...cls,
        subjectsCount: subjects.length,
        batchYearsCount: batchYears.length,
        studentsCount: studentsResults.flat().length,
      };
    } catch (error) {
      console.error(`Error processing class ${cls._id}:`, error);
      return { ...cls, subjectsCount: 0, batchYearsCount: 0, studentsCount: 0 };
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://zbatch.onrender.com/admin/offline/class-subject-year-student/class/getAll",
        { headers: { "x-admin-token": token } }
      );

      if (response.data?.data) {
        const classesWithData = await Promise.all(
          response.data.data.map(fetchClassData)
        );
        setClasses(classesWithData);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch classes. Please try again.");
      setLoading(false);
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEditOpen = (cls) => {
    setCurrentClass(cls);
    setEditedClassName(cls.className);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentClass(null);
    setEditedClassName("");
  };

  const handleUpdateClass = async () => {
    try {
      await axios.put(
        `https://zbatch.onrender.com/admin/offline/class-subject-year-student/class/update/${currentClass._id}`,
        { className: editedClassName },
        { headers: { "x-admin-token": token } }
      );

      await fetchClasses();
      setNotification({
        open: true,
        message: "Class updated successfully!",
        severity: "success",
      });
      handleEditClose();
    } catch (err) {
      setNotification({
        open: true,
        message: "Failed to update class. Please try again.",
        severity: "error",
      });
      console.error("Error updating class:", err);
    }
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Class Management
        </Typography>
        <Chip
          label={`Total Classes: ${classes.length}`}
          className={styles.totalChip}
          variant="outlined"
        />
      </Box>

      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress size={60} className={styles.loadingSpinner} />
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error" className={styles.errorMessage}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={3} className={styles.gridContainer}>
          {classes.map((cls) => (
            <Grid item key={cls._id} xs={12} sm={6} md={4} lg={5}>
              <Paper className={styles.classCard}>
                <IconButton
                  className={styles.editButton}
                  onClick={() => handleEditOpen(cls)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  className={styles.addButton}
                  onClick={() =>
                    navigate(`/dashboard/subject-management/${cls._id}`)
                  }
                >
                  <VisibilityIcon  fontSize="small" />
                </IconButton>

                <Typography variant="h6" className={styles.className}>
                  {cls.className}
                </Typography>

                <Box className={styles.metricsContainer}>
                  <MetricBadge label="Subjects" value={cls.subjectsCount} />
                  <MetricBadge
                    label="Batch Years"
                    value={cls.batchYearsCount}
                  />
                  <MetricBadge label="Students" value={cls.studentsCount} />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <EditDialog
        open={editOpen}
        onClose={handleEditClose}
        className={styles.editDialog}
        editedClassName={editedClassName}
        setEditedClassName={setEditedClassName}
        handleUpdateClass={handleUpdateClass}
      />

      <Notification
        notification={notification}
        setNotification={setNotification}
        styles={styles}
      />
    </Container>
  );
};

const MetricBadge = ({ label, value }) => (
  <Box className={styles.metricItem}>
    <Typography variant="subtitle2" className={styles.metricLabel}>
      {label}
    </Typography>
    <Typography variant="h6" className={styles.metricValue}>
      {value}
    </Typography>
  </Box>
);

const EditDialog = ({
  open,
  onClose,
  editedClassName,
  setEditedClassName,
  handleUpdateClass,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle className={styles.dialogTitle}>
      Edit Class
      <IconButton onClick={onClose} className={styles.closeButton}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Class Name"
        fullWidth
        variant="outlined"
        value={editedClassName}
        onChange={(e) => setEditedClassName(e.target.value)}
        className={styles.editField}
      />
    </DialogContent>
    <DialogActions className={styles.dialogActions}>
      <Button onClick={onClose} className={styles.cancelButton}>
        Cancel
      </Button>
      <Button
        onClick={handleUpdateClass}
        className={styles.saveButton}
        startIcon={<SaveIcon />}
      >
        Save Changes
      </Button>
    </DialogActions>
  </Dialog>
);

const Notification = ({ notification, setNotification, styles }) => (
  <Snackbar
    open={notification.open}
    autoHideDuration={6000}
    onClose={() => setNotification({ ...notification, open: false })}
  >
    <Alert
      severity={notification.severity}
      className={styles.notificationAlert}
    >
      {notification.message}
    </Alert>
  </Snackbar>
);

export default ClassAdmin;
