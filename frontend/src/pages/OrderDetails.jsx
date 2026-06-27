import { useEffect, useState } from "react";
import { useParams, useNavigate,useSearchParams,} from "react-router-dom";
import axios from "axios";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchOrder();
    }
  }, [id, token]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  if (!order) {
    return (
      <div className="w-full bg-[#f3f4f6] min-h-screen flex items-center justify-center font-sans">
        <h1 className="text-xl font-bold text-gray-500 animate-pulse">Loading Invoice Summary...</h1>
      </div>
    );
  }

  // Calculate dynamic sub-elements safely based on populated states
  const itemsSubtotal = order.products?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || order.totalAmount;

  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      <div className="max-w-[1024px] mx-auto px-6">
        
        {/* Back and Page Header Controller Anchor Block */}
        <div className="flex items-center gap-3 mb-6">
         <button
  onClick={() =>
    navigate(
      searchParams.get("from") === "admin"
        ? "/admin?tab=orders"
        : "/my-orders"
    )
  }
  className="text-gray-500 hover:text-black font-bold text-sm flex items-center gap-1 transition-colors cursor-pointer"
>
  ← Back
</button>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Order Invoice Summary</h1>
        </div>

        {/* 1. Header Order Manifest Metadata Ribbon */}
        <div className="bg-white rounded-t-2xl border border-gray-100 border-b-0 px-6 py-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div>
            <p className="uppercase text-[11px] font-bold tracking-wider text-gray-400">Invoice Reference ID</p>
           <p className="font-mono text-black font-bold text-[14px] mt-0.5 select-all">
  #{order._id?.slice(-8).toUpperCase()}
</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-[12px] font-black tracking-wide uppercase border ${getStatusStyle(order.status)}`}>
              {order.status || "Processing"}
            </span>
          </div>
        </div>

        {/* 2. Structured Content Split Workspace Panel Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          
          {/* LEFT SIDEBAR SECTION: Dynamic Nested Product Records Block */}
          <div className="md:col-span-2 bg-white rounded-b-2xl md:rounded-bl-2xl border border-gray-100 p-6 shadow-xs divide-y divide-gray-50">
            <h2 className="text-[16px] font-bold text-gray-800 pb-3 tracking-tight">
              Products Shipped ({order.products?.length || 0})
            </h2>

            {order.products?.map((item) => {
              if (!item.productId) return null;
              return (
                <div key={item._id} className="flex items-center justify-between gap-4 py-4 last:pb-0">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail Mask Frame */}
                    <div className="w-16 h-16 bg-[#f9f9f9] border border-gray-100 rounded-xl p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={item.productId.images?.[0] || "/placeholder.png"}
                        alt={item.productId.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-[15px] text-black line-clamp-2 leading-snug max-w-[340px]">
                        {item.productId.title}
                      </h3>
                      <p className="text-[12px] text-gray-400 font-semibold mt-1">
                        Quantity Ordered: <span className="text-gray-700 font-bold">{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-[15px] text-black shrink-0">
                    ₹{((item.price || item.productId.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDEBAR SECTION: Fixed Addresses and Final Pricing Item Breakdown */}
          <div className="space-y-6 w-full">
            
            {/* Delivery Parameters Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs text-left">
              <h3 className="text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Shipping Details
              </h3>
              <div className="text-[14px] font-medium text-gray-800 space-y-1">
                <p className="font-bold text-black text-[15px]">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-500 font-mono text-[13px] pt-0.5">📞 +91 {order.shippingAddress?.phone}</p>
                <p className="text-gray-600 leading-relaxed pt-1 border-t border-gray-50 mt-2">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-bold text-black">{order.shippingAddress?.pincode}</span>
                </p>
              </div>
            </div>

            {/* Invoiced Payment Breakdown Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs text-left">
              <h3 className="text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                Payment Breakdown
              </h3>
              
              <div className="space-y-3 text-[14px] font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-black font-semibold">₹{itemsSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping & Delivery</span>
                  <span className="text-emerald-600 font-bold text-[12px] bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                </div>
                
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-[16px] font-bold text-black">
                  <span>Amount Paid</span>
                  <span className="text-[#0078ad] font-black text-[18px]">₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderDetails;