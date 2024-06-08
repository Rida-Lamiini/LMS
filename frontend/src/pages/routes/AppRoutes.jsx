import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "./../LoginPage"; // Assuming LoginPage is in a separate file
import { RegisterPage } from "./../RegisterPage";
import { Admin } from "./../../layouts/Admin";
import { Student } from "./../../layouts/Student";
import { Browse } from "./../student/Browse";
import { Dashboard } from "./../student/Dashboard";
import { Courses } from "./../teacher/coursePages/Courses";
import { Analytics } from "./../teacher/Analytics";
import { CreateCourse } from "./../teacher/coursePages/CreateCourse";
import { CourseEdit } from "./../teacher/coursePages/CourseEdit";
import ChapterEdit from "./../teacher/coursePages/ChapterEdit";
import CourseLayout from "./../../components/students/CourseLayout";
import ChapterLayout from "./../../components/students/ChapterLayout";
import ForgotPassword from "../ForgotPassword";
export default function AppRoutes() {
  return (
    <div>

        <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="courses" element={<Courses />}  />

           {/* Route with parameter id */} 
           <Route  path="create" element={<CreateCourse />} />

          <Route path=":id" element={<CourseEdit />} />

          <Route path="chapters/:chapterId" element={<ChapterEdit/>}/>
            

         
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="/student" element={<Student />}>
          <Route path="browse" element={<Browse />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/courses/:id" element={<CourseLayout />}>
            
            <Route path=":chapterId" element={<ChapterLayout/>}/>


        </Route>



        {/* Add other routes as needed */}
      </Routes>
    </Router>

      
      
    </div>
  )
}
