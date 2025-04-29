import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Call backend logout endpoint if available
        await axios.post("http://localhost:8082/api/auth/logout");
      } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
      } finally {
        // Use the auth context logout function
        logout();
        // Navigate to login page
        navigate("/login");
      }
    };
  
    logoutUser();
  }, [navigate, logout]);
  
  return (
    <div className="text-center mt-5">
      <h3>Déconnexion en cours...</h3>
    </div>
  );
};

export default Logout;