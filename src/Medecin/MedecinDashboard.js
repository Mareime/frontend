import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from "react-bootstrap";
import { FaEdit, FaCheck, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify"; // pour afficher des notifications modernes

function MedecinDashboard() {
  const [rendezvousList, setRendezvousList] = useState([]);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statut, setStatut] = useState(""); // Statut du rendez-vous

  // Charger les rendez-vous pour un médecin spécifique (exemple avec l'id du médecin)
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/rendezvous/medecin/1") // Remplacer 1 par l'id du médecin connecté
      .then((response) => setRendezvousList(response.data))
      .catch((error) => console.error("Erreur lors du chargement des rendez-vous:", error));
  }, []);

  // Ouvrir la modal pour changer le statut d'un rendez-vous
  const handleEditRdv = (rdv) => {
    setSelectedRdv(rdv);
    setStatut(rdv.statut); // Initialiser le statut avec celui existant
    setShowModal(true);
  };

  // Sauvegarder le changement de statut du rendez-vous
  const handleSaveStatut = () => {
    axios
      .put(`http://localhost:8080/api/rendezvous/${selectedRdv.id}`, { ...selectedRdv, statut })
      .then(() => {
        setRendezvousList(
          rendezvousList.map((rdv) => (rdv.id === selectedRdv.id ? { ...rdv, statut } : rdv))
        );
        setShowModal(false);
        toast.success("Statut du rendez-vous mis à jour avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du statut:", error);
        toast.error("Échec de la mise à jour du statut !");
      });
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card className="shadow-lg rounded">
            <Card.Body>
              <Card.Title>
                <FaCalendarAlt /> Rendez-vous des médecins
              </Card.Title>
              <Table striped bordered hover responsive variant="dark">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rendezvousList.map((rdv) => (
                    <tr key={rdv.id}>
                      <td>{rdv.patient.nom} {rdv.patient.prenom}</td>
                      <td>{rdv.dateRdv}</td>
                      <td>{rdv.motif}</td>
                      <td>
                        <Badge
                          variant={rdv.statut === "Confirmé" ? "success" : rdv.statut === "Annulé" ? "danger" : "warning"}
                        >
                          {rdv.statut}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="info" onClick={() => handleEditRdv(rdv)}>
                          <FaEdit /> Modifier
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal pour modifier le statut du rendez-vous */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le statut du rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="statut">
              <Form.Label>Statut du rendez-vous</Form.Label>
              <Form.Control
                as="select"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="custom-select"
              >
                <option value="En attente">En attente</option>
                <option value="Confirmé">Confirmé</option>
                <option value="Annulé">Annulé</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleSaveStatut}>
            <FaCheck /> Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notifications Toast */}
      <Alert variant="info" className="text-center">
        <strong>Note : </strong> Vous pouvez changer le statut des rendez-vous des patients.
      </Alert>
    </Container>
  );
}

export default MedecinDashboard;
