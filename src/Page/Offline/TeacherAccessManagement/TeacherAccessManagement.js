import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { ExpandMore, Close, Add } from "@mui/icons-material";
import styles from "./TeacherAccessManagement.module.css";
import { useParams } from "react-router-dom";

const TeacherAccessManagement = () => {
  const { id } = useParams();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [teacherAccess, setTeacherAccess] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [loading, setLoading] = useState({
    classes: true,
    teachers: false,
    creating: false,
    subjects: false,
    batches: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk4M2VhODQ5OTRlMDllNTJjMWIxYyIsImlhdCI6MTczNDk2ODQxNX0.0mxzxb4WBh_GAWHfyfMudWl5cPn6thbigI8VH_AFV8A";

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
      fetchTeacherAccess();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (openCreateDialog && selectedClass && selectedSubject) {
      fetchBatches(selectedClass, selectedSubject);
    }
  }, [selectedSubject, openCreateDialog, selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        "https://zbatch.onrender.com/admin/offline/class-subject-year-student/class/getAll",
        { headers: { "x-admin-token": token } }
      );
      setClasses(response.data.data || []);
    } catch (error) {
      showSnackbar("Failed to fetch classes", "error");
    } finally {
      setLoading((prev) => ({ ...prev, classes: false }));
    }
  };

  const fetchSubjects = async (classId) => {
    setLoading((prev) => ({ ...prev, subjects: true }));
    try {
      const response = await axios.get(
        `https://zbatch.onrender.com/admin/offline/class-subject-year-student/subject/getAll/${classId}`,
        { headers: { "x-admin-token": token } }
      );
      setSubjects(response.data.data || []);
    } catch (error) {
      showSnackbar("Failed to fetch subjects", "error");
    } finally {
      setLoading((prev) => ({ ...prev, subjects: false }));
    }
  };

  const fetchBatches = async (classId, subjectId) => {
    setLoading((prev) => ({ ...prev, batches: true }));
    try {
      const response = await axios.get(
        `https://zbatch.onrender.com/admin/offline/class-subject-year-student/batchYear/getAll/${subjectId}`,
        { headers: { "x-admin-token": token } }
      );
      setBatches(response.data.data || []);
    } catch (error) {
      showSnackbar("Failed to fetch batches", "error");
    } finally {
      setLoading((prev) => ({ ...prev, batches: false }));
    }
  };

  const fetchTeacherAccess = async () => {
    setLoading((prev) => ({ ...prev, teachers: true }));
    try {
      const cls = classes.find((c) => c._id === selectedClass);
      if (!cls) return;

      const response = await axios.get(
        "https://zbatch.onrender.com/admin/offline/teacher/access/getAll",
        {
          params: { className: cls.className },
          headers: { "x-admin-token": token },
        }
      );
      setTeacherAccess(response.data.data || []);
    } catch (error) {
      showSnackbar("Failed to fetch teacher access", "error");
    } finally {
      setLoading((prev) => ({ ...prev, teachers: false }));
    }
  };

  const createAccess = async () => {
    if (!selectedSubject || selectedBatches.length === 0) {
      showSnackbar("Please select subject and at least one batch", "error");
      return;
    }

    setLoading((prev) => ({ ...prev, creating: true }));
    try {
      await axios.post(
        `https://zbatch.onrender.com/admin/offline/teacher/access/create/${id}`,
        {
          access: {
            classId: selectedClass,
            subjectId: selectedSubject,
            batchYear: selectedBatches,
          },
        },
        { headers: { "x-admin-token": token } }
      );
      showSnackbar("Access created successfully", "success");
      setOpenCreateDialog(false);
      setSelectedBatches([]);
      setSelectedSubject("");
      fetchTeacherAccess();
    } catch (error) {
      showSnackbar("Failed to create access", "error");
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          Teacher Access Management
        </Typography>

        <div className={styles.controls}>
          <FormControl variant="outlined" className={styles.select}>
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSubject("");
                setSelectedBatches([]);
              }}
              label="Select Class"
              disabled={loading.classes}
            >
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
            disabled={!selectedClass || loading.subjects}
          >
            Add Access
          </Button>
        </div>
      </div>

      {loading.teachers ? (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teacher Name</TableCell>
                <TableCell>Expertise</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Access Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teacherAccess.map(({ accessId, teacher, access }) => (
                <TableRow key={accessId}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.expertise}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    {access.map((entry, index) => (
                      <Accordion key={index} className={styles.accordion}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Chip
                            label={`${entry.class.className} - ${entry.subject.subjectName}`}
                            color="primary"
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className={styles.accessDetails}>
                            <Typography>
                              Class: {entry.class.className}
                            </Typography>
                            <Typography>
                              Subject: {entry.subject.subjectName}
                            </Typography>
                            <div className={styles.batchList}>
                              {(entry.batchYear || []).map((batchId, i) => {
                                const batch = batches.find(
                                  (b) => b._id === batchId
                                );
                                return (
                                  <Chip
                                    key={i}
                                    label={batch?.batchYear || "Unknown Batch"}
                                    variant="outlined"
                                    className={styles.batchChip}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openCreateDialog}
        onClose={() => {
          setOpenCreateDialog(false);
          setSelectedSubject("");
          setSelectedBatches([]);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Access</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedBatches([]);
              }}
              label="Subject"
              disabled={loading.subjects}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.subjectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Batches</InputLabel>
            <Select
              multiple
              value={selectedBatches}
              onChange={(e) => setSelectedBatches(e.target.value)}
              label="Select Batches"
              disabled={loading.batches || !selectedSubject}
              renderValue={(selected) => (
                <div className={styles.chipContainer}>
                  {selected.map((batchId) => {
                    const batch = batches.find((b) => b._id === batchId);
                    return (
                      <Chip
                        key={batchId}
                        label={batch?.batchYear || "Unknown Batch"}
                        className={styles.chip}
                      />
                    );
                  })}
                </div>
              )}
            >
              {batches.map((batch) => (
                <MenuItem key={batch._id} value={batch._id}>
                  <Checkbox checked={selectedBatches.includes(batch._id)} />
                  <ListItemText primary={batch.batchYear} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenCreateDialog(false);
              setSelectedSubject("");
              setSelectedBatches([]);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={createAccess}
            variant="contained"
            disabled={loading.creating}
          >
            {loading.creating ? <CircularProgress size={24} /> : "Create"}
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

export default TeacherAccessManagement;