import express from "express";
import { authentifier } from "../middleware/auth.js";
import {
  obtenirPanier,
  ajouterAuPanier,
  retirerDuPanier,
  mettreAJourQuantitePanier,
  viderPanier,
  appliquerCode,
} from "../controllers/cartController.js";

const router = express.Router();

// Routes protégées
router.get("/", authentifier, obtenirPanier);
router.post("/ajouter", authentifier, ajouterAuPanier);
router.post("/retirer", authentifier, retirerDuPanier);
router.put("/quantite", authentifier, mettreAJourQuantitePanier);
router.delete("/", authentifier, viderPanier);
router.post("/code", authentifier, appliquerCode);

export default router;
