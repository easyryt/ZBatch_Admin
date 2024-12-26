import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Pagination,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import ProductModal from "./ProductModal";

const TableWrapper = styled(Paper)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
  overflowX: "auto",
  padding: theme.spacing(2),
}));

const DeliveryBoyOrderPage = () => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderStatus, setOrderStatus] = useState("Delivered");
  const [totalOrders, setTotalOrders] = useState(0);
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null); // Updated to null as initial state
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

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
 

  const fetchOrderData = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `https://www.backend.pkpaniwala.com/admin/deliveryBoy/orderData/${id}?page=${page}&limit=${pageSize}&orderStatus=${orderStatus}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
        }
      );

      if (response.data.status) {
        setDeliveryBoy(response.data.data.deliveryBoy);
        setOrderData(response.data.data.orders);
        setTotalOrders(response.data.data.orders.length);
      }
    } catch (error) {
      console.error("Failed to fetch order data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [page, pageSize, orderStatus]);

  const handleProductClick = (productData) => {
    setSelectedProduct(productData); // Set the selected product data
    setOpenModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  const columns = [
    {
      field: "orderID",
      headerName: "Order ID",
      width: 180,
      renderCell: (params) => params.row.orderId.orderID,
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      width: 180,
      renderCell: (params) => params.row.orderId.shippingInfo.fullName,
    },
    {
      field: "address",
      headerName: "Address",
      width: 300,
      renderCell: (params) => {
        const info = params.row.orderId.shippingInfo;
        return `${info.houseNo}, ${info.StreetNo}, ${info.landMark}, ${info.villageOrArea}, ${info.pincode}`;
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => params.row.orderId.shippingInfo.phone,
    },
    {
      field: "altPhone",
      headerName: "Alt Phone",
      width: 150,
      renderCell: (params) => params.row.orderId.shippingInfo.altPhone,
    },
    {
      field: "productTitle",
      headerName: "Product",
      width: 200,
      renderCell: (params) => (
        <strong style={{cursor:"pointer",color:"blue"}} onClick={() => handleProductClick(params.row.orderId.productData)}>
          {params.row.orderId.productData.items[0].Product_title}
        </strong>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Status",
      width: 120,
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 180,
      renderCell: (params) =>
        new Date(params.row.orderId.orderDate).toLocaleString(),
    },
    {
      field: "deliveredAt",
      headerName: "Delivered At",
      width: 180,
      renderCell: (params) => new Date(params.row.deliveredAt).toLocaleString(),
    },
  ];

  return (
    <Box
      sx={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "24px",
        }}
      >
        <Avatar
          alt={deliveryBoy.name}
          src="/static/images/avatar/1.jpg"
          sx={{
            width: 80,
            height: 80,
            marginRight: "16px",
          }}
        />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {deliveryBoy.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {deliveryBoy.email}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="number"
          label="Page Size"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          sx={{ width: 100 }}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: isMobile ? "300px" : "100%" }}>
          <DataGrid
            rows={orderData}
            columns={columns}
            pageSize={pageSize}
            rowCount={totalOrders}
            paginationMode="server"
            onPageChange={(newPage) => setPage(newPage + 1)}
            getRowId={(row) => row._id}
            autoHeight
            sx={{
              "& .MuiDataGrid-cell": { fontSize: "14px" },
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f0f0f0" },
              "& .MuiDataGrid-footerContainer": { justifyContent: "flex-end" },
            }}
          />
          <Pagination
            count={Math.ceil(totalOrders / pageSize)}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </Box>
      )}
      {/* Product Modal */}
      <ProductModal
        open={openModal}
        onClose={handleCloseModal}
        productData={selectedProduct} // Pass the selected product data to the modal
      />
    </Box>
  );
};

export default DeliveryBoyOrderPage;
