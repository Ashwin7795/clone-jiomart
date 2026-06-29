import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const originalMrp = Math.round(product.price * 1.25);
  const [wishlisted, setWishlisted] = useState(false);
  const { fetchCart } = useCart();

const token = localStorage.getItem("token");
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
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      className="min-w-[160px] md:min-w-[210px] w-[160px] md:w-[210px] bg-white rounded-xl p-3 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200 cursor-pointer flex flex-col shrink-0 border border-transparent hover:border-gray-100 group"
    >
      {/* Product Image Area - Light grey background like original */}
      <div className="w-full aspect-square bg-[#f9f9f9] rounded-lg flex items-center justify-center p-4 relative mb-2">
        
        {/* Heart Icon - Top Left */}
       <button
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
          {
            productId: product._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlisted(true);
      } else {
        await axios.delete(
          `http://localhost:5000/api/wishlist/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlisted(false);
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  }}
  className="absolute top-2 left-2 z-10"
>
          <svg className="w-5 h-5"fill={wishlisted ? "red" : "#d1d5db"} viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        {/* The JioMart "Add" Button - Top Right */}
        <button 
        onClick={async (e) => {
  e.stopPropagation();

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

  await axios.post(
  "http://localhost:5000/api/cart/add",
      {
        productId: product._id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
await fetchCart();
   
  }catch (error) {
  console.log(error.response?.data);
  console.log(error);

  alert(
    error.response?.data?.message ||
    "Failed to add to cart"
  );
}
}}
          className="absolute top-2 right-2 bg-white text-[#0078ad] border border-[#0078ad] text-[11px] font-bold px-3 py-0.5 rounded shadow-sm hover:bg-[#e5f1f7] transition-colors z-10"
        >
          Add
        </button>

        <img 
          src={product.images?.[0]} 
          alt={product.title} 
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"}
        />
      </div>

      {/* Typography & Details */}
      <div className="flex flex-col flex-grow mt-1 px-1">
        {/* Centered Pack Info */}
        <div className="text-[11px] text-gray-500 font-medium text-center mb-1.5">
          1 Pack
        </div>
        
        {/* Title - Reduced font size */}
        <h3 className="text-[13px] font-medium text-gray-800 leading-[1.3] line-clamp-2 h-[34px] mb-2">
          {product.brand ? `${product.brand} ` : ''}{product.title}
        </h3>

        {/* Pricing */}
        <div className="mt-auto flex items-center gap-1.5">
          <span className="text-[15px] font-black text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-[12px] text-gray-400 line-through decoration-gray-400">
            ₹{originalMrp}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;