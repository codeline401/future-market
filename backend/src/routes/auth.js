import express from "express";
import { authentifier, verifierAdmin } from "../middleware/auth.js";
import {
  register,
  registerVendeur,
  login,
  obtenirUtilisateurActuel,
  mettreAJourProfil,
  obtenirTousLesUtilisateurs,
  supprimerUtilisateur,
} from "../controllers/authController.js";

const router = express.Router();

// Routes publiques
router.post("/register", register);
router.post("/register-vendeur", registerVendeur);
router.post("/login", login);

// Routes protégées
router.get("/me", authentifier, obtenirUtilisateurActuel);
router.put("/me", authentifier, mettreAJourProfil);

// Routes admin
router.get("/", authentifier, verifierAdmin, obtenirTousLesUtilisateurs);
router.delete("/:userId", authentifier, verifierAdmin, supprimerUtilisateur);

export default router;
