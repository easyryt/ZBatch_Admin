import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import axios from "axios";

const BatchDetails = ({ open, handleClose, id }) => {
  const [formData, setFormData] = useState({
    batchIncludes: ["Video Lectures", "Assignments", "Exams"],
    courseDuration: { startDate: "", endDate: "" },
    validity: "",
    knowYourTeachers: [""],
    schedule: [{ subject: "", pdf: null }],
    otherDetails: [""],
    faq: [{ que: "", ans: "" }],
    subjects: [""],
  });
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          "https://npc-classes.onrender.com/admin/subjects/getAll",
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        setSubjectsList(response.data.data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "https://npc-classes.onrender.com/admin/teachers/getAll",
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        setTeachersList(response.data.data || []);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (field) => {
    const newItem = Array.isArray(formData[field][0])
      ? { que: "", ans: "" }
      : field === "schedule"
      ? { subject: "", pdf: null }
      : "";
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("token");
    const url = `https://npc-classes.onrender.com/admin/batches/discription/create/${id}`;
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          if (key === "schedule" && item.pdf) {
            data.append(`${key}[${idx}][pdf]`, item.pdf);
          } else if (typeof item === "object") {
            Object.entries(item).forEach(([subKey, subValue]) => {
              data.append(`${key}[${idx}][${subKey}]`, subValue);
            });
          } else {
            data.append(`${key}[]`, item);
          }
        });
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          data.append(`${key}[${subKey}]`, subValue);
        });
      } else {
        data.append(key, value);
      }
    });

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Success:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { subject: "", pdf: null }],
    }));
  };
  const handleRemoveSchedule = (index) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };
  const handleFileChange = (index, file) => {
    setFormData((prev) => {
      const updatedSchedule = [...prev.schedule];
      updatedSchedule[index].pdf = file;
      return { ...prev, schedule: updatedSchedule };
    });
  };
  const handleNestedChange = (field, index, key, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index][key] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY:"scroll",
          height:"100vh"
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create Batch Description
        </Typography>

        <TextField
          label="Batch Includes"
          value={formData.batchIncludes.join(", ")}
          onChange={(e) =>
            handleInputChange("batchIncludes", e.target.value.split(","))
          }
          fullWidth
          margin="normal"
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={formData.courseDuration.startDate}
            onChange={(e) =>
              handleInputChange("courseDuration", {
                ...formData.courseDuration,
                startDate: e.target.value,
              })
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={formData.courseDuration.endDate}
            onChange={(e) =>
              handleInputChange("courseDuration", {
                ...formData.courseDuration,
                endDate: e.target.value,
              })
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <TextField
          label="Validity"
          type="date"
          value={formData.validity}
          onChange={(e) => handleInputChange("validity", e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Schedule</Typography>
          {formData.schedule.map((item, index) => (
            <Box
              key={index}
              sx={{ mt: 2, border: "1px solid #ccc", p: 2, borderRadius: 2 }}
            >
              {/* Subject Selector */}
              <FormControl fullWidth margin="normal">
                <InputLabel id={`subject-select-label-${index}`}>
                  Select Subject
                </InputLabel>
                <Select
                  labelId={`subject-select-label-${index}`}
                  value={item.subject}
                  onChange={(e) =>
                    handleNestedChange(
                      "schedule",
                      index,
                      "subject",
                      e.target.value
                    )
                  }
                  renderValue={(selected) => {
                    const selectedSubject = subjectsList.find(
                      (sub) => sub._id === selected
                    );
                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src={selectedSubject?.icon?.url}
                          alt={selectedSubject?.subjectName}
                          style={{ width: 24, height: 24, borderRadius: "50%" }}
                        />
                        <span>{selectedSubject?.subjectName}</span>
                      </Box>
                    );
                  }}
                >
                  {subjectsList.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src={subject.icon.url}
                          alt={subject.subjectName}
                          style={{ width: 24, height: 24, borderRadius: "50%" }}
                        />
                        <span>{subject.subjectName}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* PDF Upload */}
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ mt: 1 }}
              >
                Upload PDF
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                />
              </Button>

              {/* Remove Schedule Entry */}
              <Button
                variant="text"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => handleRemoveSchedule(index)}
              >
                Remove
              </Button>
            </Box>
          ))}
          <FormControl fullWidth margin="normal">
            <InputLabel id="teacher-select-label">Select Teacher</InputLabel>
            <Select
              labelId="teacher-select-label"
              value=""
              onChange={(e) => {
                const selectedTeacher = teachersList.find(
                  (teacher) => teacher._id === e.target.value
                );
                if (
                  selectedTeacher &&
                  !selectedTeachers.includes(selectedTeacher._id)
                ) {
                  setSelectedTeachers([
                    ...selectedTeachers,
                    selectedTeacher._id,
                  ]);
                }
              }}
              renderValue={() => ""}
            >
              {teachersList.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src={teacher.pic.url}
                      alt={teacher.teacherName}
                      style={{ width: 32, height: 32, borderRadius: "50%" }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {teacher.teacherName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {teacher.expertise}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 3 }}>
            {selectedTeachers.map((teacherId) => {
              const teacher = teachersList.find((t) => t._id === teacherId);
              return (
                <Box
                  key={teacher._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    padding: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={teacher.pic.url}
                    alt={teacher.teacherName}
                    style={{ width: 48, height: 48, borderRadius: "50%" }}
                  />
                  <Box>
                    <Typography variant="h6">{teacher.teacherName}</Typography>
                    <Typography variant="body2">
                      Expertise: {teacher.expertise}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Experience: {teacher.yearOfEx} years
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      setSelectedTeachers((prev) =>
                        prev.filter((id) => id !== teacher._id)
                      )
                    }
                  >
                    Remove
                  </Button>
                </Box>
              );
            })}
          </Box>

          {/* Add Schedule Entry */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleAddSchedule}
          >
            Add Schedule
          </Button>
        </Box>

        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            FAQ
          </AccordionSummary>
          <AccordionDetails>
            {formData.faq.map((item, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <TextField
                  label={`Question ${index + 1}`}
                  value={item.que}
                  onChange={(e) =>
                    handleNestedChange("faq", index, "que", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={`Answer ${index + 1}`}
                  value={item.ans}
                  onChange={(e) =>
                    handleNestedChange("faq", index, "ans", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddItem("faq")}
              >
                Add FAQ
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BatchDetails;
