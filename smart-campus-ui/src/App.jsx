import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Features from "./pages/Features";

import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTickets from "./pages/AdminTickets";
import AdminTechnicians from "./pages/AdminTechnicians";
import AdminUserManagement from "./pages/AdminUserManagement";
import ResourceManagement from "./pages/ResourceManagement";
import StudentBookingForm from "./pages/StudentBookingForm";
import AdminBookingManagement from "./pages/AdminBookingManagement";

import StudentLayout from "./pages/StudentLayout";
import StudentDashboard from "./pages/StudentDashboard";
import StudentTickets from "./pages/StudentTickets";
import StudentBookings from "./pages/StudentBookings";
import StudentBookingCalendar from "./pages/StudentBookingCalendar";
import StudentResources from "./pages/StudentResources";
import StudentReport from "./pages/StudentReport";
import StudentNotifications from "./pages/StudentNotifications";
import ContactPage from "./pages/ContactPage"; // adjust path if needed

import TechnicianLayout from "./pages/TechnicianLayout";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import TechnicianTickets from "./pages/TechnicianTickets";
import TechnicianHistory from "./pages/TechnicianHistory";
import TechnicianNotifications from "./pages/TechnicianNotifications";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

/* LANDING PAGE */
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

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/features" element={<Features />} />

        {/* ✅ ADD THIS LINE RIGHT HERE */}
        <Route path="/contact" element={<ContactPage />} />

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
            <Route path="resources" element={<ResourceManagement />} />
            <Route
              path="booking-management"
              element={<AdminBookingManagement />}
            />
          </Route>

          {/* STUDENT - TEMPORARILY WITHOUT ProtectedRoute */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="tickets" element={<StudentTickets />} />
            <Route path="bookings" element={<StudentBookings />} />
            <Route path="bookings/new" element={<StudentBookingForm />} />
            <Route
              path="bookings/calendar"
              element={<StudentBookingCalendar />}
            />
            <Route path="resources" element={<StudentResources />} />
            <Route path="report" element={<StudentReport />} />
            <Route path="notifications" element={<StudentNotifications />} />
          </Route>

          {/* TECHNICIAN - TEMPORARILY WITHOUT ProtectedRoute */}
          <Route path="/technician" element={<TechnicianLayout />}>
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