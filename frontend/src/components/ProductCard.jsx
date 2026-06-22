import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();
  
  // Calculate fake MRP for UI purposes if missing
  const originalMrp = Math.round(product.price * 1.25);

  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      className="min-w-[160px] md:min-w-[210px] w-[160px] md:w-[210px] bg-white rounded-xl p-3 border border-gray-200/60 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200 cursor-pointer flex flex-col relative shrink-0"
    >
      {/* Favorite / Wishlist Heart Icon */}
      <button className="absolute top-3 left-3 text-gray-400 hover:text-red-500 z-10 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Product Image Area */}
      <div className="w-full aspect-square bg-white flex items-center justify-center p-2 mb-2 relative">
        <img 
          src={product.images?.[0]} 
          alt={product.title} 
          className="max-h-full max-w-full object-contain mix-blend-multiply"
          onError={(e) => e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"}
        />
        {/* The JioMart exact "Add" Button positioned over the image */}
        <button 
          onClick={(e) => {
             e.stopPropagation();
             alert("Added to Cart!");
          }}
          className="absolute bottom-0 right-0 bg-[#e5f1f7] text-jm-blue hover:bg-jm-blue hover:text-white border border-jm-blue/30 text-xs font-bold px-4 py-1.5 rounded transition-colors flex items-center gap-1"
        >
          Add <span className="text-lg leading-none mt-[1px]">+</span>
        </button>
      </div>

      {/* Typography & Details */}
      <div className="flex flex-col flex-grow mt-1">
        <span className="text-[10px] text-gray-500 font-medium tracking-wide mb-1 line-clamp-1">
          {product.brand} • 1 Unit
        </span>
        
        <h3 className="text-xs md:text-sm font-medium text-gray-800 leading-tight line-clamp-2 h-[34px] md:h-[40px] mb-2">
          {product.title}
        </h3>

        <div className="mt-auto flex items-center gap-2">
          <span className="text-sm md:text-base font-black text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{originalMrp}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;