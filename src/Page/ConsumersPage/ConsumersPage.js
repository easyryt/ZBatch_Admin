import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import WorkIcon from "@mui/icons-material/Work";
import PhoneIcon from "@mui/icons-material/Phone";
import CelebrationIcon from "@mui/icons-material/Celebration";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled } from "@mui/system";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

// Custom Styles
const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f9f9f9",
  minHeight: "100vh",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.primary.main,
  fontSize: "2rem",
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1200px",
  margin: theme.spacing(2, 0),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
}));

const LoadingWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "60vh",
}));

const NoDataText = styled(Typography)(({ theme }) => ({
  color: "#666",
  fontSize: "18px",
  textAlign: "center",
}));

const ConsumersPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    // Function to update widthType based on window width
    const updateWidthType = () => {
      const width = window.innerWidth;
      if (width < 500) {
        setMobile(true);
      }
    };

    // Listen for window resize events
    window.addEventListener("resize", updateWidthType);

    // Set initial widthType
    updateWidthType();

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", updateWidthType);
    };
  }, []);

  useEffect(() => {
    const fetchConsumers = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setSnackbarMessage("Authorization token not found.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          "https://www.backend.pkpaniwala.com/admin/consumerData/allconsumer",
          {
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": token,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setData(result.data);
          setFilteredData(result.data);
        } else {
          setSnackbarMessage("Failed to fetch consumer data");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("An error occurred while fetching data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConsumers();
  }, []);

  // Search Functionality
  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (consumer) =>
        (consumer.fullName &&
          consumer.fullName.toLowerCase().includes(lowercasedTerm)) ||
        consumer.phone.includes(lowercasedTerm) ||
        (consumer.email &&
          consumer.email.toLowerCase().includes(lowercasedTerm))
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // DataGrid columns
  const columns = [
    {
      field: "profile",
      headerName: "Profile",
      width: 120,
      renderCell: (params) => (
        <Avatar
          src={params.row.profilePic?.url}
          alt={params.row.fullName || "User"}
        >
          <AccountCircleIcon />
        </Avatar>
      ),
    },
    { field: "fullName", headerName: "Full Name", width: 180 },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <PhoneIcon color="primary" />
          {params.value}
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <EmailIcon color="primary" />
          {params.value || "N/A"}
        </Box>
      ),
    },
    {
      field: "dob",
      headerName: "DOB",
      width: 130,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <CakeIcon color="secondary" />
          {params.value || "N/A"}
        </Box>
      ),
    },
    {
      field: "anniversary",
      headerName: "Anniversary",
      width: 180,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <CelebrationIcon color="secondary" />
          {params.value || "N/A"}
        </Box>
      ),
    },
    { field: "role", headerName: "Role", width: 150 },
    { field: "gender", headerName: "Gender", width: 130 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "cart",
      headerName: "Check Cart",
      width: 150,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(`/dashboard/consumers-cart/${params.row._id}`)
          }
        >
          <ShoppingCartIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <PageContainer>
      <Title variant="h4">All Consumers</Title>

      {/* Controls */}
      <ControlsContainer>
        <StyledTextField
          variant="outlined"
          placeholder="Search by name, phone, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </ControlsContainer>

      {loading ? (
        <LoadingWrapper>
          <CircularProgress size={50} color="primary" />
        </LoadingWrapper>
      ) : filteredData.length === 0 ? (
        <NoDataText>No consumer data available</NoDataText>
      ) : (
        <Box sx={{ width: isMobile ? "300px" : "100%" }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Box>
      )}

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
    </PageContainer>
  );
};

export default ConsumersPage;
