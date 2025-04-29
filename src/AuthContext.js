import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for authentication data
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("userRole");
      const storedId = localStorage.getItem("userId");
      const storedAuth = localStorage.getItem("isAuthenticated");

      if (token && storedRole && storedAuth === "true") {
        // Set axios default headers for all requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setIsAuthenticated(true);
        setUserRole(storedRole);
        setUserId(storedId);
      } else {
        setIsAuthenticated(false);
        setUserRole("");
        setUserId(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, role, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", id);
    localStorage.setItem("isAuthenticated", "true");
    
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
    
    delete axios.defaults.headers.common["Authorization"];
    
    setIsAuthenticated(false);
    setUserRole("");
    setUserId(null);
  };

  const value = {
    isAuthenticated,
    userRole,
    userId,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};