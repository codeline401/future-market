import { useState, useEffect } from "react";
import api from "../api/axios";

export default function VendeurDashboard() {
  const [supermarche, setSupermarche] = useState(null);
  const [produits, setProduits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "epicerie",
    stock: "",
    marque: "",
    poids: "",
    image: null,
  });

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const [smResponse, produitsResponse, statsResponse] = await Promise.all([
        api.get("/vendeur/supermarche"),
        api.get("/vendeur/produits"),
        api.get("/vendeur/statistiques"),
      ]);

      setSupermarche(smResponse.data);
      setProduits(produitsResponse.data);
      setStats(statsResponse.data.supermarche);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convertir image en base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Formater le prix avec séparateurs de milliers
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-MG").format(price);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        prix: parseFloat(newProduct.prix),
        stock: parseInt(newProduct.stock),
      };

      if (editingProduct) {
        await api.put(`/vendeur/produits/${editingProduct._id}`, productData);
        setEditingProduct(null);
      } else {
        await api.post("/vendeur/produits", productData);
      }

      setNewProduct({
        nom: "",
        description: "",
        prix: "",
        categorie: "epicerie",
        stock: "",
        marque: "",
        poids: "",
        image: null,
      });
      setShowAddProduct(false);
      chargerDonnees();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout/modification du produit");
    }
  };

  const supprimerProduit = async (id) => {
    if (window.confirm("Êtes-vous sûr ?")) {
      try {
        await api.delete(`/vendeur/produits/${id}`);
        chargerDonnees();
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const modifierProduit = (produit) => {
    setNewProduct({
      nom: produit.nom,
      description: produit.description,
      prix: produit.prix.toString(),
      categorie: produit.categorie,
      stock: produit.stock.toString(),
      marque: produit.marque,
      poids: produit.poids,
      image: produit.image,
    });
    setEditingProduct(produit);
    setShowAddProduct(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!supermarche) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600 mb-4">
          Vous n\'avez pas encore de supermarché
        </p>
        <a
          href="/register-vendor"
          className="text-primary font-bold hover:underline"
        >
          Créer un supermarché
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        🏪 Dashboard {supermarche.nom}
      </h1>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Produits</p>
            <p className="text-3xl font-bold text-primary">
              {stats.nombreProduits}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Commandes</p>
            <p className="text-3xl font-bold text-primary">
              {stats.nombreCommandes}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Ventes totales</p>
            <p className="text-3xl font-bold text-primary">
              {stats.totalVentes}€
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Note</p>
            <p className="text-3xl font-bold text-primary">⭐ {stats.rating}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section formulaire - Colonne 1 */}
        <div className="lg:col-span-1">
          {/* Bouton ajouter produit */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({
                nom: "",
                description: "",
                prix: "",
                categorie: "epicerie",
                stock: "",
                marque: "",
                poids: "",
                image: null,
              });
              setShowAddProduct(!showAddProduct);
            }}
            className="w-full bg-gradient-to-r from-primary to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-bold mb-4 text-lg"
          >
            {showAddProduct ? "❌ Annuler" : "➕ Ajouter un produit"}
          </button>

          {/* Formulaire ajout/modification produit */}
          {showAddProduct && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg shadow-lg border-2 border-primary">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                {editingProduct
                  ? "✏️ Modifier le produit"
                  : "➕ Ajouter un nouveau produit"}
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom du produit"
                  value={newProduct.nom}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, nom: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Prix (Ar)"
                  value={newProduct.prix}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, prix: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {newProduct.prix && (
                  <div className="bg-blue-100 border border-blue-300 p-2 rounded text-sm text-blue-800">
                    💰 Prix: {formatPrice(parseInt(newProduct.prix))} Ar
                  </div>
                )}
                <select
                  value={newProduct.categorie}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, categorie: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="epicerie">Épicerie</option>
                  <option value="fruits-legumes">Fruits & Légumes</option>
                  <option value="laitiers">Laitiers</option>
                  <option value="viandes">Viandes</option>
                  <option value="boissons">Boissons</option>
                  <option value="surgeles">Surgelés</option>
                  <option value="hygiene">Hygiène & Beauté</option>
                  <option value="boulangerie">Boulangerie</option>
                  <option value="confiserie">Confiserie</option>
                  <option value="bebes">Articles pour Bébés</option>
                  <option value="nettoyage">Produits de Nettoyage</option>
                  <option value="electromenager">Électroménager</option>
                  <option value="autre">Autre</option>
                </select>
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Marque"
                  value={newProduct.marque}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, marque: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Poids (ex: 500g)"
                  value={newProduct.poids}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, poids: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Description du produit"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />

                {/* Upload d'image */}
                <div className="border-2 border-dashed border-primary rounded-lg p-4 text-center bg-blue-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageInput"
                  />
                  <label htmlFor="imageInput" className="cursor-pointer block">
                    {newProduct.image ? (
                      <div>
                        <img
                          src={newProduct.image}
                          alt="Aperçu"
                          className="w-24 h-24 object-cover rounded mx-auto mb-2"
                        />
                        <p className="text-sm text-primary font-bold">
                          Changer la photo
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-2xl mb-2">📸</p>
                        <p className="text-sm text-gray-600">
                          Cliquez pour ajouter une photo
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition font-bold text-lg"
                  >
                    {editingProduct ? "✏️ Modifier" : "✅ Ajouter"} le produit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Section produits - Colonne 2-3 */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            📦 Mes produits ({produits.length})
          </h2>
          {produits.length === 0 ? (
            <div className="bg-blue-50 border-2 border-blue-300 p-8 rounded-lg text-center">
              <p className="text-gray-600 text-lg mb-3">
                ❌ Aucun produit pour le moment
              </p>
              <p className="text-gray-500">
                Cliquez sur le bouton "➕ Ajouter un produit" à gauche pour
                commencer !
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Nom</th>
                    <th className="px-6 py-3 text-left">Prix</th>
                    <th className="px-6 py-3 text-left">Catégorie</th>
                    <th className="px-6 py-3 text-left">Stock</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map((produit) => (
                    <tr key={produit._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold">{produit.nom}</td>
                      <td className="px-6 py-3 text-primary font-bold">
                        {formatPrice(produit.prix)} Ar
                      </td>
                      <td className="px-6 py-3">{produit.categorie}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-bold ${produit.stock > 10 ? "bg-green-500" : produit.stock > 0 ? "bg-yellow-500" : "bg-red-500"}`}
                        >
                          {produit.stock}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => modifierProduit(produit)}
                            className="text-blue-500 hover:text-blue-700 font-bold hover:underline"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => supprimerProduit(produit._id)}
                            className="text-red-500 hover:text-red-700 font-bold hover:underline"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
