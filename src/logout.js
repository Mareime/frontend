// src/pages/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Inform the backend (optional)
        await axios.post("http://localhost:8082/api/auth/logout");

        // Clear local storage and redirect
        localStorage.removeItem("userRole");
        localStorage.removeItem("isAuthenticated");

        navigate("/login");
      } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h3>Déconnexion en cours...</h3>
    </div>
  );
};

export default Logout;
