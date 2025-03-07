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
  Stack,
  Skeleton,
  Box,
} from "@mui/material";
import {
  ExpandMore,
  Close,
  Add,
  Class,
  Subject,
  Schedule,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import UpdateAccessModal from "./UpdateAccessModal";

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
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedAccessData, setSelectedAccessData] = useState(null);
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

  const handleEditAccess = (accessId) => {
    setSelectedAccessData({
      accessId,
      selectedBatches: [],
    });
    setOpenUpdateDialog(true);
  };

  const updateAccess = async (accessId, newSubjectId, newBatches) => {
    setLoading((prev) => ({ ...prev, updating: true }));
    try {
      await axios.put(
        `https://zbatch.onrender.com/admin/offline/teacher/access/update/${accessId}`,
        {
          access: {
            subjectId: newSubjectId,
            batchYear: newBatches,
          },
        },
        { headers: { "x-admin-token": token } }
      );
      showSnackbar("Access updated successfully", "success");
      fetchTeacherAccess();
    } catch (error) {
      showSnackbar("Failed to update access", "error");
    } finally {
      setLoading((prev) => ({ ...prev, updating: false }));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Teacher Access Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSubject("");
                setSelectedBatches([]);
              }}
              label="Class"
              disabled={loading.classes}
              startAdornment={<Class sx={{ color: "action.active", mr: 1 }} />}
            >
              {loading.classes ? (
                <MenuItem disabled>
                  <Skeleton width={100} />
                </MenuItem>
              ) : (
                classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.className}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
            disabled={!selectedClass || loading.subjects}
            sx={{ height: 56 }}
          >
            Add Access
          </Button>
        </Box>
      </Box>

      {loading.teachers ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ bgcolor: "background.paper", fontWeight: 600 }}
                  >
                    Teacher
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "background.paper", fontWeight: 600 }}
                  >
                    Expertise
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "background.paper", fontWeight: 600 }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "background.paper", fontWeight: 600 }}
                  >
                    update
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "background.paper", fontWeight: 600 }}
                  >
                    Access Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teacherAccess.map(({ accessId, teacher, access }) => (
                  <TableRow key={accessId} hover>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.expertise}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      {" "}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditAccess(teacher.id)}
                        sx={{ mt: 2 }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      {access.map((entry, index) => (
                        <Accordion
                          key={index}
                          elevation={0}
                          sx={{ bgcolor: "background.default" }}
                        >
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Chip
                              label={`${entry.class.className} - ${entry.subject.subjectName}`}
                              color="primary"
                              variant="outlined"
                              icon={<Subject sx={{ fontSize: 16 }} />}
                            />
                          </AccordionSummary>
                          <AccordionDetails>
                            <Stack spacing={2}>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  Class
                                </Typography>
                                <Typography>{entry.class.className}</Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  Subject
                                </Typography>
                                <Typography>
                                  {entry.subject.subjectName}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                >
                                  Batches
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  flexWrap="wrap"
                                  gap={1}
                                >
                                  {(entry.batchYear || []).map((batchId, i) => {
                                    const batch = batches.find(
                                      (b) => b._id === batchId
                                    );
                                    return (
                                      <Chip
                                        key={i}
                                        label={
                                          batch?.batchYear || "Unknown Batch"
                                        }
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        icon={
                                          <Schedule sx={{ fontSize: 16 }} />
                                        }
                                      />
                                    );
                                  })}
                                </Stack>
                              </Box>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
        <DialogTitle
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          Create New Access
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedBatches([]);
              }}
              label="Subject"
              disabled={loading.subjects}
              startAdornment={
                <Subject sx={{ color: "action.active", mr: 1 }} />
              }
            >
              {loading.subjects ? (
                <MenuItem disabled>Loading subjects...</MenuItem>
              ) : subjects.length === 0 ? (
                <MenuItem disabled>No subjects found</MenuItem>
              ) : (
                subjects.map((subject) => (
                  <MenuItem key={subject._id} value={subject._id}>
                    {subject.subjectName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Batches</InputLabel>
            <Select
              multiple
              value={selectedBatches}
              onChange={(e) => setSelectedBatches(e.target.value)}
              label="Batches"
              disabled={loading.batches || !selectedSubject}
              renderValue={(selected) => (
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {selected.map((batchId) => {
                    const batch = batches.find((b) => b._id === batchId);
                    return (
                      <Chip
                        key={batchId}
                        label={batch?.batchYear || "Unknown Batch"}
                        size="small"
                        color="secondary"
                      />
                    );
                  })}
                </Stack>
              )}
            >
              {loading.batches ? (
                <MenuItem disabled>Loading batches...</MenuItem>
              ) : batches.length === 0 ? (
                <MenuItem disabled>
                  No batches available for this subject
                </MenuItem>
              ) : (
                batches.map((batch) => (
                  <MenuItem key={batch._id} value={batch._id}>
                    <Checkbox checked={selectedBatches.includes(batch._id)} />
                    <ListItemText primary={batch.batchYear} />
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
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
            sx={{ minWidth: 100 }}
          >
            {loading.creating ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          sx={{
            bgcolor:
              snackbar.severity === "error" ? "error.main" : "success.main",
            color: "white",
            px: 3,
            py: 2,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography>{snackbar.message}</Typography>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
      <UpdateAccessModal
        open={openUpdateDialog}
        onClose={() => {
          setOpenUpdateDialog(false);
          setSelectedAccessData(null);
        }}
        accessData={selectedAccessData}
        onUpdate={updateAccess}
        token={token}
        classId={selectedClass}
      />
    </Container>
  );
};

export default TeacherAccessManagement;
