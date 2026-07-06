import { useRef } from "react";
import ProductCard from "./ProductCard";

function ProductRow({ title, products }) {
  const rowScrollRef = useRef(null);

  if (!products || products.length === 0) return null;

  const handleScroll = (direction) => {
    if (rowScrollRef.current) {
      const scrollAmount = direction === "left" ? -580 : 580;
      rowScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const showNavigationArrows = products.length > 5;

  const handleViewAllRedirect = () => {
    const firstProductCategory = products[0]?.category;
    if (firstProductCategory) {
      window.location.href = `/?category=${encodeURIComponent(firstProductCategory)}`;
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="w-full bg-white py-4 relative group border-b border-gray-100">
      <div className="max-w-[1170px] mx-auto px-4 md:px-6 relative">
        
        {/* Section Header */}
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-[16px] sm:text-[18px] font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <button 
            type="button"
            onClick={handleViewAllRedirect}
            className="text-[#0078ad] text-[12px] font-extrabold tracking-tight hover:underline cursor-pointer bg-transparent border-none outline-none"
          >
            View all
          </button>
        </div>

        {/* Slider Deck Window Track */}
        <div className="relative w-full flex items-center">
          
          {showNavigationArrows && (
            <button 
              type="button"
              onClick={() => handleScroll("left")} 
              className="absolute -left-3 z-30 w-8 h-8 bg-white text-gray-600 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center font-bold text-[12px] hover:text-[#0078ad] transition-all opacity-0 group-hover:opacity-100 focus:outline-none cursor-pointer -translate-y-4"
            >
              ❮
            </button>
          )}

          <div 
            ref={rowScrollRef} 
            className="flex w-full overflow-x-auto gap-3.5 pb-3 pt-0.5 scrollbar-none scroll-smooth snap-x snap-mandatory"
          >
            {products.map((product) => (
              <div key={product._id} className="snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {showNavigationArrows && (
            <button 
              type="button"
              onClick={() => handleScroll("right")} 
              className="absolute -right-3 z-30 w-8 h-8 bg-white text-gray-600 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center font-bold text-[12px] hover:text-[#0078ad] transition-all opacity-0 group-hover:opacity-100 focus:outline-none cursor-pointer -translate-y-4"
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