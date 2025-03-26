import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashbordAdmin from './Admin/DashbordAdmin';
import AdminPatient from './Admin/AdminPatient';
import Sidebar from './Admin/Sidebar';
import AdminMedecin from './Admin/AdminMedecin';
import AdminRendezVous from './Admin/AdminRendez-vous';
import MedecinDashboard from './Medecin/MedecinDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        {/* <Route path="/" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
