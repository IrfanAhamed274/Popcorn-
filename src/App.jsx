// src/App.jsx
import Products from "./products"; 
import BannerSlider from "./banners";
import { AuthProvider } from './Auth';
import { useAuth } from './AuthContext';

function AuthDisplay() {
  const { currentUser, openLoginModal, logout } = useAuth();

  if (currentUser) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:inline">{currentUser.email}</span>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600">
          Logout
        </button>
      </div>
    );
  }

  return (
    <button onClick={openLoginModal} className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700">
      Login / Sign Up
    </button>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col scroll-smooth">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
            🍿 Product World
          </h1>
          <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-indigo-600 transition">Home</a>
            <a href="#products" className="hover:text-indigo-600 transition">Products</a>
            <a href="#contact" className="hover:text-indigo-600 transition">Contact</a>
          </nav>
          <AuthDisplay />
        </div>
      </header>
      
      <BannerSlider />

      <main id="products" className="flex-grow max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold mb-10 text-gray-800 text-center">Our Products</h3>
        <Products />
      </main>

      <section id="contact" className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-6 text-center">
        <h3 className="text-3xl font-bold mb-6">Get in Touch</h3>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">Have questions? Reach out and we’ll get back to you.</p>
        <a href="mailto:info@productshowcase.com" className="bg-amber-100 hover:bg-amber-200 transition px-8 py-3 rounded-full font-semibold shadow-lg text-black">
          Email Us
        </a>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Product Showcase. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;