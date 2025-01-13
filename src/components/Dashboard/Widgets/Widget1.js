import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Avatar,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import consumerImage from "../../Images/consumer.gif"; // Replace with the correct path to your image
import { useNavigate } from "react-router-dom";

const Widget1 = () => {
  const [totalConsumers, setTotalConsumers] = useState(null); // State to store consumer data
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState(null); // Error state for API call
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token"); // Get the token from cookies
        const response = await axios.get(
          "https://npc-classes.onrender.com/admin/dashBoard/totalStudent",
          {
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": token, // Pass token in header
            },
          }
        );
        setTotalConsumers(response.data.data); // Set total consumers data
        setLoading(false); // Stop loading spinner
      } catch (error) {
        setError("Failed to fetch data"); // Set error message
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  return (
    <Paper
      elevation={16}
      sx={{
        padding: { xs: 3, sm: 4 },
        backgroundImage: "linear-gradient(to top, #dfe9f3 0%, white 100%)",
        backdropFilter: "blur(12px)",
        borderRadius: 3,
        color: "#333",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
        "&:hover": {
          boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)",
          transform: "scale(1.05)",
        },
        transition: "all 0.3s ease-in-out",
        maxWidth: { xs: "100%", sm: "480px" },
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
      }}
      onClick={() => navigate("/dashboard/consumers")} // Navigate on click
    >
      {/* Consumer Image */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: 3,
        }}
      >
        <Avatar
          src={consumerImage}
          alt="Consumer"
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "white",
          }}
        />
      </Box>

      {/* Loading, Error, or Data Display */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <CircularProgress
            color="primary"
            size={60}
            sx={{ animationDuration: "500ms" }}
          />
        </Box>
      ) : error ? (
        <Typography
          variant="body1"
          sx={{
            color: "red",
            fontSize: "16px",
            fontWeight: 500,
            textAlign: "center",
            padding: 1,
            borderRadius: 1,
            backgroundColor: "#fff0f0",
            marginBottom: 2,
          }}
        >
          {error}
        </Typography>
      ) : (
        <Typography
          variant="h6"
          sx={{
            color: "#333",
            fontSize: { xs: "1.2rem", sm: "1.4rem" },
            fontWeight: 500,
            lineHeight: 1.6,
            display: "flex",
            flexDirection: "column",
            marginTop: 2,
          }}
        >
          <span style={{ color: "#1A237E", fontWeight: "bold" }}>
            {totalConsumers}
          </span>{" "}
          Students
        </Typography>
      )}
    </Paper>
  );
};

export default Widget1;
