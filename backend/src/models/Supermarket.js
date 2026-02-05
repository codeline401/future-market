import mongoose from "mongoose";

const supermarketSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du supermarché est requis"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    adresse: {
      rue: {
        type: String,
        required: true,
      },
      ville: {
        type: String,
        required: true,
      },
      codepostal: {
        type: String,
        required: true,
      },
      pays: {
        type: String,
        default: "France",
      },
    },
    localisation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    telephone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    horaires: {
      lundi: String,
      mardi: String,
      mercredi: String,
      jeudi: String,
      vendredi: String,
      samedi: String,
      dimanche: String,
    },
    image: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    gerant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Un gérant est requis"],
    },
    actif: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    nombreAvis: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Middleware : avant de supprimer un supermarché, supprimer ses produits
supermarketSchema.pre("deleteOne", async function (next) {
  const Product = mongoose.model("Product");
  await Product.deleteMany({ supermarket: this._id });
  next();
});

// Index géospatial pour les recherches de proximité
supermarketSchema.index({ "localisation.coordinates": "2dsphere" });

export default mongoose.model("Supermarket", supermarketSchema);
