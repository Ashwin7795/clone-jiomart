import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!token) {
    return (
      <div className="w-full bg-[#f3f4f6] min-h-screen flex flex-col items-center justify-center font-sans text-center px-4">
        <h2 className="text-xl font-bold text-gray-800">Please log in to view your wishlist</h2>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-[#0078ad] hover:bg-[#00628f] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      {/* 1170px container grid balances card sizes across high-density desktop windows */}
      <div className="max-w-[1170px] mx-auto px-6">
        
        <h1 className="text-[26px] font-bold text-gray-900 mb-8 tracking-tight">
          My Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
        </h1>

        {wishlist.length === 0 ? (
          /* High-Fidelity Clean Fallback Panel Box */
          <div className="w-full bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs max-w-[520px] mx-auto mt-12">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4 text-2xl">
              ♥
            </div>
            <h2 className="text-[18px] font-bold text-black tracking-tight">Your wishlist is empty</h2>
            <p className="text-gray-500 text-[13px] font-medium mt-1.5 max-w-xs mx-auto leading-relaxed">
              Save items that you like here to track price adjustments and easily move them onto your cart layout box later.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-[#0078ad] hover:bg-[#00628f] text-white font-bold text-[14px] px-8 py-3 rounded-full transition-colors shadow-2xs active:scale-[0.99] transition-transform cursor-pointer"
            >
              Discover Products
            </button>
          </div>
        ) : (
          /* Multi-column Grid Viewport aligning perfectly with individual ProductCard spacing states */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {wishlist.map((item) => {
              if (!item || !item.productId) return null;
              return (
                <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-xs border border-gray-50 hover:shadow-md transition-shadow">
                  <ProductCard product={item.productId} />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;