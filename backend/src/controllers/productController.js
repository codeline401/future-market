import Product from "../models/Product.js";
import Supermarket from "../models/Supermarket.js";

// GET ALL PRODUCTS
export const obtenirTousLesProduuts = async (req, res) => {
  try {
    const {
      categorie,
      supermarket,
      recherche,
      page = 1,
      limite = 12,
    } = req.query;

    const filtre = {};
    if (categorie) filtre.categorie = categorie;
    if (supermarket) filtre.supermarket = supermarket;
    if (recherche) {
      filtre.$or = [
        { nom: { $regex: recherche, $options: "i" } },
        { description: { $regex: recherche, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limite;
    const produits = await Product.find(filtre)
      .populate("supermarket", "nom logo")
      .limit(limite)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filtre);

    res.json({
      produits,
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

// GET PRODUCT BY ID
export const obtenirProduitParId = async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id).populate(
      "supermarket",
    );
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE PRODUCT (Admin or seller)
export const creerProduit = async (req, res) => {
  try {
    const {
      nom,
      description,
      prix,
      categorie,
      stock,
      supermarket,
      marque,
      poids,
    } = req.body;

    // Vérifier que le supermarché existe
    const sm = await Supermarket.findById(supermarket);
    if (!sm) {
      return res.status(404).json({ message: "Supermarché non trouvé" });
    }

    const nouveauProduit = new Product({
      nom,
      description,
      prix,
      categorie,
      stock,
      supermarket,
      marque,
      poids,
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

// UPDATE PRODUCT
export const mettreAJourProduit = async (req, res) => {
  try {
    const produit = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json({
      message: "Produit mis à jour",
      produit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT
export const supprimerProduit = async (req, res) => {
  try {
    const produit = await Product.findByIdAndDelete(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PRODUCTS BY SUPERMARKET
export const obtenirProduitsParSupermarche = async (req, res) => {
  try {
    const produits = await Product.find({
      supermarket: req.params.supermarketId,
    })
      .populate("supermarket", "nom logo")
      .sort({ createdAt: -1 });

    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
