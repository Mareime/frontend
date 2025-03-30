import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [rendezvous, setRendezvous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check if we have a session
        const API_BASE_URL = 'http://localhost:8081'; // Your Spring Boot backend

// In your fetchProfileData function:
const response = await axios.get(`${API_BASE_URL}/api/auth/check-session`, { 
  withCredentials: true 
});

        if (response.data.authenticated) {
          // Fetch profile based on user type
          const profileUrl = response.data.role === 'MEDECIN' 
            ? `${API_BASE_URL}/api/medecin/profile`
            : `${API_BASE_URL}/api/patient/profile`
          
          const [profileRes, rdvRes] = await Promise.all([
            axios.get(profileUrl, { withCredentials: true }),
            axios.get('http://localhost:8081/api/rendezvous', { withCredentials: true })
          ]);

          setUser({
            ...profileRes.data,
            role: response.data.role
          });
          setRendezvous(rdvRes.data);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Profile error:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Erreur de chargement du profil');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">Utilisateur non trouvé</div>;

  const isPatient = user.role === 'PATIENT';
  const isMedecin = user.role === 'MEDECIN';

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mon Profil</h1>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <h2>Informations Personnelles</h2>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nom:</span>
              <span className="info-value">{user.nom} {user.prenom}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Téléphone:</span>
              <span className="info-value">{user.telephone || 'Non renseigné'}</span>
            </div>
            
            {isPatient && user.dateNaissance && (
              <div className="info-item">
                <span className="info-label">Date de naissance:</span>
                <span className="info-value">
                  {new Date(user.dateNaissance).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
            
            {isMedecin && user.specialite && (
              <div className="info-item">
                <span className="info-label">Spécialité:</span>
                <span className="info-value">{user.specialite}</span>
              </div>
            )}
            
            <div className="info-item">
              <span className="info-label">Adresse:</span>
              <span className="info-value">{user.adresse || 'Non renseignée'}</span>
            </div>

            {isMedecin && user.prixConsultation && (
              <div className="info-item">
                <span className="info-label">Prix Consultation:</span>
                <span className="info-value">{user.prixConsultation} €</span>
              </div>
            )}
          </div>
        </div>

        <div className="rendezvous-section">
          <h2>Mes Rendez-vous</h2>
          
          {rendezvous.length === 0 ? (
            <p className="no-appointments">Aucun rendez-vous prévu</p>
          ) : (
            <div className="rendezvous-list">
              {rendezvous.map(rdv => (
                <div key={rdv.id} className="rendezvous-card">
                  <div className="rendezvous-header">
                    <span className="rendezvous-date">
                      {new Date(rdv.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className={`rendezvous-status ${rdv.status.toLowerCase()}`}>
                      {rdv.status === 'CONFIRME' ? 'Confirmé' : 'En attente'}
                    </span>
                  </div>
                  
                  <div className="rendezvous-details">
                    <div className="detail-item">
                      <span>Heure:</span>
                      <span>{rdv.heure}</span>
                    </div>
                    
                    {isPatient && rdv.medecinNom && (
                      <div className="detail-item">
                        <span>Médecin:</span>
                        <span>Dr. {rdv.medecinNom}</span>
                      </div>
                    )}
                    
                    {isMedecin && rdv.patientNom && (
                      <div className="detail-item">
                        <span>Patient:</span>
                        <span>{rdv.patientNom}</span>
                      </div>
                    )}
                    
                    {rdv.specialite && (
                      <div className="detail-item">
                        <span>Spécialité:</span>
                        <span>{rdv.specialite}</span>
                      </div>
                    )}

                    <div className="detail-item">
                      <span>Motif:</span>
                      <span>{rdv.motif || 'Non spécifié'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;