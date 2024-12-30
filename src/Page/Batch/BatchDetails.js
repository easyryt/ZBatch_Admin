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
  Divider,
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
    knowYourTeachers: ["676d58b2aee6c317dc5d3ed9", "676d58f2aee6c317dc5d3edd"], // Default teachers
    schedule: [
      { subject: "676d5864aee6c317dc5d3ece" },
      { subject: "676d587eaee6c317dc5d3ed2" },
    ],
    otherDetails: [
      "Additional details about the batch",
      "This batch will help you in examonation",
    ],
    faq: [{ que: "", ans: "" }],
    subjects: [""],
  });
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState(
    formData.knowYourTeachers
  );

  const handleInputChange = (key, value) => {
    setInputValue(value);
  };

  const handleAddItem = () => {
    if (!inputValue.trim()) return; // Prevent empty input

    const newItems = inputValue.split(",").map((item) => item.trim()); // Split and trim input items
    setFormData((prev) => ({
      ...prev,
      batchIncludes: [...newItems, ...prev.batchIncludes], // Add new items at the top
    }));

    setInputValue(""); // Clear the input field after adding
  };

  const handleRemoveItem = (index) => {
    const updatedBatchIncludes = [...formData.batchIncludes];
    updatedBatchIncludes.splice(index, 1);
    setFormData({ ...formData, batchIncludes: updatedBatchIncludes });
  };

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

  const handleNestedChange = (section, index, field, value) => {
    const updatedSection = [...formData[section]];
    updatedSection[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      [section]: updatedSection,
    }));
  };

  const handleRemoveSchedule = (index) => {
    const newSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleFileChange = (index, file) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index].pdf = file;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleAddSchedule = () => {
    const newSchedule = [...formData.schedule, { subject: "", pdf: null }];
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleTeacherChange = (e) => {
    const selectedTeacherId = e.target.value;
    if (!selectedTeachers.includes(selectedTeacherId)) {
      const newSelectedTeachers = [...selectedTeachers, selectedTeacherId];
      setSelectedTeachers(newSelectedTeachers);
      setFormData((prevData) => ({
        ...prevData,
        knowYourTeachers: newSelectedTeachers,
      }));
    }
  };

  const handleRemoveTeacher = (teacherId) => {
    const newSelectedTeachers = selectedTeachers.filter(
      (id) => id !== teacherId
    );
    setSelectedTeachers(newSelectedTeachers);
    setFormData((prevData) => ({
      ...prevData,
      knowYourTeachers: newSelectedTeachers,
    }));
  };

  // Handler for updating the `otherDetails` array
  const handleDetailChange = (index, value) => {
    const updatedDetails = [...formData.otherDetails];
    updatedDetails[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      otherDetails: updatedDetails,
    }));
  };

  // Handler for adding a new detail
  const handleAddDetail = () => {
    setFormData((prevData) => ({
      ...prevData,
      otherDetails: [...prevData.otherDetails, ""],
    }));
  };

  // Handler for removing a detail
  const handleRemoveDetail = (index) => {
    const updatedDetails = formData.otherDetails.filter(
      (_, idx) => idx !== index
    );
    setFormData((prevData) => ({
      ...prevData,
      otherDetails: updatedDetails,
    }));
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
          overflowY: "scroll",
          height: "95vh",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create Batch Description
        </Typography>

        <Box
          sx={{
            margin: "auto",
            padding: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Title */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Batch Includes
          </Typography>

          {/* Input Field and Add Button */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              mt: 2,
            }}
          >
            <TextField
              label="Enter items (comma-separated)"
              value={inputValue}
              onChange={(e) =>
                handleInputChange("batchIncludes", e.target.value)
              }
              fullWidth
              placeholder="e.g., Video Lectures, Assignments, Exams"
              variant="outlined"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              sx={{ fontWeight: "bold", px: 3 }}
            >
              Add
            </Button>
          </Box>

          {/* Batch Includes List */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "text.primary", fontWeight: "bold" }}
            >
              Added Items:
            </Typography>

            {formData.batchIncludes.length > 0 ? (
              <List sx={{ bgcolor: "background.default", borderRadius: 2 }}>
                {formData.batchIncludes.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e0e0e0",
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item}
                    </Typography>

                    {/* Remove Icon */}
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, fontStyle: "italic" }}
              >
                No items added yet. Start by adding items above!
              </Typography>
            )}
          </Box>
        </Box>
        <br />
        <Box
          sx={{
            margin: "auto",
            padding: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Title */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Course Duration
          </Typography>

          {/* Start Date and End Date Fields */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
            }}
          >
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
              sx={{
                bgcolor: "background.default",
                borderRadius: 1,
              }}
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
              sx={{
                bgcolor: "background.default",
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>
        <br />
        <Box
          sx={{
            margin: "auto",
            padding: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Title */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Validity
          </Typography>

          <TextField
            label="Validity"
            type="date"
            value={formData.validity}
            onChange={(e) => handleInputChange("validity", e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <br />
        <Box
          sx={{
            margin: "auto",
            padding: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Title */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            know Your Teachers
          </Typography>
          {/* Teacher Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="teacher-select-label">Select Teacher</InputLabel>
            <Select
              labelId="teacher-select-label"
              value=""
              onChange={handleTeacherChange}
              renderValue={() => ""}
            >
              {teachersList.map((teacher) => (
                <MenuItem key={teacher?._id} value={teacher?._id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src={teacher?.pic?.url}
                      alt={teacher?.teacherName}
                      style={{ width: 32, height: 32, borderRadius: "50%" }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {teacher?.teacherName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {teacher?.expertise}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Display Selected Teachers */}
          <Box sx={{ mt: 3 }}>
            {selectedTeachers.map((teacherId) => {
              const teacher = teachersList.find((t) => t._id === teacherId);
              return (
                <Box
                  key={teacher?._id}
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
                    src={teacher?.pic?.url}
                    alt={teacher?.teacherName}
                    style={{ width: 48, height: 48, borderRadius: "50%" }}
                  />
                  <Box>
                    <Typography variant="h6">{teacher?.teacherName}</Typography>
                    <Typography variant="body2">
                      Expertise: {teacher?.expertise}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Experience: {teacher?.yearOfEx} years
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveTeacher(teacher?._id)}
                  >
                    Remove
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Box>
        <br />
        <Box
          sx={{
            margin: "auto",
            padding: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Title */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Schedule
          </Typography>
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
              <Box style={{display:"flex",alignItems:"center",gap:"10px"}}>
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
              {item.pdf && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  {item.pdf.name}
                </Typography>
              )}

              {/* Remove Schedule Entry */}
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => handleRemoveSchedule(index)}
              >
                Remove
              </Button>
              </Box>
            
            </Box>
          ))}

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
        <br />

        <Box
          sx={{
            margin: "auto",
            padding: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Displaying and editing otherDetails */}
          <Typography variant="h6" gutterBottom>
            Other Details
          </Typography>
          {formData.otherDetails.map((detail, index) => (
            <Box
              key={index}
              sx={{ mb: 2, display: "flex", alignItems: "center" }}
            >
              <TextField
                fullWidth
                value={detail}
                onChange={(e) => handleDetailChange(index, e.target.value)}
                label={`Detail ${index + 1}`}
                variant="outlined"
                multiline
                rows={3}
                sx={{ mr: 2 }}
              />
              {/* Remove button */}
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveDetail(index)}
              >
                Remove
              </Button>
            </Box>
          ))}

          {/* Button to add a new detail */}
          <Button variant="outlined" onClick={handleAddDetail} sx={{ mt: 2 }}>
            Add Detail
          </Button>
        </Box>

        <br />

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
