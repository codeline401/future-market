import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// CREATE ORDER
export const creerCommande = async (req, res) => {
  try {
    const { adresseLivraison, modePaiement } = req.body;

    // Récupérer le panier de l'utilisateur
    const panier = await Cart.findOne({ client: req.userId }).populate(
      "produits.produit",
    );

    if (!panier || panier.produits.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    // Vérifier le stock de chaque produit
    for (let item of panier.produits) {
      if (item.produit.stock < item.quantite) {
        return res.status(400).json({
          message: `Stock insuffisant pour ${item.produit.nom}`,
        });
      }
    }

    // Créer la commande
    const nouvelleCommande = new Order({
      client: req.userId,
      produits: panier.produits.map((item) => ({
        produit: item.produit._id,
        quantite: item.quantite,
        prixUnitaire: item.prixUnitaire,
        sousTotal: item.sousTotal,
      })),
      supermarket: panier.supermarketPrincipal,
      adresseLivraison,
      modePaiement,
      sousTotal: panier.sousTotal,
      fraisLivraison: panier.fraisLivraison,
      taxe: panier.taxe,
      total: panier.total,
    });

    // Décrémenter le stock
    for (let item of panier.produits) {
      await Product.findByIdAndUpdate(item.produit._id, {
        $inc: { stock: -item.quantite },
      });
    }

    await nouvelleCommande.save();

    // Vider le panier
    panier.viderPanier();
    await panier.save();

    res.status(201).json({
      message: "Commande créée",
      commande: nouvelleCommande,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER ORDERS
export const obtenirMesCommandes = async (req, res) => {
  try {
    const commandes = await Order.find({ client: req.userId })
      .populate("produits.produit", "nom prix image")
      .populate("supermarket", "nom logo")
      .sort({ createdAt: -1 });

    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ORDER BY ID
export const obtenirCommande = async (req, res) => {
  try {
    const commande = await Order.findById(req.params.id)
      .populate("client", "nom prenom email telephone")
      .populate("produits.produit")
      .populate("supermarket");

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Vérifier l'accès
    if (commande.client.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (Admin)
export const obtenirToutesLesCommandes = async (req, res) => {
  try {
    const { statut, page = 1, limite = 20 } = req.query;
    const filtre = {};
    if (statut) filtre.statut = statut;

    const skip = (page - 1) * limite;
    const commandes = await Order.find(filtre)
      .populate("client", "nom prenom email")
      .populate("supermarket", "nom")
      .limit(limite)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filtre);

    res.json({
      commandes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limite),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS (Admin)
export const mettreAJourStatutCommande = async (req, res) => {
  try {
    const { statut } = req.body;

    const commande = await Order.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true },
    );

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.json({
      message: "Statut mise à jour",
      commande,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CANCEL ORDER
export const annulerCommande = async (req, res) => {
  try {
    const commande = await Order.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Vérifier si la commande peut être annulée
    if (!["en attente", "confirmée"].includes(commande.statut)) {
      return res
        .status(400)
        .json({ message: "Cette commande ne peut pas être annulée" });
    }

    // Restaurer le stock
    for (let item of commande.produits) {
      await Product.findByIdAndUpdate(item.produit, {
        $inc: { stock: item.quantite },
      });
    }

    commande.statut = "annulee";
    await commande.save();

    res.json({
      message: "Commande annulée",
      commande,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
