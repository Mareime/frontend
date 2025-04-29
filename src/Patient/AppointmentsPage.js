import React, { useState, useEffect } from "react";
import { Container, Modal, Form, Spinner, Button, Badge, Card, Row, Col, Alert } from "react-bootstrap";
import { Trash2, Edit, Calendar, Clock, User, FileText } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    // 🔒 Restrict to patients only
    if (role !== "ROLE_PATIENT") {
      alert("Accès réservé aux patients. Redirection vers la page d'accueil.");
      navigate("/");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/rendezvous");
        // 🎯 Filter appointments for the logged-in patient
        const patientAppointments = response.data.filter(
          (app) => app.patient?.id?.toString() === userId
        );
        
        // Trier les rendez-vous par date
        const sortedAppointments = patientAppointments.sort((a, b) => 
          new Date(a.dateRdv) - new Date(b.dateRdv)
        );
        
        setAppointments(sortedAppointments);
        setLoading(false);
      } catch (err) {
        setError("Échec de la récupération des rendez-vous");
        setLoading(false);
      }
    };

    if (userId) {
      fetchAppointments();
    } else {
      alert("ID patient introuvable. Redirection vers la page d'accueil.");
      navigate("/");
    }
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      try {
        await axios.delete(`http://localhost:8082/api/rendezvous/${id}`);
        setAppointments(appointments.filter((appointment) => appointment.id !== id));
        
        // Afficher un message de confirmation
        setFeedbackMessage({
          type: "success",
          message: "Rendez-vous supprimé avec succès"
        });
        
        // Faire disparaître le message après 3 secondes
        setTimeout(() => setFeedbackMessage(null), 3000);
      } catch (err) {
        setFeedbackMessage({
          type: "danger",
          message: "Échec de la suppression du rendez-vous"
        });
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    }
  };

  const handleShowModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8082/api/rendezvous/update/${selectedAppointment.id}`,
        selectedAppointment
      );
      setAppointments(
        appointments.map((app) =>
          app.id === selectedAppointment.id ? selectedAppointment : app
        )
      );
      
      // Afficher un message de confirmation
      setFeedbackMessage({
        type: "success",
        message: "Motif du rendez-vous modifié avec succès"
      });
      
      // Faire disparaître le message après 3 secondes
      setTimeout(() => setFeedbackMessage(null), 3000);
      
      handleCloseModal();
    } catch (err) {
      setFeedbackMessage({
        type: "danger",
        message: "Échec de la modification du motif"
      });
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  // Formatter la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Déterminer si un rendez-vous est passé
  const isAppointmentPast = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
            <p className="mt-3 text-primary fw-bold">Chargement de vos rendez-vous...</p>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container className="text-center mt-5">
          <div className="alert alert-danger p-4">
            <h4 className="alert-heading">Erreur!</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">Veuillez réessayer ultérieurement ou contacter le support.</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-5">
        {feedbackMessage && (
          <Alert variant={feedbackMessage.type} className="mb-4 shadow-sm">
            {feedbackMessage.message}
          </Alert>
        )}
        
        <div className="bg-light p-4 rounded-3 shadow-sm mb-4">
          <h1 className="text-primary text-center mb-3">Mes Rendez-Vous</h1>
          <p className="text-muted text-center">
            Consultez et gérez vos rendez-vous médicaux
          </p>
        </div>
        
        {appointments.length === 0 ? (
          <Card className="text-center shadow-sm border-0">
            <Card.Body className="py-5">
              <Calendar size={64} className="text-secondary mb-3" />
              <h3 className="text-secondary">Aucun rendez-vous</h3>
              <p className="text-muted">Vous n'avez pas encore de rendez-vous programmés.</p>
              <Button variant="primary" onClick={() => navigate("/prendre-rendez-vous")}>
                Prendre un rendez-vous
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {appointments.map((appointment) => {
              const { date, time } = formatDate(appointment.dateRdv);
              const isPast = isAppointmentPast(appointment.dateRdv);
              
              return (
                <Col md={6} lg={4} key={appointment.id}>
                  <Card className="h-100 border-0 shadow-sm hover-shadow">
                    <Card.Header className={`${isPast ? 'bg-secondary' : 'bg-primary'} text-white`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">RDV #{appointment.id}</h5>
                        <Badge bg={isPast ? "secondary" : "info"}>
                          {isPast ? "Passé" : "À venir"}
                        </Badge>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <User size={20} className="text-primary me-2" />
                        <div>
                          <strong>Dr. {appointment.medecin.nom} {appointment.medecin.prenom}</strong>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <Calendar size={20} className="text-primary me-2" />
                        <div>{date}</div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <Clock size={20} className="text-primary me-2" />
                        <div>{time}</div>
                      </div>
                      <div className="d-flex align-items-start mb-3">
                        <FileText size={20} className="text-primary me-2" />
                        <div>
                          <strong>Motif:</strong> {appointment.motif || "Non spécifié"}
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0">
                      <div className="d-grid gap-2">
                        {!isPast && (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => handleShowModal(appointment)}
                            >
                              <Edit size={16} className="me-1" /> Modifier le motif
                            </Button>
                            <Button 
                              variant="danger"
                              onClick={() => handleDelete(appointment.id)}
                            >
                              <Trash2 size={16} className="me-1" /> Supprimer ce rendez-vous
                            </Button>
                          </>
                        )}
                        {isPast && (
                          <Button variant="secondary" disabled>Rendez-vous passé</Button>
                        )}
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="text-primary">Modifier le motif du rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <div className="mb-4 p-3 bg-light rounded">
                <div className="d-flex align-items-center mb-2">
                  <User size={18} className="text-primary me-2" />
                  <div><strong>Dr. {selectedAppointment.medecin.nom} {selectedAppointment.medecin.prenom}</strong></div>
                </div>
                <div className="d-flex align-items-center">
                  <Calendar size={18} className="text-primary me-2" />
                  <div>{formatDate(selectedAppointment.dateRdv).date} à {formatDate(selectedAppointment.dateRdv).time}</div>
                </div>
              </div>
              <Form onSubmit={handleUpdate}>
                <Form.Group controlId="motif" className="mb-3">
                  <Form.Label><strong>Motif de consultation</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Décrivez brièvement la raison de votre consultation"
                    value={selectedAppointment?.motif || ""}
                    onChange={(e) =>
                      setSelectedAppointment({ ...selectedAppointment, motif: e.target.value })
                    }
                  />
                  <Form.Text className="text-muted">
                    Vous pouvez modifier le motif de votre rendez-vous ici.
                  </Form.Text>
                </Form.Group>
                <div className="d-grid gap-2 mt-4">
                  <Button type="submit" variant="primary" size="lg">
                    Enregistrer les modifications
                  </Button>
                  <Button variant="outline-secondary" onClick={handleCloseModal}>
                    Annuler
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppointmentsPage;