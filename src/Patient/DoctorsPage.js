import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge,Spinner } from "react-bootstrap";
import { Mail, Phone } from "lucide-react";
import axios from "axios";
import Header from "../Header";

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/medecins");
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de charger les médecins. Veuillez réessayer ultérieurement.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorDetails = (doctorId) => {
    navigate(`/medecins/${doctorId}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">Notre Équipe Médicale</h1>
          <p className="lead text-muted">
            Découvrez nos professionnels de santé hautement qualifiés et dévoués
          </p>
        </div>
        <Row className="g-4">
          {doctors.map((doctor) => (
            <Col key={doctor.id} md={4}>
              <Card 
                className="h-100 shadow-sm border-0 position-relative cursor-pointer" 
                onClick={() => handleDoctorDetails(doctor.id)}
              >
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src="https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827774.jpg"
                    alt={`${doctor.nom} ${doctor.prenom}`}
                    className="card-img-top"
                    style={{ 
                      height: '250px', 
                      objectFit: 'cover',
                      filter: 'brightness(0.9)' 
                    }}
                  />
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 end-0 m-3"
                  >
                    {doctor.specialite}
                  </Badge>
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="h4 mb-3">
                    Dr. {doctor.nom} {doctor.prenom}
                  </Card.Title>
                  <div className="d-flex flex-column align-items-center mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <Mail className="me-2 text-muted" size={18} />
                      <small className="text-muted">{doctor.email}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <Phone className="me-2 text-muted" size={18} />
                      <small className="text-muted">{doctor.telephone}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default DoctorsPage;