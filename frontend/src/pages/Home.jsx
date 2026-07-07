import { useEffect, useState, useRef } from "react";
import axios from "axios"; 
import ProductRow from "../components/ProductRow";
import ProductCard from "../components/ProductCard";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Hook injection

// --- INLINE DESIGN-COMPLIANT PROMO IMAGE CAROUSEL ROW ---
function PromoPillRow() {
  const promoPills = [
    { title: "Fashion Bestsellers", img: "/Fashion-Bestsellers-(1)-1782916730151.png.png" },
    { title: "Footwear steals", img: "/Footwear-steals-1782280008705.png.png" },
    { title: "Top Reliance Brands", img: "/Top-Reliance-Brands-1782916677993.png.png" },
    { title: "Accessories", img: "/Accessories-1782971746611.png.png" }
  ];

  return (
    <div className="w-full bg-transparent select-none relative z-20">
      <div className="flex w-full overflow-x-auto gap-4 scrollbar-none scroll-smooth snap-x justify-start md:justify-end items-center pr-6 md:pr-12 pl-4">
        {promoPills.map((pill, idx) => (
          <div 
            key={idx}
            className="w-[125px] sm:w-[155px] md:w-[165px] lg:w-[175px] shrink-0 snap-start cursor-pointer transition-transform duration-200 hover:scale-[1.025]"
          >
            <img 
              src={pill.img} 
              alt={pill.title} 
              className="w-full h-auto object-contain pointer-events-none drop-shadow-xs"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN HOMEPAGE COMPONENT ---
function Home() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [sort, setSort] = useState("");
  const [brand, setBrand] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();
  const { triggerToast } = useCart(); // Extract global toast launcher
  
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, brand, sort]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        window.scrollTo({ top: 0 });

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
          params: {
            search,
            category,
            brand,
            sort,
            page: currentPage,
          },
        });
        setProducts(response.data.products);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.totalProducts);

        // ADDED TOAST USER FEEDBACK: Show informative parameters status when search queries match items
        if (search && response.data.totalProducts > 0) {
          triggerToast(`Found ${response.data.totalProducts} results for "${search}"`);
        }
      } catch (error) {
        console.log(error);
        // INJECTED PRECISE NETWORK CAPTURE TOAST FEEDBACK
        triggerToast("Failed to fetch fresh product parameters from database layer", "error");
      }
    };
    
    fetchProducts();
  }, [search, category, brand, sort, currentPage]);

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

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-sans antialiased overflow-x-hidden relative">
      <main className="w-full pb-10">
        
        {/* NATIVE FLEX WRAPPER WITH TRUE CONSTRAINED DIMENSIONS */}
        {!search && !category && !brand && !sort && (
          <div className="w-full bg-[#0a3251] border-b border-gray-200 select-none overflow-hidden py-4 sm:py-6 md:py-8 lg:py-10">
            <div className="max-w-[1170px] mx-auto w-full px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Left Side: Dynamic Native Typography Headers */}
              <div className="flex flex-col text-left shrink-0 w-full md:w-auto">
                <h1 className="text-[28px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-black text-white leading-[1.1] tracking-tight drop-shadow-sm">
                  Grand Savings
                </h1>
                <span className="text-[24px] sm:text-[30px] md:text-[34px] lg:text-[38px] font-black text-amber-300 leading-[1.1] tracking-tight drop-shadow-sm mt-0.5">
                  Greater Deals
                </span>
              </div>

              {/* Right Side: Embedded Carousel Promo Images Track */}
              <div className="w-full md:flex-1 overflow-hidden">
                <PromoPillRow />
              </div>

            </div>
          </div>
        )}

        {/* CONTROLS FILTER BAR */}
        {(search || category || brand || sort) && (
          <div className="w-full bg-white border-b border-gray-100 shadow-2xs">
            <div className="max-w-[1170px] mx-auto px-4 md:px-6 py-4 flex flex-wrap gap-4 items-center justify-end">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative h-10 min-w-[170px]">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full h-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 text-[13px] font-bold text-gray-700 outline-none hover:bg-gray-50 focus:border-[#0078ad] focus:border-2 transition-all cursor-pointer appearance-none text-left"
                  >
                    <option value="">All Brands</option>
                    {brands.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#0078ad]">
                    <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="relative h-10 min-w-[165px]">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full h-full bg-white border border-gray-200 rounded-xl pl-4 pr-10 text-[13px] font-bold text-gray-700 outline-none hover:bg-gray-50 focus:border-[#0078ad] focus:border-2 transition-all cursor-pointer appearance-none text-left"
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
                    navigate("/");
                    triggerToast("Filter clear tags applied");
                  }}
                  className="h-10 px-5 rounded-xl border border-red-100 bg-red-50/30 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CORE INTERFACE RESULTS BLOCK */}
        {search || category || brand || sort ? (
          /* --- VIEWPORT 1: SEARCH & FILTER RESULTS VIEW --- */
          <div className="w-full bg-[#f3f4f6] min-h-screen py-8 font-sans antialiased text-[#141414] select-none">
            <div className="max-w-[1170px] mx-auto px-4 md:px-6">
              <div className="mb-6 text-left">
                <h2 className="text-[26px] md:text-[28px] font-bold tracking-tight text-gray-900">
                  {search ? `Results for "${search}"` : category ? category : "Filtered Products"}
                </h2>
                <p className="text-xs font-bold text-gray-400 mt-1">{totalProducts} products found</p>
              </div>

              {products.length === 0 ? (
                <div className="w-full bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-2xs max-w-[480px] mx-auto mt-8">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 text-lg">🔍</div>
                  <h3 className="text-[16px] font-bold text-black tracking-tight">No products found</h3>
                  <p className="text-gray-400 text-[13px] font-medium mt-1.5 max-w-xs mx-auto leading-relaxed">
                    We couldn't find matches for your active criteria parameters. Try adjusting your filter tags or search terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-2xs border border-gray-50 hover:shadow-md transition-shadow">
                      <ProductCard product={product} />
                    </div>
                  ))}

                  <div className="col-span-full flex justify-center items-center gap-2 mt-12 pt-6 border-t border-gray-200/50 select-none">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-5 h-10 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-[13px] shadow-2xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1.5">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        const isCurrent = currentPage === pageNum;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 font-sans font-bold text-[13px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-[#0078ad] text-white shadow-2xs"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-5 h-10 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-[13px] shadow-2xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- VIEWPORT 2: THE DEFAULT HOMEPAGE CATEGORY ROW STACK --- */
          <div className="max-w-[1170px] mx-auto px-4 md:px-6 py-4 flex flex-col gap-5 font-sans antialiased text-left mt-2">
            
            <div className="my-3">
              <img
                src="/offers/a.png"
                alt="Offer"
                className="w-full rounded-2xl cursor-pointer shadow-3xs"
              />
            </div>

            <div className="w-full transition-opacity duration-200">
              <ProductRow title="Most Loved Groceries" products={groceries} />
              <div className="my-4">
                <img
                  src="/offers/banner3.png"
                  alt="Offer"
                  className="w-full rounded-2xl cursor-pointer shadow-3xs"
                />
              </div>
            </div>

            <div className="w-full transition-opacity duration-200">
              <ProductRow title="Monsoon Needs for Home" products={homeAndLifestyle} />
            </div>

            <div className="my-4">
              <img
                src="/offers/b.png"
                alt="Offer"
                className="w-full rounded-2xl cursor-pointer shadow-3xs"
              />
            </div>

            <div className="w-full transition-opacity duration-200">
              <ProductRow title="Top Electronics & Audio" products={electronics} />
            </div>

            <div className="my-4">
              <img
                src="/offers/c.png"
                alt="Offer"
                className="w-full rounded-2xl cursor-pointer shadow-3xs"
              />
            </div>

            <div className="w-full transition-opacity duration-200">
              <ProductRow title="Beauty & Personal Care" products={beauty} />
            </div>
          </div>
        )}
        
      </main>

      {/* FLOATING CUSTOMER ASSISTANT BOT EMBLEM */}
      <div className="fixed bottom-6 right-6 z-50 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none">
        <div className="w-12 h-12 bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-gray-100 flex items-center justify-center p-2 relative group">
          <img 
            src="/Bot_Header_Icon-SThzrdTf (1).png" 
            alt="Customer Assistant Bot" 
            className="w-full h-full object-contain pointer-events-none" 
          />
          <div className="absolute right-14 bg-gray-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md whitespace-nowrap">
            Need help? Chat with us
          </div>
        </div>
      </div>

    </div>  
  );
}

export default Home;