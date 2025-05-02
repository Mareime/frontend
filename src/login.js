// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://localhost:8082";

// const Login = ({ usr }) => {
//   const [email, setEmail] = useState("");
//   const [motDePasse, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const loginResponse = await axios.post("/api/auth/login", {
//         email,
//         motDePasse,
//       });

//       const { token, role, id } = loginResponse.data;

//       if (!token || !role || !id) {
//         throw new Error("Invalid response - token, role, or id missing");
//       }

//       // Use the authContext login function
//       login(token, role, id);
      
//       // Also update the parent component's state if needed
//       if (usr) {
//         usr(role);
//       }

//       // Navigate based on role
//       switch (role) {
//         case "ROLE_ADMIN":
//           navigate("/Admin");
//           break;
//         case "ROLE_MEDECIN":
//           navigate("/DashboardMedecin");
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
import { useAuth } from "./AuthContext";
import { User, Lock, LogIn, AlertCircle, Activity } from "lucide-react";

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

  // Redesigned card styling
  const styles = {
    pageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '20px'
    },
    card: {
      maxWidth: '450px',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '30px 20px 15px',
      textAlign: 'center',
      borderBottom: '1px solid #f1f1f1'
    },
    cardBody: {
      padding: '25px 30px'
    },
    logo: {
      margin: '0 auto 15px auto', 
      display: 'flex',
      justifyContent: 'center'
    },
    logoIcon: {
      padding: '12px',
      backgroundColor: '#ebf5fe',
      borderRadius: '50%'
    },
    title: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#2c3e50'
    },
    subtitle: {
      fontSize: '14px',
      color: '#7f8c8d',
      marginBottom: '10px'
    },
    errorContainer: {
      backgroundColor: '#ffecec',
      border: '1px solid #f5aca6',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    errorText: {
      color: '#cc0033',
      marginLeft: '10px',
      fontSize: '14px'
    },
    formGroup: {
      marginBottom: '20px',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#34495e'
    },
    inputContainer: {
      position: 'relative'
    },
    iconContainer: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#95a5a6'
    },
    input: {
      width: '100%',
      padding: '12px 12px 12px 42px',
      borderRadius: '8px',
      border: '1px solid #dcdfe6',
      fontSize: '14px',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.15)'
    },
    forgotPassword: {
      fontSize: '13px',
      color: '#3498db',
      textDecoration: 'none',
      float: 'right',
      fontWeight: '500',
      transition: 'color 0.2s'
    },
    button: {
      width: '100%',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background-color 0.2s',
      boxShadow: '0 2px 4px rgba(52, 152, 219, 0.25)'
    },
    buttonHover: {
      backgroundColor: '#2980b9'
    },
    buttonDisabled: {
      backgroundColor: '#81c4e9',
      cursor: 'not-allowed',
      boxShadow: 'none'
    },
    buttonIcon: {
      marginRight: '10px'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '25px 0',
      color: '#b2bec3',
      fontSize: '12px'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#eaeaea'
    },
    dividerText: {
      padding: '0 15px'
    },
    cardFooter: {
      padding: '20px 30px',
      backgroundColor: '#f9fafc',
      borderTop: '1px solid #f1f1f1',
      textAlign: 'center'
    },
    registerText: {
      fontSize: '14px',
      color: '#7f8c8d',
      margin: '0'
    },
    registerLink: {
      color: '#3498db',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '5px',
      transition: 'color 0.2s'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Activity size={32} color="#3498db" />
            </div>
          </div>
          <h2 style={styles.title}>Rendez-Vous Médical</h2>
          <p style={styles.subtitle}>Connectez-vous pour accéder à votre espace</p>
        </div>
        
        <div style={styles.cardBody}>
          {error && (
            <div style={styles.errorContainer}>
              <AlertCircle size={18} color="#cc0033" />
              <span style={styles.errorText}>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">Adresse Email</label>
              <div style={styles.inputContainer}>
                <div style={styles.iconContainer}>
                  <User size={16} color="#95a5a6" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="exemple@domaine.com"
                  style={styles.input}
                  autoComplete="email"
                  onFocus={(e) => e.target.style.borderColor = '#3498db'}
                  onBlur={(e) => e.target.style.borderColor = '#dcdfe6'}
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={styles.label} htmlFor="password">Mot de passe</label>
                <a href="#" style={styles.forgotPassword}
                  onMouseOver={(e) => e.target.style.color = '#2980b9'}
                  onMouseOut={(e) => e.target.style.color = '#3498db'}>
                  Mot de passe oublié?
                </a>
              </div>
              <div style={styles.inputContainer}>
                <div style={styles.iconContainer}>
                  <Lock size={16} color="#95a5a6" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={styles.input}
                  autoComplete="current-password"
                  onFocus={(e) => e.target.style.borderColor = '#3498db'}
                  onBlur={(e) => e.target.style.borderColor = '#dcdfe6'}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              style={styles.button}
              onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#2980b9')}
              onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#3498db')}
            >
              <LogIn size={16} color="white" style={styles.buttonIcon} />
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form> 
        </div>
        
        <div style={styles.cardFooter}>
          <p style={styles.registerText}>
            Nouveau sur la plateforme?
            <a href="/register" 
              style={styles.registerLink}
              onMouseOver={(e) => e.target.style.color = '#2980b9'}
              onMouseOut={(e) => e.target.style.color = '#3498db'}>
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;