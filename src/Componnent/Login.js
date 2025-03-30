import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8081';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      // Étape 1: Connexion
      const loginResponse = await axios.post("/api/auth/login", { 
        email, 
        motDePasse: password 
      });
  
      // Si le login réussit mais que la vérification de session échoue
      if (!loginResponse.data?.role) {
        throw new Error("Réponse inattendue du serveur");
      }
  
      // Étape 2: Vérification de session (optionnelle)
      try {
        const sessionResponse = await axios.get("/api/auth/check-session");
        if (!sessionResponse.data?.authenticated) {
          throw new Error("Échec de la création de session");
        }
      } catch (sessionError) {
        console.warn("Avertissement session:", sessionError);
      }
  
      // Stockage des informations et redirection
      localStorage.setItem("userRole", loginResponse.data.role);
      localStorage.setItem("isAuthenticated", "true");
      
      switch(loginResponse.data.role) {
        case "ADMIN": navigate("/DashboardAdmin"); break;
        case "MEDECIN": navigate("/ProfilePage"); break;
        case "PATIENT": navigate("/PatientDashboard"); break;
        default: navigate("/");
      }
  
    } catch (err) {
      // Gestion améliorée des erreurs
      const backendError = err.response?.data;
      console.error("Erreur complète:", backendError || err);
  
      if (backendError?.message) {
        setError(backendError.message);
      } else if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else if (err.response?.status === 500) {
        setError("Erreur serveur - veuillez réessayer plus tard");
      } else {
        setError("Erreur de connexion au serveur");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center">Connexion</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Se connecter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;