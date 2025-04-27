// import React, { useState, useEffect } from "react";
// import { Container, Modal, Form, Spinner, Button, Table } from "react-bootstrap";
// import { Trash2, Edit } from "lucide-react";
// import axios from "axios";
// import Header from "../Header";

// const AppointmentsPage = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get("http://localhost:8082/api/rendezvous");
//         setAppointments(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Échec de la récupération des rendez-vous");
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
//       try {
//         await axios.delete(`http://localhost:8082/api/rendezvous/${id}`);
//         setAppointments(appointments.filter(appointment => appointment.id !== id));
//         alert("Rendez-vous supprimé avec succès");
//       } catch (err) {
//         alert("Échec de la suppression du rendez-vous");
//       }
//     }
//   };

//   const handleShowModal = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedAppointment(null);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:8082/api/rendezvous/update/${selectedAppointment.id}`, selectedAppointment);
//       setAppointments(appointments.map(app => app.id === selectedAppointment.id ? selectedAppointment : app));
//       alert("Rendez-vous modifié avec succès");
//       handleCloseModal();
//     } catch (err) {
//       alert("Échec de la modification du rendez-vous");
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Chargement...</span>
//         </Spinner>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="text-center mt-5">
//         <p className="text-danger">{error}</p>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <Container className="mt-5">
//         <h1 className="text-center mb-4">Mes Rendez-Vous</h1>
//         <Table striped bordered hover className="shadow-sm" style={{ borderRadius: "15px" }}>
//           <thead className="bg-primary text-white">
//             <tr>
//               <th>ID</th>
//               <th>Médecin</th>
//               <th>Date</th>
//               <th>Motif</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {appointments.map((appointment) => (
//               <tr key={appointment.id} style={{ backgroundColor: "#f8f9fa" }}>
//                 <td>{appointment.id}</td>
//                 <td>{appointment.medecin.nom} {appointment.medecin.prenom}</td>
//                 <td>{new Date(appointment.dateRdv).toLocaleString()}</td>
//                 <td>{appointment.motif}</td>
//                 <td>
//                   <Button variant="info" className="me-2" onClick={() => handleShowModal(appointment)}><Edit size={16} /></Button>
//                   <Button variant="danger" onClick={() => handleDelete(appointment.id)}><Trash2 size={16} /></Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Container>

//       <Modal show={showModal} onHide={handleCloseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Modifier le Rendez-vous</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleUpdate}>
//             <Form.Group controlId="motif">
//               <Form.Label>Motif</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={selectedAppointment?.motif || ''}
//                 onChange={(e) => setSelectedAppointment({ ...selectedAppointment, motif: e.target.value })}
//               />
//             </Form.Group>
//             <div className="d-flex justify-content-end mt-4">
//               <Button variant="secondary" className="me-2" onClick={handleCloseModal}>Annuler</Button>
//               <Button type="submit">Enregistrer</Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default AppointmentsPage;
import React, { useState, useEffect } from "react";
import { Container, Modal, Form, Spinner, Button, Table } from "react-bootstrap";
import { Trash2, Edit } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
        setAppointments(patientAppointments);
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
        alert("Rendez-vous supprimé avec succès");
      } catch (err) {
        alert("Échec de la suppression du rendez-vous");
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
      alert("Rendez-vous modifié avec succès");
      handleCloseModal();
    } catch (err) {
      alert("Échec de la modification du rendez-vous");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt-5">
        <h1 className="text-center mb-4">Mes Rendez-Vous</h1>
        {appointments.length === 0 ? (
          <p className="text-center text-muted">Aucun rendez-vous trouvé.</p>
        ) : (
          <Table striped bordered hover className="shadow-sm" style={{ borderRadius: "15px" }}>
            <thead className="bg-primary text-white">
              <tr>
                <th>ID</th>
                <th>Médecin</th>
                <th>Date</th>
                <th>Motif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} style={{ backgroundColor: "#f8f9fa" }}>
                  <td>{appointment.id}</td>
                  <td>
                    {appointment.medecin.nom} {appointment.medecin.prenom}
                  </td>
                  <td>{new Date(appointment.dateRdv).toLocaleString()}</td>
                  <td>{appointment.motif}</td>
                  <td>
                    <Button
                      variant="info"
                      className="me-2"
                      onClick={() => handleShowModal(appointment)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(appointment.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="motif">
              <Form.Label>Motif</Form.Label>
              <Form.Control
                type="text"
                value={selectedAppointment?.motif || ""}
                onChange={(e) =>
                  setSelectedAppointment({ ...selectedAppointment, motif: e.target.value })
                }
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppointmentsPage;
