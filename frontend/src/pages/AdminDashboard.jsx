import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {

  if (activeTab === "orders") {
    fetchOrders();
  }

}, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
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

  const fetchOrders = async () => {
  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/orders/admin/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setOrders(response.data);

  } catch (error) {

    console.log(error.response?.data);

  }
};
const updateStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/orders/admin/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders();

  } catch (error) {
    console.log(error.response?.data);
  }
};

  const isFormValid = title.trim() && price && stock && imageUrl.trim();

  return (
    <div className="w-full bg-[#f3f3f3] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      <div className="max-w-[1140px] mx-auto px-4">
        
        {/* Top Header & Tab Controls Navigation Block */}
        <div className="flex flex-col items-start border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-[28px] font-black text-black tracking-tight leading-none">
            Admin Dashboard
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2">
            Admin Console — Overview system parameters, catalogs, tracking rows, and store inventories.
          </p>

          {/* Styled Tab Row */}
          <div className="flex gap-3 mt-6">
            {[
              { id: "products", label: "Products" },
              { id: "orders", label: "Orders" },
              { id: "inventory", label: "Inventory" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-xl text-[14px] font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#0078ad] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Workspace Container Rows */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* TAB 1: ADD PRODUCTS WORKFLOW */}
          {activeTab === "products" && (
            <form 
              onSubmit={handleSubmit} 
              className="lg:col-span-2 bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 space-y-6"
            >
              <h2 className="text-[18px] font-bold border-b border-gray-100 pb-3 mb-2 tracking-tight">
                Product Details
              </h2>

              {/* Product Title Input */}
              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Product Title
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                  <input
                    type="text"
                    placeholder="Enter explicit item nomenclature details..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Product Description Input */}
              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide a clean product synopsis description detail layout block..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 focus:border-[#0078ad] focus:border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all resize-none"
                />
              </div>

              {/* Category & Subcategory Split */}
              <div className="grid sm:grid-cols-2 gap-5 w-full">
                <div className="w-full flex flex-col items-start">
                  <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                    Category
                  </label>
                  <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 relative bg-transparent">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-full bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none text-[#141414]"
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
                  <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                    <input
                      type="text"
                      placeholder="e.g., Staples"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full h-full bg-transparent text-sm font-medium outline-none placeholder-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Brand, Price, and Stock Config Block Row */}
              <div className="grid sm:grid-cols-3 gap-5 w-full">
                <div className="w-full flex flex-col items-start">
                  <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                    Brand
                  </label>
                  <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                    <input
                      type="text"
                      placeholder="Brand Name"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full h-full bg-transparent text-sm font-medium outline-none placeholder-gray-300"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col items-start">
                  <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                    Price (₹)
                  </label>
                  <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-full bg-transparent text-sm font-medium outline-none placeholder-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col items-start">
                  <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                    Stock
                  </label>
                  <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                    <input
                      type="number"
                      placeholder="Units Available"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full h-full bg-transparent text-sm font-medium outline-none placeholder-gray-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Image URL Input */}
              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Image URL reference anchor
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                  <input
                    type="text"
                    placeholder="Paste full CDN or cloud asset image URL string address..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Action Submit Control Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full h-12 rounded-full font-bold text-base flex items-center justify-center transition-all duration-200 shadow-xs ${
                  isFormValid
                    ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer"
                    : "bg-[#b8e0f2] text-white cursor-not-allowed"
                }`}
              >
                Add Product to Catalog
              </button>
            </form>
          )}

          {/* RIGHT SIDEBAR PANEL: Real-time Item Preview Layer */}
          {activeTab === "products" && (
            <div className="w-full sticky top-28">
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] p-6 flex flex-col items-center">
                <h3 className="text-[13px] font-bold text-gray-400 self-start mb-4 tracking-wide uppercase">
                  Live Thumbnail Preview
                </h3>

                {/* Dashboard Image Viewport Container */}
                <div className="w-full aspect-square max-w-[240px] bg-[#f9f9f9] border border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden p-4 group">
                  {imageUrl.trim() ? (
                    <img
                      src={imageUrl}
                      alt="Preview illustration layer"
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-102"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/300x300/f0f4f9/a0aec0?text=Invalid+Image+URL";
                      }}
                    />
                  ) : (
                    <div className="text-center flex flex-col items-center gap-2 text-gray-400">
                      <svg className="w-8 h-8 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <p className="text-[11px] font-bold">Image will auto-render here</p>
                    </div>
                  )}
                </div>

                {/* Micro Meta Presentation Block Card */}
                <div className="w-full mt-5 bg-[#f0f4f9]/60 border border-gray-50 rounded-xl p-4 text-left">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Item Structure</p>
                  <h4 className="text-[15px] font-bold text-black mt-1 truncate">
                    {title.trim() ? title : "Untitled Product"}
                  </h4>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/40">
                    <span className="text-[16px] font-black text-black">₹{price ? Number(price).toFixed(2) : "0.00"}</span>
                    <span className="bg-[#0078ad] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {category}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-200/40 flex justify-between text-[11px] font-bold text-gray-500">
                    <span>Stock: <span className="text-black">{stock || 0}</span></span>
                    <span>Brand: <span className="text-black truncate max-w-[80px] inline-block align-bottom">{brand || "-"}</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL ORDERS PLACEHOLDER BLOCK */}
         {activeTab === "orders" && (
  <div className="lg:col-span-3 bg-white rounded-[24px] shadow border border-gray-100 p-8">

    <h2 className="text-2xl font-bold mb-6">
      Customer Orders
    </h2>

    <table className="w-full">

      <thead>

        <tr className="border-b">

          <th className="text-left py-3">
            Customer
          </th>

          <th className="text-left">
            Amount
          </th>

          <th className="text-left">
            Status
          </th>

          <th className="text-left">
            Update
          </th>

        </tr>

      </thead>

      <tbody>

        {orders.map((order) => (

          <tr
            key={order._id}
            className="border-b"
          >

            <td className="py-4">
              {order.userId?.name}
            </td>

            <td>
              ₹{order.totalAmount}
            </td>

            <td>
              {order.status}
            </td>

            <td>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(
                    order._id,
                    e.target.value
                  )
                }
                className="border rounded px-3 py-1"
              >

                <option>Pending</option>

                <option>Confirmed</option>

                <option>Shipped</option>

                <option>Delivered</option>

                <option>Cancelled</option>

              </select>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
)}

          {/* TAB 3: SYSTEM INVENTORY STATEMENTS CONTAINER */}
          {activeTab === "inventory" && (
            <div className="lg:col-span-3 bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 min-h-[320px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3">📊</div>
              <h2 className="text-[18px] font-bold text-black tracking-tight">Catalog & Stock Analytics</h2>
              <p className="mt-1 text-sm text-gray-400 max-w-xs leading-normal">
                Bulk tracking modifications, markdown managers, and log charts coming next.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;