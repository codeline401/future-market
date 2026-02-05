import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motdepasse: '',
    motdepasseConfirm: '',
    telephone: '',
  })
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    // Validation
    if (formData.motdepasse !== formData.motdepasseConfirm) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.motdepasse.length < 6) {
      setErreur('Le mot de passe doit faire au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/register', {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        motdepasse: formData.motdepasse,
        telephone: formData.telephone,
      })

      // Sauvegarder le token
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.utilisateur))

      // Rediriger vers l'accueil
      navigate('/')
    } catch (error) {
      setErreur(error.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">S'Inscrire</h1>

        {erreur && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Dupont"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Jean"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Mot de passe</label>
            <input
              type="password"
              name="motdepasse"
              value={formData.motdepasse}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              name="motdepasseConfirm"
              value={formData.motdepasseConfirm}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50"
          >
            {loading ? 'Inscription en cours...' : 'S\'Inscrire'}
          </button>
        </form>

        <p className="text-center mt-6">
          Déjà inscrit ?{' '}
          <a href="/login" className="text-primary font-bold hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  )
}
