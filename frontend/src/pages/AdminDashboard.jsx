import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [inventory, setInventory] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [orders, setOrders] = useState([]);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "products"
  );
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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
    if (activeTab === "inventory") {
      fetchInventory();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
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
      } else {
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
      }

      if (editingProduct) {
        alert("Product Updated Successfully!");
      } else {
        alert("Product Added Successfully!");
      }

      setTitle("");
      setDescription("");
      setCategory("Groceries");
      setSubcategory("");
      setBrand("");
      setPrice("");
      setStock("");
      setImageUrl("");
      setEditingProduct(null);
      setActiveTab("inventory");
      fetchInventory();
      fetchDashboardStats();
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Failed to Save Product");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInventory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchInventory();
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      console.log(error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description);
    setCategory(product.category);
    setSubcategory(product.subcategory);
    setBrand(product.brand);
    setPrice(product.price);
    setStock(product.stock);
    setImageUrl(product.images?.[0] || "");
    setActiveTab("products");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const isFormValid = title.trim() && price && stock && imageUrl.trim();

  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      <div className="max-w-[1170px] mx-auto px-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/60 pb-6 mb-8 gap-4 text-left">
          <div className="flex-1">
            <h1 className="text-[28px] font-black text-gray-900 tracking-tight leading-none">
              Admin Dashboard
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-2.5">
              Admin Console — Overview system parameters, catalogs, tracking rows, and store inventories.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-5 h-10 border border-red-200 bg-red-50/40 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0"
          >
            Logout
          </button>
        </div>

        {/* Real-time Insights Summary Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8 text-left">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
            <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Revenue</p>
            <h2 className="text-[24px] font-black text-gray-900 mt-2">₹{stats.revenue.toLocaleString("en-IN")}</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
            <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Orders</p>
            <h2 className="text-[24px] font-black text-gray-900 mt-2">{stats.totalOrders}</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
            <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Products</p>
            <h2 className="text-[24px] font-black text-gray-900 mt-2">{stats.totalProducts}</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
            <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Customers</p>
            <h2 className="text-[24px] font-black text-gray-900 mt-2">{stats.totalCustomers}</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs col-span-2 md:col-span-1">
            <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Pending Orders</p>
            <h2 className="text-[24px] font-black text-orange-500 mt-2">{stats.pendingOrders}</h2>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex gap-2 mb-8 border-b border-gray-200/40 pb-4 justify-start">
          {[
            { id: "products", label: "Products" },
            { id: "orders", label: "Orders" },
            { id: "inventory", label: "Inventory" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-black tracking-wide transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#0078ad] text-white shadow-xs"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Display Area */}
        <div className="w-full">
          
          {/* TAB 1: PRODUCTS WORKFLOW */}
          {activeTab === "products" && (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <form 
                onSubmit={handleSubmit} 
                className="lg:col-span-2 bg-white rounded-[20px] border border-gray-100 p-8 space-y-5 shadow-xs"
              >
                <h2 className="text-[18px] font-black text-black border-b border-gray-100 pb-3 mb-2 tracking-tight text-left">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2> 

                <div className="w-full flex flex-col items-start">
                  <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                    Product Title
                  </label>
                  <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                    <input
                      type="text"
                      placeholder="Enter catalog item title nomenclature..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col items-start">
                  <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                    Description Summary
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Provide descriptive inventory documentation metrics for storefront layouts..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 focus:border-[#0078ad] focus:border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all resize-none text-black"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5 w-full">
                  <div className="w-full flex flex-col items-start">
                    <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                      Category
                    </label>
                    <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 relative bg-transparent">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-full bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none text-black pr-10 text-left"
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
                      Subcategory Tag
                    </label>
                    <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                      <input
                        type="text"
                        placeholder="e.g., Staples, Audio, Wearables"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-5 w-full">
                  <div className="w-full flex flex-col items-start">
                    <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                      Brand
                    </label>
                    <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                      <input
                        type="text"
                        placeholder="Manufacturer"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-start">
                    <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                      Retail Price (₹)
                    </label>
                    <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-start">
                    <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                      Available Stock
                    </label>
                    <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                      <input
                        type="number"
                        placeholder="Units"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col items-start">
                  <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                    Asset Image URL
                  </label>
                  <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                    <input
                      type="text"
                      placeholder="Paste cloud asset image storage URL reference path..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full h-12 rounded-full font-sans font-bold text-sm flex items-center justify-center transition-all duration-200 shadow-sm ${
                      isFormValid
                        ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer"
                        : "bg-[#b8e0f2] text-white cursor-not-allowed"
                    }`}
                  >
                    {editingProduct ? "Update Product" : "Add Product to Catalog"}
                  </button>

                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setTitle("");
                        setDescription("");
                        setCategory("Groceries");
                        setSubcategory("");
                        setBrand("");
                        setPrice("");
                        setStock("");
                        setImageUrl("");
                      }}
                      className="w-full h-12 border border-gray-200 hover:border-gray-300 bg-white text-gray-500 hover:text-black font-bold text-xs rounded-full transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Live Preview Panel */}
              <div className="w-full sticky top-28">
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 flex flex-col items-center">
                  <h3 className="text-[11px] font-black text-gray-400 self-start mb-4 tracking-wider uppercase">
                    Live Component Preview
                  </h3>

                  <div className="w-full aspect-square max-w-[220px] bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden p-4 group">
                    {imageUrl.trim() ? (
                      <img
                        src={imageUrl}
                        alt="Preview structural thumbnail window"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/300x300/f0f4f9/a0aec0?text=Invalid+Image+URL";
                        }}
                      />
                    ) : (
                      <div className="text-center flex flex-col items-center gap-2 text-gray-400">
                        <svg className="w-7 h-7 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className="text-[10px] font-bold">Image will auto-render here</p>
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-5 bg-[#f0f4f9]/50 border border-gray-100/60 rounded-xl p-4 text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Item Structure</p>
                    <h4 className="text-[15px] font-bold text-gray-900 mt-1 truncate">
                      {title.trim() ? title : "Untitled Product Asset"}
                    </h4>
                    
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/40">
                      <span className="text-[16px] font-black text-gray-900">₹{price ? Number(price).toFixed(2) : "0.00"}</span>
                      <span className="bg-[#0078ad] text-white text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5 rounded-md shadow-3xs">
                        {category}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-200/40 flex justify-between text-[11px] font-bold text-gray-500">
                      <span>Stock Pool: <span className="text-black font-black">{stock || 0}</span></span>
                      <span>Brand: <span className="text-black font-black truncate max-w-[80px] inline-block align-bottom">{brand || "-"}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LOGGER */}
          {activeTab === "orders" && (
            <div className="w-full bg-white rounded-[20px] border border-gray-100 p-8 shadow-xs overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 text-left">Customer Orders</h2>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[600px]">
                  <thead>
                    <tr className="text-gray-500 text-sm border-b">
                      <th className="text-left py-3 font-semibold">Customer</th>
                      <th className="text-left font-semibold">Amount</th>
                      <th className="text-left font-semibold">Status</th>
                      <th className="text-center font-semibold">Update</th>
                      <th className="text-center font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 rounded-l-xl">
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">{order.userId?.name}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{order.userId?.email}</p>
                            <p className="text-xs text-gray-400 mt-1.5 font-medium">
                              {order.products[0]?.productId?.title}
                              {order.products.length > 1 && ` + ${order.products.length - 1} more`}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-sm font-bold text-gray-900">
                          ₹{order.totalAmount}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                            order.status === "Delivered" ? "bg-green-100 text-green-700" :
                            order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                            order.status === "Confirmed" ? "bg-purple-100 text-purple-700" :
                            order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="relative inline-block h-9 text-left">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              className="bg-white border border-gray-200 text-xs font-bold rounded-lg px-3 h-full outline-none cursor-pointer focus:border-[#0078ad] transition-all text-black pr-8 appearance-none"
                            >
                              <option>Pending</option>
                              <option>Confirmed</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center rounded-r-xl">
                          <button
                            type="button"
                            onClick={() => navigate(`/orders/${order._id}?from=admin`)}
                            className="bg-[#0078ad] hover:bg-[#00618b] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-3xs"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY REGISTRY */}
          {activeTab === "inventory" && (
            <div className="w-full bg-white rounded-[20px] border border-gray-100 p-8 shadow-xs overflow-hidden animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6 text-left">Inventory</h2>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-sm">
                      <th className="pb-3 font-semibold">Image</th>
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Stock</th>
                      <th className="pb-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {inventory.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg p-1 flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={product.images?.[0]}
                              alt={product.title}
                              className="max-w-full max-h-full object-contain mix-blend-multiply"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Item"; }}
                            />
                          </div>
                        </td>
                        <td className="py-3 text-sm font-bold text-gray-900 max-w-[220px] truncate pr-4">
                          {product.title}
                        </td>
                        <td className="py-3 text-xs font-semibold text-gray-400 pr-4">
                          {product.category}
                        </td>
                        <td className="py-3 text-sm font-bold text-gray-900 pr-4">
                          ₹{product.price}
                        </td>
                        <td className="py-3 pr-4">
                          {product.stock < 10 ? (
                            <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold inline-block">
                              Low Stock ({product.stock})
                            </span>
                          ) : (
                            <span className="text-green-600 font-bold inline-block">
                              {product.stock}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-all cursor-pointer shadow-3xs"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 transition-all cursor-pointer shadow-3xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;