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
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Info,
  Heart,
  MapPin,
  Star
} from "lucide-react";
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
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Block users who are not patients
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");

    if (role !== "ROLE_PATIENT") {
      showToastNotification("Vous devez être connecté en tant que patient pour prendre un rendez-vous.", "error");
      navigate("/");
      return;
    }

    if (storedUserId) {
      setAppointmentDetails((prev) => ({
        ...prev,
        patientId: parseInt(storedUserId),
      }));

      // Fetch patient's existing appointments
      fetchPatientAppointments(storedUserId);
    } else {
      showToastNotification("Identifiant patient manquant.", "error");
      navigate("/");
    }
  }, [navigate]);

  const showToastNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const fetchPatientAppointments = async (patientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/rendezvous/patient/${patientId}`
      );
      setExistingAppointments(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des rendez-vous:", err);
      // showToastNotification("Impossible de charger vos rendez-vous existants.", "error");
    }
  };

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
        console.log("Raw disponibilites data:", disponibilitesResponse.data);

        // Format the disponibilites data to match what the component expects
        const formattedDisponibilites = disponibilitesResponse.data.map(slot => {
          // Convert date and times to expected format
          const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
          const slotDate = new Date(slot.date);
          const dayName = dayNames[slotDate.getDay()];
          
          // Create full date-time strings for start and end
          const heureDebut = new Date(`${slot.date}T${slot.startTime}`);
          const heureFin = new Date(`${slot.date}T${slot.endTime}`);
          
          return {
            id: slot.id,
            jour: dayName,
            heureDebut: heureDebut,
            heureFin: heureFin,
            date: slot.date
          };
        });

        console.log("Formatted disponibilites:", formattedDisponibilites);

        const now = new Date();
        const futureDisponibilites = formattedDisponibilites.filter(
          (slot) => slot.heureFin >= now
        );

        setDisponibilites(futureDisponibilites);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Impossible de charger les détails du médecin");
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError(null);
    
    try {
      // Check for overlapping appointments for this patient
      const appointmentDateTime = new Date(appointmentDetails.dateRdv);
      
      // Vérifier si ce patient a déjà un rendez-vous à cette heure
      const patientHasOverlappingAppointment = existingAppointments.some(appointment => {
        const existingDateTime = new Date(appointment.dateRdv);
        
        // Considérer un rendez-vous comme chevauchant si dans la même tranche de 30 minutes
        const startTime = new Date(existingDateTime.getTime() - 15 * 60000);
        const endTime = new Date(existingDateTime.getTime() + 15 * 60000);
        
        return appointmentDateTime >= startTime && appointmentDateTime <= endTime;
      });
      
      if (patientHasOverlappingAppointment) {
        setBookingError("Vous avez déjà un autre rendez-vous médical prévu à cette heure. Veuillez vérifier votre agenda et choisir un autre créneau disponible.");
        setIsSubmitting(false);
        return;
      }
      
      // Vérifier si le médecin a déjà un rendez-vous à cette heure
      const doctorAppointmentsResponse = await axios.get(
        `http://localhost:8082/api/rendezvous/medecin/${id}`
      );
      
      const doctorHasOverlappingAppointment = doctorAppointmentsResponse.data.some(appointment => {
        const existingDateTime = new Date(appointment.dateRdv);
        
        // Considérer un rendez-vous comme chevauchant si dans la même tranche de 30 minutes
        const startTime = new Date(existingDateTime.getTime() - 15 * 60000);
        const endTime = new Date(existingDateTime.getTime() + 15 * 60000);
        
        return appointmentDateTime >= startTime && appointmentDateTime <= endTime;
      });
      
      if (doctorHasOverlappingAppointment) {
        setBookingError("Ce créneau vient d'être réservé par un autre patient. Veuillez sélectionner un autre horaire parmi les disponibilités.");
        setIsSubmitting(false);
        return;
      }
      
      // Create the appointment if there are no conflicts
      // await axios.post("http://localhost:8082/api/rendezvous/add", {
      //   ...appointmentDetails,
      //   medecin: { id: doctor.id },
      //   patient: { id: appointmentDetails.patientId },
      //   statut: "EN_ATTENTE",
      // });
      await axios.post("http://localhost:8082/api/rendezvous/add", {
        dateRdv: appointmentDetails.dateRdv,
        motif: appointmentDetails.motif,
        statut: "EN_ATTENTE", // Explicitly set the status
        medecin: { id: doctor.id },
        patient: { id: appointmentDetails.patientId }
      });
      
      setShowSuccessModal(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Erreur lors de la réservation:", err);
      setBookingError("Une erreur technique est survenue pendant la prise de rendez-vous. Veuillez réessayer dans quelques instants ou contacter notre assistance.");
      setIsSubmitting(false);
    }
  };

  const formatTime = (date) => {
    if (!(date instanceof Date)) {
      return "--:--";
    }
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      return "Date invalide";
    }
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    });
  };

  const formatShortDate = (date) => {
    if (!(date instanceof Date)) {
      return "Date invalide";
    }
    return date.toLocaleDateString();
  };

  const isValidAppointmentDay = (slot) => {
    if (!appointmentDetails.dateRdv) return false;
    
    const selectedDate = new Date(appointmentDetails.dateRdv);
    const slotDate = new Date(slot.date);
    
    // Check if the selected date matches the slot date
    const sameDate = 
      selectedDate.getFullYear() === slotDate.getFullYear() &&
      selectedDate.getMonth() === slotDate.getMonth() &&
      selectedDate.getDate() === slotDate.getDate();
    
    // Check if the selected time falls within the slot's time range
    const selectedTime = selectedDate.getHours() * 60 + selectedDate.getMinutes();
    const slotStartTime = slot.heureDebut.getHours() * 60 + slot.heureDebut.getMinutes();
    const slotEndTime = slot.heureFin.getHours() * 60 + slot.heureFin.getMinutes();
    
    return sameDate && (selectedTime >= slotStartTime) && (selectedTime <= slotEndTime);
  };

  const isSlotValid = disponibilites.some(isValidAppointmentDay);

  // Success modal with improved UI
  const SuccessModal = () => (
    <Modal show={showSuccessModal} onHide={() => navigate("/rendez-vous")} centered>
      <Modal.Header className="bg-success text-white border-0">
        <Modal.Title><CheckCircle2 className="me-2" />Rendez-vous confirmé</Modal.Title>
        <Button variant="link" className="text-white ms-auto p-0" onClick={() => navigate("/rendez-vous")}>
          <X size={20} />
        </Button>
      </Modal.Header>
      <Modal.Body className="py-4">
        <div className="text-center mb-4">
          <div className="mb-3">
            <CheckCircle2 size={60} className="text-success" />
          </div>
          <h4 className="fw-bold">Merci pour votre réservation!</h4>
          <p className="text-muted">Votre rendez-vous a été confirmé avec succès</p>
        </div>
        
        <Card className="border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex mb-3 align-items-center">
              <div className="me-3">
                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                  <Calendar className="text-white" />
                </div>
              </div>
              <div>
                <h6 className="mb-0">Date du rendez-vous</h6>
                <p className="mb-0 fw-bold">{new Date(appointmentDetails.dateRdv).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <div className="d-flex mb-3 align-items-center">
              <div className="me-3">
                <div className="rounded-circle bg-success d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                  <Clock className="text-white" />
                </div>
              </div>
              <div>
                <h6 className="mb-0">Heure</h6>
                <p className="mb-0 fw-bold">{new Date(appointmentDetails.dateRdv).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            
            <div className="d-flex mb-3 align-items-center">
              <div className="me-3">
                <div className="rounded-circle bg-info d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                  <Heart className="text-white" />
                </div>
              </div>
              <div>
                <h6 className="mb-0">Médecin</h6>
                <p className="mb-0 fw-bold">Dr. {doctor?.nom} {doctor?.prenom}</p>
              </div>
            </div>
            
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="rounded-circle bg-warning d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                  <Info className="text-white" />
                </div>
              </div>
              <div>
                <h6 className="mb-0">Motif</h6>
                <p className="mb-0">{appointmentDetails.motif}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        <Alert variant="info" className="d-flex align-items-center mb-0">
          <Info size={20} className="me-2 text-info" />
          <div>
            <p className="mb-0">Vous recevrez un rappel par email 24 heures avant votre rendez-vous.</p>
          </div>
        </Alert>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          Retour
        </Button>
        <Button variant="primary" onClick={() => navigate("/rendez-vous")}>
          Voir mes rendez-vous
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading) return (
    <>
      <Header />
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des informations du médecin...</p>
      </Container>
    </>
  );
  
  if (error) return (
    <>
      <Header />
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </Container>
    </>
  );
  
  if (!doctor) return (
    <>
      <Header />
      <Container className="py-5">
        <Alert variant="warning">
          Médecin non trouvé
        </Alert>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </Container>
    </>
  );

  // Group disponibilites by date
  const groupedDisponibilites = disponibilites.reduce((acc, slot) => {
    const dateKey = slot.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <Container className="py-5">
        {/* Toast notifications */}
        <ToastContainer position="top-end" className="p-3">
          <Toast 
            show={showToast} 
            onClose={() => setShowToast(false)} 
            delay={5000} 
            autohide 
            bg={toastType === "success" ? "success" : "danger"}
            className="text-white"
          >
            <Toast.Header closeButton={true}>
              <strong className="me-auto">
                {toastType === "success" ? "Succès" : "Erreur"}
              </strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

        <Row>
          <Col md={4}>
            <Card className="mb-4 shadow">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src="https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827774.jpg"
                  alt={`${doctor.nom} ${doctor.prenom}`}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                    filter: "brightness(0.85)",
                  }}
                />
                <div 
                  className="position-absolute bottom-0 start-0 end-0 p-3 text-white" 
                  style={{
                    background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
                  }}
                >
                  <h4 className="mb-0">Dr. {doctor.nom} {doctor.prenom}</h4>
                  <div className="mt-1">
                    <Badge bg="primary" className="me-2">{doctor.specialite}</Badge>
                    <div className="d-inline-flex align-items-center mt-1">
                      <Star className="text-warning" size={14} />
                      <Star className="text-warning" size={14} />
                      <Star className="text-warning" size={14} />
                      <Star className="text-warning" size={14} />
                      <Star className="text-warning" size={14} />
                    </div>
                  </div>
                </div>
              </div>
              <Card.Body>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center">
                    <Mail className="me-3 text-primary" />
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <span>{doctor.email}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Phone className="me-3 text-primary" />
                    <div>
                      <small className="text-muted d-block">Téléphone</small>
                      <span>{doctor.telephone}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <MapPin className="me-3 text-primary" />
                    <div>
                      <small className="text-muted d-block">Adresse</small>
                      <span>{doctor.adresse || "Cabinet médical"}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            {/* Informations complémentaires */}
            <Card className="shadow mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">À propos</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-0">
                  Dr. {doctor.nom} {doctor.prenom} est spécialisé(e) en {doctor.specialite}. 
                  {doctor.description || " Avec plusieurs années d'expérience, le docteur s'engage à fournir des soins de qualité et personnalisés à tous ses patients."}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="shadow mb-4">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Disponibilités</h4>
                <Badge bg="success" className="px-3 py-2">Consultations disponibles</Badge>
              </Card.Header>
              <Card.Body>
                {disponibilites.length === 0 ? (
                  <Alert variant="warning">
                    <AlertTriangle className="me-2" />
                    Aucune disponibilité actuelle ou future. Veuillez contacter le médecin directement.
                  </Alert>
                ) : (
                  <div>
                    {Object.entries(groupedDisponibilites).map(([dateKey, slots], dateIndex) => {
                      const displayDate = new Date(dateKey);
                      return (
                        <div key={dateIndex} className="mb-4">
                          <h5 className="border-bottom pb-2 mb-3">
                            <Calendar className="me-2 text-primary" size={18} />
                            {formatDate(displayDate)}
                          </h5>
                          <Row className="row-cols-2 row-cols-lg-3 g-3">
                            {slots.map((slot, index) => (
                              <Col key={index}>
                                <Card 
                                  className={`border h-100 ${selectedSlot === slot.id ? 'border-primary' : ''}`}
                                  onClick={() => {
                                    setSelectedSlot(slot.id);
                                    const dateStr = `${slot.date}T${slot.heureDebut.getHours().toString().padStart(2, '0')}:${slot.heureDebut.getMinutes().toString().padStart(2, '0')}`;
                                    setAppointmentDetails({
                                      ...appointmentDetails,
                                      dateRdv: dateStr
                                    });
                                    document.getElementById('appointment-form').scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Card.Body className={`${selectedSlot === slot.id ? 'bg-primary bg-opacity-10' : ''}`}>
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                      <span className="fw-bold">
                                        {formatTime(slot.heureDebut)}
                                      </span>
                                      <Badge bg={selectedSlot === slot.id ? "primary" : "light"} text={selectedSlot === slot.id ? "white" : "dark"}>
                                        {selectedSlot === slot.id ? 'Sélectionné' : 'Disponible'}
                                      </Badge>
                                    </div>
                                    <div className="d-flex align-items-center text-muted">
                                      <Clock size={14} className="me-1" />
                                      <small>Durée: 30 min</small>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="shadow" id="appointment-form">
              <Card.Header className="bg-white">
                <h4 className="mb-0">Prendre Rendez-vous</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleAppointmentSubmit}>
                  <Row>
                    <Col md={6}>
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
                          min={new Date().toISOString().slice(0, 16)}
                          className="form-control-lg"
                        />
                        <Form.Text className="text-muted">
                          Sélectionnez une date dans les plages disponibles ou cliquez sur un créneau ci-dessus.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Motif de Consultation</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Décrivez brièvement le motif de votre consultation..."
                          value={appointmentDetails.motif}
                          onChange={(e) =>
                            setAppointmentDetails({
                              ...appointmentDetails,
                              motif: e.target.value,
                            })
                          }
                          required
                          className="form-control-lg"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {appointmentDetails.dateRdv && !isSlotValid && (
                    <Alert variant="danger" className="d-flex align-items-center mb-3">
                      <AlertTriangle className="me-2 flex-shrink-0" />
                      <div>
                        <strong>Créneau non disponible</strong>
                        <p className="mb-0">Le médecin n'est pas disponible à cette date et heure. Veuillez choisir un créneau parmi les disponibilités affichées.</p>
                      </div>
                    </Alert>
                  )}
                  
                  {bookingError && (
                    <Alert variant="danger" className="d-flex align-items-center mb-3">
                      <AlertTriangle className="me-2 flex-shrink-0" />
                      <div>
                        <strong>Impossible de réserver ce créneau</strong>
                        <p className="mb-0">{bookingError}</p>
                      </div>
                    </Alert>
                  )}

                  {appointmentDetails.dateRdv && isSlotValid && (
                    <Card className="border-success mb-3">
                      <Card.Header className="bg-success bg-opacity-10 text-success border-success">
                        <div className="d-flex align-items-center">
                          <CheckCircle2 className="me-2" size={20} />
                          <h5 className="mb-0">Récapitulatif de votre rendez-vous</h5>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={4}>
                            <p className="mb-1 text-muted">Médecin</p>
                            <p className="fw-bold">Dr. {doctor.nom} {doctor.prenom}</p>
                          </Col>
                          <Col md={4}>
                            <p className="mb-1 text-muted">Date</p>
                            <p className="fw-bold">{new Date(appointmentDetails.dateRdv).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                          </Col>
                          <Col md={4}>
                            <p className="mb-1 text-muted">Heure</p>
                            <p className="fw-bold">{new Date(appointmentDetails.dateRdv).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  )}

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="py-3"
                      disabled={!isSlotValid || disponibilites.length === 0 || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Traitement en cours...
                        </>
                      ) : (
                        'Confirmer mon rendez-vous'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Success Modal */}
        <SuccessModal />
      </Container>
    </>
  );
};

export default DoctorDetailsPage;