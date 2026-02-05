import Supermarket from "../models/Supermarket.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// GET MON SUPERMARKET (pour le vendeur)
export const obtenirMonSupermarche = async (req, res) => {
  try {
    const supermarche = await Supermarket.findOne({ gerant: req.userId });

    if (!supermarche) {
      return res
        .status(404)
        .json({ message: "Vous n'avez pas encore de supermarché" });
    }

    res.json(supermarche);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRÉER UN SUPERMARKET
export const creerMonSupermarche = async (req, res) => {
  try {
    // Vérifier que l'utilisateur ne possède pas déjà un supermarché
    const existant = await Supermarket.findOne({ gerant: req.userId });
    if (existant) {
      return res
        .status(400)
        .json({ message: "Vous possédez déjà un supermarché" });
    }

    const {
      nom,
      description,
      adresse,
      localisation,
      telephone,
      email,
      horaires,
    } = req.body;

    const nouveauSupermarche = new Supermarket({
      nom,
      description,
      adresse,
      localisation,
      telephone,
      email,
      horaires,
      gerant: req.userId,
    });

    await nouveauSupermarche.save();

    // Mettre à jour le rôle de l'utilisateur
    await User.findByIdAndUpdate(req.userId, { role: "vendeur" });

    res.status(201).json({
      message: "Supermarché créé avec succès",
      supermarche: nouveauSupermarche,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// METTRE À JOUR MON SUPERMARKET
export const mettreAJourMonSupermarche = async (req, res) => {
  try {
    const supermarche = await Supermarket.findOneAndUpdate(
      { gerant: req.userId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!supermarche) {
      return res.status(404).json({ message: "Supermarché non trouvé" });
    }

    res.json({
      message: "Supermarché mis à jour",
      supermarche,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MES PRODUITS (pour le vendeur)
export const obtenirMesProduits = async (req, res) => {
  try {
    // Récupérer le supermarché du vendeur
    const supermarche = await Supermarket.findOne({ gerant: req.userId });
    if (!supermarche) {
      return res
        .status(404)
        .json({ message: "Vous n'avez pas de supermarché" });
    }

    // Récupérer tous les produits du supermarché
    const produits = await Product.find({ supermarket: supermarche._id }).sort({
      createdAt: -1,
    });

    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRÉER UN PRODUIT (vendeur uniquement)
export const creerMonProduit = async (req, res) => {
  try {
    // Récupérer le supermarché du vendeur
    const supermarche = await Supermarket.findOne({ gerant: req.userId });
    if (!supermarche) {
      return res
        .status(404)
        .json({ message: "Vous n'avez pas de supermarché" });
    }

    const { nom, description, prix, categorie, stock, marque, poids, image } =
      req.body;

    const nouveauProduit = new Product({
      nom,
      description,
      prix,
      categorie,
      stock,
      marque,
      poids,
      image,
      supermarket: supermarche._id,
    });

    await nouveauProduit.save();

    res.status(201).json({
      message: "Produit créé",
      produit: nouveauProduit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// METTRE À JOUR MON PRODUIT
export const mettreAJourMonProduit = async (req, res) => {
  try {
    const supermarche = await Supermarket.findOne({ gerant: req.userId });
    if (!supermarche) {
      return res
        .status(404)
        .json({ message: "Vous n'avez pas de supermarché" });
    }

    const produit = await Product.findOne({
      _id: req.params.id,
      supermarket: supermarche._id,
    });

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    Object.assign(produit, req.body);
    await produit.save();

    res.json({
      message: "Produit mis à jour",
      produit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUPPRIMER MON PRODUIT
export const supprimerMonProduit = async (req, res) => {
  try {
    const supermarche = await Supermarket.findOne({ gerant: req.userId });
    if (!supermarche) {
      return res
        .status(404)
        .json({ message: "Vous n'avez pas de supermarché" });
    }

    const produit = await Product.findOneAndDelete({
      _id: req.params.id,
      supermarket: supermarche._id,
    });

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STATISTIQUES VENDEUR
export const obtenirStatistiques = async (req, res) => {
  try {
    const supermarche = await Supermarket.findOne({ gerant: req.userId });
    if (!supermarche) {
      return res
        .status(404)
        .json({ message: "Vous n'avez pas de supermarché" });
    }

    const nombreProduits = await Product.countDocuments({
      supermarket: supermarche._id,
    });

    const nombreCommandes = await Order.countDocuments({
      supermarket: supermarche._id,
    });

    const totalVentes = await Order.aggregate([
      { $match: { supermarket: supermarche._id } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.json({
      supermarche: {
        nom: supermarche.nom,
        nombreProduits,
        nombreCommandes,
        totalVentes: totalVentes[0]?.total || 0,
        rating: supermarche.rating,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
