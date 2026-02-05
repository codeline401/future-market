import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RegisterVendor() {
  const [step, setStep] = useState(1); // 1: User info, 2: Supermarket info
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    motdepasseConfirm: "",
    telephone: "",
  });
  const [smData, setSMData] = useState({
    nom: "",
    description: "",
    adresse: {
      rue: "",
      ville: "",
      codepostal: "",
    },
    telephone: "",
    email: "",
    horaires: {},
    localisation: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
    },
  });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const handleUserChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSMChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("adresse.")) {
      const field = name.split(".")[1];
      setSMData({
        ...smData,
        adresse: {
          ...smData.adresse,
          [field]: value,
        },
      });
    } else {
      setSMData({
        ...smData,
        [name]: value,
      });
    }
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    setErreur("");

    if (userData.motdepasse !== userData.motdepasseConfirm) {
      setErreur("Les mots de passe ne correspondent pas");
      return;
    }

    if (userData.motdepasse.length < 6) {
      setErreur("Le mot de passe doit faire au moins 6 caractères");
      return;
    }

    setStep(2);
  };

  const handleSMSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setLoading(true);

    try {
      // 1. Créer l'utilisateur vendeur
      const userResponse = await api.post("/auth/register-vendeur", {
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        motdepasse: userData.motdepasse,
        telephone: userData.telephone,
      });

      const token = userResponse.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(userResponse.data.utilisateur),
      );

      // 2. Créer le supermarché
      await api.post("/vendeur/supermarche", smData); // Utiliser le token automatiquement via l'intercepteur

      // Rafraîchir la page pour mettre à jour le Header
      setTimeout(() => {
        window.location.href = "/vendeur/dashboard";
      }, 500);
    } catch (error) {
      setErreur(
        error.response?.data?.message || "Erreur lors de l'inscription",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          {step === 1 ? "Devenir Vendeur" : "Créer votre Supermarché"}
        </h1>

        {erreur && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erreur}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={userData.nom}
                  onChange={handleUserChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Dupont"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={userData.prenom}
                  onChange={handleUserChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Jean"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={userData.telephone}
                onChange={handleUserChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="motdepasse"
                value={userData.motdepasse}
                onChange={handleUserChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Confirmer mot de passe
              </label>
              <input
                type="password"
                name="motdepasseConfirm"
                value={userData.motdepasseConfirm}
                onChange={handleUserChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition font-bold"
            >
              Continuer
            </button>
          </form>
        ) : (
          <form onSubmit={handleSMSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Nom du supermarché
              </label>
              <input
                type="text"
                name="nom"
                value={smData.nom}
                onChange={handleSMChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Mon Supermarché"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={smData.description}
                onChange={handleSMChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Description de votre supermarché"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Rue</label>
              <input
                type="text"
                name="adresse.rue"
                value={smData.adresse.rue}
                onChange={handleSMChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="123 Rue de Paris"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  name="adresse.ville"
                  value={smData.adresse.ville}
                  onChange={handleSMChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Paris"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Code postal
                </label>
                <input
                  type="text"
                  name="adresse.codepostal"
                  value={smData.adresse.codepostal}
                  onChange={handleSMChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="75000"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={smData.email}
                onChange={handleSMChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="contact@supermarche.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={smData.telephone}
                onChange={handleSMChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="01 23 45 67 89"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition font-bold"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </form>
        )}

        <p className="text-center mt-6">
          Déjà inscrit ?{" "}
          <a href="/login" className="text-primary font-bold hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
