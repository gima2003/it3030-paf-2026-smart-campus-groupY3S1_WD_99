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

import ProtectedRoute from "./components/ProtectedRoute";

import StudentLayout from "./pages/StudentLayout";
import StudentDashboard from "./pages/StudentDashboard";
import StudentTickets from "./pages/StudentTickets";


import TechnicianDashboard from "./pages/TechnicianDashboard";
import TechnicianLayout from "./pages/TechnicianLayout";

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

function App() {
  return (
    <Routes>

      {/* ✅ VERY IMPORTANT (FIX ERROR) */}
      <Route path="/" element={<LandingPage />} />

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
        path="/technician"
        element={
          <ProtectedRoute allowedRole="TECHNICIAN">
            <TechnicianLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TechnicianDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;