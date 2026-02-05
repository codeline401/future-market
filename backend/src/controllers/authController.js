import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Générer JWT
const genererToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "7d",
  });
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { nom, prenom, email, motdepasse, telephone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await User.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Créer un nouvel utilisateur
    const nouvelUtilisateur = new User({
      nom,
      prenom,
      email,
      motdepasse,
      telephone,
      role: "client",
    });

    await nouvelUtilisateur.save();

    const token = genererToken(nouvelUtilisateur._id, nouvelUtilisateur.role);

    res.status(201).json({
      message: "Inscription réussie",
      token,
      utilisateur: nouvelUtilisateur.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REGISTER VENDEUR
export const registerVendeur = async (req, res) => {
  try {
    const { nom, prenom, email, motdepasse, telephone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await User.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Créer un nouvel utilisateur vendeur
    const nouvelUtilisateur = new User({
      nom,
      prenom,
      email,
      motdepasse,
      telephone,
      role: "vendeur",
    });

    await nouvelUtilisateur.save();

    const token = genererToken(nouvelUtilisateur._id, nouvelUtilisateur.role);

    res.status(201).json({
      message: "Inscription vendeur réussie",
      token,
      utilisateur: nouvelUtilisateur.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, motdepasse } = req.body;

    // Vérifier les champs requis
    if (!email || !motdepasse) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Trouver l'utilisateur
    const utilisateur = await User.findOne({ email }).select("+motdepasse");
    if (!utilisateur) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const motdepasseValide = await utilisateur.comparerMotdepasse(motdepasse);
    if (!motdepasseValide) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const token = genererToken(utilisateur._id, utilisateur.role);

    res.json({
      message: "Connexion réussie",
      token,
      utilisateur: utilisateur.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CURRENT USER
export const obtenirUtilisateurActuel = async (req, res) => {
  try {
    const utilisateur = await User.findById(req.userId);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
export const mettreAJourProfil = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body;

    const utilisateur = await User.findByIdAndUpdate(
      req.userId,
      { nom, prenom, telephone, adresse },
      { new: true, runValidators: true },
    );

    res.json({
      message: "Profil mis à jour",
      utilisateur,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL USERS (Admin only)
export const obtenirTousLesUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await User.find();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER (Admin or self)
export const supprimerUtilisateur = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
