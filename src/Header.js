import React from 'react';
import { Calendar, User, LogIn, UserPlus } from 'lucide-react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar bg="white" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/Home" className="d-flex align-items-center">
                    <Calendar className="me-2" size={24} />
                    Rendez-Vous
                </Navbar.Brand>
                
                <Nav className="ms-auto align-items-center">
                    <Nav.Link href="/rendez-vous" className="d-flex align-items-center me-3">
                        <Calendar className="me-1" size={16} />
                        Rendez-vous
                    </Nav.Link>
                    <Nav.Link href="/medecins" className="d-flex align-items-center me-3">
                        <User className="me-1" size={16} />
                        Les Docteurs
                    </Nav.Link>
                    <div className="d-flex">
                        <Button variant="outline-primary" className="me-2 d-flex align-items-center">
                            <LogIn className="me-1" size={16} />
                            Login
                        </Button>
                        <Button variant="primary" className="d-flex align-items-center">
                            <UserPlus className="me-1" size={16} />
                            Sign Up
                        </Button>
                    </div>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;