import express from "express";
import { authentifier } from "../middleware/auth.js";
import {
  obtenirMonSupermarche,
  creerMonSupermarche,
  mettreAJourMonSupermarche,
  obtenirMesProduits,
  creerMonProduit,
  mettreAJourMonProduit,
  supprimerMonProduit,
  obtenirStatistiques,
} from "../controllers/vendeurController.js";

const router = express.Router();

// Toutes les routes sont protégées
router.use(authentifier);

// Routes supermarché
router.get("/supermarche", obtenirMonSupermarche);
router.post("/supermarche", creerMonSupermarche);
router.put("/supermarche", mettreAJourMonSupermarche);

// Routes produits
router.get("/produits", obtenirMesProduits);
router.post("/produits", creerMonProduit);
router.put("/produits/:id", mettreAJourMonProduit);
router.delete("/produits/:id", supprimerMonProduit);

// Statistiques
router.get("/statistiques", obtenirStatistiques);

export default router;
