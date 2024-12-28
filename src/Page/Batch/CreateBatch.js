import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import Cookies from "js-cookie";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";

const CreateBatch = () => {
  const { id } = useParams(); // Get course ID from URL params
  const [thumbnailImg, setThumbnailImg] = useState(null);
  const [isFree, setIsFree] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      board: "",
      duration: {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      },
      batchTag: "",
      price: "",
      mrp: "",
    },
  });

  const onSubmit = async (data) => {
    const token = Cookies.get("token"); // Retrieve token from cookies

    if (!token) {
      alert("Authentication token is missing");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("board", data.board);
    formData.append(
      "duration",
      JSON.stringify({
        startDate: data.duration.startDate,
        endDate: data.duration.endDate,
      })
    );
    formData.append("batchTag", data.batchTag);
    formData.append("isFree", isFree);

    if (thumbnailImg) {
      formData.append("thumbnailImg", thumbnailImg);
    }

    if (!isFree) {
      formData.append("price", data.price);
      formData.append("mrp", data.mrp);
    }

    try {
      const response = await axios.post(
        `https://npc-classes.onrender.com/admin/course/batches/create/${id}`,
        formData,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );

      if (response.status === 200) {
        alert("Batch created successfully!");
      } else {
        alert(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      alert("An error occurred while creating the batch");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: "700px",
        margin: "auto",
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        Create Batch
      </Typography>

      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Controller
        name="board"
        control={control}
        rules={{ required: "Board is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Board"
            fullWidth
            margin="normal"
            error={!!errors.board}
            helperText={errors.board?.message}
          />
        )}
      />

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Duration
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            {...register("duration.startDate")}
            label="Start Date"
            type="date"
            fullWidth
            defaultValue="2024-01-01"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...register("duration.endDate")}
            label="End Date"
            type="date"
            fullWidth
            defaultValue="2024-12-31"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Controller
        name="batchTag"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Batch Tag"
            fullWidth
            margin="normal"
          />
        )}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
          />
        }
        label="Is Free"
      />

      {!isFree && (
        <>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                fullWidth
                margin="normal"
              />
            )}
          />

          <Controller
            name="mrp"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="MRP"
                type="number"
                fullWidth
                margin="normal"
              />
            )}
          />
        </>
      )}

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Thumbnail Image
      </Typography>
      <Button
        variant="outlined"
        component="label"
        sx={{ marginBottom: "16px" }}
      >
        Upload Thumbnail
        <input
          type="file"
          hidden
          onChange={(e) => setThumbnailImg(e.target.files[0])}
        />
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
      >
        Create Batch
      </Button>
    </Box>
  );
};

export default CreateBatch;
