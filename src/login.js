import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8082";

const Login = ({ usr }) => {
  const [email, setEmail] = useState("");
  const [motDePasse, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loginResponse = await axios.post("/api/auth/login", {
        email,
        motDePasse,
      });

      const { token, role, id } = loginResponse.data;

      if (!token || !role || !id) {
        throw new Error("Invalid response - token, role, or id missing");
      }

      // Use the authContext login function
      login(token, role, id);
      
      // Also update the parent component's state if needed
      if (usr) {
        usr(role);
      }

      // Navigate based on role
      switch (role) {
        case "ROLE_ADMIN":
          navigate("/Admin");
          break;
        case "ROLE_MEDECIN":
          navigate("/DashboardMedecin");
          break;
        case "ROLE_PATIENT":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else if (err.response?.status === 403) {
        setError("Accès interdit. Veuillez vérifier vos identifiants.");
      } else if (err.response?.status === 500) {
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        setError("Erreur de connexion. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
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
                    value={motDePasse}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
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