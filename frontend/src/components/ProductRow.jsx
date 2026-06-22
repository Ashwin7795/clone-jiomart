import ProductCard from "./ProductCard";

function ProductRow({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full bg-white py-6 mb-2 border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          <button className="bg-jm-blue-light text-jm-blue text-xs font-bold px-3 py-1.5 rounded-full hover:bg-jm-blue hover:text-white transition-colors flex items-center gap-1">
            View All
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 scrollbar-none snap-x snap-mandatory">
          {products.map((product) => (
            <div key={product._id} className="snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ProductRow;