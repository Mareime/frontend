import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";

function AdminRendezVous() {
  const [selectedOption, setSelectedOption] = useState("rendezvous");
  const [rendezVousList, setRendezVousList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [newRendezVous, setNewRendezVous] = useState({
    patient: "",
    medecin: "",
    dateRdv: "",
    statut: "Pending",
    motif: "",
  });
  const [editingRdv, setEditingRdv] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  useEffect(() => {
    fetchRendezVous();
    fetchPatients();
    fetchMedecins();
  }, []);

  const fetchRendezVous = () => {
    axios
      .get("http://localhost:8082/api/rendezvous")
      .then((response) => setRendezVousList(response.data))
      .catch((error) => {
        console.error("Error loading appointments:", error);
        setAlertMessage("Failed to load appointments. Please try again later.");
        setAlertVariant("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  const fetchPatients = () => {
    axios
      .get("http://localhost:8082/api/patients")
      .then((response) => setPatients(response.data))
      .catch((error) => {
        console.error("Error loading patients:", error);
        setAlertMessage("Failed to load patients. Please try again later.");
        setAlertVariant("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  const fetchMedecins = () => {
    axios
      .get("http://localhost:8082/api/medecins")
      .then((response) => setMedecins(response.data))
      .catch((error) => {
        console.error("Error loading doctors:", error);
        setAlertMessage("Failed to load doctors. Please try again later.");
        setAlertVariant("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  const validateForm = () => {
    const currentDate = new Date().toISOString().slice(0, 16);
    if (newRendezVous.dateRdv < currentDate) {
      setAlertMessage("Date cannot be in the past!");
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return false;
    }
    return true;
  };

  const handleSaveRendezVous = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedRendezVous = {
      ...newRendezVous,
      patient: { id: newRendezVous.patient },
      medecin: { id: newRendezVous.medecin },
      dateRdv: newRendezVous.dateRdv,
    };

    console.log("Saving appointment:", formattedRendezVous);

    const request = editingRdv
      ? axios.put(`http://localhost:8082/api/rendezvous/update/${editingRdv.id}`, formattedRendezVous)
      : axios.post("http://localhost:8082/api/rendezvous/add", formattedRendezVous);

    request
      .then((response) => {
        console.log("Response from API:", response.data);
        fetchRendezVous();
        setShowModal(false);
        setAlertMessage(editingRdv ? "Appointment updated successfully!" : "Appointment added successfully!");
        setAlertVariant("success");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((error) => {
        console.error("Error saving appointment:", error);
        setAlertMessage("Error saving appointment! Please try again later.");
        setAlertVariant("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });

    setNewRendezVous({
      patient: "",
      medecin: "",
      dateRdv: "",
      statut: "En attente",
      motif: "",
    });
    setEditingRdv(null);
  };

  const handleEditRendezVous = (rdv) => {
    setNewRendezVous({
      patient: rdv.patient.id,
      medecin: rdv.medecin.id,
      dateRdv: rdv.dateRdv,
      statut: rdv.statut,
      motif: rdv.motif,
    });
    setEditingRdv(rdv);
    setShowModal(true);
  };

  const handleDeleteRendezVous = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      axios
        .delete(`http://localhost:8082/api/rendezvous/${id}`)
        .then(() => fetchRendezVous())
        .catch((error) => {
          console.error("Error deleting appointment:", error);
          setAlertMessage("Error deleting appointment! Please try again later.");
          setAlertVariant("danger");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
    }
  };

  return (
    <Container fluid className="bg-light min-vh-100">
      <Row>
        <Sidebar selectedOption={selectedOption} onSelect={setSelectedOption} />

        <Col md={9} className="offset-md-3 p-4">
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-primary">Gestion des Rendez-vous</h4>
                <Button variant="success" onClick={() => setShowModal(true)}>
                  <FaPlus className="me-2" /> Ajouter Rendez-vous
                </Button>
              </div>

              {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}

              <div className="table-responsive">
                {rendezVousList.length > 0 ? (
                  <Table striped bordered hover responsive className="text-center">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Médecin</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Motif</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rendezVousList.map((rdv) => (
                        <tr key={rdv.id}>
                          <td>{rdv.id}</td>
                          <td>{rdv.patient.nom} {rdv.patient.prenom}</td>
                          <td>{rdv.medecin.nom} {rdv.medecin.prenom}</td>
                          <td>{rdv.dateRdv}</td>
                          <td>{rdv.statut}</td>
                          <td>{rdv.motif}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditRendezVous(rdv)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteRendezVous(rdv.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted text-center">Aucun rendez-vous enregistré.</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingRdv ? "Modifier le Rendez-vous" : "Ajouter un Rendez-vous"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <Form onSubmit={handleSaveRendezVous}>
    <Form.Group controlId="patient" className="mt-3">
      <Form.Label>Patient</Form.Label>
      <Form.Control
        as="select"
        value={newRendezVous.patient}
        onChange={(e) => setNewRendezVous({ ...newRendezVous, patient: e.target.value })}
        required
      >
        <option value="">Sélectionner un patient</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.nom} {patient.prenom}
          </option>
        ))}
      </Form.Control>
    </Form.Group>

    <Form.Group controlId="medecin" className="mt-3">
      <Form.Label>Médecin</Form.Label>
      <Form.Control
        as="select"
        value={newRendezVous.medecin}
        onChange={(e) => setNewRendezVous({ ...newRendezVous, medecin: e.target.value })}
        required
      >
        <option value="">Sélectionner un médecin</option>
        {medecins.map((medecin) => (
          <option key={medecin.id} value={medecin.id}>
            {medecin.nom} {medecin.prenom}
          </option>
        ))}
      </Form.Control>
    </Form.Group>

    <Form.Group controlId="dateRdv" className="mt-3">
      <Form.Label>Date du Rendez-vous</Form.Label>
      <Form.Control
        type="datetime-local"
        value={newRendezVous.dateRdv}
        onChange={(e) => setNewRendezVous({ ...newRendezVous, dateRdv: e.target.value })}
        required
      />
    </Form.Group>

    {/* Ajout du champ statut */}
    <Form.Group controlId="statut" className="mt-3">
      <Form.Label>Statut</Form.Label>
      <Form.Control
        as="select"
        value={newRendezVous.statut}
        onChange={(e) => setNewRendezVous({ ...newRendezVous, statut: e.target.value })}
        required
      >
        <option value="Pending">En attente</option>
        <option value="Confirmed">Confirmee</option>
        <option value="Completed">Realisee</option>
      </Form.Control>
    </Form.Group>

    <Form.Group controlId="motif" className="mt-3">
      <Form.Label>Motif</Form.Label>
      <Form.Control
        type="text"
        placeholder="Entrez le motif du rendez-vous"
        value={newRendezVous.motif}
        onChange={(e) => setNewRendezVous({ ...newRendezVous, motif: e.target.value })}
        required
      />
    </Form.Group>

    <div className="d-flex justify-content-end mt-4">
      <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
        Annuler
      </Button>
      <Button type="submit" variant="primary">
        {editingRdv ? "Modifier" : "Ajouter"}
      </Button>
    </div>
  </Form>
</Modal.Body>

      </Modal>
    </Container>
  );
}

export default AdminRendezVous;
