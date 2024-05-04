import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage"; // Assuming LoginPage is in a separate file
import { RegisterPage } from "./pages/RegisterPage";
import { Admin } from "./layouts/Admin";
import { Student } from "./layouts/Student";
import { Browse } from "./pages/student/Browse";
import { Dashboard } from "./pages/student/Dashboard";
import { Courses } from "./pages/teacher/Courses";
import { Analytics } from "./pages/teacher/Analytics";
import { CreateCourse } from "./pages/teacher/CreateCourse";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="courses" element={<Courses />} />
          <Route path="analytics" element={<Analytics />} />
          <Route  path="create" element={<CreateCourse />} />
        </Route>
        <Route path="/student" element={<Student />}>
          <Route path="browse" element={<Browse />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
