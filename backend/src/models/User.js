import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
    },
    motdepasse: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: 6,
      select: false, // N'afficher le mot de passe que si demandé explicitement
    },
    telephone: {
      type: String,
      trim: true,
    },
    adresse: {
      rue: String,
      ville: String,
      codepostal: String,
      pays: String,
    },
    role: {
      type: String,
      enum: ['client', 'admin', 'vendeur'],
      default: 'client',
    },
    actif: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Hash le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('motdepasse')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.motdepasse = await bcrypt.hash(this.motdepasse, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Méthode pour comparer les mots de passe
userSchema.methods.comparerMotdepasse = async function (motdepasseEntree) {
  return await bcrypt.compare(motdepasseEntree, this.motdepasse)
}

// Méthode pour masquer les infos sensibles
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.motdepasse
  return obj
}

export default mongoose.model('User', userSchema)
