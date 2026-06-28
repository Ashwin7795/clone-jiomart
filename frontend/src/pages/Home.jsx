import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProductRow from "../components/ProductRow";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [brand, setBrand] = useState("");
  
  // Reference for the Monsoon Banner Scroll Container
  const bannerScrollRef = useRef(null);
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          params: {
            search,
            category,
            brand,
            sort,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [search, category, brand, sort]);

  // Filtering products by your database categories
  const groceries = products.filter(p => p.category === "Groceries");
  const electronics = products.filter(p => p.category === "Electronics");
  const beauty = products.filter(p => p.category === "Beauty & Personal Care");
  const homeAndLifestyle = products.filter(p => p.category === "Home & Lifestyle");

  const brands = [
    ...new Set(
      products
        .map((product) => product.brand)
        .filter(Boolean)
    ),
  ];

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
      <main className="w-full pb-10">
        
        {/* HERO BANNER - Shows only when no filters or search queries are active */}
        {!search && !category && !brand && !sort && (
          <div className="relative w-full h-[380px] lg:h-[420px] bg-[#8bbdc1] border-b border-gray-200 flex items-center overflow-hidden">
            <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80')] mix-blend-overlay bg-cover bg-center pointer-events-none"></div>

            {/* Inner Content Grid */}
            <div className="relative w-full max-w-[1440px] h-full mx-auto px-6 md:px-12 flex items-center z-10 justify-between">
              
              {/* Left Box: Headline Title */}
              <div className="flex flex-col shrink-0 select-none pr-8 md:pr-12 max-w-[320px] lg:max-w-[420px]">
                <h1 className="text-[36px] md:text-[44px] lg:text-[50px] font-black text-[#005f8f] leading-[1.1] tracking-tight">
                  Baarish ka Season
                </h1>
                <span className="text-[32px] md:text-[38px] lg:text-[44px] font-black text-[#004b70] leading-[1.1] tracking-tight mt-1">
                  Shopping ka Reason
                </span>
              </div>

              {/* Right Action Area: Carousel + Cloud Badge */}
              <div className="flex-1 h-full flex items-center justify-end overflow-hidden">
                <div className="relative flex-1 h-full flex items-center max-w-[calc(100%-200px)]">
                  
                  {/* Left Arrow */}
                  <button
                    type="button"
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
                              onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Image"; }}
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
                    type="button"
                    onClick={() => scrollBanner("right")}
                    className="absolute right-2 z-30 w-9 h-9 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-700 hover:text-[#0078ad] focus:outline-none cursor-pointer border border-gray-100"
                  >
                    <svg className="w-5 h-5 pl-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* The "Monsoon Ready Sale" Cloud Badge Area */}
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
                  <div className="hidden w-40 h-48 bg-gradient-to-br from-[#0078ad] to-[#004b70] rounded-full border-4 border-white shadow-xl flex-col items-center justify-center text-white p-4 text-center transform rotate-6">
                    <span className="font-black italic text-md leading-none">MONSOON READY</span>
                    <span className="text-xs font-bold text-yellow-300 mt-1">SALE</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* YOUR CONDITIONAL BAR - Now triggers accurately whenever a search query parameter string is present */}
        {(search || category || brand || sort) && (
          <div className="w-full bg-white border-b border-gray-100">
            <div className="max-w-[1170px] mx-auto px-4 py-4 flex flex-wrap gap-4 items-center justify-end">
              <div className="flex items-center gap-3 flex-wrap">

                {/* Brands Filtering Dropdown Selector */}
                <div className="relative h-10 min-w-[170px]">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full h-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 text-[13px] font-bold text-gray-700 outline-none hover:bg-gray-50 focus:border-[#0078ad] focus:border-2 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">All Brands</option>
                    {brands.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#0078ad]">
                    <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Sort Options Dropdown Selector */}
                <div className="relative h-10 min-w-[165px]">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full h-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 text-[13px] font-bold text-gray-700 outline-none hover:bg-gray-50 focus:border-[#0078ad] focus:border-2 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Sort By</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#0078ad]">
                    <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBrand("");
                    setSort("");
                    setCategory("");
                  }}
                  className="h-10 px-5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
                >
                  Clear
                </button>

              </div>
            </div>
          </div>
        )}

        {/* CONDITIONAL CORE VIEWPORTS INTERFACE */}
        {search || category || brand || sort ? (
          /* --- VIEWPORT 1: SEARCH & FILTER RESULTS VIEW --- */
          <div className="w-full bg-[#f3f4f6] min-h-screen py-8 font-sans antialiased text-[#141414] select-none">
            <div className="max-w-[1170px] mx-auto px-4">
              
              <div className="mb-6 text-left">
                <h2 className="text-[28px] font-black tracking-tight">
                  {search ? `Results for "${search}"` : "Filtered Products"}
                </h2>
                <p className="text-gray-500 mt-1 font-medium">
                  {products.length} product{products.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {products.length === 0 ? (
                <div className="w-full bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-xs max-w-[480px] mx-auto mt-8">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 text-xl">
                    🔍
                  </div>
                  <h3 className="text-[16px] font-bold text-black tracking-tight">No products found</h3>
                  <p className="text-gray-400 text-[13px] font-medium mt-1 max-w-xs mx-auto leading-relaxed">
                    We couldn't find matches for your active configuration criteria parameters. Try adjusting your filter tags or search terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-2xs border border-gray-50 hover:shadow-md transition-shadow">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- VIEWPORT 2: THE DEFAULT HOMEPAGE CATEGORY ROW STACK --- */
          <div className="w-full bg-[#f3f4f6] py-6 flex flex-col gap-6 font-sans antialiased">
            <div className="w-full transition-opacity duration-200">
              <ProductRow title="Most Loved Groceries" products={groceries} />
            </div>
            <div className="w-full transition-opacity duration-200">
              <ProductRow title="Monsoon Needs for Home" products={homeAndLifestyle} />
            </div>
            <div className="w-full transition-opacity duration-200">
              <ProductRow title="Top Electronics & Audio" products={electronics} />
            </div>
            <div className="w-full transition-opacity duration-200">
              <ProductRow title="Beauty & Personal Care" products={beauty} />
            </div>
          </div>
        )}
        
      </main>
    </div>  
  );
}

export default Home;