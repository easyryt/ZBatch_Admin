import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import NotFound from "./Page/NotFound/NotFound";
import DashboardHome from "./components/Dashboard/DashboardHome";
import ClassList from "./Page/ClassList/ClassList";
import CreateBatch from "./Page/Batch/CreateBatch";
import BatchList from "./Page/Batch/BatchList";
import SubjectsList from "./Page/SubjectsList/SubjectsList";
import TeachersList from "./Page/TeachersList/TeachersList";
import ViewBatchDetails from "./Page/ViewBatchDetails/ViewBatchDetails";
import ContentDisplay from "./Page/ContentDisplay/ContentDisplay";
import TestsList from "./Page/TestsList/TestsList";
import QuestionDetails from "./Page/QuestionDetails.js/QuestionDetails";
import DirectTestList from "./Page/DirectTestList/DirectTestList";
import QuestionList from "./Page/DirectTestList/QuestionList";

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
          <Route path="batch-list/:id" element={<BatchList />} />
          <Route path="subjects-list" element={<SubjectsList />} />
          <Route path="teachers-list" element={<TeachersList />} />
          <Route path="batch-details/:id" element={<ViewBatchDetails  />} />
          <Route path="content-display/:id" element={<ContentDisplay  />} />
          <Route path="tests-list/:batchId/:subjectId" element={<TestsList  />} />
          <Route path="question-details/:batchId/:id" element={<QuestionDetails  />} />
          <Route path="direct-test-list/:id" element={<DirectTestList  />} />
          <Route path="question-list/:id" element={<QuestionList  />} />
        </Route>
        <Route path="/class-list" element={<ClassList />} />
        <Route path="/batch-list/:id" element={<BatchList />} />
        <Route path="/subjects-list" element={<SubjectsList />} />
        <Route path="/teachers-list" element={<TeachersList />} />
        <Route path="/batch-details/:id" element={<ViewBatchDetails  />} />
        <Route path="/content-display/:id" element={<ContentDisplay  />} />
        <Route path="/tests-list/:batchId/:subjectId" element={<TestsList  />} />
        <Route path="/question-details/:batchId/:id" element={<QuestionDetails  />} />
        <Route path="/direct-test-list/:id" element={<DirectTestList  />} />
        <Route path="/question-list/:id" element={<QuestionList  />} />
        {/* Fallback for Not Found Pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
