import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import styles from "./QuestionDetails.module.css"; // Assuming you use module-level CSS
import { useParams } from "react-router-dom";

const QuestionDetails = () => {
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {id} = useParams()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token"); // Retrieve token from cookies
        const response = await axios.get(
          `https://npc-classes.onrender.com/admin/batches/test/subjects/tests/ques/get/${id}`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );
        setQuestionData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching question data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!questionData) {
    return <Typography>Error loading question data.</Typography>;
  }

  const { questionText, options, difficultyLevel, correctAnswer, explanation } =
    questionData;

  return (
    <Paper className={styles.container} elevation={3}>
      <Typography variant="h5" className={styles.title}>
        Question Details
      </Typography>
      <Box className={styles.section}>
        <Typography variant="h6">Question</Typography>
        <Typography variant="body1" className={styles.questionText}>
          {questionText}
        </Typography>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Options</Typography>
        <List>
          {options.map((option, index) => (
            <ListItem key={option._id}>
              <ListItemIcon>
                {option.isCorrect ? (
                  <CheckCircle color="success" />
                ) : (
                  <Cancel color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={`${String.fromCharCode(65 + index)}: ${
                  option.optionText
                }`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Difficulty Level</Typography>
        <Chip label={difficultyLevel} color="primary" className={styles.chip} />
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Correct Answer</Typography>
        <Typography variant="body1" className={styles.correctAnswer}>
          {correctAnswer}
        </Typography>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Explanation</Typography>
        <Typography variant="body2" className={styles.explanation}>
          {explanation}
        </Typography>
      </Box>
    </Paper>
  );
};

export default QuestionDetails;
