import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header 
      className="w-full bg-white flex flex-col sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] select-none border-b border-gray-100"
      style={{ fontFamily: "mr-eaves-xl-modern, sans-serif" }}
    >
      
      {/* 1. Main Navigation Row */}
      <div className="w-full h-[70px] px-4 md:px-6 flex items-center justify-between max-w-[1440px] mx-auto gap-4 lg:gap-6">
        
        {/* Logo Section */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <img 
            src="/jio mart.png" 
            alt="JioMart Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="text-[20px] font-black text-[#000000] tracking-tight hidden md:block">
            JioMart
          </span>
        </div>

        {/* Quick / Shop All Toggle */}
        <div className="hidden xl:flex items-center bg-[#f0f4f9] rounded-full p-1 shrink-0">
          <button className="flex items-center gap-1 px-3 py-1 text-[13px] font-extrabold italic text-[#141414] hover:text-[#000000] transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h7v8l11-12h-8l4-8z" />
            </svg>
            Quick
          </button>
          <button className="bg-[#0078ad] text-white px-4 py-1 rounded-full text-[13px] font-bold shadow-sm cursor-pointer">
            Shop all
          </button>
        </div>

        {/* Location Widget */}
        <div className="hidden lg:flex items-center gap-2 cursor-pointer group shrink-0 min-w-[160px]">
          <div className="w-8 h-8 rounded-full bg-[#e5f1f7] flex items-center justify-center group-hover:bg-[#d1e9f5] transition-colors">
            <svg className="w-4 h-4 text-[#0078ad]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 21c-5-5-8-9.5-8-13.5a8 8 0 1116 0c0 4-3 8.5-8 13.5z" />
              <circle cx="12" cy="7.5" r="2.5" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[13px] font-bold text-[#000000] leading-none mb-0.5">
              Location
              <svg className="w-3 h-3 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <span className="text-[11px] font-medium text-[#141414]/70 leading-none truncate max-w-[160px]">
              Sagara, Karnataka, 577401, ...
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-[480px] h-9 bg-[#f0f4f9] rounded-full flex items-center px-4 border border-transparent focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,120,173,0.05)] transition-all">
          <svg className="w-4 h-4 text-[#141414] mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search for 'Electronics'" 
            className="w-full h-full bg-transparent text-[13px] font-medium text-[#000000] outline-none placeholder-[#141414]/60"
          />
        </div>

        {/* Right Icon Actions Group */}
        <div className="flex items-center gap-4 shrink-0 pl-2">
          
          {/* Offers (%) */}
          <button className="w-[30px] h-[30px] rounded-full bg-[#141414] hover:bg-[#000000] text-white flex items-center justify-center transition-colors cursor-pointer">
            <span className="font-bold text-[15px] leading-none mb-[1px]">%</span>
          </button>

          {/* Wishlist */}
          <button className="w-[30px] h-[30px] text-[#141414] hover:text-[#000000] transition-colors cursor-pointer flex items-center justify-center">
             <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
               <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z"/>
               <path fill="#ffffff" d="M12 16.5l-4.5-4.5c-1.2-1.2-1.2-3.1 0-4.2s3.1-1.2 4.2 0l.3.3.3-.3c1.2-1.2 3.1-1.2 4.2 0s1.2 3.1 0 4.2L12 16.5z"/>
             </svg>
          </button>

          {/* Shopping Cart */}
         <button
  onClick={() => navigate("/cart")}
  className="w-[30px] h-[30px] text-[#141414] hover:text-[#000000] transition-colors relative cursor-pointer flex items-center justify-center"
>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-[#e80018] text-white text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 border-white">
              0
            </span>
          </button>

          {/* User Profile */}
          <button 
            onClick={token ? handleLogout : () => navigate("/login")}
            className="w-[30px] h-[30px] text-[#141414] hover:text-[#000000] transition-colors cursor-pointer flex items-center justify-center"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </button>

        </div>
      </div>

      {/* 2. Sub-Navigation Category Row */}
      <div className="w-full bg-white border-t border-gray-100 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 pl-[52px] flex items-end overflow-x-auto scrollbar-none h-[40px]">
          
          {/* Smart Buys Tab */}
          <button className="bg-[#0078ad] text-white flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-bold text-[14px] shrink-0 cursor-pointer h-[34px]">
            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Smart Buys
          </button>

          {/* Links Group */}
          <div className="flex items-center gap-5 px-5 pb-1.5 shrink-0">
            {[
              { name: "Explore All", icon: "M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z" },
              { name: "Electronics", icon: "M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" },
              { name: "Home", icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" },
              { name: "Daily Needs", icon: "M21.11 9H17V6c0-1.66-1.34-3-3-3S11 4.34 11 6v3H6.89l-1 5h14.22l-1-5zm-7.11 0h-4V6c0-.55.45-1 1-1s1 .45 1 1v3zm-4 7v3c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-3h-6z" },
              { name: "Fashion", icon: "M17 5.5V3c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v2.5L5 9v3h2.2l.6 9h8.4l.6-9H19V9l-2-3.5z" }, 
              { name: "Groceries", icon: "M17.21 9l-4.38-6.56a1 1 0 00-1.66 1.12L14.6 9H9.4L12.83 3.56a1 1 0 10-1.66-1.12L6.79 9H2v2h1.61l1.52 8.35A2 2 0 007.1 21h9.8a2 2 0 001.97-1.65L20.39 11H22V9h-4.79zM9 17H7v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4z" } 
            ].map((cat, idx) => (
              <button 
                key={idx} 
                className="flex items-center gap-1.5 text-[14px] font-bold text-[#141414] hover:text-[#000000] transition-colors cursor-pointer"
              >
                <svg className="w-[16px] h-[16px] text-[#141414]" fill="currentColor" viewBox="0 0 24 24">
                  <path d={cat.icon} />
                </svg>
                {cat.name}
              </button>
            ))}
          </div>

          {/* All Categories Dropdown */}
          <div className="ml-auto flex items-center gap-1 text-[14px] font-bold text-[#141414] cursor-pointer hover:text-[#000000] pb-1.5 shrink-0">
            All Categories 
            <svg className="w-3.5 h-3.5 mt-0.5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;