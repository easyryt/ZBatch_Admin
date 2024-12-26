import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Modal, TextField } from "@mui/material";
import Cookies from "js-cookie";
import axios from "axios";

const CouponCodeTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const token = Cookies.get("token");

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

  // Inline styles for the UI
  const styles = {
    container: {
      width: "90%",
      margin: "50px auto",
      fontFamily: "'Arial', sans-serif",
    },
    dataGrid: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
    },
    button: {
      margin: "5px",
    },
    modal: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      backgroundColor: "white",
      boxShadow: 24,
      padding: "20px",
      borderRadius: "8px",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
    },
  };

  // Fetch coupon codes
  useEffect(() => {
    const fetchCoupons = async () => {
        const token = Cookies.get("token");
      setLoading(true);
      try {
        const response = await axios.get(
          "https://www.backend.pkpaniwala.com/admin/couponCode/getAll",
          {
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": token,
            },
          }
        );
        if (response.data.status) {
          setRows(
            response.data.data.map((coupon, index) => ({
              id: coupon._id,
              promoCode: coupon.promoCode,
              expiry: new Date(coupon.expiry).toLocaleDateString(),
              discount: coupon.discount,
              index: index + 1,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
      setLoading(false);
    };

    fetchCoupons();
  }, [token]);

  // Delete coupon code
  const handleDelete = async (id) => {
    const token = Cookies.get("token");
    try {
      await axios.delete(
        `https://www.backend.pkpaniwala.com/admin/couponCode/delete/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                "x-admin-token": token,
              },
        }
      );
      setRows((prev) => prev.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  // Open edit modal
  const handleEdit = (row) => {
    setEditRow(row);
    setModalOpen(true);
  };

  // Save updated coupon
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://www.backend.pkpaniwala.com/admin/couponCode/update/${editRow.id}`,
        {
          promoCode: editRow.promoCode,
          expiry: new Date(editRow.expiry).toISOString(),
          discount: editRow.discount,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "x-admin-token": token,
              },
        }
      );
      if (response.data.status) {
        setRows((prev) =>
          prev.map((row) => (row.id === editRow.id ? { ...editRow } : row))
        );
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  const columns = [
    { field: "index", headerName: "#", width: 50 },
    {
      field: "promoCode",
      headerName: "Promo Code",
      width: 150,
      editable: false,
    },
    { field: "expiry", headerName: "Expiry Date", width: 150 },
    { field: "discount", headerName: "Discount (%)", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            style={styles.button}
            onClick={() => handleEdit(params.row)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={styles.button}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box style={styles.container}>
      <h2 style={styles.heading}>Coupon Code Management</h2>
      <Box sx={{ width:isMobile ? "300px" : "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          loading={loading}
          autoHeight
          disableSelectionOnClick
        />
      </Box>

      {/* Modal for Editing */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box style={styles.modal}>
          <h3 style={{ textAlign: "center" }}>Edit Coupon</h3>
          <TextField
            label="Promo Code"
            fullWidth
            value={editRow?.promoCode || ""}
            onChange={(e) =>
              setEditRow({ ...editRow, promoCode: e.target.value })
            }
            style={{ marginBottom: "15px" }}
          />
          <TextField
            label="Expiry Date"
            type="date"
            fullWidth
            value={editRow?.expiry?.split("T")[0] || ""}
            onChange={(e) => setEditRow({ ...editRow, expiry: e.target.value })}
            style={{ marginBottom: "15px" }}
          />
          <TextField
            label="Discount"
            type="number"
            fullWidth
            value={editRow?.discount || ""}
            onChange={(e) =>
              setEditRow({ ...editRow, discount: e.target.value })
            }
            style={{ marginBottom: "15px" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CouponCodeTable;
