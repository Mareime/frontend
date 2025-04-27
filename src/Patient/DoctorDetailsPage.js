
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Alert,
  Form,
  Badge,
} from "react-bootstrap";
import { Calendar, Clock, Mail, Phone, CheckCircle2 } from "lucide-react";
import axios from "axios";
import Header from "../Header";

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    dateRdv: "",
    motif: "",
    patientId: null,
  });

  // Block users who are not patients
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");

    if (role !== "ROLE_PATIENT") {
      alert(
        "Vous devez être connecté en tant que patient pour prendre un rendez-vous."
      );
      navigate("/");
      return;
    }

    if (storedUserId) {
      setAppointmentDetails((prev) => ({
        ...prev,
        patientId: parseInt(storedUserId),
      }));
    } else {
      alert("Identifiant patient manquant.");
      navigate("/");
    }
  }, [navigate]);

  // Fetch doctor details and availability
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorResponse = await axios.get(
          `http://localhost:8082/api/medecins/${id}`
        );
        setDoctor(doctorResponse.data);

        const disponibilitesResponse = await axios.get(
          `http://localhost:8082/api/disponibilites/medecin/${id}`
        );

        const now = new Date();
        const futureDisponibilites = disponibilitesResponse.data.filter(
          (slot) => new Date(slot.heureFin) >= now
        );

        setDisponibilites(futureDisponibilites);
        setLoading(false);
      } catch (err) {
        setError("Impossible de charger les détails du médecin");
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8082/api/rendezvous/add", {
        ...appointmentDetails,
        medecin: { id: doctor.id },
        patient: { id: appointmentDetails.patientId },
      });
      alert("Rendez-vous confirmé avec succès !");
      navigate("/rendez-vous");
    } catch (err) {
      console.error("Erreur lors de la réservation:", err);
      alert("Erreur lors de la réservation. Veuillez réessayer.");
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const isValidAppointmentDay = (slot) => {
    const selectedDate = new Date(appointmentDetails.dateRdv);
    const dayNames = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const selectedDayName = dayNames[selectedDate.getDay()];

    return (
      slot.jour === selectedDayName &&
      selectedDate.getTime() >= new Date(slot.heureDebut).getTime() &&
      selectedDate.getTime() <= new Date(slot.heureFin).getTime()
    );
  };

  const isSlotValid = disponibilites.some(isValidAppointmentDay);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!doctor) return <div>Médecin non trouvé</div>;

  return (
    <>
      <Header />
      <Container className="py-5">
        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Img
                variant="top"
                src="https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827774.jpg"
                alt={`${doctor.nom} ${doctor.prenom}`}
                style={{
                  height: "300px",
                  objectFit: "cover",
                  filter: "brightness(0.9)",
                }}
              />
              <Card.Body>
                <Card.Title className="h4 text-center">
                  Dr. {doctor.nom} {doctor.prenom}
                </Card.Title>
                <div className="text-center mb-3">
                  <Badge bg="primary">{doctor.specialite}</Badge>
                </div>
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <Mail className="me-2 text-muted" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Phone className="me-2 text-muted" />
                    <span>{doctor.telephone}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card>
              <Card.Header>
                <h4>Disponibilités</h4>
              </Card.Header>
              <Card.Body>
                {disponibilites.length === 0 ? (
                  <Alert variant="warning">
                    Aucune disponibilité actuelle ou future
                  </Alert>
                ) : (
                  <Row>
                    {disponibilites.map((slot, index) => (
                      <Col key={index} md={6} className="mb-3">
                        <Card className="border">
                          <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                              <Calendar className="me-2 text-primary" />
                              <strong>{slot.jour + " . "}</strong>
                              <strong>
                                {new Date(slot.heureDebut).toLocaleDateString()}
                              </strong>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <Clock className="me-2 text-success" />
                              <span>
                                {formatTime(slot.heureDebut)} -{" "}
                                {formatTime(slot.heureFin)}
                              </span>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>

            <Card className="mt-4">
              <Card.Header>
                <h4>Prendre Rendez-vous</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleAppointmentSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date et Heure du Rendez-vous</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={appointmentDetails.dateRdv}
                      onChange={(e) =>
                        setAppointmentDetails({
                          ...appointmentDetails,
                          dateRdv: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Motif de Consultation</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Décrivez brièvement le motif"
                      value={appointmentDetails.motif}
                      onChange={(e) =>
                        setAppointmentDetails({
                          ...appointmentDetails,
                          motif: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>

                  {appointmentDetails.dateRdv && !isSlotValid && (
                    <Alert variant="danger" className="mb-3">
                      <CheckCircle2 className="me-2" />
                      Le médecin n'est pas disponible à cette date. Veuillez
                      choisir une date valide.
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!isSlotValid}
                  >
                    Confirmer le Rendez-vous
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DoctorDetailsPage;
