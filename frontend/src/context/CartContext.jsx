import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null); 
  const token = localStorage.getItem("token");

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data.items || []);
      const totalQuantity = (res.data.items || []).reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity);
    } catch (err) {
      console.error("Error fetching cart layer details:", err);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleStorage = () => {
      fetchCart();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [token]);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, fetchCart, setCartCount, triggerToast }}>
      {children}

      {/* GLOBAL TOAST LAYER - SCALED UP BY 10% */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in-down pointer-events-none select-none w-max max-w-[90vw]">
          <div className="px-4.5 py-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] font-sans text-[14.5px] font-bold tracking-tight text-white flex items-center gap-2.5 bg-gray-900/95 backdrop-blur-xs border border-gray-800">
            {toast.type === "error" ? (
              <span className="text-red-400 text-lg leading-none">⚠️</span>
            ) : (
              <span className="text-emerald-400 text-lg leading-none">✓</span>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);