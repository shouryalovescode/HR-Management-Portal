import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import Attendance from "./pages/Attendance.jsx";
import Departments from "./pages/Departments.jsx";
import LeaveManagement from "./pages/LeaveManagement.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Payroll from "./pages/Payroll.jsx";
import Recruitment from "./pages/Recruitment.jsx";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* =====================================================
          GLOBAL TOASTER
      ====================================================== */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "16px",
            background: "#111827",
            color: "#fff",
            fontSize: "14px",
          },
        }}
      />

      {/* =====================================================
          APPLICATION ROUTES
      ====================================================== */}
      <Routes>

        {/* =================================================
            LOGIN
        ================================================== */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

<Route
  path="/attendance"
  element={<Attendance />}
/>

        {/* =================================================
            SIGNUP
        ================================================== */}
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signup />
            )
          }
        />

<Route
  path="/departments"
  element={<Departments />}
/>

<Route
  path="/leave-management"
  element={<LeaveManagement />}
/>

        {/* =================================================
            DASHBOARD
        ================================================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            EMPLOYEES
        ================================================== */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
<Route
  path="/recruitment"
  element={<Recruitment />}
/>

        {/* =================================================
            ANALYTICS
        ================================================== */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            SETTINGS
        ================================================== */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
<Route path="/payroll" element={<Payroll />} />

        {/* =================================================
            PROFILE
        ================================================== */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            DEFAULT ROUTE
        ================================================== */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        {/* =================================================
            UNKNOWN ROUTES
        ================================================== */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

      </Routes>
    </>
  );
}