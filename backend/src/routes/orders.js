import express from "express";
import { authentifier, verifierAdmin } from "../middleware/auth.js";
import {
  creerCommande,
  obtenirMesCommandes,
  obtenirCommande,
  obtenirToutesLesCommandes,
  mettreAJourStatutCommande,
  annulerCommande,
} from "../controllers/orderController.js";

const router = express.Router();

// Routes protégées (utilisateur)
router.post("/", authentifier, creerCommande);
router.get("/mes-commandes", authentifier, obtenirMesCommandes);
router.get("/:id", authentifier, obtenirCommande);
router.put("/:id/annuler", authentifier, annulerCommande);

// Routes admin
router.get("/", authentifier, verifierAdmin, obtenirToutesLesCommandes);
router.put(
  "/:id/statut",
  authentifier,
  verifierAdmin,
  mettreAJourStatutCommande,
);

export default router;
