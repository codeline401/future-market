import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Supermarkets from "./pages/Supermarkets";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterVendor from "./pages/RegisterVendor";
import VendeurDashboard from "./pages/VendeurDashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/supermarkets" element={<Supermarkets />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-vendor" element={<RegisterVendor />} />
            <Route path="/vendeur/dashboard" element={<VendeurDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
