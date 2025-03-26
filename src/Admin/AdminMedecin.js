import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert, Spinner } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import axios from 'axios';

function AdminMedecin() {
  const [medecins, setMedecins] = useState([]);
  const [newMedecin, setNewMedecin] = useState({
    nom: "",
    prenom: "",
    specialite: "",
    email: "",
    telephone: "",
    adresseCabinet: "",
    prixConsultation: "",
  });
  const [editingMedecin, setEditingMedecin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedecins();
  }, []);

  const fetchMedecins = () => {
    setLoading(true);
    axios
      .get("http://localhost:8082/api/medecins")
      .then((response) => setMedecins(response.data))
      .catch((error) => console.error("Erreur lors du chargement des médecins :", error))
      .finally(() => setLoading(false));
  };

  const handleSaveMedecin = (e) => {
    e.preventDefault();
    const { nom, prenom, specialite, email, telephone, adresseCabinet, prixConsultation } = newMedecin;

    if ([nom, prenom, specialite, email, telephone, adresseCabinet, prixConsultation].some((field) => {
      return field && typeof field === 'string' && field.trim() === "";
    })) {
      setAlertMessage("Veuillez remplir tous les champs !");
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!validateEmail(email)) {
      setAlertMessage("Email invalide !");
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    setLoading(true);

    const request = editingMedecin
      ? axios.put(`http://localhost:8082/api/medecins/update/${editingMedecin.id}`, newMedecin)
      : axios.post("http://localhost:8082/api/medecins/add", newMedecin);

    console.log("Données envoyées à l'API :", newMedecin);

    request
      .then((response) => {
        console.log("Réponse de l'API :", response.data);
        fetchMedecins();
        setShowModal(false);
        setAlertMessage(editingMedecin ? "Médecin modifié avec succès !" : "Médecin ajouté avec succès !");
        setAlertVariant("success");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement :", error);
        console.error("Détails de l'erreur :", error.response ? error.response.data : error.message);
        setAlertMessage("Erreur lors de l'enregistrement !");
        setAlertVariant("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .finally(() => setLoading(false));

    setNewMedecin({
      nom: "",
      prenom: "",
      specialite: "",
      email: "",
      telephone: "",
      adresseCabinet: "",
      prixConsultation: "",
    });
    setEditingMedecin(null);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleEditMedecin = (medecin) => {
    setNewMedecin(medecin);
    setEditingMedecin(medecin);
    setShowModal(true);
  };

  const handleDeleteMedecin = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?")) {
      setLoading(true);
      axios
        .delete(`http://localhost:8082/api/medecins/${id}`)
        .then(() => fetchMedecins())
        .catch((error) => console.error("Erreur lors de la suppression du médecin :", error))
        .finally(() => setLoading(false));
    }
  };

  return (
    <Container fluid className="bg-light min-vh-100">
      <Row>
        <Sidebar selectedOption="medecins" onSelect={() => {}} />
        <Col md={9} className="offset-md-3 p-4">
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-primary">Gestion des Médecins</h4>
                <Button variant="success" onClick={() => setShowModal(true)} disabled={loading}>
                  <FaPlus className="me-2" /> Ajouter Médecin
                </Button>
              </div>

              {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}

              {loading ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : medecins.length > 0 ? (
                <Table striped bordered hover responsive className="text-center">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Spécialité</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Adresse Cabinet</th>
                      <th>Prix Consultation</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medecins.map((medecin) => (
                      <tr key={medecin.id}>
                        <td>{medecin.id}</td>
                        <td>{medecin.nom}</td>
                        <td>{medecin.prenom}</td>
                        <td>{medecin.specialite}</td>
                        <td>{medecin.email}</td>
                        <td>{medecin.adresseCabinet}</td>
                        <td>{medecin.prixConsultation}</td>
                        <td>{medecin.telephone}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditMedecin(medecin)}
                            disabled={loading}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteMedecin(medecin.id)}
                            disabled={loading}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">Aucun médecin enregistré.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingMedecin ? "Modifier le Médecin" : "Ajouter un Médecin"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveMedecin}>
            {["nom", "prenom", "specialite", "email", "telephone", "adresseCabinet", "prixConsultation"].map(
              (field) => (
                <Form.Group controlId={`medecin${field}`} className="mt-3" key={field}>
                  <Form.Label>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</Form.Label>
                  <Form.Control
                    type={field === "prixConsultation" ? "number" : "text"}
                    placeholder={`Entrez ${field}`}
                    value={newMedecin[field]}
                    onChange={(e) => setNewMedecin({ ...newMedecin, [field]: e.target.value })}
                    required
                  />
                </Form.Group>
              )
            )}
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {editingMedecin ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminMedecin;