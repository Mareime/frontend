import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  Users,
  Calendar as CalendarIcon,
  PlusCircle,
  Trash2,
  LogOut,
  Check,
  X,
  User,
} from "react-feather";
import "./MedecinDashboard.css";

const MedecinDashboard = () => {
  // États
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,

    pendingAppointments: 0,
    totalPatients: 0,
  });
  const [newDisponibilite, setNewDisponibilite] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [medecinInfo, setMedecinInfo] = useState(null);
  const [debugMode, setDebugMode] = useState(false);

  const navigate = useNavigate();

  // Récupérer l'ID du médecin depuis localStorage
  const medecinId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Configuration Axios
  const api = axios.create({
    baseURL: "http://localhost:8082",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Récupérer les données
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        // Récupérer les informations du médecin
        const medecinResponse = await api.get(`/api/medecins/${medecinId}`);
        setMedecinInfo(medecinResponse.data);

        // Récupérer les rendez-vous
        const appointmentsResponse = await api.get(
          `/api/rendezvous/medecin/${medecinId}`
        );
        const appointmentsData = appointmentsResponse.data;

        console.log(
          "Données brutes des rendez-vous reçues de l'API:",
          appointmentsData
        );

        // Traitement des rendez-vous avec information des patients
        const appointmentsWithPatientDetails = await Promise.all(
          appointmentsData.map(async (appointment) => {
            try {
              // Vérifier si l'objet patient existe et a un ID
              if (appointment.patient && appointment.patient.id) {
                // Récupérer les détails du patient
                const patientResponse = await api.get(
                  `/api/patients/${appointment.patient.id}`
                );
                const patientData = patientResponse.data;

                // Créer une version "normalisée" du rendez-vous avec tous les champs nécessaires
                const processedAppointment = {
                  id: appointment.id,
                  date: appointment.dateRdv || appointment.date || null, // Essayer différents noms de champs possibles
                  heure: appointment.heureRdv || appointment.heure || null, // Essayer différents noms de champs
                  statut: appointment.statut || "EN_ATTENTE", // Valeur par défaut si status non défini
                  patientName: `${patientData.nom} ${patientData.prenom}`,
                  patientId: appointment.patient.id,
                  motif: appointment.motif || "Non spécifié",
                };

                console.log("Rendez-vous traité:", processedAppointment);

                return processedAppointment;
              } else {
                // Si les données du patient ne sont pas disponibles dans le rendez-vous
                return {
                  id: appointment.id,
                  date: appointment.dateRdv || appointment.date || null,
                  heure: appointment.heureRdv || appointment.heure || null,
                  status: appointment.statut || "EN_ATTENTE",
                  patientName: "Patient inconnu",
                  patientId: null,
                };
              }
            } catch (err) {
              console.error(
                `Erreur lors de la récupération des détails du patient pour le rendez-vous ${appointment.id}:`,
                err
              );
              return {
                id: appointment.id,
                date: appointment.dateRdv || appointment.date || null,
                heure: appointment.heureRdv || appointment.heure || null,
                status: appointment.statut || "EN_ATTENTE",
                patientName: "Erreur de récupération",
                patientId: appointment.patient?.id || null,
              };
            }
          })
        );

        console.log(
          "Rendez-vous après traitement:",
          appointmentsWithPatientDetails
        );

        setAppointments(appointmentsWithPatientDetails);

        // Récupérer les patients
        const patientsResponse = await api.get(
          `/api/medecin/${medecinId}/patients`
        );
        setPatients(patientsResponse.data);

        // Récupérer les disponibilités
        const disponibilitesResponse = await api.get(
          `/api/disponibilites/medecin/${medecinId}`
        );
        setDisponibilites(disponibilitesResponse.data);

        // Calculer les statistiques
        setStats({
          totalAppointments: appointmentsData.length,
          pendingAppointments: appointmentsData.filter(
            (app) => app.statut === "EN_ATTENTE"
          ).length,
          totalPatients: patientsResponse.data.length,
        });

        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(
          `Erreur lors du chargement des données: ${
            err.response?.data?.message || err.message
          }`
        );
        setLoading(false);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userId");
          localStorage.removeItem("isAuthenticated");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate, medecinId, token]);

  // Gestionnaires d'événements
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDisponibilite({
      ...newDisponibilite,
      [name]: value,
    });
  };

  const addDisponibilite = async (e) => {
    e.preventDefault();
    try {
      const disponibiliteData = {
        date: newDisponibilite.date,
        startTime: newDisponibilite.startTime,
        endTime: newDisponibilite.endTime,
        medecin: {
          id: medecinId,
        },
      };

      const response = await api.post(
        "/api/disponibilites/add",
        disponibiliteData
      );

      setDisponibilites([...disponibilites, response.data]);
      setNewDisponibilite({ date: "", startTime: "", endTime: "" });
    } catch (err) {
      setError(
        `Erreur lors de l'ajout de disponibilité: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
      // Nettoyer le stockage local
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    } catch (err) {
      console.error("Erreur de déconnexion:", err);
      // En cas d'erreur, déconnecter quand même côté client
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    }
  };
  const confirmAppointment = async (appointmentId) => {
    try {
      // Get the current appointment
      const appointment = appointments.find((app) => app.id === appointmentId);
      if (!appointment) throw new Error("Rendez-vous non trouvé");

      // First get the full appointment details to preserve all fields
      const fullAppointment = await api.get(`/api/rendezvous/${appointmentId}`);

      // Update with the new status while preserving all other fields
      const response = await api.put(
        `/api/rendezvous/update/${appointmentId}`,
        {
          ...fullAppointment.data, // Include all existing fields
          statut: "CONFIRME", // Use uppercase consistent with backend
          // Keep the original motif
          motif: fullAppointment.data.motif,
        }
      );

      // Update local state
      setAppointments(
        appointments.map((app) =>
          app.id === appointmentId ? { ...app, statut: "CONFIRME" } : app
        )
      );

      // Update stats
      setStats({
        ...stats,
        pendingAppointments: stats.pendingAppointments - 1,
      });
    } catch (err) {
      console.error("Error confirming appointment:", err);
      setError(
        `Erreur lors de la confirmation: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      // Get the current appointment
      const appointment = appointments.find((app) => app.id === appointmentId);
      if (!appointment) throw new Error("Rendez-vous non trouvé");

      // First get the full appointment details
      const fullAppointment = await api.get(`/api/rendezvous/${appointmentId}`);

      // Update with the new status while preserving all other fields
      const response = await api.put(
        `/api/rendezvous/update/${appointmentId}`,
        {
          ...fullAppointment.data, // Include all existing fields
          statut: "ANNULE", // Use uppercase consistent with backend
          // Keep the original motif
          motif: fullAppointment.data.motif,
        }
      );

      // Update local state
      setAppointments(
        appointments.map((app) =>
          app.id === appointmentId ? { ...app, statut: "ANNULE" } : app
        )
      );

      // Update stats if it was pending
      if (appointment.statut === "EN_ATTENTE") {
        setStats({
          ...stats,
          pendingAppointments: stats.pendingAppointments - 1,
        });
      }
    } catch (err) {
      console.error("Error canceling appointment:", err);
      setError(
        `Erreur lors de l'annulation: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };
  const deleteDisponibilite = async (disponibiliteId) => {
    try {
      await api.delete(`/api/disponibilites/${disponibiliteId}`);

      // Mettre à jour la liste des disponibilités
      setDisponibilites(
        disponibilites.filter((dispo) => dispo.id !== disponibiliteId)
      );
    } catch (err) {
      setError(
        `Erreur lors de la suppression de la disponibilité: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      // Récupérer d'abord le rendez-vous actuel
      const appointment = appointments.find((app) => app.id === appointmentId);

      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      console.log("Finalisation du rendez-vous:", appointmentId);

      // Envoyer une requête plus complète avec les informations nécessaires
      const response = await api.put(
        `/api/rendezvous/update/${appointmentId}`,
        {
          id: appointmentId,
          statut: "Completée",
          // Inclure les champs essentiels qui pourraient être nécessaires pour le serveur
          dateRdv: appointment.date || appointment.dateRdv,
          heureRdv: appointment.heure || appointment.heureRdv,
          patient: {
            id: appointment.patientId,
          },
          medecin: {
            id: medecinId,
          },
        }
      );

      console.log("Réponse du serveur:", response.data);

      // Mettre à jour la liste des rendez-vous
      setAppointments(
        appointments.map((app) =>
          app.id === appointmentId ? { ...app, statut: "Completée" } : app
        )
      );
    } catch (err) {
      console.error("Détails de l'erreur:", err);
      setError(
        `Erreur lors de la finalisation du rendez-vous: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Formater la date - Version améliorée qui accepte plusieurs formats possibles
  const formatDate = (dateString) => {
    if (!dateString) return "Date non définie";

    try {
      // Si la date est au format "YYYY-MM-DD" (format ISO sans heure)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day); // Mois commence à 0 en JS
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return date.toLocaleDateString("fr-FR", options);
      }

      // Si c'est un timestamp complet ISO ou un autre format de date reconnu par JS
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return date.toLocaleDateString("fr-FR", options);
      }

      // Si aucun format n'est reconnu, retourner la valeur telle quelle
      console.warn("Format de date non reconnu:", dateString);
      return dateString;
    } catch (e) {
      console.error(
        "Erreur lors du formatage de la date:",
        e,
        "pour la valeur:",
        dateString
      );
      return "Format invalide";
    }
  };

  // Formater l'heure - Version améliorée qui accepte plusieurs formats
  const formatTime = (timeString) => {
    if (!timeString) return "Heure non définie";

    try {
      // Si c'est déjà un format HH:MM ou HH:MM:SS
      if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
        return timeString.substring(0, 5); // Retourner juste HH:MM
      }

      // Si c'est un timestamp complet
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      console.warn("Format d'heure non reconnu:", timeString);
      return timeString;
    } catch (e) {
      console.error(
        "Erreur lors du formatage de l'heure:",
        e,
        "pour la valeur:",
        timeString
      );
      return "Format invalide";
    }
  };

  // Afficher la structure complète de données pour le débogage
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (!debugMode) {
      console.log("Structure complète des rendez-vous:", appointments);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Rendez-Vous</h2>
        </div>
        <div className="profile-info">
          <div className="profile-avatar">
            <User size={36} />
          </div>
          <div className="profile-details">
            <h3>
              {medecinInfo?.nom} {medecinInfo?.prenom}
            </h3>
            <p>Médecin</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li
              className={activeTab === "appointments" ? "active" : ""}
              onClick={() => setActiveTab("appointments")}
            >
              <Calendar size={20} />
              <span>Rendez-vous</span>
            </li>
            <li
              className={activeTab === "patients" ? "active" : ""}
              onClick={() => setActiveTab("patients")}
            >
              <Users size={20} />
              <span>Patients</span>
            </li>
            <li
              className={activeTab === "disponibilites" ? "active" : ""}
              onClick={() => setActiveTab("disponibilites")}
            >
              <Clock size={20} />
              <span>Disponibilités</span>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {error && (
          <div className="error-message">
            <button onClick={() => setError(null)} className="close-error">
              ×
            </button>
            {error}
          </div>
        )}

        {/* Dashboard Header */}
        <header className="dashboard-header">
          <h1>
            {activeTab === "appointments" && "Gestion des Rendez-vous"}
            {activeTab === "patients" && "Mes Patients"}
            {activeTab === "disponibilites" && "Gestion des Disponibilités"}
          </h1>
          <div className="date-display">
            <CalendarIcon size={16} />
            <span>
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon appointments-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Rendez-vous</h3>
              <p>{stats.totalAppointments}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending-icon">
              <Clock size={24} />
            </div>
            <div className="stat-details">
              <h3>En attente</h3>
              <p>{stats.pendingAppointments}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon patients-icon">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Patients</h3>
              <p>{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="appointments-section">
              <div className="section-header">
                <h2>Rendez-vous à venir</h2>
              </div>

              {appointments.length === 0 ? (
                <div className="no-data-message">
                  <p>Aucun rendez-vous à venir</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Motif</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className={`status-${
                            appointment.statut
                              ? appointment.statut.toLowerCase()
                              : "unknown"
                          }`}
                        >
                          <td>
                            <div className="patient-info">
                              <span className="patient-name">
                                {appointment.patientName ||
                                  "Patient non défini"}
                              </span>
                            </div>
                          </td>
                          <td>
                            {formatDate(
                              appointment.date || appointment.dateRdv
                            )}
                          </td>
                          <td>
                            {formatTime(
                              appointment.heure ||
                                appointment.date ||
                                appointment.dateRdv
                            )}
                          </td>
                          <td>
                            {appointment.motif || "Non spécifié"}{" "}
                            {/* New cell */}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                appointment.statut
                                  ? appointment.statut.toLowerCase()
                                  : "unknown"
                              }`}
                            >
                              {appointment.statut === "EN_ATTENTE" &&
                                "En attente"}
                              {appointment.statut === "CONFIRME" && "Confirmé"}
                              {appointment.statut === "ANNULE" && "Annulé"}
                              {appointment.statut === "COMPLETE" && "Terminé"}
                              {!appointment.statut && "Inconnu"}
                            </span>
                          </td>
                          <td>
                            {appointment.statut === "EN_ATTENTE" && (
                              <div className="action-buttons">
                                <button
                                  onClick={() =>
                                    confirmAppointment(appointment.id)
                                  }
                                  className="action-btn confirm"
                                  title="CONFIRM"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    cancelAppointment(appointment.id)
                                  }
                                  className="action-btn cancel"
                                  title="CANCELED"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            )}
                            {appointment.statut === "Confirmée" && (
                              <div className="action-buttons">
                                <button
                                  onClick={() =>
                                    cancelAppointment(appointment.id)
                                  }
                                  className="action-btn cancel"
                                  title="Annuler"
                                >
                                  <X size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    completeAppointment(appointment.id)
                                  }
                                  className="action-btn complete"
                                  title="Marquer comme terminé"
                                >
                                  <Check size={16} color="#4CAF50" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === "patients" && (
            <div className="patients-section">
              <div className="section-header">
                <h2>Liste des Patients</h2>
              </div>

              {patients.length === 0 ? (
                <div className="no-data-message">
                  <p>Aucun patient enregistré</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td>
                            <div className="patient-info">
                              <span className="patient-name">
                                {patient.nom} {patient.prenom}
                              </span>
                            </div>
                          </td>
                          <td>{patient.email}</td>
                          <td>{patient.telephone}</td>
                          {/* <td>
                            <Link
                              to={`/medecin/patients/${patient.id}`}
                              className="view-btn"
                            >
                              Dossier médical
                            </Link>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Disponibilites Tab */}
          {activeTab === "disponibilites" && (
            <div className="disponibilites-section">
              <div className="section-header">
                <h2>Gérer vos disponibilités</h2>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Ajouter une disponibilité</h3>
                </div>
                <div className="card-body">
                  <form
                    onSubmit={addDisponibilite}
                    className="disponibilite-form"
                  >
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={newDisponibilite.date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="startTime">Heure de début</label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          value={newDisponibilite.startTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="endTime">Heure de fin</label>
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          value={newDisponibilite.endTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="submit-btn">
                      <PlusCircle size={16} />
                      Ajouter
                    </button>
                  </form>
                </div>
              </div>

              <div className="disponibilites-list-section">
                <div className="section-header">
                  <h3>Mes disponibilités actuelles</h3>
                </div>

                {disponibilites.length === 0 ? (
                  <div className="no-data-message">
                    <p>Aucune disponibilité définie</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Heure de début</th>
                          <th>Heure de fin</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {disponibilites.map((disponibilite) => (
                          <tr key={disponibilite.id}>
                            <td>{formatDate(disponibilite.date)}</td>
                            <td>{disponibilite.startTime}</td>
                            <td>{disponibilite.endTime}</td>
                            <td>
                              <button
                                onClick={() =>
                                  deleteDisponibilite(disponibilite.id)
                                }
                                className="action-btn delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedecinDashboard;
