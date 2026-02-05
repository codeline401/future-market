import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    prix: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: 0,
    },
    prixOriginal: {
      type: Number,
      min: 0,
    },
    categorie: {
      type: String,
      required: [true, 'La catégorie est requise'],
      enum: ['fruits-legumes', 'laitiers', 'viandes', 'epicerie', 'boissons', 'surgeles', 'hygiene', 'autre'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: null,
    },
    images: [String],
    supermarket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supermarket',
      required: true,
    },
    code: {
      type: String,
      unique: true,
      sparse: true, // Permet les null
    },
    marque: {
      type: String,
      trim: true,
    },
    poids: {
      type: String, // "500g", "1kg", etc
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
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
    reduction: {
      pourcentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      dateDebut: Date,
      dateFin: Date,
    },
  },
  { timestamps: true }
)

// Index pour les recherches
productSchema.index({ nom: 'text', description: 'text' })
productSchema.index({ supermarket: 1, categorie: 1 })

export default mongoose.model('Product', productSchema)
