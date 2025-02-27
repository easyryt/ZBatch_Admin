import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Link,
  Paper,
  Box
} from '@mui/material';
import styles from './BlogDetail.module.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(
          `https://zbatch.onrender.com/admin/blog/get/${id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog details');
        }
        
        const data = await response.json();
        
        if (data.status) {
          setBlogData(data.data);
        } else {
          throw new Error(data.message || 'Blog not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" className={styles.errorContainer}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!blogData) {
    return null;
  }

  return (
    <Container maxWidth="md" className={styles.blogContainer}>
      <Paper elevation={3} className={styles.blogPaper}>
        <Box className={styles.featureImageContainer}>
          <img
            src={blogData.featureImage.url}
            alt="Feature"
            className={styles.featureImage}
          />
        </Box>

        <Box className={styles.blogContent}>
          <Chip
            label={blogData.catId.categoryName}
            color="primary"
            className={styles.categoryChip}
          />

          <Typography variant="h2" className={styles.blogTitle}>
            {blogData.blogName}
          </Typography>

          <Typography variant="h5" className={styles.author}>
            By {blogData.authorName}
          </Typography>

          <Typography variant="h4" className={styles.title}>
            {blogData.title}
          </Typography>

          <Typography variant="h5" className={styles.subtitle}>
            {blogData.subtitle}
          </Typography>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: blogData.mixContent }}
          />

          {blogData.pdfLink && (
            <Box className={styles.pdfSection}>
              <Typography variant="h6" className={styles.pdfHeading}>
                Download PDF:
              </Typography>
              <Link
                href={blogData.pdfLink}
                target="_blank"
                rel="noopener"
                className={styles.pdfLink}
              >
                {blogData.pdfLink}
              </Link>
            </Box>
          )}

          <Box className={styles.metaData}>
            <Typography variant="body2" color="textSecondary">
              Created At: {new Date(blogData.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last Updated: {new Date(blogData.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogDetail;