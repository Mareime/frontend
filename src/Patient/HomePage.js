// import React from 'react';
// import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
// import { 
//     Calendar, 
//     Users, 
//     UserPlus, 
//     Stethoscope, 
//     HeartPulse, 
//     Shield, 
//     Award, 
//     CheckCircle 
// } from 'lucide-react';
// import Header from '../Header';
// import { MdHeight } from 'react-icons/md';

// const HomePage = () => {
//     return (
//         <>
//             <Header />
//             <Container fluid className="px-0">
//                 {/* Hero Section */}
//                 <div 
//                     className="bg-primary text-white text-center py-5" 
//                     style={{
//                         backgroundImage: 'linear-gradient(rgba(0,123,255,0.8), rgba(0,123,255,0.8)), url("/medical-background.jpg")',
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center'
//                     }}
//                 >
//                     <Container>
//                         <h1 className="display-4 mb-4">Clinique Rendez-Vous</h1>
//                         <p className="lead mb-4">
//                             Votre santé, notre engagement. Des soins personnalisés et de haute qualité.
//                         </p>
//                         <div>
//                             <Button variant="light" size="lg" href="/medecins" className="me-3">
//                                 Prendre Rendez-Vous
//                             </Button>
//                             {/* <Button variant="outline-light" size="lg" href="/medecins">
//                                 Nos Médecins
//                             </Button> */}
//                         </div>
//                     </Container>
//                 </div>

//                 {/* Services Section */}
//                 <Container className="py-5">
//                     <h2 className="text-center mb-5">Nos Services</h2>
//                     <Row>
//                         <Col md={4} className="mb-4">
//                             <Card className="h-100 shadow-sm border-0">
//                                 <Card.Body className="text-center">
//                                     <Stethoscope size={48} className="text-primary mb-3" />
//                                     <Card.Title>Consultations Médicales</Card.Title>
//                                     <Card.Text>
//                                         Des consultations complètes avec nos médecins spécialistes, utilisant les dernières technologies médicales.
//                                     </Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={4} className="mb-4">
//                             <Card className="h-100 shadow-sm border-0">
//                                 <Card.Body className="text-center">
//                                     <HeartPulse size={48} className="text-primary mb-3" />
//                                     <Card.Title>Suivi Personnalisé</Card.Title>
//                                     <Card.Text>
//                                         Un accompagnement médical adapté à vos besoins individuels, avec un suivi attentif et personnalisé.
//                                     </Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={4} className="mb-4">
//                             <Card className="h-100 shadow-sm border-0">
//                                 <Card.Body className="text-center">
//                                     <Shield size={48} className="text-primary mb-3" />
//                                     <Card.Title>Prévention</Card.Title>
//                                     <Card.Text>
//                                         Des programmes de prévention et de dépistage pour maintenir votre santé et prévenir les risques.
//                                     </Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Container>

//                 {/* Advantages Section */}
//                 <Container className="bg-light py-5">
//                     <h2 className="text-center mb-5">Pourquoi Nous Choisir</h2>
//                     <Row>
//                         <Col md={3} className="text-center">
//                             <Award size={64} className="text-primary mb-3" />
//                             <h4>Expertise Médicale</h4>
//                             <p>Des professionnels hautement qualifiés et constamment formés.</p>
//                         </Col>
//                         <Col md={3} className="text-center">
//                             <CheckCircle size={64} className="text-primary mb-3" />
//                             <h4>Soins de Qualité</h4>
//                             <p>Un engagement constant pour des soins médicaux de la plus haute qualité.</p>
//                         </Col>
//                         <Col md={3} className="text-center">
//                             <Calendar size={64} className="text-primary mb-3" />
//                             <h4>Flexibilité</h4>
//                             <p>Rendez-vous en ligne faciles et adaptés à votre emploi du temps.</p>
//                         </Col>
//                         <Col md={3} className="text-center">
//                             <Users size={64} className="text-primary mb-3" />
//                             <h4>Approche Humaine</h4>
//                             <p>Une équipe à l'écoute, attentive et bienveillante.</p>
//                         </Col>
//                     </Row>
//                 </Container>

//                 {/* About Section */}
//                 <Container className="py-5">
//                     <Row className="align-items-center">
//                         <Col md={6}>
//                             <h2 className="mb-4">À Propos de la Clinique Rendez-Vous</h2>
//                             <p className="lead">
//                                 Fondée en 2010, la Clinique Rendez-Vous est devenue un acteur de référence dans les soins médicaux personnalisés.
//                             </p>
//                             <p>
//                                 Notre mission est de fournir des soins médicaux de haute qualité, centrés sur le patient, 
//                                 dans un environnement chaleureux et technologiquement avancé. Nous croyons en une approche 
//                                 holistique de la santé, combinant expertise médicale et compassion.
//                             </p>
//                             <Button variant="primary" href="/Propos">
//                                 En Savoir Plus
//                             </Button>
//                         </Col>  
//                         <Col md={6}>
//                             <img 
//                                 src="https://img.freepik.com/premium-photo/blue-medical-caduceus-symbol-cross-white-background-3d-rendering_476612-5759.jpg?ga=GA1.1.2047248883.1705566149&semt=ais_hybrid"
//                                 alt="Clinique Rendez-Vous" 
//                                 className="img-fluid rounded"
//                                 style={{ maxWidth: '60%', height: 'auto' }}
//                             />
//                         </Col>
//                     </Row>
//                 </Container>
//             </Container>
//         </>
//     );
// };

// export default HomePage;
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { 
  Calendar, 
  Users, 
  Stethoscope, 
  HeartPulse, 
  Shield, 
  Award, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Header from '../Header';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      
      {/* Hero Section - Modern with gradient and better typography */}
      <div className="hero-section text-white text-center position-relative overflow-hidden">
        <div className="hero-bg-gradient position-absolute w-100 h-100"></div>
        <Container className="py-5 my-5 position-relative">
          <h1 className="display-3 fw-bold mb-4">Clinique Rendez-Vous</h1>
          <p className="lead mb-5 fs-4 fw-light px-md-5 mx-md-5">
            Votre santé, notre engagement. Des soins personnalisés et de haute qualité.
          </p>
          <Button 
            variant="light" 
            size="lg" 
            href="/medecins" 
            className="btn-appointment rounded-pill fw-bold px-4 py-3 shadow-sm"
          >
            Prendre Rendez-Vous <ArrowRight size={18} className="ms-2" />
          </Button>
        </Container>
        <div className="hero-wave position-absolute bottom-0 w-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </div>

      {/* Services Section - Cards with hover effects */}
      <Container className="services-section py-5">
        <h2 className="text-center mb-2 fw-bold">Nos Services</h2>
        <p className="text-center text-muted mb-5">Des soins médicaux complets pour répondre à vos besoins</p>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="service-card h-100 border-0 shadow-sm transition-all">
              <Card.Body className="text-center p-4">
                <div className="icon-wrapper bg-primary-light rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center">
                  <Stethoscope size={32} className="text-primary" />
                </div>
                <Card.Title as="h4" className="fw-bold mb-3">Consultations Médicales</Card.Title>
                <Card.Text className="text-muted">
                  Des consultations complètes avec nos médecins spécialistes, utilisant les dernières technologies médicales.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="service-card h-100 border-0 shadow-sm transition-all">
              <Card.Body className="text-center p-4">
                <div className="icon-wrapper bg-primary-light rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center">
                  <HeartPulse size={32} className="text-primary" />
                </div>
                <Card.Title as="h4" className="fw-bold mb-3">Suivi Personnalisé</Card.Title>
                <Card.Text className="text-muted">
                  Un accompagnement médical adapté à vos besoins individuels, avec un suivi attentif et personnalisé.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="service-card h-100 border-0 shadow-sm transition-all">
              <Card.Body className="text-center p-4">
                <div className="icon-wrapper bg-primary-light rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center">
                  <Shield size={32} className="text-primary" />
                </div>
                <Card.Title as="h4" className="fw-bold mb-3">Prévention</Card.Title>
                <Card.Text className="text-muted">
                  Des programmes de prévention et de dépistage pour maintenir votre santé et prévenir les risques.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Advantages Section - Modern design with curved background */}
      <div className="advantages-section position-relative my-5">
        <div className="bg-light position-absolute w-100 h-100"></div>
        <Container className="py-5 position-relative">
          <h2 className="text-center mb-2 fw-bold">Pourquoi Nous Choisir</h2>
          <p className="text-center text-muted mb-5">Ce qui nous distingue des autres cliniques</p>
          <Row className="g-4">
            <Col md={3} sm={6} className="mb-4">
              <div className="advantage-card text-center p-4 h-100 bg-white rounded-lg shadow-sm">
                <div className="icon-wrapper text-primary mb-3">
                  <Award size={48} strokeWidth={1.5} />
                </div>
                <h4 className="fw-bold mb-2">Expertise Médicale</h4>
                <p className="text-muted mb-0">Des professionnels hautement qualifiés et constamment formés.</p>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <div className="advantage-card text-center p-4 h-100 bg-white rounded-lg shadow-sm">
                <div className="icon-wrapper text-primary mb-3">
                  <CheckCircle size={48} strokeWidth={1.5} />
                </div>
                <h4 className="fw-bold mb-2">Soins de Qualité</h4>
                <p className="text-muted mb-0">Un engagement constant pour des soins médicaux de la plus haute qualité.</p>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <div className="advantage-card text-center p-4 h-100 bg-white rounded-lg shadow-sm">
                <div className="icon-wrapper text-primary mb-3">
                  <Calendar size={48} strokeWidth={1.5} />
                </div>
                <h4 className="fw-bold mb-2">Flexibilité</h4>
                <p className="text-muted mb-0">Rendez-vous en ligne faciles et adaptés à votre emploi du temps.</p>
              </div>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <div className="advantage-card text-center p-4 h-100 bg-white rounded-lg shadow-sm">
                <div className="icon-wrapper text-primary mb-3">
                  <Users size={48} strokeWidth={1.5} />
                </div>
                <h4 className="fw-bold mb-2">Approche Humaine</h4>
                <p className="text-muted mb-0">Une équipe à l'écoute, attentive et bienveillante.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* About Section - Modern layout with better spacing */}
      <Container className="about-section py-5 my-5">
        <Row className="align-items-center gy-5">
          <Col lg={6} className="pe-lg-5">
            <div className="about-content">
              <h6 className="text-primary fw-bold text-uppercase mb-3">Notre Histoire</h6>
              <h2 className="fw-bold mb-4">À Propos de la Clinique Rendez-Vous</h2>
              <p className="lead mb-4">
                Fondée en 2010, la Clinique Rendez-Vous est devenue un acteur de référence dans les soins médicaux personnalisés.
              </p>
              <p className="text-muted mb-4">
                Notre mission est de fournir des soins médicaux de haute qualité, centrés sur le patient, 
                dans un environnement chaleureux et technologiquement avancé. Nous croyons en une approche 
                holistique de la santé, combinant expertise médicale et compassion.
              </p>
              <Button 
                variant="outline-primary" 
                href="/Propos" 
                className="rounded-pill px-4 py-2"
              >
                En Savoir Plus <ArrowRight size={16} className="ms-2" />
              </Button>
            </div>
          </Col>
          <Col lg={6} className="clinic-image-wrapper position-relative">
            <div className="clinic-image position-relative">
              <div className="image-shape bg-primary position-absolute"></div>
              <div className="image-container shadow rounded overflow-hidden position-relative">
                <div className="placeholder-image d-flex align-items-center justify-content-center bg-light text-primary">
                  <Award size={64} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .homepage {
          overflow-x: hidden;
        }
        
        .hero-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .hero-bg-gradient {
          background: linear-gradient(135deg, #0062cc 0%, #0097ff 100%);
          z-index: -1;
        }
        
        .hero-wave {
          height: 100px;
          z-index: 1;
        }
        
        .btn-appointment {
          transition: transform 0.3s ease;
        }
        
        .btn-appointment:hover {
          transform: translateY(-3px);
        }
        
        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 12px;
        }
        
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .icon-wrapper {
          width: 80px;
          height: 80px;
        }
        
        .bg-primary-light {
          background-color: rgba(0, 123, 255, 0.1);
        }
        
        .advantages-section {
          z-index: 1;
        }
        
        .advantage-card {
          transition: transform 0.3s ease;
          border-radius: 12px;
        }
        
        .advantage-card:hover {
          transform: translateY(-5px);
        }
        
        .image-shape {
          width: 80%;
          height: 80%;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          bottom: -10%;
          right: -10%;
          z-index: 0;
        }
        
        .image-container {
          width: 90%;
          height: 400px;
          z-index: 1;
        }
        
        .placeholder-image {
          width: 100%;
          height: 100%;
        }
        
        .rounded-lg {
          border-radius: 12px;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default HomePage;