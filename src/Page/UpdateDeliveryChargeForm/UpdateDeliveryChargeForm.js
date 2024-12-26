import React, { useState, useEffect } from "react";
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
import RefreshIcon from "@mui/icons-material/Refresh";
import InventoryIcon from "@mui/icons-material/Inventory"; // Bulk icon
import { useParams } from "react-router-dom";

// Custom Styled Components
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  minHeight: "100vh",
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
  color: "#2575fc", // Gradient color
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

const UpdateDeliveryChargeForm = () => {
  const [isBulk, setIsBulk] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { status } = useParams();

  // Fetch existing delivery charge data on mount
  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      const token = Cookies.get("token");
      if (!token) {
        showSnackbar("Authorization token not found.", "error");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://www.backend.pkpaniwala.com/admin/deliveryCharge/getAll?isBulk=${status}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": token,
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          const chargeData = result.data[0];
          setDeliveryCharge(chargeData.deliveryCharge || "");
          setIsBulk(chargeData.isBulk || false);
          showSnackbar(result.message, "success");
        } else {
          showSnackbar(result.message || "Failed to fetch delivery charge data.", "error");
        }
      } catch (error) {
        showSnackbar("An error occurred while fetching data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryCharge();
  }, [status]);

  // Show snackbar message
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deliveryCharge) {
      showSnackbar("Delivery charge is required.", "error");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      showSnackbar("Authorization token not found.", "error");
      return;
    }

    const payload = {
      isBulk,
      deliveryCharge: Number(deliveryCharge),
    };

    try {
      setLoading(true);
      const response = await fetch(
        `https://www.backend.pkpaniwala.com/admin/deliveryCharge/update/${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (response.ok) {
        showSnackbar(result.message || "Delivery charge updated successfully!", "success");
      } else {
        showSnackbar(result.message || "Failed to update delivery charge.", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred while submitting the form.", "error");
    } finally {
      setLoading(false);
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
        <Title variant="h5">Update Delivery Charge</Title>
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
                      <AttachMoneyIcon color="primary" />
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
                    <InventoryIcon fontSize="small" style={{ marginRight: "4px" }} />
                    Is Bulk?
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Update"}
              </SubmitButton>
            </Grid>

            <Grid item xs={12}>
              <ResetButton onClick={handleReset}>
                <RefreshIcon fontSize="small" style={{ marginRight: "8px" }} />
                Reset
              </ResetButton>
            </Grid>
          </Grid>
        </form>
      </FormWrapper>

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

export default UpdateDeliveryChargeForm;
