import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTickets from "./pages/AdminTickets";
import AdminTechnicians from "./pages/AdminTechnicians";
import ResourceManagement from "./pages/ResourceManagement";

import AdminUserManagement from "./pages/AdminUserManagement";

import ProtectedRoute from "./components/ProtectedRoute";

import StudentLayout from "./pages/StudentLayout";
import StudentDashboard from "./pages/StudentDashboard";
import StudentTickets from "./pages/StudentTickets";


import TechnicianDashboard from "./pages/TechnicianDashboard";
import TechnicianLayout from "./pages/TechnicianLayout";
import TechnicianTickets from "./pages/TechnicianTickets";
import TechnicianHistory from "./pages/TechnicianHistory";
import TechnicianNotifications from "./pages/TechnicianNotifications";

import StudentBookings from "./pages/StudentBookings";
import StudentResources from "./pages/StudentResources";
import StudentReport from "./pages/StudentReport";
import StudentNotifications from "./pages/StudentNotifications";

/* 🔥 LANDING PAGE */
function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </>
  );
}

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* ✅ VERY IMPORTANT (FIX ERROR) */}
          <Route path="/" element={<LandingPage />} />

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="technicians" element={<AdminTechnicians />} />
        <Route path="/admin/resources" element={<ResourceManagement />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="tickets" element={<StudentTickets />} />
      </Route>

      {/* 🔥 FALLBACK (IMPORTANT) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="technicians" element={<AdminTechnicians />} />
          </Route>

          {/* STUDENT */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="tickets" element={<StudentTickets />} />
          </Route>

          {/* 🔥 FALLBACK (IMPORTANT) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="technicians" element={<AdminTechnicians />} />
            <Route path="users" element={<AdminUserManagement />} />
          </Route>

          {/* STUDENT */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="tickets" element={<StudentTickets />} />
            <Route path="bookings" element={<StudentBookings />} />
            <Route path="resources" element={<StudentResources />} />
            <Route path="report" element={<StudentReport />} />
            <Route path="notifications" element={<StudentNotifications />} />
          </Route>

          {/* TECHNICIAN */}
          <Route
            path="/technician"
            element={
              <ProtectedRoute allowedRole="TECHNICIAN">
                <TechnicianLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TechnicianDashboard />} />
            <Route path="tickets" element={<TechnicianTickets />} />
            <Route path="history" element={<TechnicianHistory />} />
            <Route path="notifications" element={<TechnicianNotifications />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;