// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function SignUp() {
//   const [formData, setFormData] = useState({
//     nom: "",
//     prenom: "",
//     email: "",
//     motDePasse: "",
//     telephone: "", // Changed from integer to string to match backend expectation
//     adresse: "",
//     sexe: "Femme",
//     dateNaissance: "",
//     specialite: "",
//     prixConsultation: "",
//     adresseCabinet: "",
//     role: "PATIENT",
//   });

//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const validateForm = () => {
//     if (formData.motDePasse.length < 6) {
//       setError("Le mot de passe doit contenir au moins 6 caractères.");
//       return false;
//     }
//     if (formData.role === "PATIENT" && !formData.dateNaissance) {
//       setError("Veuillez entrer votre date de naissance.");
//       return false;
//     }
//     if (formData.role === "MEDECIN" && !formData.specialite) {
//       setError("Veuillez sélectionner une spécialité.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     if (!validateForm()) return;

//     setIsLoading(true);

//     // Prepare data for backend - ensure field names match the RegisterRequest class
//     const requestData = {
//       nom: formData.nom,
//       prenom: formData.prenom,
//       email: formData.email,
//       motDePasse: formData.motDePasse,
//       telephone: formData.telephone, // Use telephone instead of tel to match backend
//       adresse: formData.adresse,
//       sexe: formData.sexe,
//       role: formData.role,
//       dateNaissance: formData.dateNaissance || null,
//       specialite: formData.role === "MEDECIN" ? formData.specialite : null,
//       prixConsultation:
//         formData.role === "MEDECIN"
//           ? parseFloat(formData.prixConsultation) || 0
//           : null,
//       adresseCabinet:
//         formData.role === "MEDECIN" ? formData.adresseCabinet : null,
//     };

//     try {
//       const response = await axios.post("/api/auth/register", requestData);

//       // Redirect to login page on successful registration
//       navigate("/Login", {
//         state: {
//           registrationSuccess: true,
//           message: "Inscription réussie. Veuillez vous connecter.",
//         },
//       });
//     } catch (error) {
//       console.error("Registration error:", error);

//       if (error.response?.data?.message) {
//         setError(error.response.data.message);
//       } else if (error.response?.status === 400) {
//         setError("Données invalides. Veuillez vérifier vos informations.");
//       } else if (error.response?.status === 409) {
//         setError("Cet email est déjà utilisé.");
//       } else if (error.response?.status === 500) {
//         setError("Erreur serveur. Veuillez réessayer plus tard.");
//       } else {
//         setError("Échec de l'inscription. Veuillez réessayer.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card p-4 shadow">
//             <h2 className="text-center">Inscription</h2>

//             {error && <div className="alert alert-danger">{error}</div>}

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Nom</label>
//                 <input
//                   type="text"
//                   name="nom"
//                   className="form-control"
//                   value={formData.nom}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Prénom</label>
//                 <input
//                   type="text"
//                   name="prenom"
//                   className="form-control"
//                   value={formData.prenom}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className="form-control"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Mot de passe</label>
//                 <input
//                   type="password"
//                   name="motDePasse"
//                   className="form-control"
//                   value={formData.motDePasse}
//                   onChange={handleChange}
//                   required
//                   minLength="6"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Téléphone</label>
//                 <input
//                   type="tel"
//                   name="telephone"
//                   className="form-control"
//                   value={formData.telephone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Adresse</label>
//                 <input
//                   type="text"
//                   name="adresse"
//                   className="form-control"
//                   value={formData.adresse}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Sexe</label>
//                 <select
//                   name="sexe"
//                   className="form-select"
//                   value={formData.sexe}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="Homme">Homme</option>
//                   <option value="Femme">Femme</option>
//                 </select>
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Rôle</label>
//                 <select
//                   name="role"
//                   className="form-select"
//                   value={formData.role}
//                   onChange={handleChange}
//                 >
//                   <option value="PATIENT">Patient</option>
//                   <option value="MEDECIN">Médecin</option>
//                   {/* <option value="ADMIN">Administrateur</option> */}
//                 </select>
//               </div>

//               {formData.role === "PATIENT" && (
//                 <div className="mb-3">
//                   <label className="form-label">Date de naissance</label>
//                   <input
//                     type="date"
//                     name="dateNaissance"
//                     className="form-control"
//                     value={formData.dateNaissance}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               )}

//               {formData.role === "MEDECIN" && (
//                 <>
//                   <div className="mb-3">
//                     <label className="form-label">Spécialité</label>
//                     <select
//                       name="specialite"
//                       className="form-select"
//                       value={formData.specialite}
//                       onChange={handleChange}
//                       required
//                     >
//                       <option value="">Sélectionnez une spécialité</option>
//                       <option value="Cardiologie">Cardiologie</option>
//                       <option value="Dermatologie">Dermatologie</option>
//                       <option value="Pédiatrie">Pédiatrie</option>
//                       <option value="Neurologie">Neurologie</option>
//                       <option value="Chirurgie">Chirurgie</option>
//                     </select>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Prix Consultation</label>
//                     <input
//                       type="number"
//                       name="prixConsultation"
//                       className="form-control"
//                       value={formData.prixConsultation}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Adresse du Cabinet</label>
//                     <input
//                       type="text"
//                       name="adresseCabinet"
//                       className="form-control"
//                       value={formData.adresseCabinet}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </>
//               )}

//               <button
//                 type="submit"
//                 className="btn btn-primary w-100"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Inscription..." : "S'inscrire"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Activity,
  AlertCircle,
  UserPlus,
  Mail,
} from "lucide-react";

function SignUp() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    telephone: "",
    adresse: "",
    sexe: "Femme",
    dateNaissance: "",
    specialite: "",
    prixConsultation: "",
    adresseCabinet: "",
    role: "PATIENT",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.motDePasse.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    if (formData.role === "PATIENT" && !formData.dateNaissance) {
      setError("Veuillez entrer votre date de naissance.");
      return false;
    }
    if (formData.role === "MEDECIN" && !formData.specialite) {
      setError("Veuillez sélectionner une spécialité.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setIsLoading(true);

    // Prepare data for backend - ensure field names match the RegisterRequest class
    const requestData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      motDePasse: formData.motDePasse,
      telephone: formData.telephone,
      adresse: formData.adresse,
      sexe: formData.sexe,
      role: formData.role,
      dateNaissance: formData.dateNaissance || null,
      specialite: formData.role === "MEDECIN" ? formData.specialite : null,
      prixConsultation:
        formData.role === "MEDECIN"
          ? parseFloat(formData.prixConsultation) || 0
          : null,
      adresseCabinet:
        formData.role === "MEDECIN" ? formData.adresseCabinet : null,
    };

    try {
      const response = await axios.post("/api/auth/register", requestData);

      // Redirect to login page on successful registration
      navigate("/Login", {
        state: {
          registrationSuccess: true,
          message: "Inscription réussie. Veuillez vous connecter.",
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError("Données invalides. Veuillez vérifier vos informations.");
      } else if (error.response?.status === 409) {
        setError("Cet email est déjà utilisé.");
      } else if (error.response?.status === 500) {
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        setError("Échec de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redesigned card styling to match the login form
  const styles = {
    pageContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f7fa",
      padding: "20px",
    },
    card: {
      maxWidth: "650px",
      width: "100%",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      margin: "30px auto",
    },
    cardHeader: {
      padding: "30px 20px 15px",
      textAlign: "center",
      borderBottom: "1px solid #f1f1f1",
    },
    cardBody: {
      padding: "25px 30px",
    },
    cardFooter: {
      padding: "20px 30px",
      backgroundColor: "#f9fafc",
      borderTop: "1px solid #f1f1f1",
      textAlign: "center",
    },
    logo: {
      margin: "0 auto 15px auto",
      display: "flex",
      justifyContent: "center",
    },
    logoIcon: {
      padding: "12px",
      backgroundColor: "#ebf5fe",
      borderRadius: "50%",
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#2c3e50",
    },
    subtitle: {
      fontSize: "14px",
      color: "#7f8c8d",
      marginBottom: "10px",
    },
    formRow: {
      display: "flex",
      flexWrap: "wrap",
      margin: "0 -10px",
    },
    formColumn: {
      flex: "1 0 50%",
      padding: "0 10px",
      boxSizing: "border-box",
    },
    formColumnFull: {
      flex: "1 0 100%",
      padding: "0 10px",
      boxSizing: "border-box",
    },
    formGroup: {
      marginBottom: "20px",
      textAlign: "left",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      fontSize: "14px",
      color: "#34495e",
    },
    inputContainer: {
      position: "relative",
    },
    iconContainer: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#95a5a6",
    },
    input: {
      width: "100%",
      padding: "12px 12px 12px 42px",
      borderRadius: "8px",
      border: "1px solid #dcdfe6",
      fontSize: "14px",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
      outline: "none",
    },
    select: {
      width: "100%",
      padding: "12px 12px 12px 42px",
      borderRadius: "8px",
      border: "1px solid #dcdfe6",
      fontSize: "14px",
      backgroundColor: "white",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
      outline: "none",
      appearance: "none",
      backgroundImage:
        'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px top 50%",
      backgroundSize: "10px auto",
    },
    inputFocus: {
      borderColor: "#3498db",
      boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.15)",
    },
    errorContainer: {
      backgroundColor: "#ffecec",
      border: "1px solid #f5aca6",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
    },
    errorText: {
      color: "#cc0033",
      marginLeft: "10px",
      fontSize: "14px",
    },
    button: {
      width: "100%",
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "14px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "background-color 0.2s",
      boxShadow: "0 2px 4px rgba(52, 152, 219, 0.25)",
    },
    buttonHover: {
      backgroundColor: "#2980b9",
    },
    buttonDisabled: {
      backgroundColor: "#81c4e9",
      cursor: "not-allowed",
      boxShadow: "none",
    },
    buttonIcon: {
      marginRight: "10px",
    },
    loginLink: {
      color: "#3498db",
      textDecoration: "none",
      fontWeight: "600",
      marginLeft: "5px",
      transition: "color 0.2s",
    },
    specialtySection: {
      backgroundColor: "#f8fafc",
      padding: "15px",
      borderRadius: "8px",
      marginTop: "10px",
      marginBottom: "10px",
      border: "1px solid #edf2f7",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#2c3e50",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
    },
    sectionIcon: {
      marginRight: "8px",
    },
    roleToggle: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    roleButton: {
      flex: "1",
      padding: "12px",
      backgroundColor: "#f1f5f9",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    roleButtonActive: {
      backgroundColor: "#ebf5fe",
      borderColor: "#3498db",
      color: "#3498db",
    },
    roleIcon: {
      marginRight: "8px",
    },
    "@media (max-width: 768px)": {
      formColumn: {
        flex: "1 0 100%",
      },
    },
  };

  // Apply media queries manually since we're using inline styles
  const isSmallScreen = window.innerWidth <= 768;
  const columnStyle = isSmallScreen ? { flex: "1 0 100%" } : styles.formColumn;

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
          <p style={styles.subtitle}>
            Créez votre compte pour accéder à nos services
          </p>
        </div>

        <div style={styles.cardBody}>
          {error && (
            <div style={styles.errorContainer}>
              <AlertCircle size={18} color="#cc0033" />
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <div style={styles.roleToggle}>
            <button
              type="button"
              style={{
                ...styles.roleButton,
                ...(formData.role === "PATIENT" ? styles.roleButtonActive : {}),
              }}
              onClick={() =>
                setFormData((prev) => ({ ...prev, role: "PATIENT" }))
              }
            >
              <User size={16} style={styles.roleIcon} />
              Patient
            </button>
            <button
              type="button"
              style={{
                ...styles.roleButton,
                ...(formData.role === "MEDECIN" ? styles.roleButtonActive : {}),
              }}
              onClick={() =>
                setFormData((prev) => ({ ...prev, role: "MEDECIN" }))
              }
            >
              <Briefcase size={16} style={styles.roleIcon} />
              Médecin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={columnStyle}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="nom">
                    Nom
                  </label>
                  <div style={styles.inputContainer}>
                    <div style={styles.iconContainer}>
                      <User size={16} color="#95a5a6" />
                    </div>
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom"
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = "#3498db")}
                      onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
                    />
                  </div>
                </div>
              </div>

              <div style={columnStyle}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="prenom">
                    Prénom
                  </label>
                  <div style={styles.inputContainer}>
                    <div style={styles.iconContainer}>
                      <User size={16} color="#95a5a6" />
                    </div>
                    <input
                      id="prenom"
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      placeholder="Votre prénom"
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = "#3498db")}
                      onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formColumnFull}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="email">
                    Email
                  </label>
                  <div style={styles.inputContainer}>
                    <div style={styles.iconContainer}>
                      <Mail size={16} color="#95a5a6" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="exemple@domaine.com"
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = "#3498db")}
                      onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formColumnFull}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="motDePasse">
                    Mot de passe
                  </label>
                  <div style={styles.inputContainer}>
                    <div style={styles.iconContainer}>
                      <Lock size={16} color="#95a5a6" />
                    </div>
                    <input
                      id="motDePasse"
                      type="password"
                      name="motDePasse"
                      value={formData.motDePasse}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder="Minimum 6 caractères"
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = "#3498db")}
                      onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={columnStyle}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="telephone">
                    Téléphone
                  </label>
                  <div style={styles.inputContainer}>
                    <div style={styles.iconContainer}>
                      <Phone size={16} color="#95a5a6" />
                    </div>
                    <input
                      id="telephone"
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      placeholder="Votre numéro"
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = "#3498db")}
                      onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
                    />
                  </div>
                </div>
              </div>

              <div style={columnStyle}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="sexe">
                    Sexe
                  </label>
                  <div style={styles.inputContainer}>
                    <div style={styles.iconContainer}>
                      <User size={16} color="#95a5a6" />
                    </div>
                    <select
                      id="sexe"
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleChange}
                      required
                      style={styles.select}
                      onFocus={(e) => (e.target.style.borderColor = "#3498db")}
                      onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
                    >
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formColumnFull}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="adresse">
                    Adresse
                  </label>
                  <div style={styles.inputContainer}>
                    <div style={styles.iconContainer}>
                      <MapPin size={16} color="#95a5a6" />
                    </div>
                    <input
                      id="adresse"
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      required
                      placeholder="Votre adresse complète"
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = "#3498db")}
                      onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {formData.role === "PATIENT" && (
              <div style={styles.formRow}>
                <div style={styles.formColumnFull}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="dateNaissance">
                      Date de naissance
                    </label>
                    <div style={styles.inputContainer}>
                      <div style={styles.iconContainer}>
                        <Calendar size={16} color="#95a5a6" />
                      </div>
                      <input
                        id="dateNaissance"
                        type="date"
                        name="dateNaissance"
                        value={formData.dateNaissance}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#3498db")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.role === "MEDECIN" && (
              <div style={styles.specialtySection}>
                <div style={styles.sectionTitle}>
                  <Briefcase
                    size={18}
                    color="#2c3e50"
                    style={styles.sectionIcon}
                  />
                  Informations Professionnelles
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formColumnFull}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="specialite">
                        Spécialité
                      </label>
                      <div style={styles.inputContainer}>
                        <div style={styles.iconContainer}>
                          <Activity size={16} color="#95a5a6" />
                        </div>
                        <select
                          id="specialite"
                          name="specialite"
                          value={formData.specialite}
                          onChange={handleChange}
                          required
                          style={styles.select}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#3498db")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#dcdfe6")
                          }
                        >
                          <option value="">Sélectionnez une spécialité</option>
                          <option value="Cardiologie">Cardiologie</option>
                          <option value="Dermatologie">Dermatologie</option>
                          <option value="Pédiatrie">Pédiatrie</option>
                          <option value="Neurologie">Neurologie</option>
                          <option value="Chirurgie">Chirurgie</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={columnStyle}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="prixConsultation">
                        Prix Consultation
                      </label>
                      <div style={styles.inputContainer}>
                        <div style={styles.iconContainer}>
                          <DollarSign size={16} color="#95a5a6" />
                        </div>
                        <input
                          id="prixConsultation"
                          type="number"
                          name="prixConsultation"
                          value={formData.prixConsultation}
                          onChange={handleChange}
                          required
                          placeholder="Tarif en Ouguiya"
                          style={styles.input}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#3498db")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#dcdfe6")
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div style={columnStyle}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="adresseCabinet">
                        Adresse du Cabinet
                      </label>
                      <div style={styles.inputContainer}>
                        <div style={styles.iconContainer}>
                          <MapPin size={16} color="#95a5a6" />
                        </div>
                        <input
                          id="adresseCabinet"
                          type="text"
                          name="adresseCabinet"
                          value={formData.adresseCabinet}
                          onChange={handleChange}
                          required
                          placeholder="Adresse de votre cabinet"
                          style={styles.input}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#3498db")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#dcdfe6")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {}),
              }}
              onMouseOver={(e) =>
                !isLoading && (e.target.style.backgroundColor = "#2980b9")
              }
              onMouseOut={(e) =>
                !isLoading && (e.target.style.backgroundColor = "#3498db")
              }
            >
              <UserPlus size={16} color="white" style={styles.buttonIcon} />
              {isLoading ? "Création du compte..." : "S'inscrire"}
            </button>
          </form>
        </div>

        <div style={styles.cardFooter}>
          <p style={{ fontSize: "14px", color: "#7f8c8d", margin: "0" }}>
            Déjà inscrit?
            <a
              href="/login"
              style={styles.loginLink}
              onMouseOver={(e) => (e.target.style.color = "#2980b9")}
              onMouseOut={(e) => (e.target.style.color = "#3498db")}
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
