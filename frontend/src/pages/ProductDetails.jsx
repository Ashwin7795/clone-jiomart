import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductRow from "../components/ProductRow";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [pincode, setPincode] = useState("560002"); // Defaulting to Bengaluru zone from your screenshots
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);

        const catalogRes = await axios.get("http://localhost:5000/api/products");
        const filtered = catalogRes.data.filter(p => p.category === res.data.category && p._id !== res.data._id);
        setRelatedProducts(filtered);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to Basket!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-20 text-sm font-bold text-gray-500">Loading Product Deck...</div>;
  if (!product) return <div className="text-center mt-20 font-bold text-gray-600">Product Missing</div>;

  return (
    <div className="bg-[#f6f6f7] min-h-screen font-sans antialiased text-gray-900 selection:bg-[#0078ad]/10">

      {/* Top Breadcrumb Navigation */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pt-4 text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
        <span className="hover:text-[#0078ad] cursor-pointer">Home</span> 
        <span>&gt;</span> 
        <span className="hover:text-[#0078ad] cursor-pointer">{product.category}</span> 
        <span>&gt;</span> 
        <span className="text-gray-800 font-bold truncate max-w-[200px]">{product.title}</span>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex flex-col gap-8">
        
        {/* UPPER PANEL: Core Sticky Two-Column Details Deck */}
        <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT SIDE COLUMN: Image Stage View (Sticky Frame) */}
          <div className="w-full lg:w-[55%] bg-white rounded-2xl border border-gray-200/60 p-6 flex gap-4 sticky top-4">
            {/* Multi-Thumbnail Sidebar Picker Track */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="w-[54px] h-[54px] rounded-lg border-2 border-[#0078ad] p-1 flex items-center justify-center cursor-pointer bg-white">
                <img src={product.images?.[0]} alt="thumbnail" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            {/* Hero Main Viewing Window */}
            <div className="flex-1 h-[360px] md:h-[440px] flex items-center justify-center p-4 relative bg-white">
              <img src={product.images?.[0]} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              <div className="absolute bottom-2 right-2 flex gap-1.5">
                <button className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-black flex items-center justify-center text-gray-400 hover:text-gray-800">&lt;</button>
                <button className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-black flex items-center justify-center text-gray-400 hover:text-gray-800">&gt;</button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE COLUMN: Buy Actions Floating Box Layout */}
          <div className="w-full lg:w-[45%] flex flex-col gap-4">
            <div className="w-full bg-white rounded-2xl border border-gray-200/60 p-6 flex flex-col gap-4">
              <div>
                <span className="text-[#0078ad] text-[13px] font-extrabold uppercase tracking-wider">{product.brand}</span>
                <h1 className="text-lg md:text-xl font-black text-gray-900 leading-snug tracking-tight mt-0.5">{product.title}</h1>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="bg-[#f1a545] text-white text-[11px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    {product.rating?.toFixed(1) || "3.6"} ★
                  </div>
                  <span className="text-[11px] text-gray-400 font-bold">(448 Ratings)</span>
                </div>
              </div>

              {/* Exact JioMart Pricing Row Blocks */}
              <div className="border-t border-b border-gray-100 py-3 flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900">₹{product.price}.00</span>
                  <span className="text-xs font-bold text-gray-400 line-through">MRP ₹{Math.round(product.price * 1.35)}.00</span>
                  <span className="text-[11px] bg-green-50 text-green-600 border border-green-100 px-1.5 py-0.5 rounded-md font-black">Save 35%</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">Price inclusive of all taxes</p>
              </div>

              {/* Teal Core Action Trigger Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full h-[44px] bg-[#0078ad] hover:bg-[#005f8f] active:scale-[0.99] text-white rounded-full font-black text-sm tracking-wide shadow-sm transition-all cursor-pointer flex items-center justify-center"
              >
                Add to Basket
              </button>
            </div>

            {/* Delivery address verification widget card */}
            <div className="w-full bg-white rounded-2xl border border-gray-200/60 p-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">Delivery Address</h3>
              <div className="flex gap-2 max-w-md">
                <input 
                  type="text" maxLength="6" value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 h-9 bg-[#f6f6f7] rounded-lg px-3 text-xs font-bold text-gray-800 outline-none border border-transparent focus:border-gray-200"
                />
                <button className="text-[#0078ad] text-xs font-black px-4 border border-[#0078ad]/40 rounded-lg hover:bg-blue-50/50">Change</button>
              </div>
              <p className="text-[11px] text-green-600 font-bold mt-2 flex items-center gap-1">✨ Standard Delivery Available</p>
            </div>
          </div>

        </div>

        {/* LOWER PANEL: Product Specs Metadata Information Table Grid */}
        <div className="w-full bg-white rounded-2xl border border-gray-200/60 p-6 flex flex-col gap-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Product Parameters</h3>
          <div className="w-full max-w-3xl border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-medium border-collapse">
              <tbody>
                <tr className="border-b border-gray-100"><td className="p-3 bg-gray-50/60 text-gray-500 w-1/3 font-bold">Brand</td><td className="p-3 font-semibold text-gray-800">{product.brand}</td></tr>
                <tr className="border-b border-gray-100"><td className="p-3 bg-gray-50/60 text-gray-500 font-bold">Category</td><td className="p-3 font-semibold text-gray-800">{product.category}</td></tr>
                <tr className="border-b border-gray-100"><td className="p-3 bg-gray-50/60 text-gray-500 font-bold">Sub-Classification</td><td className="p-3 font-semibold text-blue-600 hover:underline cursor-pointer">{product.subcategory}</td></tr>
                <tr><td className="p-3 bg-gray-50/60 text-gray-500 font-bold">In-Stock Volume</td><td className="p-3 font-semibold text-gray-800">{product.stock} Units Remaining</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-2">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-1.5">Description Overview</h4>
            <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed max-w-4xl">{product.description}</p>
          </div>
        </div>

        {/* RECOMMENDATIONS TRACKS BLOCK */}
        <div className="-mx-4 md:mx-0">
          <ProductRow title="You may also like" products={relatedProducts.slice(0, 6)} />
          <div className="mt-4">
            <ProductRow title="Frequently Bought Together" products={relatedProducts.slice(6, 12)} />
          </div>
        </div>

        {/* BOTTOM PANEL: Accurate Customer Reviews Summary Grid */}
        <div className="w-full bg-white rounded-2xl border border-gray-200/60 p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Ratings & Reviews Summary</h3>
          <div className="flex flex-col sm:flex-row gap-8 items-center">
            <div className="text-center sm:border-r border-gray-100 pr-0 sm:pr-10 flex flex-col items-center shrink-0">
              <span className="text-4xl font-black text-gray-900 tracking-tight">{product.rating?.toFixed(1) || "3.6"}</span>
              <span className="text-[11px] text-gray-400 font-bold mt-1">Out of 5 Stars</span>
            </div>
            <div className="flex-1 w-full max-w-xs flex flex-col gap-1.5">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                  <span className="w-2">{stars}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-[#f1a545] h-full rounded-full" style={{ width: stars >= 4 ? "68%" : "18%" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default ProductDetails;