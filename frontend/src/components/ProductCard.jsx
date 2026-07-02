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
    <div className="min-w-[160px] md:min-w-[210px] w-[160px] md:w-[210px] bg-white rounded-xl p-3 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200 cursor-pointer flex flex-col shrink-0 border border-transparent hover:border-gray-100 group">
      
      {/* Product Image Area - Light grey background like original */}
      <div className="relative w-full h-44 bg-[#f9f9f9] rounded-lg cursor-pointer overflow-hidden">
        
        {/* Heart Icon - Top Left */}
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
          <svg className="w-5 h-5" fill={wishlisted ? "red" : "#d1d5db"} viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        {/* The JioMart "Add" Button - Top Right */}
        {cartItem ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 flex items-center h-7 bg-white border border-[#0078ad] rounded-lg shadow-2xs overflow-hidden z-10"
          >
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                await axios.put(
                  "http://localhost:5000/api/cart/update",
                  {
                    productId: product._id,
                    quantity: cartItem.quantity - 1,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                await fetchCart();
              }}
              className="px-2.5 h-full text-[#0078ad] font-bold hover:bg-[#e5f1f7]/30 transition-colors cursor-pointer"
            >
              -
            </button>

            <span className="px-1 text-xs font-bold text-gray-900 select-none">
              {cartItem.quantity}
            </span>

            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                await axios.put(
                  "http://localhost:5000/api/cart/update",
                  {
                    productId: product._id,
                    quantity: cartItem.quantity + 1,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                await fetchCart();
              }}
              className="px-2.5 h-full text-[#0078ad] font-bold hover:bg-[#e5f1f7]/30 transition-colors cursor-pointer"
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
            }}
            className="absolute top-2 right-2 h-7 bg-white text-[#0078ad] border border-[#0078ad] text-[11px] font-bold px-3 rounded-lg shadow-2xs hover:bg-[#e5f1f7]/20 transition-colors z-10 cursor-pointer"
          >
            Add
          </button>
        )}

        {/* Product Imagery Frame Wrapper */}
        <div 
          onClick={() => navigate(`/product/${product._id}`)}
          className="flex items-center justify-center h-full w-full p-4"
        >
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-102 transition-transform duration-300 ease-out"
          />
        </div>
      </div>

      {/* Details Meta Presentation Container Block */}
      <div className="flex flex-col flex-grow mt-2 text-left font-sans antialiased">
        {/* Centered Pack Info */}
        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
          1 Pack
        </div>
        
        {/* Title */}
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="cursor-pointer text-[13px] font-medium text-gray-800 leading-snug line-clamp-2 h-[36px] mb-2 hover:text-[#0078ad] transition-colors"
        >
          {product.brand ? <span className="font-bold text-gray-900">{product.brand} </span> : ""}
          {product.title}
        </h3>

        {/* Pricing Rows Grid */}
        <div className="mt-auto flex items-baseline gap-1.5 select-none">
          <span className="text-[15px] font-bold text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-[11px] text-gray-400 font-medium line-through decoration-gray-300">
            ₹{originalMrp}
          </span>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;