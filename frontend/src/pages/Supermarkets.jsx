import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Supermarkets() {
  const navigate = useNavigate();
  const [supermarches, setSupermarches] = useState([]); // pour stocker les supermarchés
  const [loading, setLoading] = useState(true); // pour indiquer si les données sont en cours de chargement
  const [recherche, setRecherche] = useState(""); // pour stocker la valeur de la recherche

  useEffect(() => {
    chargerSupermarches(); // charger les supermarchés au chargement du composant et à chaque changement de la recherche
  }, [recherche]);

  const chargerSupermarches = async () => {
    try {
      setLoading(true); // indique que le chargement commence
      const params = new URLSearchParams(); // pour construire les paramètres de la requête
      if (recherche) params.append("recherche", recherche); // ajoute le paramètre de recherche si il existe

      const response = await api.get("/supermarkets?" + params); // effectue la requête GET avec les paramètres
      setSupermarches(response.data.supermarches); // met à jour l'état avec les supermarchés reçus
    } catch (error) {
      console.error("Erreur:", error); // gère les erreurs de la requête
    } finally {
      setLoading(false); // indique que le chargement est terminé
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Nos Supermarchés</h1>

      {/* Recherche */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <input
          type="text"
          placeholder="Rechercher un supermarché..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Supermarchés */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Chargement...</p>
        </div>
      ) : supermarches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Aucun supermarché trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supermarches.map((sm) => (
            <div
              key={sm._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-green-600 h-32 flex items-center justify-center">
                <span className="text-6xl">🏪</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-2xl mb-2">{sm.nom}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {sm.description}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <p>
                    <span className="font-semibold">📍</span> {sm.adresse?.rue},{" "}
                    {sm.adresse?.ville}
                  </p>
                  <p>
                    <span className="font-semibold">📞</span> {sm.telephone}
                  </p>
                  <p>
                    <span className="font-semibold">⭐</span>{" "}
                    {sm.rating?.toFixed(1) || "N/A"} ({sm.nombreAvis || 0} avis)
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/products?supermarket=${sm._id}`)}
                    className="flex-grow bg-primary text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    Voir les produits
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
