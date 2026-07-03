import { useRef } from "react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

function ProductRow({ title, products }) {
  const rowScrollRef = useRef(null);
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  // Handles smooth stepping when clicking the structural floating arrows
  const handleScroll = (direction) => {
    if (rowScrollRef.current) {
      const scrollAmount = direction === "left" ? -600 : 600;
      rowScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const showNavigationArrows = products.length > 5;

  // Helper function to safely extract category values from the row dataset
  const handleViewAllRedirect = () => {
    const firstProductCategory = products[0]?.category;
    if (firstProductCategory) {
      navigate(`/?category=${encodeURIComponent(firstProductCategory)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-full bg-white py-4 border-b border-gray-100 relative group">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 relative">
        
        {/* Section Title Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[16px] md:text-[18px] font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          <button 
            type="button"
            onClick={handleViewAllRedirect}
            className="text-[#0078ad] text-[12px] font-bold tracking-tight hover:underline cursor-pointer bg-transparent border-none outline-none"
          >
            View all
          </button>
        </div>

        {/* Carousel Window Wrapper */}
        <div className="relative w-full flex items-center">
          
          {/* Left Arrow Button */}
          {showNavigationArrows && (
            <button 
              type="button"
              onClick={() => handleScroll("left")} 
              className="absolute left-0 z-20 w-8 h-8 bg-white/95 text-gray-700 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center justify-center font-bold text-[14px] hover:text-[#0078ad] transition-all -translate-y-6 focus:outline-none cursor-pointer"
            >
              ❮
            </button>
          )}

          {/* Horizontal Side-Scroll Track */}
          <div 
            ref={rowScrollRef} 
            className="flex w-full overflow-x-auto gap-3 pb-2 scrollbar-none scroll-smooth snap-x snap-mandatory"
          >
            {products.map((product) => (
              <div key={product._id} className="snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          {showNavigationArrows && (
            <button 
              type="button"
              onClick={() => handleScroll("right")} 
              className="absolute right-0 z-20 w-8 h-8 bg-white/95 text-gray-700 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center justify-center font-bold text-[14px] hover:text-[#0078ad] transition-all -translate-y-6 focus:outline-none cursor-pointer"
            >
              ❯
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default ProductRow;