import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { 
    Calendar, 
    Users, 
    UserPlus, 
    Stethoscope, 
    HeartPulse, 
    Shield, 
    Award, 
    CheckCircle 
} from 'lucide-react';
import Header from '../Header';
import { MdHeight } from 'react-icons/md';

const HomePage = () => {
    return (
        <>
            <Header />
            <Container fluid className="px-0">
                {/* Hero Section */}
                <div 
                    className="bg-primary text-white text-center py-5" 
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,123,255,0.8), rgba(0,123,255,0.8)), url("/medical-background.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <Container>
                        <h1 className="display-4 mb-4">Clinique Rendez-Vous</h1>
                        <p className="lead mb-4">
                            Votre santé, notre engagement. Des soins personnalisés et de haute qualité.
                        </p>
                        <div>
                            <Button variant="light" size="lg" href="/medecins" className="me-3">
                                Prendre Rendez-Vous
                            </Button>
                            {/* <Button variant="outline-light" size="lg" href="/medecins">
                                Nos Médecins
                            </Button> */}
                        </div>
                    </Container>
                </div>

                {/* Services Section */}
                <Container className="py-5">
                    <h2 className="text-center mb-5">Nos Services</h2>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="text-center">
                                    <Stethoscope size={48} className="text-primary mb-3" />
                                    <Card.Title>Consultations Médicales</Card.Title>
                                    <Card.Text>
                                        Des consultations complètes avec nos médecins spécialistes, utilisant les dernières technologies médicales.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="text-center">
                                    <HeartPulse size={48} className="text-primary mb-3" />
                                    <Card.Title>Suivi Personnalisé</Card.Title>
                                    <Card.Text>
                                        Un accompagnement médical adapté à vos besoins individuels, avec un suivi attentif et personnalisé.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="text-center">
                                    <Shield size={48} className="text-primary mb-3" />
                                    <Card.Title>Prévention</Card.Title>
                                    <Card.Text>
                                        Des programmes de prévention et de dépistage pour maintenir votre santé et prévenir les risques.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                {/* Advantages Section */}
                <Container className="bg-light py-5">
                    <h2 className="text-center mb-5">Pourquoi Nous Choisir</h2>
                    <Row>
                        <Col md={3} className="text-center">
                            <Award size={64} className="text-primary mb-3" />
                            <h4>Expertise Médicale</h4>
                            <p>Des professionnels hautement qualifiés et constamment formés.</p>
                        </Col>
                        <Col md={3} className="text-center">
                            <CheckCircle size={64} className="text-primary mb-3" />
                            <h4>Soins de Qualité</h4>
                            <p>Un engagement constant pour des soins médicaux de la plus haute qualité.</p>
                        </Col>
                        <Col md={3} className="text-center">
                            <Calendar size={64} className="text-primary mb-3" />
                            <h4>Flexibilité</h4>
                            <p>Rendez-vous en ligne faciles et adaptés à votre emploi du temps.</p>
                        </Col>
                        <Col md={3} className="text-center">
                            <Users size={64} className="text-primary mb-3" />
                            <h4>Approche Humaine</h4>
                            <p>Une équipe à l'écoute, attentive et bienveillante.</p>
                        </Col>
                    </Row>
                </Container>

                {/* About Section */}
                <Container className="py-5">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h2 className="mb-4">À Propos de la Clinique Rendez-Vous</h2>
                            <p className="lead">
                                Fondée en 2010, la Clinique Rendez-Vous est devenue un acteur de référence dans les soins médicaux personnalisés.
                            </p>
                            <p>
                                Notre mission est de fournir des soins médicaux de haute qualité, centrés sur le patient, 
                                dans un environnement chaleureux et technologiquement avancé. Nous croyons en une approche 
                                holistique de la santé, combinant expertise médicale et compassion.
                            </p>
                            <Button variant="primary" href="/Propos">
                                En Savoir Plus
                            </Button>
                        </Col>  
                        <Col md={6}>
                            <img 
                                src="https://img.freepik.com/premium-photo/blue-medical-caduceus-symbol-cross-white-background-3d-rendering_476612-5759.jpg?ga=GA1.1.2047248883.1705566149&semt=ais_hybrid"
                                alt="Clinique Rendez-Vous" 
                                className="img-fluid rounded"
                                style={{ maxWidth: '60%', height: 'auto' }}
                            />
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    );
};

export default HomePage;