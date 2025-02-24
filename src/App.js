import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import NotFound from "./Page/NotFound/NotFound";
import DashboardHome from "./components/Dashboard/DashboardHome";
import ClassList from "./Page/ClassList/ClassList";
import BatchList from "./Page/Batch/BatchList";
import SubjectsList from "./Page/SubjectsList/SubjectsList";
import TeachersList from "./Page/TeachersList/TeachersList";
import ViewBatchDetails from "./Page/ViewBatchDetails/ViewBatchDetails";
import ContentDisplay from "./Page/ContentDisplay/ContentDisplay";
import TestsList from "./Page/TestsList/TestsList";
import QuestionDetails from "./Page/TestsList/QuestionDetails";
import QuestionList from "./Page/TestsList/QuestionList";
import BookList from "./Page/BookList/BookList";
import BookContent from "./Page/BookContent/BookContent";
import TitlesDataGrid from "./Page/WholeMaterial/MaterialTitle/TitlesDataGrid";
import SubjectsDataGrid from "./Page/WholeMaterial/MaterialSubject/SubjectsDataGrid";
import ContentsDataGrid from "./Page/WholeMaterial/MaterialContent/ContentsDataGrid";
import StudentDataGrid from "./Page/StudentData/StudentDataGrid";
import TestSubjectsDataGrid from "./Page/TestsList/TestSubjectsDataGrid";
import ChapterDataGrid from "./Page/TestsList/ChapterDataGrid";
import BatchTest from "./Page/BatchTest/BatchTest";
import BatchQuestionDetails from "./Page/QuestionDetails.js/BatchQuestionDetails";
import TuitionDashboard from "./Page/TuitionDashboard/TuitionDashboard";
import ToppersList from "./Page/ToppersList/ToppersList";

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
          <Route path="batch-details/:clsId/:id" element={<ViewBatchDetails />} />
          <Route path="content-display/:id" element={<ContentDisplay />} />
          <Route path="tests-list/:chapterId" element={<TestsList />} />
          <Route
            path="batch-test/:batchId/:subjectId"
            element={<BatchTest />}
          />
          <Route
            path="batch-question-details/:batchId/:id"
            element={<BatchQuestionDetails />}
          />
          <Route path="question-details/:id" element={<QuestionDetails />} />
          <Route path="question-list/:id" element={<QuestionList />} />
          <Route path="book-list/:id" element={<BookList />} />
          <Route path="book-content/:id" element={<BookContent />} />
          <Route path="material-title/:id" element={<TitlesDataGrid />} />
          <Route path="material-subject/:id" element={<SubjectsDataGrid />} />
          <Route path="material-contents/:id" element={<ContentsDataGrid />} />
          <Route path="student-data" element={<StudentDataGrid />} />
          <Route path="tuition-dashboard" element={<TuitionDashboard  />} />
          <Route path="toppers-list" element={<ToppersList />} />
          <Route
            path="test-subjects-list/:id"
            element={<TestSubjectsDataGrid />}
          />
          <Route path="chapter-list/:clsId/:id" element={<ChapterDataGrid />} />
        </Route>
        <Route path="/class-list" element={<ClassList />} />
        <Route path="/batch-list/:id" element={<BatchList />} />
        <Route path="/subjects-list" element={<SubjectsList />} />
        <Route path="/teachers-list" element={<TeachersList />} />
        <Route path="/batch-details/:id" element={<ViewBatchDetails />} />
        <Route path="/content-display/:id" element={<ContentDisplay />} />
        <Route path="tests-list/:chapterId" element={<TestsList />} />
        <Route path="/question-details/:id" element={<QuestionDetails />} />
        <Route path="/question-list/:id" element={<QuestionList />} />
        <Route path="/book-list/:id" element={<BookList />} />
        <Route path="/book-content/:id" element={<BookContent />} />
        <Route path="/material-title/:id" element={<TitlesDataGrid />} />
        <Route path="/material-subject/:id" element={<SubjectsDataGrid />} />
        <Route path="/material-contents/:id" element={<ContentsDataGrid />} />
        <Route path="/student-data" element={<StudentDataGrid />} />
        <Route
          path="/test-subjects-list/:id"
          element={<TestSubjectsDataGrid />}
        />
        <Route
          path="/batch-question-details/:batchId/:id"
          element={<BatchQuestionDetails />}
        />
        <Route path="/batch-test/:batchId/:subjectId" element={<BatchTest />} />
        <Route path="/chapter-list/:clsId/:id" element={<ChapterDataGrid />} />
        <Route path="/tuition-dashboard" element={<TuitionDashboard  />} />
        <Route path="/toppers-list" element={<ToppersList />} />
        {/* Fallback for Not Found Pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
