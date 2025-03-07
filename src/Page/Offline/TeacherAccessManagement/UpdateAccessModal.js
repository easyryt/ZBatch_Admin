import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Stack,
  Chip,
} from "@mui/material";

const UpdateAccessModal = ({ open, onClose, accessData, onUpdate, token, classId }) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState({
    subjects: true,
    batches: true,
    updating: false,
  });

  console.log(accessData,"accessData")

  useEffect(() => {
    if (open && accessData) {
      setSelectedSubject(accessData.subjectId);
      setSelectedBatches(accessData.selectedBatches);
      fetchSubjects();
      fetchBatches(accessData.subjectId);
    }
  }, [open, accessData]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `https://zbatch.onrender.com/admin/offline/class-subject-year-student/subject/getAll/${classId}`,
        { headers: { "x-admin-token": token } }
      );
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading((prev) => ({ ...prev, subjects: false }));
    }
  };

  const fetchBatches = async (subjectId) => {
    setLoading((prev) => ({ ...prev, batches: true }));
    try {
      const response = await axios.get(
        `https://zbatch.onrender.com/admin/offline/class-subject-year-student/batchYear/getAll/${subjectId}`,
        { headers: { "x-admin-token": token } }
      );
      setBatches(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    } finally {
      setLoading((prev) => ({ ...prev, batches: false }));
    }
  };

  const handleUpdate = async () => {
    if (selectedBatches.length === 0) return;
    setLoading((prev) => ({ ...prev, updating: true }));
    try {
      await onUpdate(accessData.accessId, selectedSubject, selectedBatches);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading((prev) => ({ ...prev, updating: false }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Subject and Batches</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Subject</InputLabel>
          <Select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedBatches([]);
              fetchBatches(e.target.value);
            }}
            label="Subject"
            disabled={loading.subjects}
          >
            {loading.subjects ? (
              <MenuItem disabled>Loading subjects...</MenuItem>
            ) : subjects?.length === 0 ? (
              <MenuItem disabled>No subjects available</MenuItem>
            ) : (
              subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.subjectName}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
          <InputLabel>Batches</InputLabel>
          <Select
            multiple
            value={selectedBatches}
            onChange={(e) => setSelectedBatches(e.target.value)}
            label="Batches"
            disabled={loading.batches}
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
            ) : batches?.length === 0 ? (
              <MenuItem disabled>No batches available</MenuItem>
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
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={loading.updating || selectedBatches?.length === 0}
        >
          {loading.updating ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAccessModal;