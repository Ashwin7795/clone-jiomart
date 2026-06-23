import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductRow from "../components/ProductRow";

function Home() {
  const [products, setProducts] = useState([]);
  
  // Reference for the Monsoon Banner Scroll Container
  const bannerScrollRef = useRef(null);

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

  // Filtering products by your database categories
  const groceries = products.filter(p => p.category === "Groceries");
  const electronics = products.filter(p => p.category === "Electronics");
  const beauty = products.filter(p => p.category === "Beauty & Personal Care");
  const homeAndLifestyle = products.filter(p => p.category === "Home & Lifestyle");

  // ONLINE IMAGES: Wired up using 100% reliable links from your active database CDN
  const promoCards = [
    { title: "Rain Ready Styles", tag: "From ₹149", img: "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp" },
    { title: "Monsoon Wash Deals", tag: "From ₹6,780", img: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp" },
    { title: "Healthy Picks", tag: "Upto 60% off", img: "https://cdn.dummyjson.com/product-images/groceries/apple/1.webp" },
    { title: "It's Tea Time", tag: "Upto 70% off", img: "https://cdn.dummyjson.com/product-images/groceries/water/1.webp" },
    { title: "Smart Munching", tag: "Upto 50% off", img: "https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/1.webp" },
    { title: "Water Purifiers", tag: "From ₹1,499", img: "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/1.webp" },
  ];

  // Scroll function for the arrows
  const scrollBanner = (direction) => {
    if (bannerScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      bannerScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-sans antialiased overflow-x-hidden">
      <Navbar />

      <main className="w-full pb-10">
        
        {/* HERO BANNER - Structural Separation to Eliminate Header Overlap */}
        <div className="relative w-full h-[380px] lg:h-[420px] bg-[#8bbdc1] border-b border-gray-200 flex items-center overflow-hidden">
          
          {/* Immersive background texture image overlay */}
          <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80')] mix-blend-overlay bg-cover bg-center pointer-events-none"></div>
          
          {/* Inner Content Grid */}
          <div className="relative w-full max-w-[1440px] h-full mx-auto px-6 md:px-12 flex items-center z-10 justify-between">
            
            {/* 1. Left Box: Headline Title - Guarded by hard padding right */}
            <div className="flex flex-col shrink-0 select-none pr-8 md:pr-12 max-w-[320px] lg:max-w-[420px]">
              <h1 className="text-[36px] md:text-[44px] lg:text-[50px] font-black text-[#005f8f] leading-[1.1] tracking-tight">
                Baarish ka Season
              </h1>
              <span className="text-[32px] md:text-[38px] lg:text-[44px] font-black text-[#004b70] leading-[1.1] tracking-tight mt-1">
                Shopping ka Reason
              </span>
            </div>
            
            {/* 2. Right Action Area: Carousel + Cloud Badge */}
            <div className="flex-1 h-full flex items-center justify-end overflow-hidden">
              
              {/* Slider Track Container Wrapper */}
              <div className="relative flex-1 h-full flex items-center max-w-[calc(100%-200px)]">
                
                {/* Left Arrow */}
                <button 
                  onClick={() => scrollBanner("left")} 
                  className="absolute left-2 z-30 w-9 h-9 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-700 hover:text-[#0078ad] focus:outline-none cursor-pointer border border-gray-100"
                >
                  <svg className="w-5 h-5 pr-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Horizontal Product Cards Deck */}
                <div 
                  ref={bannerScrollRef} 
                  className="flex w-full overflow-x-auto gap-3 px-12 py-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
                >
                  {promoCards.map((promo, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl w-[145px] md:w-[170px] h-[240px] md:h-[280px] shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden border border-white/40 cursor-pointer snap-start hover:shadow-md transition-shadow"
                    >
                      <div className="p-3 flex flex-col items-center bg-white flex-grow justify-between">
                        <h4 className="text-[12px] md:text-[13px] font-bold text-center text-[#005f8f] leading-tight line-clamp-2 w-full">
                          {promo.title}
                        </h4>
                        <div className="w-24 h-24 md:w-28 md:h-24 flex items-center justify-center my-auto">
                          <img 
                            src={promo.img} 
                            alt={promo.title} 
                            className="max-w-full max-h-full object-contain mix-blend-multiply" 
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Image" }}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-[#0078ad] w-full py-2.5 flex items-center justify-center shrink-0">
                        <span className="text-white text-[12px] md:text-[13px] font-black tracking-wide">
                          {promo.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                <button 
                  onClick={() => scrollBanner("right")} 
                  className="absolute right-2 z-30 w-9 h-9 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-700 hover:text-[#0078ad] focus:outline-none cursor-pointer border border-gray-100"
                >
                  <svg className="w-5 h-5 pl-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

              </div>

              {/* 3. The "Monsoon Ready Sale" Cloud Badge Area */}
              <div className="w-[180px] xl:w-[200px] shrink-0 hidden lg:flex items-center justify-center select-none pointer-events-none pl-4">
                <img 
                  src="/monsoon-badge.png" 
                  alt="Monsoon Ready Sale" 
                  className="w-full h-auto object-contain drop-shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* CSS Backup badge layout */}
                <div className="hidden w-40 h-48 bg-gradient-to-br from-[#0078ad] to-[#004b70] rounded-full border-4 border-white shadow-xl flex-col items-center justify-center text-white p-4 text-center transform rotate-6">
                  <span className="font-black italic text-md leading-none">MONSOON READY</span>
                  <span className="text-xs font-bold text-yellow-300 mt-1">SALE</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Category Rows Section Deck */}
        <div className="w-full flex flex-col gap-2 bg-[#f3f4f6] mt-4">
          <ProductRow title="Most Loved Groceries" products={groceries} />
          <ProductRow title="Monsoon Needs for Home" products={homeAndLifestyle} />
          <ProductRow title="Top Electronics & Audio" products={electronics} />
          <ProductRow title="Beauty & Personal Care" products={beauty} />
        </div>

      </main>
    </div>
  );
}

export default Home;