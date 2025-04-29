import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

// Admin components
import DashbordAdmin from "./Admin/DashbordAdmin";
import AdminPatient from "./Admin/AdminPatient";
import Sidebar from "./Admin/Sidebar";
import AdminMedecin from "./Admin/AdminMedecin";
import AdminRendezVous from "./Admin/AdminRendez-vous";

// Medecin components
import MedecinDashboard from "./Medecin/MedecinDashboard";

// Shared components
import Header from "./Header";

// Patient components
import DoctorsPage from "./Patient/DoctorsPage";
import AppointmentsPage from "./Patient/AppointmentsPage";
import HomePage from "./Patient/HomePage";
import DoctorDetailsPage from "./Patient/DoctorDetailsPage";

// Auth components
import Login from "./login";
import Register from "./register";
import Logout from "./logout";

// Auth Context and Protected Routes
import { AuthProvider } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login usr={setUserRole} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/Admin" element={<DashbordAdmin />} />
        <Route path="/AdminPatient" element={<AdminPatient />} />
        <Route path="/AdminMedecin" element={<AdminMedecin />} />
        <Route path="/AdminRendezVous" element={<AdminRendezVous />} />
        <Route path="/Sidebar" element={<Sidebar />} />
      </Route>

      {/* Medecin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_MEDECIN"]} />}>
        <Route path="/DashboardMedecin" element={<MedecinDashboard />} />
      </Route>

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />}>
        <Route path="/Rendez-vous" element={<AppointmentsPage />} />
        <Route path="/medecins" element={<DoctorsPage />} />
        <Route path="/medecins/:id" element={<DoctorDetailsPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;