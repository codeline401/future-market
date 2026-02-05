import express from "express";
import { authentifier, verifierAdmin } from "../middleware/auth.js";
import {
  obtenirTousLesSupermarches,
  obtenirSupermarche,
  creerSupermarche,
  mettreAJourSupermarche,
  supprimerSupermarche,
  rechercherSupermarches,
  noterSupermarche,
} from "../controllers/supermarketController.js";

const router = express.Router();

// Routes publiques
router.get("/", obtenirTousLesSupermarches);
router.get("/recherche/proximite", rechercherSupermarches);
router.get("/:id", obtenirSupermarche);

// Routes protégées
router.post("/", authentifier, verifierAdmin, creerSupermarche);
router.put("/:id", authentifier, verifierAdmin, mettreAJourSupermarche);
router.delete("/:id", authentifier, verifierAdmin, supprimerSupermarche);

// Notation
router.post("/:id/noter", authentifier, noterSupermarche);

export default router;
