import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import { ExpandMore, Close } from '@mui/icons-material';
import styles from './TeacherAccessManagement.module.css';
import { useParams } from 'react-router-dom';

const TeacherAccessManagement = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [teacherAccess, setTeacherAccess] = useState([]);
  const [loading, setLoading] = useState({
    classes: true,
    teachers: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const {id} = useParams()

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk4M2VhODQ5OTRlMDllNTJjMWIxYyIsImlhdCI6MTczNDk2ODQxNX0.0mxzxb4WBh_GAWHfyfMudWl5cPn6thbigI8VH_AFV8A";

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTeacherAccess();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        'https://zbatch.onrender.com/admin/offline/class-subject-year-student/class/getAll',
        { headers: { 'x-admin-token': token } }
      );
      setClasses(response.data.data || []);
    } catch (error) {
      showSnackbar('Failed to fetch classes', 'error');
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchTeacherAccess = async () => {
    setLoading(prev => ({ ...prev, teachers: true }));
    try {
      const response = await axios.get(
        'https://zbatch.onrender.com/admin/offline/teacher/access/getAll',
        {
          params: { className: selectedClass },
          headers: { 
            'x-admin-token': token,
            'Content-Type': 'application/json'
          }
        }
      );
      setTeacherAccess(response.data.data || []);
    } catch (error) {
      showSnackbar('Failed to fetch teacher access', 'error');
    } finally {
      setLoading(prev => ({ ...prev, teachers: false }));
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
        
        <FormControl variant="outlined" className={styles.select}>
          <InputLabel>Select Class</InputLabel>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            label="Select Class"
            disabled={loading.classes}
          >
            {classes.map((cls) => (
              <MenuItem key={cls._id} value={cls.className}>
                {cls.className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
                            <Typography>
                              Batch Year: {entry.batch.year}
                            </Typography>
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
          backgroundColor: snackbar.severity === 'error' ? 'error.main' : 'success.main',
          color: 'white',
        }}
      />
    </Container>
  );
};

export default TeacherAccessManagement;