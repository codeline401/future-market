import Supermarket from "../models/Supermarket.js";
import User from "../models/User.js";

// GET ALL SUPERMARKETS
export const obtenirTousLesSupermarches = async (req, res) => {
  try {
    const { recherche, page = 1, limite = 10 } = req.query;

    const filtre = { actif: true };
    if (recherche) {
      filtre.$or = [
        { nom: { $regex: recherche, $options: "i" } },
        { description: { $regex: recherche, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limite;
    const supermarches = await Supermarket.find(filtre)
      .populate("gerant", "nom prenom email")
      .limit(limite)
      .skip(skip);

    const total = await Supermarket.countDocuments(filtre);

    res.json({
      supermarches,
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

// GET SUPERMARKET BY ID
export const obtenirSupermarche = async (req, res) => {
  try {
    const supermarche = await Supermarket.findById(req.params.id).populate(
      "gerant",
      "nom prenom email telephone",
    );

    if (!supermarche) {
      return res.status(404).json({ message: "Supermarché non trouvé" });
    }

    res.json(supermarche);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE SUPERMARKET (Admin)
export const creerSupermarche = async (req, res) => {
  try {
    const {
      nom,
      description,
      adresse,
      localisation,
      telephone,
      email,
      horaires,
      gerant,
    } = req.body;

    // Vérifier que le gérant existe
    const utilisateur = await User.findById(gerant);
    if (!utilisateur) {
      return res.status(404).json({ message: "Gérant non trouvé" });
    }

    const nouveauSupermarche = new Supermarket({
      nom,
      description,
      adresse,
      localisation,
      telephone,
      email,
      horaires,
      gerant,
    });

    await nouveauSupermarche.save();

    res.status(201).json({
      message: "Supermarché créé",
      supermarche: nouveauSupermarche,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SUPERMARKET
export const mettreAJourSupermarche = async (req, res) => {
  try {
    const supermarche = await Supermarket.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
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

// DELETE SUPERMARKET
export const supprimerSupermarche = async (req, res) => {
  try {
    const supermarche = await Supermarket.findByIdAndDelete(req.params.id);
    if (!supermarche) {
      return res.status(404).json({ message: "Supermarché non trouvé" });
    }
    res.json({ message: "Supermarché supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH NEARBY SUPERMARKETS (Géolocalisation)
export const rechercherSupermarches = async (req, res) => {
  try {
    const { longitude, latitude, distance = 5000 } = req.query; // distance en mètres

    if (!longitude || !latitude) {
      return res
        .status(400)
        .json({ message: "Longitude et latitude requises" });
    }

    const supermarches = await Supermarket.find({
      "localisation.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: distance,
        },
      },
    });

    res.json(supermarches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RATE SUPERMARKET
export const noterSupermarche = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const supermarche = await Supermarket.findById(req.params.id);

    if (!supermarche) {
      return res.status(404).json({ message: "Supermarché non trouvé" });
    }

    // Mettre à jour la note moyenne
    const moyenneActuelle = supermarche.rating;
    const nombreAvisActuel = supermarche.nombreAvis;

    supermarche.rating =
      (moyenneActuelle * nombreAvisActuel + rating) / (nombreAvisActuel + 1);
    supermarche.nombreAvis += 1;

    await supermarche.save();

    res.json({
      message: "Supermarché noté",
      supermarche,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
