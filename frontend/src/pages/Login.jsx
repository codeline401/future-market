import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [motdepasse, setMotdepasse] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        motdepasse,
      })

      // Sauvegarder le token
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.utilisateur))

      // Rediriger vers l'accueil
      navigate('/')
    } catch (error) {
      setErreur(error.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Se Connecter</h1>

        {erreur && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Mot de passe</label>
            <input
              type="password"
              value={motdepasse}
              onChange={(e) => setMotdepasse(e.target.value)}
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
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        <p className="text-center mt-6">
          Pas encore de compte ?{' '}
          <a href="/register" className="text-primary font-bold hover:underline">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  )
}
