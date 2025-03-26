import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaUserMd, FaUserInjured, FaCalendarCheck } from "react-icons/fa";
import Sidebar from "./Sidebar";  // Importation correcte de la Sidebar
import "../DashboardAdmin.css";

function DashboardAdmin() {
  const navigate = useNavigate();  // Hook pour la navigation

  return (
    <Container fluid className="bg-light min-vh-100">
      <Row>
        {/* Sidebar */}
        <Sidebar selectedOption="home" onSelect={() => {}} />

        {/* Main Content */}
        <Col md={9} className="offset-md-3">
          <Row className="mt-4 d-flex justify-content-center">
            {/* Carte - Médecins */}
            <Col md={4} className="mb-4">
              <Card
                className="shadow-lg border-0 rounded-lg overflow-hidden card-hover"
                style={{ background: "linear-gradient(135deg, #007bff, #0056b3)", color: "white" }}
              >
                <Card.Body className="text-center p-4">
                  <FaUserMd size={70} className="mb-3" />
                  <Card.Title className="mt-2 fw-bold">Gérer les Médecins</Card.Title>
                  <Card.Text>Ajoutez, modifiez ou supprimez les médecins.</Card.Text>
                  <Button variant="light" className="fw-bold shadow" onClick={() => navigate("/AdminMedecin")}>
                    Accéder
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Carte - Patients */}
            <Col md={4} className="mb-4">
              <Card
                className="shadow-lg border-0 rounded-lg overflow-hidden card-hover"
                style={{ background: "linear-gradient(135deg, #28a745, #1c7430)", color: "white" }}
              >
                <Card.Body className="text-center p-4">
                  <FaUserInjured size={70} className="mb-3" />
                  <Card.Title className="mt-2 fw-bold">Gérer les Patients</Card.Title>
                  <Card.Text>Consultez et modifiez les informations des patients.</Card.Text>
                  <Button variant="light" className="fw-bold shadow" onClick={() => navigate("/AdminPatient")}>
                    Accéder
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Carte - Rendez-vous */}
            <Col md={4} className="mb-4">
              <Card
                className="shadow-lg border-0 rounded-lg overflow-hidden card-hover"
                style={{ background: "linear-gradient(135deg, #ffc107, #d39e00)", color: "black" }}
              >
                <Card.Body className="text-center p-4">
                  <FaCalendarCheck size={70} className="mb-3" />
                  <Card.Title className="mt-2 fw-bold">Gérer les Rendez-vous</Card.Title>
                  <Card.Text>Validez et organisez les rendez-vous.</Card.Text>
                  <Button variant="dark" className="fw-bold shadow" onClick={() => navigate("/AdminRendezVous")}>
                    Accéder
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardAdmin;
