// src/products.jsx
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import { useAuth } from './AuthContext';
import OrderForm from './OrderForm';

export default function Products() {
  const { currentUser, openLoginModal } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const productList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        const activeProducts = productList.filter((product) => product.status === "active");
        setProducts(activeProducts);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleBuyNowClick = (product) => {
    if (currentUser) {
      // If user is logged in, show the order form
      setSelectedProduct(product);
      setShowOrderForm(true);
    } else {
      // If user is not logged in, show the login modal
      openLoginModal();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-pulse bg-gray-300 h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden group ${product.stockout ? "grayscale" : ""}`}>
            <div className="relative overflow-hidden">
              <img src={product.image} alt={product.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" />
              {product.stockout && (<span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Stock Out</span>)}
            </div>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h2>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-indigo-600">₹{product.price}</p>
                <button
                  onClick={() => handleBuyNowClick(product)}
                  className={`bg-indigo-600 text-white px-4 py-2 rounded-lg transition-transform duration-300 ${product.stockout ? "bg-gray-400 cursor-not-allowed opacity-75" : "hover:bg-indigo-700 hover:scale-105 focus:scale-105"}`}
                  disabled={product.stockout}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showOrderForm && selectedProduct && (
        <OrderForm 
          product={selectedProduct} 
          closeModal={() => setShowOrderForm(false)} 
        />
      )}
    </>
  );
}