import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    produits: [
      {
        produit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantite: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        prixUnitaire: {
          type: Number,
          required: true,
        },
        sousTotal: {
          type: Number,
          required: true,
        },
        supermarket: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Supermarket',
          required: true,
        },
      },
    ],
    sousTotal: {
      type: Number,
      default: 0,
    },
    fraisLivraison: {
      type: Number,
      default: 0,
    },
    taxe: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    supermarketPrincipal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supermarket',
    },
  },
  { timestamps: true }
)

// Méthode pour calculer le total
cartSchema.methods.calculerTotal = function () {
  this.sousTotal = this.produits.reduce((sum, item) => sum + item.sousTotal, 0)
  this.total = this.sousTotal + this.fraisLivraison + this.taxe
  return this.total
}

// Méthode pour ajouter un produit
cartSchema.methods.ajouterProduit = function (produit, quantite, supermarketId) {
  const existant = this.produits.find(
    (item) => item.produit.toString() === produit._id.toString()
  )

  if (existant) {
    existant.quantite += quantite
    existant.sousTotal = existant.quantite * existant.prixUnitaire
  } else {
    this.produits.push({
      produit: produit._id,
      quantite,
      prixUnitaire: produit.prix,
      sousTotal: quantite * produit.prix,
      supermarket: supermarketId,
    })
  }

  this.calculerTotal()
}

// Méthode pour retirer un produit
cartSchema.methods.retirerProduit = function (produitId) {
  this.produits = this.produits.filter(
    (item) => item.produit.toString() !== produitId.toString()
  )
  this.calculerTotal()
}

// Méthode pour vider le panier
cartSchema.methods.viderPanier = function () {
  this.produits = []
  this.calculerTotal()
}

export default mongoose.model('Cart', cartSchema)
