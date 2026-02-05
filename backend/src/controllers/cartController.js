import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET CART
export const obtenirPanier = async (req, res) => {
  try {
    let panier = await Cart.findOne({ client: req.userId }).populate(
      "produits.produit",
      "nom prix image stock",
    );

    if (!panier) {
      panier = new Cart({ client: req.userId });
      await panier.save();
    }

    res.json(panier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD TO CART
export const ajouterAuPanier = async (req, res) => {
  try {
    const { produitId, quantite, supermarketId } = req.body;

    // Vérifier que le produit existe
    const produit = await Product.findById(produitId);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Vérifier le stock
    if (produit.stock < quantite) {
      return res.status(400).json({ message: "Stock insuffisant" });
    }

    // Récupérer ou créer le panier
    let panier = await Cart.findOne({ client: req.userId });
    if (!panier) {
      panier = new Cart({ client: req.userId });
    }

    // Ajouter le produit
    panier.ajouterProduit(produit, quantite, supermarketId);

    // Définir le supermarché principal
    if (!panier.supermarketPrincipal) {
      panier.supermarketPrincipal = supermarketId;
    }

    await panier.save();

    res.json({
      message: "Produit ajouté au panier",
      panier,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE FROM CART
export const retirerDuPanier = async (req, res) => {
  try {
    const { produitId } = req.body;

    const panier = await Cart.findOne({ client: req.userId });
    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    panier.retirerProduit(produitId);
    await panier.save();

    res.json({
      message: "Produit retiré du panier",
      panier,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CART ITEM QUANTITY
export const mettreAJourQuantitePanier = async (req, res) => {
  try {
    const { produitId, quantite } = req.body;

    const panier = await Cart.findOne({ client: req.userId });
    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    const item = panier.produits.find(
      (p) => p.produit.toString() === produitId,
    );
    if (!item) {
      return res
        .status(404)
        .json({ message: "Produit non trouvé dans le panier" });
    }

    // Vérifier le stock
    const produit = await Product.findById(produitId);
    if (produit.stock < quantite) {
      return res.status(400).json({ message: "Stock insuffisant" });
    }

    item.quantite = quantite;
    item.sousTotal = quantite * item.prixUnitaire;

    panier.calculerTotal();
    await panier.save();

    res.json({
      message: "Quantité mise à jour",
      panier,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLEAR CART
export const viderPanier = async (req, res) => {
  try {
    let panier = await Cart.findOne({ client: req.userId });

    if (!panier) {
      panier = new Cart({ client: req.userId });
    }

    panier.viderPanier();
    await panier.save();

    res.json({
      message: "Panier vidé",
      panier,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPLY COUPON (Optional)
export const appliquerCode = async (req, res) => {
  try {
    const { code } = req.body;
    const panier = await Cart.findOne({ client: req.userId });

    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    // Logique simple (à adapter selon vos besoins)
    let reduction = 0;
    if (code === "BIENVENUE10") {
      reduction = panier.sousTotal * 0.1;
    }

    res.json({
      message: "Code appliqué",
      reduction,
      nouveauTotal: panier.total - reduction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
