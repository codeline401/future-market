import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    numerCommande: {
      type: String,
      unique: true,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
        },
        prixUnitaire: {
          type: Number,
          required: true,
        },
        sousTotal: {
          type: Number,
          required: true,
        },
      },
    ],
    supermarket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supermarket',
      required: true,
    },
    adresseLivraison: {
      rue: String,
      ville: String,
      codepostal: String,
      pays: String,
      telephone: String,
    },
    sousTotal: {
      type: Number,
      required: true,
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
      required: true,
      default: 0,
    },
    statut: {
      type: String,
      enum: ['en attente', 'confirmée', 'en preparation', 'expediee', 'livree', 'annulee'],
      default: 'en attente',
    },
    modePaiement: {
      type: String,
      enum: ['carte', 'virement', 'paypal', 'especes'],
      required: true,
    },
    notePaiement: {
      type: String,
      enum: ['non paye', 'en attente', 'paye'],
      default: 'non paye',
    },
    dateExpedition: Date,
    dateLivraison: Date,
    notesClient: String,
    notesAdmin: String,
  },
  { timestamps: true }
)

// Générer un numéro de commande unique
orderSchema.pre('save', async function (next) {
  if (!this.numerCommande) {
    const count = await mongoose.model('Order').countDocuments()
    this.numerCommande = `CMD-${Date.now()}-${count + 1}`
  }
  next()
})

export default mongoose.model('Order', orderSchema)
