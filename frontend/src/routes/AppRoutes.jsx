import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Unauthorized from "../pages/shared/Unauthorized";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminDepartments from "../pages/admin/Departments";
import AdminModules from "../pages/admin/Modules";
import AdminReports from "../pages/admin/Reports";

import LecturerDashboard from "../pages/lecturer/Dashboard";
import LecturerModules from "../pages/lecturer/Modules";
import LecturerMaterials from "../pages/lecturer/Materials";
import LecturerAssignments from "../pages/lecturer/Assignments";
import LecturerQuizzes from "../pages/lecturer/Quizzes";
import LecturerResults from "../pages/lecturer/Results";

import StudentDashboard from "../pages/student/Dashboard";
import StudentModules from "../pages/student/Modules";
import StudentMaterials from "../pages/student/Materials";
import StudentAssignments from "../pages/student/Assignments";
import StudentQuizzes from "../pages/student/Quizzes";
import StudentResults from "../pages/student/Results";
import LecturerRecordings from "../pages/lecturer/Recordings";
import StudentRecordings from "../pages/student/Recordings";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/departments" element={<AdminDepartments />} />
            <Route path="/admin/modules" element={<AdminModules />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

       <Route element={<RoleRoute allowedRoles={["lecturer"]} />}>
  <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
  <Route path="/lecturer/modules" element={<LecturerModules />} />
  <Route path="/lecturer/materials" element={<LecturerMaterials />} />
  <Route path="/lecturer/recordings" element={<LecturerRecordings />} />
  <Route path="/lecturer/assignments" element={<LecturerAssignments />} />
  <Route path="/lecturer/quizzes" element={<LecturerQuizzes />} />
  <Route path="/lecturer/results" element={<LecturerResults />} />
</Route>

      <Route element={<RoleRoute allowedRoles={["student"]} />}>
  <Route path="/student/dashboard" element={<StudentDashboard />} />
  <Route path="/student/modules" element={<StudentModules />} />
  <Route path="/student/materials" element={<StudentMaterials />} />
  <Route path="/student/recordings" element={<StudentRecordings />} />
  <Route path="/student/assignments" element={<StudentAssignments />} />
  <Route path="/student/quizzes" element={<StudentQuizzes />} />
  <Route path="/student/results" element={<StudentResults />} />
</Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;