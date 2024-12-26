import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import Cookies from "js-cookie";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DoneIcon from "@mui/icons-material/Done";
import RefreshIcon from "@mui/icons-material/Refresh";
import BulkIcon from "@mui/icons-material/Inventory";

// Custom Styled Components
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const FormWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: theme.spacing(4),
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)", // Professional shadow
  width: "100%",
  maxWidth: "500px",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  textAlign: "center",
  color: "#2575fc", // Match gradient color
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Shadow for input fields
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  fontSize: "16px",
  background: "linear-gradient(135deg, #2575fc, #6a11cb)", // Gradient button
  color: "#fff",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(135deg, #6a11cb, #2575fc)", // Hover effect
  },
}));

const ResetButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  fontSize: "16px",
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: theme.palette.grey[400],
  },
}));

const DeliveryChargeForm = () => {
  const [isBulk, setIsBulk] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deliveryCharge) {
      setSnackbarMessage("Delivery charge is required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      setSnackbarMessage("Authorization token not found.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      isBulk,
      deliveryCharge,
    };

    try {
      setLoading(true);
      const response = await fetch("https://www.backend.pkpaniwala.com/admin/deliveryCharge/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(payload),
      });

      setLoading(false);

      if (response.ok) {
        setSnackbarMessage("Delivery charge created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // Reset form after success
        setIsBulk(false);
        setDeliveryCharge("");
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.message || "Failed to create delivery charge");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setSnackbarMessage("An error occurred while submitting the form.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Reset the form
  const handleReset = () => {
    setIsBulk(false);
    setDeliveryCharge("");
  };

  return (
    <Container>
      <FormWrapper>
        <Title variant="h5">Create Delivery Charge</Title>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledTextField
                label="Delivery Charge"
                type="number"
                fullWidth
                required
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <IconButton disabled>
                      ₹
                    </IconButton>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isBulk}
                    onChange={() => setIsBulk(!isBulk)}
                    color="primary"
                  />
                }
                label={
                  <Typography>
                    <BulkIcon fontSize="small" style={{ marginRight: "4px" }} />
                    Is Bulk?
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <SubmitButton variant="contained" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
              </SubmitButton>
            </Grid>

            <Grid item xs={12}>
              <ResetButton variant="outlined" onClick={handleReset}>
                <RefreshIcon fontSize="small" style={{ marginRight: "8px" }} />
                Reset
              </ResetButton>
            </Grid>
          </Grid>
        </form>
      </FormWrapper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DeliveryChargeForm;
