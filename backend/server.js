import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import supermarketRoutes from "./src/routes/supermarkets.js";
import orderRoutes from "./src/routes/orders.js";
import cartRoutes from "./src/routes/cart.js";
import vendeurRoutes from "./src/routes/vendeur.js";

dotenv.config();

// Connecter à MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.get("/api", (req, res) => {
  res.json({ message: "Bienvenue sur l'API SuperMarket Marketplace" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/supermarkets", supermarketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/vendeur", vendeurRoutes);

// Routes santé
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Middleware d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur serveur", error: err.message });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV}`);
});

export default app;
