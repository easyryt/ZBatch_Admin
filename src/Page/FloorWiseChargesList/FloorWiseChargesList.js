import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, CardHeader, Typography, IconButton, Divider, Snackbar, Alert, CircularProgress, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { styled } from "@mui/system";
import { Edit, Delete, Info } from "@mui/icons-material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Utility function to format dates
const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Styled components for a professional UI
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const Title = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  fontWeight: "bold",
  fontSize: "2rem",
  color: theme.palette.primary.main,
}));

const ChargeCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[5],
  borderRadius: "16px",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    boxShadow: theme.shadows[10],
    transform: "scale(1.03)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.dark,
  fontSize: "1.2rem",
}));

const CardSubHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.9rem",
}));

const ChargeDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const FilterBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(4),
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const ChargesList = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const navigate = useNavigate()

  // Fetch all floor-wise charges from the server
  const fetchCharges = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    try {
      const response = await fetch("https://www.backend.pkpaniwala.com/admin/FloorWiseCharges/getAll", {
        headers: {
          "x-admin-token": token,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch charges");
      const data = await response.json();
      setCharges(data.data); // Store the fetched charges data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete action
  const handleDeleteCharge = async (chargeId) => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(`https://www.backend.pkpaniwala.com/admin/FloorWiseCharges/delete/${chargeId}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": token,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete charge");
      setCharges((prevCharges) => prevCharges.filter(charge => charge._id !== chargeId));
      setSnackOpen(true);
      setOpenDialog(false); // Close the dialog
    } catch (error) {
      setError(error.message);
      setOpenDialog(false);
    }
  };

  // Open dialog for deletion confirmation
  const handleOpenDialog = (charge) => {
    setSelectedCharge(charge);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCharge(null);
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  return (
    <PageContainer>
      <Title variant="h4">Floor-Wise Charges</Title>

      {/* Error message */}
      {error && <Typography color="error" align="center">{error}</Typography>}

      {/* Loading spinner */}
      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center">
            {charges.length > 0 ? (
              charges.map((charge) => (
                <Grid item xs={12} sm={6} md={4} key={charge._id}>
                  <ChargeCard>
                    <CardHeader
                      action={
                        <>
                          <IconButton color="primary" onClick={() => navigate(`/dashboard/update-charges/${charge.isBulk}`)} >
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleOpenDialog(charge)}>
                            <Delete />
                          </IconButton>
                        </>
                      }
                      title={<CardTitle>{`Charge for Floors`}</CardTitle>}
                      subheader={<CardSubHeader>{`Created At: ${formatDate(charge.createdAt)}`}</CardSubHeader>}
                    />
                    <CardContent>
                      {/* Charge details */}
                      <ChargeDetails>
                        <Typography variant="body1" color="primary">
                          Ground Floor: ₹{charge.GroundF}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          First Floor: ₹{charge.FirstF}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          Second Floor: ₹{charge.SecondF}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          Third Floor: ₹{charge.ThirdF}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          Fourth Floor: ₹{charge.FourthF}
                        </Typography>

                        {/* Bulk status */}
                        <Chip
                          label={charge.isBulk ? "Bulk Charge" : "Non-Bulk Charge"}
                          color={charge.isBulk ? "primary" : "secondary"}
                          size="small"
                        />
                      </ChargeDetails>

                      <Divider sx={{ marginTop: 2 }} />

                      {/* Date display */}
                      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                        Updated At: {formatDate(charge.updatedAt)}
                      </Typography>
                    </CardContent>
                  </ChargeCard>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" align="center" sx={{ width: "100%" }}>
                No charges available.
              </Typography>
            )}
          </Grid>
        </>
      )}

      {/* Snackbar for success */}
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity="success">
          Charge deleted successfully!
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this charge?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button
            onClick={() => handleDeleteCharge(selectedCharge?._id)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ChargesList;
