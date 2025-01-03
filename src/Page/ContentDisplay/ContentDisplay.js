import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockIcon from "@mui/icons-material/Lock";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";
import Cookies from "js-cookie";

const ContentDisplay = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/allClass/subjects/contents/getAll/${id}`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        if (response.data.status) {
          setContentData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        Content
      </Typography>
      <Grid container spacing={3}>
        {contentData.map((content) => (
          <Grid item xs={12} sm={6} md={4} key={content._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="180"
                image={content.thumbnailImg.url}
                alt={content.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {content.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Content Type: {content.contentType}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Part: {content.part}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Duration: {content.duration}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  {content.isFreeContent ? (
                    <CheckCircleOutlineIcon color="success" />
                  ) : (
                    <LockIcon color="error" />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {content.isFreeContent ? "Free Content" : "Premium Content"}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayCircleOutlineIcon />}
                  href={content.videoUrl}
                  target="_blank"
                >
                  Watch Video
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ContentDisplay;
