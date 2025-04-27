import React from "react";
import { Calendar, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8082/api/auth/logout");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/Home" className="d-flex align-items-center">
          <Calendar className="me-2" size={24} />
          Rendez-Vous
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          <Nav.Link
            href="/rendez-vous"
            className="d-flex align-items-center me-3"
          >
            <Calendar className="me-1" size={16} />
            Rendez-vous
          </Nav.Link>
          <Nav.Link href="/medecins" className="d-flex align-items-center me-3">
            <User className="me-1" size={16} />
            Les Docteurs
          </Nav.Link>

          <div className="d-flex">
            {isAuthenticated ? (
              <Button
                variant="danger"
                className="d-flex align-items-center"
                onClick={handleLogout}
              >
                <LogOut className="me-1" size={16} />
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-primary"
                  className="me-2 d-flex align-items-center"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="me-1" size={16} />
                  Login
                </Button>
                <Button
                  variant="primary"
                  className="d-flex align-items-center"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="me-1" size={16} />
                  Register
                </Button>
              </>
            )}
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
