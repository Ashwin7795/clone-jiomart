import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch live cart status from backend database
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data.items || []);
      // Sum total quantities for the navbar indicator bubble
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
    <CartContext.Provider value={{ cartCount, cartItems, fetchCart, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);