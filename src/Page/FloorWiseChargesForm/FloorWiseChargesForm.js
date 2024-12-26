import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Paper,
  CircularProgress,
  InputAdornment,
  FormGroup,
} from "@mui/material";
import { styled } from "@mui/system";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Styled components for a professional UI
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  margin: "auto",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

const FloorField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  fontWeight: "bold",
}));

const SubmitButtonContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(4),
}));

const FloorWiseChargesForm = () => {
  const navigate = useNavigate();

  const [isBulk, setIsBulk] = useState(false);
  const [charges, setCharges] = useState({
    GroundF: 0,
    FirstF: 0,
    SecondF: 0,
    ThirdF: 0,
    FourthF: 0,
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharges((prevCharges) => ({
      ...prevCharges,
      [name]: value,
    }));
  };

  // Handle bulk checkbox toggle
  const handleBulkChange = (e) => {
    setIsBulk(e.target.checked);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get("token");
    const data = {
      isBulk,
      ...charges,
    };

    try {
      const response = await fetch("https://www.backend.pkpaniwala.com/admin/FloorWiseCharges/create", {
        method: "POST",
        headers: {
            "x-admin-token": token,
            "Content-Type": "application/json",
          },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        navigate("/dashboard/charges-list"); // Redirect to dashboard or another page
      } else {
        alert("Failed to submit data");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <FormContainer>
        <Title variant="h5">Floor-Wise Charges Form</Title>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Bulk checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={isBulk} onChange={handleBulkChange} />}
                label="Is Bulk"
              />
            </Grid>

            {/* Floor Charges */}
            <Grid item xs={12} sm={6}>
              <FloorField
                label="Ground Floor"
                type="number"
                fullWidth
                name="GroundF"
                value={charges.GroundF}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FloorField
                label="First Floor"
                type="number"
                fullWidth
                name="FirstF"
                value={charges.FirstF}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FloorField
                label="Second Floor"
                type="number"
                fullWidth
                name="SecondF"
                value={charges.SecondF}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FloorField
                label="Third Floor"
                type="number"
                fullWidth
                name="ThirdF"
                value={charges.ThirdF}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FloorField
                label="Fourth Floor"
                type="number"
                fullWidth
                name="FourthF"
                value={charges.FourthF}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                required
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <SubmitButtonContainer>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={loading ? <CircularProgress size={24} /> : <AddCircleOutline />}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </SubmitButtonContainer>
        </form>
      </FormContainer>
    </Box>
  );
};

export default FloorWiseChargesForm;
