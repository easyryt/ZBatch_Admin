import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateProduct from "./Page/CreateProduct/CreateProduct";
import NotFound from "./Page/NotFound/NotFound";
import DashboardHome from "./components/Dashboard/DashboardHome";
import ProductsPage from "./Page/ProductsPage/ProductsPage";
import UpdateProduct from "./Page/UpdateProduct/UpdateProduct";
import FloorWiseChargesForm from "./Page/FloorWiseChargesForm/FloorWiseChargesForm";
import ChargesList from "./Page/FloorWiseChargesList/FloorWiseChargesList";
import UpdateChargesForm from "./Page/UpdateChargesForm/UpdateChargesForm";
import DeliveryChargeForm from "./Page/DeliveryChargeForm/DeliveryChargeForm";
import DeliveryChargesPage from "./Page/DeliveryChargesPage/DeliveryChargesPage";
import UpdateDeliveryChargeForm from "./Page/UpdateDeliveryChargeForm/UpdateDeliveryChargeForm";
import ConsumersPage from "./Page/ConsumersPage/ConsumersPage";
import ConsumerKartPage from "./Page/ConsumerKartPage/ConsumerKartPage";
import OrderHistoryPage from "./Page/OrderHistoryPage/OrderHistoryPage";
import OrderDetails from "./Page/OrderDetails/OrderDetails";
import BannerCreate from "./Page/BannerCreate/BannerCreate";
import BannerList from "./Page/BannerList/BannerList";
import CreateDeliveryBoyPage from "./Page/CreateDeliveryBoyPage/CreateDeliveryBoyPage";
import DeliveryBoyListPage from "./Page/DeliveryBoyListPage/DeliveryBoyListPage";
import DeliveryBoyOrderPage from "./Page/DeliveryBoyOrderPage/DeliveryBoyOrderPage";
import CouponCodeForm from "./Page/CouponCodeForm/CouponCodeForm";
import CouponCodeTable from "./Page/CouponCodeTable/CouponCodeTable";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout Route */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Main Dashboard page */}
          <Route index element={<DashboardHome />} />

          {/* Create Product Page */}
          <Route path="create-product" element={<CreateProduct />} />
          {/* All Products Page */}
          <Route path="all-product" element={<ProductsPage />} />
          {/* Update Product Page (dynamic product id) */}
          <Route path="update-product/:id" element={<UpdateProduct />} />
          <Route path="floor-wise-charges" element={<FloorWiseChargesForm />} />
          <Route path="charges-list" element={<ChargesList />} />
          <Route path="update-charges/:status" element={<UpdateChargesForm />} />
          <Route path="delivery-Charge" element={<DeliveryChargeForm />} />
          <Route path="all-delivery-Charges" element={<DeliveryChargesPage/>} />
          <Route path="delivery-update-charges/:status" element={<UpdateDeliveryChargeForm/>} />
          <Route path="consumers" element={<ConsumersPage />} />
          <Route path="consumers-cart/:id" element={<ConsumerKartPage />} />
          <Route path="order-history" element={<OrderHistoryPage />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
          <Route path="banner-create" element={<BannerCreate />} />
          <Route path="banner-list" element={<BannerList />} />
          <Route path="create-delivery-boy" element={<CreateDeliveryBoyPage />} />
          <Route path="delivery-boy-list" element={<DeliveryBoyListPage />} />
          <Route path="delivery-boy-order/:id" element={<DeliveryBoyOrderPage />} />
          <Route path="coupon-code" element={<CouponCodeForm />} />
          <Route path="coupon-code-list" element={<CouponCodeTable />} />
        </Route>

        {/* Create Product Page (outside dashboard) */}
        <Route path="/create-product" element={<CreateProduct />} />
        {/* All Products Page (outside dashboard) */}
        <Route path="/all-product" element={<ProductsPage />} />
        {/* Update Product Page (outside dashboard) */}
        <Route path="/update-product/:id" element={<UpdateProduct />} />
        <Route path="/floor-wise-charges" element={<FloorWiseChargesForm />} />
        <Route path="/charges-list" element={<ChargesList />} />
        <Route path="/update-charges/:status" element={<UpdateChargesForm />} />
        <Route path="/delivery-Charge" element={<DeliveryChargeForm />} />
        <Route path="/all-delivery-Charges" element={<DeliveryChargesPage/>} />
        <Route path="/delivery-update-charges/:status" element={<UpdateDeliveryChargeForm/>} />
        <Route path="/consumers" element={<ConsumersPage />} />
        <Route path="/consumers-cart/:id" element={<ConsumerKartPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/order-details/:id" element={<OrderDetails />} />
        <Route path="/banner-create" element={<BannerCreate />} />
        <Route path="/banner-list" element={<BannerList />} />
        <Route path="/create-delivery-boy" element={<CreateDeliveryBoyPage />} />
        <Route path="/delivery-boy-list" element={<DeliveryBoyListPage />} />
        <Route path="/delivery-boy-order/:id" element={<DeliveryBoyOrderPage />} />
        <Route path="/coupon-code" element={<CouponCodeForm />} />
        <Route path="/coupon-code-list" element={<CouponCodeTable />} />
        {/* Fallback for Not Found Pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
