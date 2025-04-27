// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function SignUp() {
//   const [formData, setFormData] = useState({
//     nom: "",
//     prenom: "",
//     email: "",
//     motDePasse: "",
//     telephone: "",
//     adresse: "",
//     sexe: "M",
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

//     // Prepare data for backend
//     const requestData = {
//       nom: formData.nom,
//       prenom: formData.prenom,
//       email: formData.email,
//       motDePasse: formData.motDePasse,
//       tel: formData.telephone,
//       dateNaissance: formData.dateNaissance,
//       adresse: formData.adresse,
//       sexe: formData.sexe,
//       role: formData.role,
//       ...(formData.role === "MEDECIN" && {
//         specialite: formData.specialite,
//         prixConsultation: formData.prixConsultation,
//         adresseCabinet: formData.adresseCabinet,
//       }),
//     };

//     try {
//       const response = await fetch("http://localhost:8082/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//         credentials: "include",
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Erreur lors de l'inscription.");
//       }

//       navigate("/Login", { state: { registrationSuccess: true } });
//     } catch (error) {
//       setError(error.message || "Échec de l'inscription. Réessayez.");
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
//                   <option value="M">Homme</option>
//                   <option value="F">Femme</option>
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
//                   <option value="ADMIN">Administrateur</option>
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

function SignUp() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    telephone: "", // Changed from integer to string to match backend expectation
    adresse: "",
    sexe: "M",
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
      telephone: formData.telephone, // Use telephone instead of tel to match backend
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

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h2 className="text-center">Inscription</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  name="nom"
                  className="form-control"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  className="form-control"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  name="motDePasse"
                  className="form-control"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  className="form-control"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  className="form-control"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Sexe</label>
                <select
                  name="sexe"
                  className="form-select"
                  value={formData.sexe}
                  onChange={handleChange}
                  required
                >
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Rôle</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="PATIENT">Patient</option>
                  <option value="MEDECIN">Médecin</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              {formData.role === "PATIENT" && (
                <div className="mb-3">
                  <label className="form-label">Date de naissance</label>
                  <input
                    type="date"
                    name="dateNaissance"
                    className="form-control"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {formData.role === "MEDECIN" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Spécialité</label>
                    <select
                      name="specialite"
                      className="form-select"
                      value={formData.specialite}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez une spécialité</option>
                      <option value="Cardiologie">Cardiologie</option>
                      <option value="Dermatologie">Dermatologie</option>
                      <option value="Pédiatrie">Pédiatrie</option>
                      <option value="Neurologie">Neurologie</option>
                      <option value="Chirurgie">Chirurgie</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Prix Consultation</label>
                    <input
                      type="number"
                      name="prixConsultation"
                      className="form-control"
                      value={formData.prixConsultation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Adresse du Cabinet</label>
                    <input
                      type="text"
                      name="adresseCabinet"
                      className="form-control"
                      value={formData.adresseCabinet}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Inscription..." : "S'inscrire"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
