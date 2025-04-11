import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashbordAdmin from './Admin/DashbordAdmin';
import AdminPatient from './Admin/AdminPatient';
import Sidebar from './Admin/Sidebar';
import AdminMedecin from './Admin/AdminMedecin';
import AdminRendezVous from './Admin/AdminRendez-vous';
import MedecinDashboard from './Medecin/MedecinDashboard';
import Header from './Header';
import DoctorsPage from './Patient/DoctorsPage';
import AppointmentsPage from './Patient/AppointmentsPage';
import HomePage from './Patient/HomePage';
import DoctorDetailsPage from './Patient/DoctorDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Admin" element={<DashbordAdmin />} />
        <Route path="/AdminPatient" element={<AdminPatient />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/AdminMedecin" element={<AdminMedecin />} />  
        <Route path="/AdminRendezVous" element={<AdminRendezVous />} />
        <Route path="/DashbordMedecin" element={<MedecinDashboard />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/medecins" element={<DoctorsPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Rendez-vous" element={<AppointmentsPage />} />
        <Route path="/medecins/:id" element={<DoctorDetailsPage />} />
        {/* <Route path="/" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
