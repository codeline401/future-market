import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Products() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState("");
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    chargerProduits();
  }, [categorie, recherche]);

  const chargerProduits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categorie) params.append("categorie", categorie);
      if (recherche) params.append("recherche", recherche);

      const response = await api.get("/products?" + params);
      setProduits(response.data.produits);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Formater le prix avec séparateurs de milliers
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-MG").format(price);
  };

  const categories = [
    "fruits-legumes",
    "laitiers",
    "viandes",
    "epicerie",
    "boissons",
    "surgeles",
    "hygiene",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Nos Produits</h1>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Produits */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Chargement...</p>
        </div>
      ) : produits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {produits.map((produit) => (
            <div
              key={produit._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                {produit.image ? (
                  <img
                    src={produit.image}
                    alt={produit.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">📦</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {produit.nom}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {produit.description}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(produit.prix)} Ar
                  </span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    Stock: {produit.stock}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-grow bg-primary text-white py-2 rounded hover:bg-green-700 transition">
                    Ajouter au panier
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
