import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Bienvenue sur Future Market</h2>
        <p className="text-xl text-gray-600">
          Trouvez tous vos produits de supermarché en un seul endroit
        </p>
      </section>

      {/* Barre de recherche */}
      <section className="mb-16">
        <form
          onSubmit={handleSearch}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Rechercher des produits ou des supermarchés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              🔍 Rechercher
            </button>
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-4xl mb-4">🏪</div>
          <h3 className="text-xl font-bold mb-2">Supermarchés</h3>
          <p className="text-gray-600">
            Parcourez tous les supermarchés partenaires
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2">Produits</h3>
          <p className="text-gray-600">Accédez à des milliers de produits</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="text-xl font-bold mb-2">Livraison</h3>
          <p className="text-gray-600">Livraison rapide à votre domicile</p>
        </div>
      </section>
    </div>
  );
}
