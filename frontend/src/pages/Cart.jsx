import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Cart() {
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerPanier();
  }, []);

  // Formater le prix avec séparateurs de milliers
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-MG").format(price);
  };

  const chargerPanier = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get("/cart");
      setPanier(response.data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const mettreAJourQuantite = async (produitId, quantite) => {
    try {
      await api.put("/cart/quantite", {
        produitId,
        quantite,
      });
      chargerPanier();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const retirerProduit = async (produitId) => {
    try {
      await api.post("/cart/retirer", { produitId });
      chargerPanier();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const viderPanier = async () => {
    try {
      await api.delete("/cart");
      chargerPanier();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const passer_commande = async () => {
    try {
      await api.post("/orders", {
        adresseLivraison: {
          rue: "123 Rue de la Paix",
          ville: "Paris",
          codepostal: "75000",
          pays: "France",
        },
        modePaiement: "carte",
      });
      alert("Commande créée avec succès!");
      chargerPanier();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création de la commande");
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            Vous devez être connecté pour voir votre panier
          </p>
          <a href="/login" className="text-primary font-bold hover:underline">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!panier || panier.produits.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Votre panier est vide</p>
          <a
            href="/products"
            className="text-primary font-bold hover:underline"
          >
            Continuer vos achats
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Produits */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {panier.produits.map((item) => (
              <div key={item._id} className="flex gap-4 p-6 border-b">
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.produit?.image ? (
                    <img
                      src={item.produit.image}
                      alt={item.produit?.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.produit?.nom}</h3>
                  <p className="text-gray-600 mb-2">
                    {formatPrice(item.prixUnitaire)} Ar par article
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        mettreAJourQuantite(
                          item.produit?._id,
                          item.quantite - 1,
                        )
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantite}
                      readOnly
                      className="w-12 text-center border rounded"
                    />
                    <button
                      onClick={() =>
                        mettreAJourQuantite(
                          item.produit?._id,
                          item.quantite + 1,
                        )
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => retirerProduit(item.produit?._id)}
                      className="ml-auto text-red-500 hover:text-red-700 font-bold"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(item.sousTotal)} Ar
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={viderPanier}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Vider le panier
          </button>
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Résumé</h2>
          <div className="space-y-4 mb-6 border-b pb-4">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-bold">
                {formatPrice(panier.sousTotal)} Ar
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span className="font-bold">
                {formatPrice(panier.fraisLivraison)} Ar
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxe</span>
              <span className="font-bold">{formatPrice(panier.taxe)} Ar</span>
            </div>
          </div>
          <div className="flex justify-between text-2xl font-bold mb-6">
            <span>Total</span>
            <span className="text-primary">{formatPrice(panier.total)} Ar</span>
          </div>
          <button
            onClick={passer_commande}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-green-700 transition font-bold"
          >
            Passer la commande
          </button>
        </div>
      </div>
    </div>
  );
}
