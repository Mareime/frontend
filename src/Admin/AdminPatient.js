import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaUserInjured } from "react-icons/fa";
import Sidebar from "./Sidebar";

function AdminPatient() {
  const [selectedOption, setSelectedOption] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
    sexe: "",
  });
  const [editingPatient, setEditingPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  useEffect(() => {
    fetch("http://localhost:8082/api/patients")
      .then((response) => response.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error("Erreur lors de la récupération des patients :", error));
  }, []);

  const handleSavePatient = (e) => {
    e.preventDefault();

    if (!newPatient.nom.trim() || !newPatient.prenom.trim() || !newPatient.email.trim() || !newPatient.telephone?.toString().trim() || !newPatient.dateNaissance.trim() || !newPatient.adresse.trim() || !newPatient.sexe) {
      setAlertMessage("Veuillez remplir tous les champs !");
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const request = editingPatient
      ? fetch(`http://localhost:8082/api/patients/update/${editingPatient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPatient),
        })
      : fetch("http://localhost:8082/api/patients/add", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPatient),
        });

    request
      .then((response) => {
        if (!response.ok) throw new Error(editingPatient ? "Erreur lors de la modification du patient !" : "Erreur lors de l'ajout du patient !");
        return response.json();
      })
      .then((data) => {
        if (editingPatient) {
          setPatients(patients.map((p) => (p.id === editingPatient.id ? data : p)));
          setEditingPatient(null);
          setAlertMessage("Patient modifié avec succès !");
          setAlertVariant("success");
        } else {
          setPatients([...patients, data]);
          setAlertMessage("Patient ajouté avec succès !");
          setAlertVariant("success");
        }
        setShowModal(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((err) => {
        setAlertMessage(err.message);
        setAlertVariant("danger");
        setShowAlert(true);
        console.error("Error during save:", err);
      });

    setNewPatient({
      nom: "",
      prenom: "",
      email: "",
      motDePasse: "",
      telephone: "",
      dateNaissance: "",
      adresse: "",
      sexe: "",
    });
  };

  const handleEditPatient = (patient) => {
    setNewPatient(patient);
    setEditingPatient(patient);
    setShowModal(true);
  };

  const handleDeletePatient = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      fetch(`http://localhost:8082/api/patients/${id}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors de la suppression !");
          setPatients(patients.filter((p) => p.id !== id));
          setAlertMessage("Patient supprimé avec succès !");
          setAlertVariant("success");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        })
        .catch((error) => {
          setAlertMessage(error.message);
          setAlertVariant("danger");
          setShowAlert(true);
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
                <h4 className="text-primary">
                  <FaUserInjured className="me-2" /> Gestion des Patients
                </h4>
                <Button variant="success" onClick={() => setShowModal(true)}>
                  <FaPlus className="me-2" /> Ajouter Patient
                </Button>
              </div>

              {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}

              {patients.length > 0 ? (
                <Table striped bordered hover responsive className="text-center">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Adresse</th>
                      <th>Sexe</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.nom}</td>
                        <td>{patient.prenom}</td>
                        <td>{patient.email}</td>
                        <td>{patient.telephone}</td>
                        <td>{patient.adresse}</td>
                        <td>{patient.sexe}</td>
                        <td>
                          <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditPatient(patient)}>
                            <FaEdit />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeletePatient(patient.id)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">Aucun patient enregistré.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal && !editingPatient} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSavePatient}>
            {["nom", "prenom", "email", "motDePasse", "tel", "dateNaissance", "adresse"].map((field, index) => (
              <Form.Group controlId={`patient${field}`} className="mt-3" key={index}>
                <Form.Label>{field === "motDePasse" ? "Mot de Passe" : field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === "dateNaissance" ? "date" : field === "motDePasse" ? "password" : "text"}
                  placeholder={field === "motDePasse" ? "Mot de Passe" : `Entrez ${field}`}
                  value={newPatient[field]}
                  onChange={(e) => setNewPatient({ ...newPatient, [field]: e.target.value })}
                  required
                />
              </Form.Group>
            ))}

            <Form.Group controlId="patientSexe" className="mt-3">
              <Form.Label>Sexe</Form.Label>
              <div className="d-flex">
                <Form.Check
                  type="radio"
                  label="Homme"
                  name="sexe"
                  value="Homme"
                  checked={newPatient.sexe === "Homme"}
                  onChange={(e) => setNewPatient({ ...newPatient, sexe: e.target.value })}
                  className="me-4"
                />
                <Form.Check
                  type="radio"
                  label="Femme"
                  name="sexe"
                  value="Femme"
                  checked={newPatient.sexe === "Femme"}
                  onChange={(e) => setNewPatient({ ...newPatient, sexe: e.target.value })}
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Ajouter
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {editingPatient && (
        <Modal show={showModal && editingPatient} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Modifier le Patient</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSavePatient}>
              {["nom", "prenom", "email", "telephone", "dateNaissance", "adresse"].map((field, index) => (
                <Form.Group controlId={`patient${field}`} className="mt-3" key={index}>
                  {/* <Form.Label>{field === "motDePasse" ? "Mot de Passe" : field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label> */}
                  <Form.Control
                    type={field === "dateNaissance" ? "date" : field === "motDePasse" ? "password" : "text"}
                    placeholder={field === "motDePasse" ? "Mot de Passe" : `Entrez ${field}`}
                    value={newPatient[field]}
                    onChange={(e) => setNewPatient({ ...newPatient, [field]: e.target.value })}
                    required
                  />
                </Form.Group>
              ))}

              <Form.Group controlId="patientSexe" className="mt-3">
                <Form.Label>Sexe</Form.Label>
                <div className="d-flex">
                  <Form.Check
                    type="radio"
                    label="Homme"
                    name="sexe"
                    value="Homme"
                    checked={newPatient.sexe === "Homme"}
                    onChange={(e) => setNewPatient({ ...newPatient, sexe: e.target.value })}
                    className="me-4"
                  />
                  <Form.Check
                    type="radio"
                    label="Femme"
                    name="sexe"
                    value="Femme"
                    checked={newPatient.sexe === "Femme"}
                    onChange={(e) => setNewPatient({ ...newPatient, sexe: e.target.value })}
                  />
                </div>
              </Form.Group>

              <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary">
                  Modifier
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
}

export default AdminPatient;