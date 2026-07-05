import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const originalMrp = Math.round(product.price * 1.25);
  const [wishlisted, setWishlisted] = useState(false);
  const { fetchCart, cartItems } = useCart();

  const token = localStorage.getItem("token");
  const cartItem = cartItems.find(
    (item) => item.productId._id === product._id
  );

  useEffect(() => {
    if (token) {
      checkWishlist();
    }
  }, []);

  const checkWishlist = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const exists = response.data.some(
        (item) => item.productId._id === product._id
      );

      setWishlisted(exists);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[150px] sm:w-[192px] bg-white rounded-2xl p-2.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer flex flex-col shrink-0 border border-gray-100/60 relative group select-none">
      
      {/* Product Imagery & Overlay Utilities Frame */}
      <div className="relative w-full h-[150px] sm:h-[185px] bg-[#f5f5f5] rounded-xl overflow-hidden flex items-center justify-center">
        
        {/* Heart Icon Toggle Utility - Top Left */}
        <button
          type="button"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              if (!token) {
                alert("Please login first");
                return;
              }

              if (!wishlisted) {
                await axios.post(
                  "http://localhost:5000/api/wishlist",
                  { productId: product._id },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setWishlisted(true);
              } else {
                await axios.delete(
                  `http://localhost:5000/api/wishlist/${product._id}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setWishlisted(false);
              }
            } catch (error) {
              console.log(error.response?.data);
            }
          }}
          className="absolute top-2 left-2 z-10 w-7 h-7 bg-white/80 backdrop-blur-xs rounded-full flex items-center justify-center border border-gray-100 hover:bg-white transition-colors cursor-pointer outline-none shadow-3xs"
        >
          <svg className="w-3.5 h-3.5 transition-transform active:scale-90" fill={wishlisted ? "#ef4444" : "none"} stroke={wishlisted ? "#ef4444" : "#71717a"} strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        {/* Action Toggle Add Triggers - Top Right */}
        <div className="absolute top-2 right-2 z-10">
          {cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center h-[26px] bg-white border border-[#0078ad] rounded-md shadow-3xs overflow-hidden"
            >
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  await axios.put(
                    "http://localhost:5000/api/cart/update",
                    { productId: product._id, quantity: cartItem.quantity - 1 },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  await fetchCart();
                }}
                className="px-2 h-full text-[#0078ad] font-black text-xs hover:bg-blue-50/50 transition-colors cursor-pointer border-none outline-none"
              >
                -
              </button>
              <span className="px-1 text-[11px] font-black text-gray-900 select-none min-w-[12px] text-center">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  await axios.put(
                    "http://localhost:5000/api/cart/update",
                    { productId: product._id, quantity: cartItem.quantity + 1 },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  await fetchCart();
                }}
                className="px-2 h-full text-[#0078ad] font-black text-xs hover:bg-blue-50/50 transition-colors cursor-pointer border-none outline-none"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                if (!token) {
                  alert("Please login first");
                  return;
                }
                await axios.post(
                  "http://localhost:5000/api/cart/add",
                  { productId: product._id, quantity: 1 },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                await fetchCart();
              }}
              className="h-[26px] bg-white text-[#0078ad] border border-gray-200 hover:border-[#0078ad] text-[11px] font-bold px-2.5 rounded-md shadow-3xs transition-all cursor-pointer outline-none active:scale-[0.97]"
            >
              Add
            </button>
          )}
        </div>

        {/* Native E-Commerce Veg Green Square Dot Emblem Tag - Bottom Right */}
        <div className="absolute bottom-2 right-2 z-10 w-3.5 h-3.5 bg-white border border-gray-200 rounded-xs flex items-center justify-center pointer-events-none p-0.5 shadow-3xs">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        </div>

        {/* Image Mount Canvas Container */}
        <div 
          onClick={() => navigate(`/product/${product._id}`)}
          className="w-full h-full p-3.5 flex items-center justify-center mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-[1.015]"
        >
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="max-w-full max-h-full object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* Details Meta Presentation Container Block */}
      <div className="flex flex-col flex-grow mt-2 text-left font-sans antialiased px-0.5">
        <span className="text-[11px] text-gray-400 font-medium tracking-normal mb-0.5">
          1 Pack
        </span>
        
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="text-[12px] sm:text-[13px] font-normal text-gray-700 leading-snug line-clamp-2 h-[36px] tracking-tight mb-1.5 group-hover:text-[#0078ad] transition-colors"
        >
          {product.brand && <span className="font-bold text-gray-900 pr-0.5">{product.brand}</span>}
          {product.title}
        </h3>

        {/* Price Tracking Layout Matrix */}
        <div className="mt-auto flex items-baseline gap-1.5">
          <span className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 tracking-tight">
            ₹{product.price}
          </span>
          <span className="text-[10px] sm:text-[11px] text-gray-400 font-normal line-through tracking-tight decoration-gray-300/80">
            ₹{originalMrp}
          </span>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;