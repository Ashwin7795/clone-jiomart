import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VendorDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "vendor") {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/products",
        {
          title,
          description,
          category,
          subcategory,
          brand,
          price,
          stock,
          images: [imageUrl],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("Product Added Successfully!");

      setTitle("");
      setDescription("");
      setCategory("Groceries");
      setSubcategory("");
      setBrand("");
      setPrice("");
      setStock("");
      setImageUrl("");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Failed to Add Product");
    }
  };

  const isFormValid = title.trim() && price && stock && imageUrl.trim();

  return (
    <div className="w-full bg-[#f3f3f3] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      <div className="max-w-[1140px] mx-auto px-4">
        
        {/* Header Block Section */}
        <div className="flex flex-col items-start mb-8 text-left">
          <h1 className="text-[28px] font-black text-[#141414] tracking-tight leading-none">
            Vendor Dashboard
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1.5">
            Merchant Inventory System — Create and publish items directly onto the storefront channel.
          </p>
        </div>

        {/* 2-Column Balanced Responsive Grid Container */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT SIDE: Core Management Entry Fields (Takes 2 columns) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 space-y-6">
            
            <h2 className="text-[18px] font-bold border-b border-gray-100 pb-3 mb-2 tracking-tight">
              Product Details
            </h2>

            {/* Title Block */}
            <div className="w-full flex flex-col items-start">
              <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                Product Title
              </label>
              <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 transition-all">
                <input
                  type="text"
                  placeholder="e.g., Himalaya Purifying Neem Face Wash 200ml"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-full bg-transparent text-sm font-medium outline-none"
                  required
                />
              </div>
            </div>

            {/* Description Block */}
            <div className="w-full flex flex-col items-start">
              <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                Description
              </label>
              <textarea
                rows="3"
                placeholder="Provide a clean product synopsis summary details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 focus:border-[#0078ad] focus:border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all resize-none"
              />
            </div>

            {/* Category and Subcategory Split Cells */}
            <div className="grid sm:grid-cols-2 gap-5 w-full">
              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Category
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none"
                  >
                    <option>Groceries</option>
                    <option>Fashion</option>
                    <option>Home & Lifestyle</option>
                    <option>Electronics</option>
                    <option>Beauty & Personal Care</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none text-[#0078ad]">
                    <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Subcategory
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 transition-all">
                  <input
                    type="text"
                    placeholder="e.g., Face Wash"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Brand, Price, and Stock Triple Data Row */}
            <div className="grid sm:grid-cols-3 gap-5 w-full">
              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Brand
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 transition-all">
                  <input
                    type="text"
                    placeholder="e.g., Himalaya"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Price (₹)
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 transition-all">
                  <input
                    type="number"
                    placeholder="220"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Available Stock
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 transition-all">
                  <input
                    type="number"
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image URL Input Field */}
            <div className="w-full flex flex-col items-start">
              <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                Product Image URL
              </label>
              <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 transition-all">
                <input
                  type="text"
                  placeholder="Paste direct product image reference link address here"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-full bg-transparent text-sm font-medium outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Control Action Button Block */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full h-12 rounded-full font-bold text-base flex items-center justify-center transition-all duration-200 mt-4 shadow-xs ${
                isFormValid
                  ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer"
                  : "bg-[#b8e0f2] text-white cursor-not-allowed"
              }`}
            >
              Add Product to Catalog
            </button>

          </form>

          {/* RIGHT SIDE: Interactive Real-Time Image Viewport Panel Frame Container */}
          <div className="w-full sticky top-28">
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] p-6 flex flex-col items-center">
              <h3 className="text-[14px] font-bold text-gray-500 self-start mb-4 tracking-wide uppercase">
                Live Thumbnail Preview
              </h3>
              
              <div className="w-full aspect-square max-w-[260px] bg-[#f9f9f9] border border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden p-4 group">
                {imageUrl.trim() ? (
                  <img
                    src={imageUrl}
                    alt="Preview content visualization window"
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/300x300/f0f4f9/a0aec0?text=Invalid+Image+URL";
                    }}
                  />
                ) : (
                  <div className="text-center flex flex-col items-center gap-2 text-gray-400 p-4">
                    <svg className="w-10 h-10 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p className="text-[12px] font-bold leading-tight">Image will render here instantly upon link validation</p>
                  </div>
                )}
              </div>

              {/* Mock Metadata Indicator Below Panel */}
              <div className="w-full mt-5 bg-[#f0f4f9]/50 border border-gray-100 rounded-xl p-4 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item Tag Details</p>
                <h4 className="text-[14px] font-bold text-[#141414] mt-1.5 truncate">
                  {title.trim() ? title : "Untitled Item"}
                </h4>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-[16px] font-black text-black">₹{price ? Number(price).toFixed(2) : "0.00"}</span>
                  <span className="text-[12px] font-bold bg-[#e5f1f7] text-[#0078ad] px-2 py-0.5 rounded-md">
                    {category}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;