// src/services/api.js
import axios from 'axios';

const API_BASE = 'https://zbatch.onrender.com/admin/offline';

export const getClasses = (token) => 
  axios.get(`${API_BASE}/class-subject-year-student/class/getAll`, {
    headers: { "x-admin-token": token }
  });

export const getSubjects = (classId, token) => 
  axios.get(`${API_BASE}/class-subject-year-student/subject/getAll/${classId}`, {
    headers: { "x-admin-token": token }
  });

export const getBatches = (subjectId, token) => 
  axios.get(`${API_BASE}/class-subject-year-student/batchYear/getAll/${subjectId}`, {
    headers: { "x-admin-token": token }
  });

export const getStudents = (batchId, token) => 
  axios.get(`${API_BASE}/class-subject-year-student/enrollStudent/getAll/${batchId}`, {
    headers: { "x-admin-token": token }
  });

export const getAnalytics = (batchId, studentId, token) => 
  axios.get(`${API_BASE}/student/attendance/anlytics/${batchId}/${studentId}`, {
    headers: { "x-admin-token": token }
  });