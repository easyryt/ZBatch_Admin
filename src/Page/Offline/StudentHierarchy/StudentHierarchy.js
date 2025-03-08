// src/components/StudentHierarchy/StudentHierarchy.jsx
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Backdrop,
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import {
  Folder,
  Subject,
  ArrowBack,
  CalendarMonth,
  Search,
  Close,
  Person,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import styles from "./StudentHierarchy.module.css";
import {
  getClasses,
  getSubjects,
  getBatches,
  getStudents,
  getAnalytics,
  getAttendenceAnalytics,
} from "./api";

const StudentHierarchy = () => {
  const [currentLevel, setCurrentLevel] = useState("class");
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [attendanceList, setAttendanceList] = useState(null);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk4M2VhODQ5OTRlMDllNTJjMWIxYyIsImlhdCI6MTczNDk2ODQxNX0.0mxzxb4WBh_GAWHfyfMudWl5cPn6thbigI8VH_AFV8A";
 console.log(attendanceList,"list")
  const levelTitles = {
    class: "Classes",
    subject: "Subjects",
    batch: "Batches",
    student: "Students",
    analytics: "Attendance Analytics",
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await getClasses(token);
      setClasses(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm("");

  const filteredItems = () => {
    const items =
      {
        class: classes,
        subject: subjects,
        batch: batches,
        student: students,
      }[currentLevel] || [];

    return items.filter((item) => {
      const searchField =
        item.className ||
        item.subjectName ||
        item.batchYear ||
        item.studentName ||
        "";
      return searchField.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const handleCardClick = async (item) => {
    setLoading(true);
    try {
      switch (currentLevel) {
        case "class":
          const subjectsRes = await getSubjects(item._id, token);
          setSubjects(subjectsRes.data.data);
          setCurrentLevel("subject");
          setSelected({ class: item });
          break;
        case "subject":
          const batchesRes = await getBatches(item._id, token);
          setBatches(batchesRes.data.data);
          setCurrentLevel("batch");
          setSelected((prev) => ({ ...prev, subject: item }));
          break;
        case "batch":
          const studentsRes = await getStudents(item._id, token);
          setStudents(studentsRes.data.data);
          setCurrentLevel("student");
          setSelected((prev) => ({ ...prev, batch: item }));
          break;
        case "student":
          const analyticsRes = await getAnalytics(
            selected.batch._id,
            item._id,
            token
          );
          const analyticsList = await getAttendenceAnalytics(
            selected.batch._id,
            item._id,
            token
          );
          setAnalytics(analyticsRes.data.data);
          setAttendanceList(analyticsList.data.data)
          setCurrentLevel("analytics");
          setSelected((prev) => ({ ...prev, student: item }));
          break;
      }
    } finally {
      setLoading(false);
      setSearchTerm("");
    }
  };

  const handleBack = () => {
    const levels = ["class", "subject", "batch", "student", "analytics"];
    const currentIndex = levels.indexOf(currentLevel);
    setCurrentLevel(levels[Math.max(0, currentIndex - 1)]);
    setSearchTerm("");
  };

  const renderIcon = () => {
    const iconStyle = { fontSize: 40, color: "#5C6BC0" };
    switch (currentLevel) {
      case "class":
        return <Folder style={iconStyle} />;
      case "subject":
        return <Subject style={iconStyle} />;
      case "batch":
        return <CalendarMonth style={iconStyle} />;
      case "student":
        return <Person style={iconStyle} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Backdrop open={loading} className={styles.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box className={styles.header}>
        {currentLevel !== "class" && (
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            className={styles.backButton}
            variant="outlined"
          >
            Back
          </Button>
        )}
        <Typography variant="h4" className={styles.title}>
          {levelTitles[currentLevel]}
        </Typography>
      </Box>

      {currentLevel !== "analytics" && (
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search ${levelTitles[currentLevel]}...`}
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchBar}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <IconButton onClick={clearSearch}>
                <Close />
              </IconButton>
            ),
          }}
        />
      )}

      {currentLevel === "analytics" ? (
        <Card className={styles.analyticsCard}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {selected.student.studentName}'s Attendance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <div className={styles.analyticsDetail}>
                  <Typography variant="h6">Total Classes:</Typography>
                  <Typography variant="h4">
                    {analytics.totalConductedClasses}
                  </Typography>
                </div>
                <div className={styles.analyticsDetail}>
                  <Typography variant="h6">Attended:</Typography>
                  <Typography variant="h4" className={styles.attended}>
                    {analytics.attendedClasses}
                  </Typography>
                </div>
                <div className={styles.analyticsDetail}>
                  <Typography variant="h6">Absent:</Typography>
                  <Typography variant="h4" className={styles.absent}>
                    {analytics.absentClasses}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={styles.chartContainer}>
                  <Typography variant="h2" className={styles.percentage}>
                    {analytics.attendancePercent}%
                  </Typography>
                  <Typography variant="subtitle1">Attendance Rate</Typography>
                </div>
              </Grid>
            </Grid>
          </CardContent>
            {/* Attendance List Section */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Attendance History
                </Typography>
                {attendanceList?.length > 0 ? (
                  attendanceList?.map((record, index) => (
                    <Card
                      key={index}
                      className={styles.attendanceCard}
                      sx={{ mb: 1 }}
                    >
                      <CardContent className={styles.attendanceContent}>
                        <div className={styles.attendanceDetails}>
                          <Typography
                            variant="body1"
                            className={styles.attendanceDate}
                          >
                            {new Date(record.date).toLocaleDateString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            className={styles.attendanceSlot}
                          >
                            {record.slot}
                          </Typography>
                        </div>
                        {record.present ? (
                          <CheckCircle
                            color="success"
                            className={styles.statusIcon}
                          />
                        ) : (
                          <Cancel
                            color="error"
                            className={styles.statusIcon}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body1">
                    No attendance records found.
                  </Typography>
                )}
              </Grid>
        </Card>
      ) : (
        <Grid container spacing={3} className={styles.cardGrid}>
          {filteredItems().map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card
                className={styles.card}
                onClick={() => handleCardClick(item)}
              >
                <CardContent className={styles.cardContent}>
                  <div className={styles.cardIcon}>{renderIcon()}</div>
                  <Typography variant="h6" className={styles.cardTitle}>
                    {item.className ||
                      item.subjectName ||
                      item.batchYear ||
                      item.studentName}
                  </Typography>
                  {currentLevel === "student" && (
                    <Avatar
                      src={item.profilePic?.url}
                      className={styles.avatar}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default StudentHierarchy;
