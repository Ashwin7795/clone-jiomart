import { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Helper utility method to style tracking states based on backend values
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-[#00b259] border-emerald-100";
      case "shipped":
        return "bg-blue-50 text-[#0078ad] border-blue-100";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  if (!token) {
    return (
      <div className="text-center py-32 text-xl font-bold font-sans text-black">
        Please sign in to access your tracking history.
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-32 text-xl font-bold font-sans text-black">
        No orders processed yet. Let's start filling your basket!
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      {/* Maximum compact layout width pulls columns inward for a premium high-impact scale */}
      <div className="max-w-[1024px] mx-auto px-6">
        
        <h1 className="text-[26px] font-bold text-gray-900 mb-8 tracking-tight">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              
              {/* 1. Header Order Manifest Banner Metadata Strip */}
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-[13px] text-gray-500 font-medium">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="uppercase text-[11px] font-bold tracking-wider text-gray-400">Order Placed</p>
                    <p className="text-black font-semibold mt-0.5">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-[11px] font-bold tracking-wider text-gray-400">Total Bill</p>
                    <p className="text-black font-black text-[14px] mt-0.5">₹{Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="uppercase text-[11px] font-bold tracking-wider text-gray-400">Order ID ID</p>
                  <p className="font-mono text-black font-bold mt-0.5 select-all">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>

              {/* 2. Content Row — Multiplex Product Sub-Item Nested Loop Map */}
              <div className="p-6 divide-y divide-gray-50">
                {order.products?.map((item, idx) => {
                  if (!item.productId) return null;
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        {/* Compact Thumbnail Mask */}
                        <div className="w-16 h-16 bg-[#f9f9f9] border border-gray-100 rounded-lg p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={item.productId.images?.[0] || "/placeholder.png"}
                            alt={item.productId.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div>
                          <h3 className="font-bold text-[15px] text-black line-clamp-1 leading-snug max-w-[420px]">
                            {item.productId.title}
                          </h3>
                          <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                            Brand: <span className="text-gray-600 font-semibold">{item.productId.brand || "Generic"}</span> &nbsp;|&nbsp; Qty: <span className="text-gray-600 font-bold">{item.quantity}</span>
                          </p>
                        </div>
                      </div>

                      {/* Display Unit Rates For Individual Content Records */}
                      <div className="text-right shrink-0 sm:block hidden">
                        <span className="font-bold text-[15px] text-gray-800">₹{(item.productId.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3. Base Fulfillment Control & Color Coded Tracking Status Badge Strip */}
              <div className="border-t border-gray-50 px-6 py-4 bg-white flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-gray-500">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-black tracking-wide uppercase border ${getStatusStyle(order.status)}`}>
                    {order.status || "Processing"}
                  </span>
                </div>

                <button 
                  onClick={() => alert(`Details window processing for Order ID: ${order._id}`)}
                  className="border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded-lg text-[13px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  Track Item Flow
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MyOrders;