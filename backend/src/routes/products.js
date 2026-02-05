import express from "express";
import { authentifier, verifierAdmin } from "../middleware/auth.js";
import {
  obtenirTousLesProduuts,
  obtenirProduitParId,
  creerProduit,
  mettreAJourProduit,
  supprimerProduit,
  obtenirProduitsParSupermarche,
} from "../controllers/productController.js";

const router = express.Router();

// Routes publiques
router.get("/", obtenirTousLesProduuts);
router.get("/:id", obtenirProduitParId);
router.get("/supermarket/:supermarketId", obtenirProduitsParSupermarche);

// Routes protégées (Admin/Vendeur)
router.post("/", authentifier, verifierAdmin, creerProduit);
router.put("/:id", authentifier, verifierAdmin, mettreAJourProduit);
router.delete("/:id", authentifier, verifierAdmin, supprimerProduit);

export default router;
