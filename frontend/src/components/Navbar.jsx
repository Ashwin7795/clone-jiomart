import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Bring in live cart state hook

function Navbar({ hideSubNav }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const { cartCount } = useCart();
  const location = useLocation();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [cartCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const categoryMap = {
    "Explore All": "",
    "Electronics": "Electronics",
    "Home": "Home & Lifestyle",
    "Fashion": "Fashion",
    "Groceries": "Groceries",
  };

  // Live URL Search Parameter Sniffer for Dynamic Active Tabs
  const currentParams = new URLSearchParams(location.search);
  const activeCategoryParam = currentParams.get("category") || "";

  return (
    <header 
      className="w-full bg-white flex flex-col sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] select-none border-b border-gray-100 font-sans"
    >
      {/* 1. Main Navigation Row Layout Grid */}
      <div className="w-full h-[72px] px-4 md:px-6 flex items-center justify-between max-w-[1170px] mx-auto gap-4 lg:gap-6">
        
        {/* Logo Section */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <img 
            src="/jio mart.png" 
            alt="JioMart Logo" 
            className="w-9 h-9 object-contain"
          />
          <span className="text-[22px] font-black text-black tracking-tight hidden md:block">
            JioMart
          </span>
        </div>

        {/* Quick / Shop All Toggle - CONDITIONALLY HIDDEN ON CART PAGE */}
        {!hideSubNav && (
          <div className="hidden xl:flex items-center bg-[#f0f4f9] rounded-full p-1 shrink-0 border border-gray-100/40">
            <button className="flex items-center gap-1.5 px-3.5 py-1 text-[12px] font-black italic text-gray-700 hover:text-black transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5 text-[#0078ad]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l11-12h-8l4-8z" />
              </svg>
              Quick
            </button>
            <button className="bg-[#0078ad] text-white px-4 py-1 rounded-full text-[12px] font-black shadow-2xs cursor-pointer hover:bg-[#0c5273] transition-colors">
              Shop all
            </button>
          </div>
        )}

        {/* Location Widget */}
        <div className="hidden lg:flex items-center gap-2.5 cursor-pointer group shrink-0 min-w-[170px] text-left">
          <div className="w-9 h-9 rounded-full bg-[#e5f1f7] flex items-center justify-center group-hover:bg-[#d1e9f5] transition-colors shrink-0">
            <svg className="w-4 h-4 text-[#0078ad] stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-5-5-8-9.5-8-13.5a8 8 0 1116 0c0 4-3 8.5-8 13.5z" />
              <circle cx="12" cy="7.5" r="2.5" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 text-[13px] font-black text-black leading-none mb-1">
              Deliver to
              <svg className="w-3 h-3 text-[#0078ad] stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <span className="text-[11px] font-bold text-gray-400 leading-none truncate max-w-[130px]">
              Sagara, 577401
            </span>
          </div>
        </div>

        {/* Dynamic Search Box Input Field Frame Container */}
        <div className="flex-1 max-w-[440px] h-10 bg-[#f0f4f9] rounded-full flex items-center px-4 border border-transparent focus-within:border-gray-200 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,120,173,0.04)] transition-all">
          <svg
            className="w-4 h-4 text-gray-400 mr-2.5 shrink-0 stroke-[2.5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search essentials, electronics and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?search=${encodeURIComponent(search)}`);
              }
            }}
            className="w-full h-full bg-transparent text-[13px] font-semibold text-gray-900 outline-none placeholder-gray-400"
          />
        </div>

        {/* Right Icon Actions Group */}
        <div className="flex items-center gap-3.5 shrink-0 pl-2">
          
          {/* Offers (%) */}
          <button className="w-9 h-9 rounded-full bg-gray-900 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs">
            <span className="font-extrabold text-[14px] leading-none mb-[0.5px]">%</span>
          </button>

          {/* Wishlist Header Icon Basket */}
          {user?.role !== "admin" && (
            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="w-9 h-9 text-gray-700 hover:text-black hover:bg-gray-50 rounded-full transition-all cursor-pointer flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z"/>
                <path fill="#ffffff" d="M12 16.5l-4.5-4.5c-1.2-1.2-1.2-3.1 0-4.2s3.1-1.2 4.2 0l.3.3.3-.3c1.2-1.2 3.1-1.2 4.2 0s1.2 3.1 0 4.2L12 16.5z"/>
              </svg>
            </button>
          )}

          {/* Cart Counter Trigger Badge Box */}
          {user?.role !== "admin" && (
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="w-9 h-9 text-gray-700 hover:text-black hover:bg-gray-50 rounded-full transition-all relative cursor-pointer flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span className="absolute top-1 right-1 bg-[#e80018] text-white text-[9px] font-black w-[16px] h-[16px] rounded-full flex items-center justify-center border border-white shadow-2xs">
                {cartCount}
              </span>
            </button>
          )}

          {/* User Profile Navigation Overlay Box Block */}
          <div className="relative">
            {!token ? (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-9 h-9 text-gray-700 hover:text-black hover:bg-gray-50 rounded-full transition-all cursor-pointer flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <span className="text-[12px] font-extrabold text-gray-800 max-w-[80px] truncate">
                    {user?.name}
                  </span>
                  <svg className={`w-3 h-3 text-gray-500 transition-transform stroke-[2.5] ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2.5 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] z-50 overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-gray-50 text-left bg-gray-50/50">
                      <p className="font-bold text-sm text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        Account {user?.role}
                      </p>
                    </div>

                    {user?.role === "admin" && (
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/admin");
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    {user?.role !== "admin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/my-orders");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer"
                      >
                        My Orders
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      {/* 2. Sub-Navigation Category Row - COMPLETELY HIDDEN ON CART PAGE */}
      {!hideSubNav && (
        <div className="w-full bg-white border-t border-gray-100 hidden md:block">
          <div className="max-w-[1170px] w-full mx-auto flex items-end overflow-x-auto scrollbar-none h-11">
            
            {/* Links Dynamic Maps Categories Group Array */}
            <div className="flex items-center h-9 shrink-0">
              {[
                { name: "Explore All", icon: "M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z" },
                { name: "Groceries", icon: "M17.21 9l-4.38-6.56a1 1 0 00-1.66 1.12L14.6 9H9.4L12.83 3.56a1 1 0 10-1.66-1.12L6.79 9H2v2h1.61l1.52 8.35A2 2 0 007.1 21h9.8a2 2 0 001.97-1.65L20.39 11H22V9h-4.79zM9 17H7v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4z" },
                { name: "Electronics", icon: "M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" },
                { name: "Home", icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" },
                { name: "Fashion", icon: "M17 5.5V3c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v2.5L5 9v3h2.2l.6 9h8.4l.6-9H19V9l-2-3.5z" }
              ].map((cat, idx) => {
                const targetCategoryValue = categoryMap[cat.name];
                
                // Determine active tab match layout context rules
                const isTabActive = activeCategoryParam === targetCategoryValue && 
                  (targetCategoryValue !== "" || (!search && activeCategoryParam === ""));

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (targetCategoryValue) {
                        navigate(`/?category=${encodeURIComponent(targetCategoryValue)}`);
                      } else {
                        navigate("/");
                      }
                    }}
                    className={`flex items-center gap-1.5 px-5 rounded-t-xl font-black text-[13px] h-9 transition-all cursor-pointer ${
                      isTabActive
                        ? "bg-[#0078ad] text-white shadow-sm"
                        : "bg-transparent text-gray-600 hover:text-black"
                    }`}
                  >
                    <svg className={`w-3.5 h-3.5 ${isTabActive ? "text-white" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d={cat.icon} />
                    </svg>
                    {cat.name}
                  </button>
                );
              })}
            </div>

         

          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;