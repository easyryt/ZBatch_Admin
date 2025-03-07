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
import UpdateParentAccessModal from "./UpdateParentAccessModal";

const ParentAccessManagement = () => {
  const { id } = useParams();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [parentAccess, setParentAccess] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [loading, setLoading] = useState({
    classes: true,
    parents: false,
    creating: false,
    subjects: false,
    batches: false,
    students: false,
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
      fetchParentAccess();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (openCreateDialog && selectedClass && selectedSubject) {
      fetchBatches(selectedClass, selectedSubject);
    }
  }, [selectedSubject, openCreateDialog, selectedClass]);

  useEffect(() => {
    if (selectedBatch) {
      fetchStudents(selectedBatch);
    } else {
      setStudents([]);
      setSelectedStudents([]);
    }
  }, [selectedBatch]);

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

  const fetchStudents = async (batchId) => {
    setLoading((prev) => ({ ...prev, students: true }));
    try {
      const response = await axios.get(
        `https://zbatch.onrender.com/admin/offline/class-subject-year-student/enrollStudent/getAll/${batchId}`,
        { headers: { "x-admin-token": token } }
      );
      setStudents(response.data.data || []);
    } catch (error) {
      showSnackbar("Failed to fetch students", "error");
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  };

  const fetchParentAccess = async () => {
    setLoading((prev) => ({ ...prev, parents: true }));
    try {
      const cls = classes.find((c) => c._id === selectedClass);
      if (!cls) return;

      const response = await axios.get(
        "https://zbatch.onrender.com/admin/offline/parent/access/getAll",
        {
          params: { className: cls.className },
          headers: { "x-admin-token": token },
        }
      );
      setParentAccess(response.data.data || []);
    } catch (error) {
      showSnackbar("Failed to fetch parent access", "error");
    } finally {
      setLoading((prev) => ({ ...prev, parents: false }));
    }
  };

  const createAccess = async () => {
    if (!selectedSubject || !selectedBatch) {
      showSnackbar("Please select subject and batch", "error");
      return;
    }

    if (selectedStudents.length === 0) {
      showSnackbar("Please select at least one student", "error");
      return;
    }

    setLoading((prev) => ({ ...prev, creating: true }));
    try {
      await axios.post(
        `https://zbatch.onrender.com/admin/offline/parent/access/create/${id}`,
        {
          studentBatchEnrollment: selectedStudents,
        },
        { headers: { "x-admin-token": token } }
      );
      showSnackbar("Access created successfully", "success");
      setOpenCreateDialog(false);
      setSelectedBatch("");
      setSelectedSubject("");
      setSelectedStudents([]);
      fetchParentAccess();
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
          Parent Access Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSubject("");
                setSelectedBatch("");
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
      {loading.parents ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Parent Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Update</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Access Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parentAccess.map(
                  ({ _id, parentId, studentBatchEnrollment }) => (
                    <TableRow key={_id} hover>
                      <TableCell>{parentId.parentName}</TableCell>
                      <TableCell>{parentId.email}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedParent(parentId._id);
                            setUpdateModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        {studentBatchEnrollment.map((enrollment) => (
                          <Accordion
                            key={enrollment._id}
                            elevation={0}
                            sx={{ bgcolor: "background.default" }}
                          >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Chip
                                label={`${enrollment.clsId.className} - ${enrollment.subjectId.subjectName}`}
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
                                  <Typography>
                                    {enrollment.clsId.className}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    Subject
                                  </Typography>
                                  <Typography>
                                    {enrollment.subjectId.subjectName}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    gutterBottom
                                  >
                                    Batch
                                  </Typography>
                                  <Chip
                                    label={enrollment.batchYearId.batchYear}
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    icon={<Schedule sx={{ fontSize: 16 }} />}
                                  />
                                </Box>
                              </Stack>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </TableCell>
                    </TableRow>
                  )
                )}
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
          setSelectedBatch("");
          setSelectedStudents([]);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          Create New Access
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedBatch("");
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
            <InputLabel>Batch</InputLabel>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              label="Batch"
              disabled={loading.batches || !selectedSubject}
              startAdornment={
                <Schedule sx={{ color: "action.active", mr: 1 }} />
              }
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
                    {batch.batchYear}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Students</InputLabel>
            <Select
              multiple
              value={selectedStudents}
              onChange={(e) => setSelectedStudents(e.target.value)}
              label="Students"
              disabled={loading.students || !selectedBatch}
              renderValue={(selected) => (
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {selected.map((studentId) => {
                    const student = students.find((s) => s._id === studentId);
                    return (
                      <Chip
                        key={studentId}
                        label={student?.studentName || "Unknown Student"}
                        size="small"
                        color="primary"
                      />
                    );
                  })}
                </Stack>
              )}
            >
              {loading.students ? (
                <MenuItem disabled>Loading students...</MenuItem>
              ) : students.length === 0 ? (
                <MenuItem disabled>
                  No students found in selected batch
                </MenuItem>
              ) : (
                students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    <Checkbox
                      checked={selectedStudents.includes(student._id)}
                    />
                    <ListItemText primary={student.studentName} />
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenCreateDialog(false);
              setSelectedSubject("");
              setSelectedBatch("");
              setSelectedStudents([]);
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
      {selectedParent && (
        <UpdateParentAccessModal
          open={updateModalOpen}
          onClose={(refresh) => {
            setUpdateModalOpen(false);
            if (refresh) fetchParentAccess();
          }}
          classId={selectedClass}
          parentId={selectedParent}
        />
      )}
    </Container>
  );
};

export default ParentAccessManagement;
