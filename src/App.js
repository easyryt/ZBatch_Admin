import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import NotFound from "./Page/NotFound/NotFound";
import DashboardHome from "./components/Dashboard/DashboardHome";
import CouponCodeForm from "./Page/CouponCodeForm/CouponCodeForm";
import CouponCodeTable from "./Page/CouponCodeTable/CouponCodeTable";
import ClassList from "./Page/ClassList/ClassList";

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

          <Route path="class-list" element={<ClassList />} />
          <Route path="coupon-code" element={<CouponCodeForm />} />
          <Route path="coupon-code-list" element={<CouponCodeTable />} />
        </Route>
        <Route path="/class-list" element={<ClassList />} />
        <Route path="/coupon-code" element={<CouponCodeForm />} />
        <Route path="/coupon-code-list" element={<CouponCodeTable />} />
        {/* Fallback for Not Found Pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
