import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
} from "@mui/material";
import { Download, Visibility } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";

const BatchDescription = ({ id }) => {
  const [batchDetails, setBatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch batch details
  useEffect(() => {
    const fetchBatchDetails = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/batches/discription/get/${id}`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        if (response.data.status) {
          setBatchDetails(response.data.data);
        }
      } catch (error) {
        setError("Failed to fetch batch details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBatchDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const handleDownloadPDF = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "schedule.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Batch Details
      </Typography>

      {/* Batch Info */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Batch ID:</Typography>
              <Typography variant="body1">{batchDetails.batchId}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Divider />
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Course Duration:</Typography>
              <Typography variant="body1">
                {new Date(
                  batchDetails.courseDuration.startDate
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(
                  batchDetails.courseDuration.endDate
                ).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Divider />
      {/* Batch Includes */}
      <Typography variant="h6" mt={2}>
        Batch Includes:
      </Typography>
      <Typography variant="body1">
        {batchDetails.batchIncludes.join(", ")}
      </Typography>
      <Divider />
      {/* Validity */}
      <Typography variant="h6" mt={2}>
        Validity:
      </Typography>
      <Typography variant="body1">
        {new Date(batchDetails.validity).toLocaleDateString()}
      </Typography>
      <Divider />
      {/* Subjects */}
      <Typography variant="h6" mt={2}>
        Subjects:
      </Typography>
      <Typography variant="body1">
        {batchDetails.subjects.join(", ")}
      </Typography>
      <Divider />
      {/* Teachers */}
      <Typography variant="h6" mt={2}>
        Know Your Teachers:
      </Typography>
      <Grid container spacing={2}>
        {batchDetails.knowYourTeachers.map((teacher, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ textAlign: "center", padding: 2 }}>
              <CardMedia
                component="img"
                image={teacher.pic}
                alt={teacher.teacherName}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  margin: "0 auto",
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography variant="h6" mt={1}>
                  {teacher.teacherName}
                </Typography>
                <Typography variant="body1">{teacher.expertise}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {teacher.yearOfEx} years of experience
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider />
      {/* Schedule */}
      <Typography variant="h6" mt={2}>
        Schedule:
      </Typography>
      <Grid container spacing={2}>
        {batchDetails.schedule.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.icon}
                alt={item.subject}
              />
              <CardContent>
                <Typography variant="h6">{item.subject}</Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                    startIcon={<Visibility />}
                    href={item.pdf}
                    target="_blank"
                    variant="outlined"
                  >
                    View PDF
                  </Button>
                  <Button
                    startIcon={<Download />}
                    onClick={() => handleDownloadPDF(item.pdf)}
                    variant="contained"
                  >
                    Download
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider />
      {/* Other Details */}
      <Typography variant="h6" mt={2}>
        Other Details:
      </Typography>
      <Typography variant="body1">
        {batchDetails.otherDetails.join(", ")}
      </Typography>
      <Divider />
      {/* FAQ */}
      <Typography variant="h6" mt={2}>
        FAQ:
      </Typography>
      {batchDetails.faq.map((faq, index) => (
        <Box key={index} mt={1}>
          <Typography variant="body1" fontWeight="bold">
            Q: {faq.question}
          </Typography>
          <Typography variant="body2">A: {faq.answer}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BatchDescription;
