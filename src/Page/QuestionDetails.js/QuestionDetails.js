import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import styles from "./QuestionDetails.module.css";
import CreateQuestionModal from "./CreateQuestionModal";

const QuestionDetails = () => {
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { batchId, id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/batches/test/subjects/tests/get/${id}`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        setTestDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching test details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, update]);

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="body1" color="primary">
          Loading test details...
        </Typography>
      </Box>
    );
  }

  if (!testDetails) {
    return (
      <Typography variant="body1" color="error" align="center">
        Error loading test details.
      </Typography>
    );
  }

  const { name, description, questions, totalMarks, duration } = testDetails;

  const handleOpenModal = (question = null) => {
    setSelectedQuestion(question);
    setModalOpen(true);
  };

  return (
    <Paper className={styles.container}>
      <Typography variant="h4" className={styles.title} gutterBottom>
        Test Details
      </Typography>

      <Divider />

      <Box className={styles.section}>
        <Typography variant="h6">Test Name</Typography>
        <Typography variant="body1" color="textSecondary">
          {name}
        </Typography>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Description</Typography>
        <Typography variant="body1" color="textSecondary">
          {description}
        </Typography>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Total Marks</Typography>
        <Typography variant="body1" color="textSecondary">
          {totalMarks}
        </Typography>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Duration (mins)</Typography>
        <Typography variant="body1" color="textSecondary">
          {duration}
        </Typography>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h5" gutterBottom>
          Questions
        </Typography>
        {questions.map((question, index) => (
          <Paper
            key={question._id}
            className={styles.questionCard}
            elevation={2}
          >
            <Typography className={styles.questionText}>
              {index + 1}. {question.questionText}
            </Typography>

            <List>
              {question.options.map((option, i) => (
                <ListItem key={i}>
                  <ListItemIcon>
                    {option.isCorrect ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Cancel color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${String.fromCharCode(65 + i)}: ${
                      option.optionText
                    }`}
                  />
                </ListItem>
              ))}
            </List>

            <Typography variant="body2" className={styles.difficultyLevel}>
              Difficulty: {question.difficultyLevel}
            </Typography>

            <Typography variant="body2" className={styles.correctAnswer}>
              Correct Answer: {question.correctAnswer}
            </Typography>

            <Typography variant="body2" className={styles.explanation}>
              Explanation: {question.explanation}
            </Typography>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleOpenModal(question)}
              className={styles.editButton}
            >
              Edit Question
            </Button>
          </Paper>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        className={styles.addButton}
      >
        Add New Question
      </Button>
      <CreateQuestionModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        setUpdate={setUpdate}
        id={id}
        batchId={batchId}
        question={selectedQuestion}
      />
    </Paper>
  );
};

export default QuestionDetails;
