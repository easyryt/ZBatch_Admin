import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import styles from './CreateQuestionModal.module.css'; // Assuming you use module-level CSS
import axios from 'axios';

const CreateQuestionModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    difficultyLevel: '',
    correctAnswer: '',
    explanation: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/admin/batches/test/subjects/tests/ques/create/676d5943aee6c317dc5d3ee8/677422b1e336b9ef28115881',
        formData
      );
      console.log('Question created:', response.data);
      onClose();
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContainer}>
        <Typography variant="h6" className={styles.modalTitle}>
          Create a New Question
        </Typography>
        <TextField
          label="Question Text"
          variant="outlined"
          fullWidth
          className={styles.inputField}
          value={formData.questionText}
          onChange={(e) => handleChange('questionText', e.target.value)}
        />
        {formData.options.map((option, index) => (
          <TextField
            key={index}
            label={`Option ${String.fromCharCode(65 + index)}`}
            variant="outlined"
            fullWidth
            className={styles.inputField}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}
        <TextField
          label="Difficulty Level"
          select
          variant="outlined"
          fullWidth
          className={styles.inputField}
          value={formData.difficultyLevel}
          onChange={(e) => handleChange('difficultyLevel', e.target.value)}
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </TextField>
        <TextField
          label="Correct Answer"
          variant="outlined"
          fullWidth
          className={styles.inputField}
          value={formData.correctAnswer}
          onChange={(e) => handleChange('correctAnswer', e.target.value)}
        />
        <TextField
          label="Explanation"
          variant="outlined"
          fullWidth
          className={styles.inputField}
          multiline
          rows={4}
          value={formData.explanation}
          onChange={(e) => handleChange('explanation', e.target.value)}
        />
        <Box className={styles.actionButtons}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateQuestionModal;
