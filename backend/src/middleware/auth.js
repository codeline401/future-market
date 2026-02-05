import jwt from "jsonwebtoken"; // Importer la bibliothèque jsonwebtoken

// Middleware pour authentifier l'utilisateur via JWT

const authentifier = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Token non fourni" }); // Si le token n'est pas fourni, renvoyer une erreur 401
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.userId = decoded.userId; // Stocker l'ID utilisateur dans la requête
    req.userRole = decoded.role; // Stocker le rôle utilisateur dans la requête

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré" });
    }
    return res.status(401).json({ message: "Token invalide" });
  }
};

// Middleware pour vérifier que l'utilisateur est admin
const verifierAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Accès refusé. Admin requis." });
  }
  next();
};

// Middleware pour vérifier que c'est le propriétaire de la ressource
const verifierProprietaire = (req, res, next) => {
  if (req.userId !== req.params.userId && req.userRole !== "admin") {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};

export { authentifier, verifierAdmin, verifierProprietaire };
