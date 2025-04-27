import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import DashbordAdmin from "./Admin/DashbordAdmin";
import AdminPatient from "./Admin/AdminPatient";
import Sidebar from "./Admin/Sidebar";
import AdminMedecin from "./Admin/AdminMedecin";
import AdminRendezVous from "./Admin/AdminRendez-vous";

import MedecinDashboard from "./Medecin/MedecinDashboard";

import Header from "./Header";

import DoctorsPage from "./Patient/DoctorsPage";
import AppointmentsPage from "./Patient/AppointmentsPage";
import HomePage from "./Patient/HomePage";
import DoctorDetailsPage from "./Patient/DoctorDetailsPage";

import Login from "./login";
import Register from "./register";
// import Unauthorized from "./Unauthorized";

// import PrivateRoute from "./PrivateRoute";
import Logout from "./logout";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Auth Routes */}
//         <Route path="/"  element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/logout" element={<Logout />} />

//         {/* Admin Routes */}
//         <Route path="/Admin" element={<DashbordAdmin />} />
//         <Route path="/AdminPatient" element={<AdminPatient />} />
//         <Route path="/AdminMedecin" element={<AdminMedecin />} />
//         <Route path="/AdminRendezVous" element={<AdminRendezVous />} />
//         <Route path="/Sidebar" element={<Sidebar />} />

//         {/* Medecin Routes */}
//         <Route path="/DashbordMedecin" element={<MedecinDashboard />} />

//         {/* Patient Routes */}
//         <Route path="/Rendez-vous" element={<AppointmentsPage />} />
//         <Route path="/medecins" element={<DoctorsPage />} />
//         <Route path="/medecins/:id" element={<DoctorDetailsPage />} />

//         {/* Shared / public */}
//         <Route path="/Header" element={<Header />} />
//         {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// Auth Context and Protected Routes
import { AuthProvider } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/medecins" element={<DoctorsPage />} />
      <Route path="/medecins/:id" element={<DoctorDetailsPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/Admin" element={<DashbordAdmin />} />
        <Route path="/AdminPatient" element={<AdminPatient />} />
        <Route path="/AdminMedecin" element={<AdminMedecin />} />
        <Route path="/AdminRendezVous" element={<AdminRendezVous />} />
        <Route path="/Sidebar" element={<Sidebar />} />
      </Route>

      {/* Protected Medecin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_MEDECIN"]} />}>
        <Route path="/DashbordMedecin" element={<MedecinDashboard />} />
      </Route>

      {/* Protected Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />}>
        <Route path="/Rendez-vous" element={<AppointmentsPage />} />
      </Route>

      {/* Protected Routes for either Patient or Medecin */}
      <Route element={<ProtectedRoute allowedRoles={["PATIENT", "MEDECIN"]} />}>
        {/* Add any routes that both patients and doctors should access */}
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <Header /> */}
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;