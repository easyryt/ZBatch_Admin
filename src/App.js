import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import NotFound from "./Page/NotFound/NotFound";
import DashboardHome from "./components/Dashboard/DashboardHome";
import ClassList from "./Page/ClassList/ClassList";
import CreateBatch from "./Page/Batch/CreateBatch";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout Route */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Main Dashboard page */}
          <Route index element={<DashboardHome />} />
          <Route path="class-list" element={<ClassList />} />
          <Route path="create-batch/:id" element={<CreateBatch />} />
        </Route>
        <Route path="/class-list" element={<ClassList />} />
        <Route path="/create-batch/:id" element={<CreateBatch />} />
        {/* Fallback for Not Found Pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
