// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://localhost:8082"; 

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [motDePasse, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(""); // Clear any previous errors
//     setIsLoading(true);
    
//     try {
//       // Step 1: User login request to backend - match the API field names
//       const loginResponse = await axios.post("/api/auth/login", {
//         email,
//         motDePasse: motDePasse, 
//       });

//       // Step 2: Get the JWT token from response
//       const token = loginResponse.data?.token;
//       const role = loginResponse.data?.role;
      
//       if (!token || !role) {
//         throw new Error("Invalid response - token or role missing");
//       }

//       // Step 3: Store JWT token and user data
//       localStorage.setItem("token", token);
//       localStorage.setItem("userRole", role);
//       console.log(role);
//       localStorage.setItem("isAuthenticated", "true");
      
//       // Set default Authorization header for future requests
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       // Step 4: Redirect based on role
//       switch (role) {
//         case "ROLE_ADMIN":
//           navigate("/Admin");
//           break;
//         case "ROLE_MEDECIN":
//           navigate("/DashbordMedecin");
//           break;
//         case "ROLE_PATIENT":
//           navigate("/");
//           break;
//         default:
//           navigate("/");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
      
//       if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else if (err.response?.status === 401) {
//         setError("Email ou mot de passe incorrect.");
//       } else if (err.response?.status === 403) {
//         setError("Accès interdit. Veuillez vérifier vos identifiants.");
//       } else if (err.response?.status === 500) {
//         setError("Erreur serveur. Veuillez réessayer plus tard.");
//       } else {
//         setError("Erreur de connexion. Veuillez réessayer.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-4">
//           <div className="card">
//             <div className="card-body">
//               <h3 className="text-center">Connexion</h3>
//               {error && <div className="alert alert-danger">{error}</div>}
//               <form onSubmit={handleLogin}>
//                 <div className="mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     autoComplete="username"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Mot de passe</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     value={motDePasse}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     autoComplete="current-password"
//                   />
//                 </div>
//                 <button 
//                   type="submit" 
//                   className="btn btn-primary w-100"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Connexion..." : "Se connecter"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8082";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", id); // ✅ Store the domain-specific ID
      console.log(token);
      console.log(id);
      console.log(role);
      localStorage.setItem("isAuthenticated", "true");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      switch (role) {
        case "ROLE_ADMIN":
          navigate("/Admin");
          break;
        case "ROLE_MEDECIN":
          navigate("/DashbordMedecin");
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
