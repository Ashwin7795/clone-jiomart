import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductRow from "../components/ProductRow";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  // Organize data into logical rows for the JioMart layout
  const groceries = products.filter(p => p.category === "Groceries");
  const electronics = products.filter(p => p.category === "Electronics");
  const beauty = products.filter(p => p.category === "Beauty & Personal Care");
  const homeAndLifestyle = products.filter(p => p.category === "Home & Lifestyle");

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-sans antialiased overflow-x-hidden">
      <Navbar />

      <main className="w-full pb-10">
        
        {/* Full-Width Promotional Hero Banner mimicking the Monsoon Sale */}
        <div className="w-full bg-[#d0eef7] pt-6 pb-8 md:pt-10 md:pb-12 px-4 flex justify-center border-b border-gray-200">
          <div className="max-w-[1280px] w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black text-[#005f8f] leading-tight tracking-tight">
                Baarish ka Season <br/>
                <span className="text-[#008cc9]">Shopping ka Reason</span>
              </h1>
              <p className="mt-3 text-[#005f8f] font-bold text-sm md:text-base">
                Get your daily essentials delivered to Sagara instantly!
              </p>
            </div>
            
            {/* Promo Banner Visual Elements */}
            <div className="flex gap-4 overflow-x-auto w-full md:w-auto scrollbar-none snap-x">
              {[
                { title: "Monsoon Needs", tag: "Up to 60% off", img: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=200" },
                { title: "Smart Munching", tag: "From ₹99", img: "https://images.unsplash.com/photo-1621852004158-f3bc188aec27?w=200" },
                { title: "It's Tea Time", tag: "From ₹149", img: "https://images.unsplash.com/photo-1594631252845-29fc4cc8c786?w=200" }
              ].map((promo, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3 w-[140px] shrink-0 shadow-sm flex flex-col items-center snap-center cursor-pointer border border-[#bce2f0]">
                  <h4 className="text-xs font-bold text-center text-gray-800 mb-2 h-8">{promo.title}</h4>
                  <img src={promo.img} alt={promo.title} className="w-16 h-16 object-cover rounded-md mb-2 mix-blend-multiply" />
                  <span className="bg-[#008cc9] text-white text-[10px] font-bold px-2 py-1 rounded w-full text-center">{promo.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Category Rows based on your Seed Data */}
        <div className="w-full flex flex-col gap-2 bg-[#f3f4f6]">
          <ProductRow title="Most Loved Groceries" products={groceries} />
          <ProductRow title="Monsoon Needs for Home" products={homeAndLifestyle} />
          
          {/* Mid-Page Banner Placement */}
          <div className="max-w-[1280px] mx-auto px-4 w-full py-4 hidden md:block">
            <div className="w-full bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl h-[120px] flex items-center px-8 shadow-sm cursor-pointer">
              <div className="text-white">
                <h3 className="text-2xl font-black italic">TECH CLEARANCE</h3>
                <p className="text-sm font-medium opacity-90">Up to 40% off on premium smartphones & audio.</p>
              </div>
            </div>
          </div>

          <ProductRow title="Top Electronics & Audio" products={electronics} />
          <ProductRow title="Beauty & Personal Care" products={beauty} />
        </div>

      </main>
    </div>
  );
}

export default Home;