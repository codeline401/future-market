import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/supermarket-marketplace";

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
