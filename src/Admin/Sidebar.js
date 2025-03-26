import React from "react";
import { Nav, Col } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import React Router
import { FaHome, FaUserMd, FaUserInjured, FaCalendarCheck, FaChartPie, FaCogs, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "../Sidebar.css";

function Sidebar({ selectedOption, onSelect }) {
  return (
    <Col md={3} className="bg-white text-dark p-4 position-fixed min-vh-100 d-none d-md-block shadow-lg border-end">
      <h4 className="mb-4 text-center">Dashboard Admin</h4>
      <Nav className="flex-column">
        {[
          { name: "home", label: "Accueil", icon: <FaHome size={20} className="me-2" />, path: "/admin" },
          { name: "medecins", label: "Médecins", icon: <FaUserMd size={20} className="me-2" />, path: "/AdminMedecin" },
          { name: "patients", label: "Patients", icon: <FaUserInjured size={20} className="me-2" />, path: "/AdminPatient" },
          { name: "rendezvous", label: "Rendez-vous", icon: <FaCalendarCheck size={20} className="me-2" />, path: "/AdminRendezVous" },
          // { name: "stats", label: "Statistiques", icon: <FaChartPie size={20} className="me-2" />, path: "/admin/stats" },
          // { name: "settings", label: "Paramètres", icon: <FaCogs size={20} className="me-2" />, path: "/admin/settings" },
          // { name: "users", label: "Utilisateurs", icon: <FaUsers size={20} className="me-2" />, path: "/admin/users" },
          { name: "logout", label: "Déconnexion", icon: <FaSignOutAlt size={20} className="me-2" />, path: "/logout" },
        ].map((option) => (
          <Link
            to={option.path}
            className={`nav-link text-dark mb-3 d-flex align-items-center sidebar-option ${selectedOption === option.name ? "active-option" : ""}`}
            onClick={() => onSelect(option.name)}
            key={option.name}
          >
            {option.icon} {option.label}
          </Link>
        ))}
      </Nav>
    </Col>
  );
}

export default Sidebar;
