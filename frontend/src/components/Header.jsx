import { useState, useEffect } from "react";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🛒 Future Market</h1>
          <nav className="flex gap-6 items-center">
            <a href="/" className="hover:opacity-80">
              Accueil
            </a>
            <a href="/products" className="hover:opacity-80">
              Produits
            </a>
            <a href="/supermarkets" className="hover:opacity-80">
              Supermarchés
            </a>
            <a href="/cart" className="hover:opacity-80">
              Panier
            </a>
            {user ? (
              <div className="flex gap-4 items-center">
                <span>{user.prenom}</span>
                {user.role === "vendeur" && (
                  <a
                    href="/vendeur/dashboard"
                    className="hover:opacity-80 bg-secondary text-gray-900 px-3 py-1 rounded"
                  >
                    Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:opacity-80 bg-red-600 px-3 py-1 rounded"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <a href="/login" className="hover:opacity-80">
                  Connexion
                </a>
                <a
                  href="/register"
                  className="hover:opacity-80 bg-secondary text-gray-900 px-3 py-1 rounded"
                >
                  S'inscrire
                </a>
                <a
                  href="/register-vendor"
                  className="hover:opacity-80 bg-yellow-500 text-gray-900 px-3 py-1 rounded"
                >
                  Vendre
                </a>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
