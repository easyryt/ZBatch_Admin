import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const CouponCodeForm = () => {
  // State management
  const [promoCode, setPromoCode] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [message, setMessage] = useState("");

  // Inline styles for the UI
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Arial', sans-serif",
    },
    heading: {
      textAlign: "center",
      fontSize: "24px",
      color: "#333",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    message: {
      textAlign: "center",
      marginTop: "15px",
      fontSize: "14px",
    },
    success: {
      color: "green",
    },
    error: {
      color: "red",
    },
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token");
    if (!token) {
      setMessage("Error: Authentication token is missing!");
      return;
    }
    try {
      const response = await axios.post(
        "https://www.backend.pkpaniwala.com/admin/couponCode/create",
        {
          promoCode,
          expiry,
          discount: parseFloat(discount),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("Coupon code created successfully!");
        setPromoCode("");
        setExpiry("");
        setDiscount("");
      }
    } catch (error) {
      setMessage(
        "Error: " +
          (error.response?.data?.message || "Failed to create coupon code.")
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Coupon Code</h2>
      <form onSubmit={handleSubmit}>
        {/* Promo Code */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Promo Code</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter promo code (uppercase only)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            required
          />
        </div>

        {/* Expiry Date */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Expiry Date</label>
          <input
            style={styles.input}
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            required
          />
        </div>

        {/* Discount */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Discount (%)</label>
          <input
            style={styles.input}
            type="number"
            placeholder="Enter discount percentage"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
            min="1"
            max="100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{ ...styles.button }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor =
              styles.buttonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Create Coupon
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          style={{
            ...styles.message,
            ...(message.startsWith("Error") ? styles.error : styles.success),
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CouponCodeForm;
