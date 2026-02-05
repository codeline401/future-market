export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">À propos</h3>
            <p className="text-gray-400">Marketplace pour supermarchés</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Aide</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Légal</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>by codeline401 &copy; 2026 Future Market. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
