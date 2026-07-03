import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const isAdmin = searchParams.get("from") === "admin";
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
      <div className="w-full bg-[#f3f4f6] min-h-screen flex items-center justify-center font-sans antialiased">
        <h1 className="text-xl font-bold text-gray-500 animate-pulse">Loading Invoice Summary...</h1>
      </div>
    );
  }

  const itemsSubtotal = order.products?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || order.totalAmount;

  const updateStatus = async (status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${order._id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder((prev) => ({
        ...prev,
        status,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const steps = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
  ];

  const currentStep = steps.indexOf(order.status);

  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      <div className="max-w-[1024px] mx-auto px-6">
        
        {/* Back and Page Header Controller Anchor Block */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() =>
              navigate(
                searchParams.get("from") === "admin"
                  ? "/admin?tab=orders"
                  : "/my-orders"
              )
            }
            className="text-gray-500 hover:text-black font-semibold text-sm flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Order Invoice Summary</h1>
        </div>

        {/* 1. Header Order Manifest Metadata Ribbon */}
        <div className="bg-white rounded-t-2xl border border-gray-100 border-b-0 px-6 py-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="text-left">
            <p className="uppercase text-[11px] font-bold tracking-wider text-gray-400">Invoice Reference ID</p>
            <p className="font-mono text-gray-900 font-bold text-[14px] mt-0.5 select-all">
              #{order._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
              {order.status}
            </span>

            {isAdmin && (
              <div className="relative h-8">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="bg-white border border-gray-200 text-xs font-bold rounded-lg px-3 h-full outline-none cursor-pointer focus:border-[#0078ad] transition-all text-black pr-7 appearance-none"
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
            )}
          </div>
        </div>

        {/* 2. Order Timeline - Styled cleanly across full-width landscape orientation */}
        <div className="bg-white border border-gray-100 border-b-0 p-6 text-left shadow-2xs">
          <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-5 select-none">
            Order Timeline
          </h3>
          
          <div className="w-full flex items-center justify-between relative px-2 pt-2 pb-4">
            {steps.map((step, index) => {
              const isPastOrCurrent = index <= currentStep && order.status !== "Cancelled";
              const isCurrent = index === currentStep && order.status !== "Cancelled";
              
              return (
                <div key={step} className={`flex items-center ${index !== steps.length - 1 ? "flex-1" : ""}`}>
                  
                  {/* Step Node Point */}
                  <div className="flex flex-col items-center relative z-10 min-w-[65px]">
                    <div 
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isPastOrCurrent 
                          ? "bg-emerald-500 border-emerald-500 ring-4 ring-emerald-100" 
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <span className={`text-[12px] font-semibold tracking-tight mt-3 transition-colors ${
                      isCurrent ? "text-[#0078ad] font-bold" : isPastOrCurrent ? "text-gray-900" : "text-gray-400"
                    }`}>
                      {step}
                    </span>
                  </div>

                  {/* Connecting Progress Track Line */}
                  {index !== steps.length - 1 && (
                    <div className="flex-1 h-[2px] bg-gray-100 mx-2 -translate-y-4 relative overflow-hidden">
                      <div 
                        className={`absolute inset-0 h-full transition-all duration-500 ${
                          index < currentStep && order.status !== "Cancelled" ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                        style={{ width: index < currentStep && order.status !== "Cancelled" ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cancelled Flag View Callout */}
          {order.status === "Cancelled" && (
            <div className="mt-2 bg-rose-50 border border-rose-100 rounded-xl p-3.5 text-center text-rose-600 text-xs font-bold uppercase tracking-wider animate-fadeIn">
              ⚠️ This transaction flow has been marked as Cancelled.
            </div>
          )}
        </div>

        {/* 3. Structured Content Split Workspace Panel Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start mb-10">
          
          {/* LEFT SIDEBAR SECTION: Dynamic Product Items Track */}
          <div className="md:col-span-2 bg-white rounded-b-2xl md:rounded-bl-2xl border border-gray-100 p-6 shadow-xs divide-y divide-gray-50">
            <h2 className="text-[16px] font-bold text-gray-800 pb-3 tracking-tight text-left">
              Products Shipped ({order.products?.length || 0})
            </h2>

            {order.products?.map((item) => {
              if (!item.productId) return null;
              return (
                <div key={item._id} className="flex items-center justify-between gap-4 py-4 last:pb-0">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-16 h-16 bg-[#f9f9f9] border border-gray-100 rounded-xl p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={item.productId.images?.[0] || "/placeholder.png"}
                        alt={item.productId.title}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[15px] text-gray-950 line-clamp-2 leading-snug max-w-[340px]">
                        {item.productId.title}
                      </h3>
                      <p className="text-[12px] text-gray-400 font-medium mt-1">
                        Quantity Ordered: <span className="text-gray-700 font-semibold">{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-[15px] text-gray-900 shrink-0">
                    ₹{((item.price || item.productId.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDEBAR SECTION: Address Info and Breakdown Overview */}
          <div className="space-y-6 w-full">
            
            {/* Shipping Details Parameters Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs text-left">
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Shipping Details
              </h3>
              <div className="text-[14px] font-medium text-gray-800 space-y-1">
                <p className="font-bold text-gray-950 text-[15px]">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-500 font-mono text-[13px] pt-0.5">📞 +91 {order.shippingAddress?.phone}</p>
                <p className="text-gray-600 leading-relaxed pt-1 border-t border-gray-50 mt-2">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-bold text-gray-900">{order.shippingAddress?.pincode}</span>
                </p>
              </div>
            </div>

            {/* Invoiced Payment Breakdown Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs text-left">
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                Payment Breakdown
              </h3>
              
              <div className="space-y-3 text-[14px] font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-gray-900 font-semibold">₹{itemsSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping & Delivery</span>
                  <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                </div>
                
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline text-[16px] font-bold text-gray-900">
                  <span>Amount Paid</span>
                  <span className="text-[#0078ad] font-bold text-[18px]">₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-100 pt-3.5 space-y-2 text-xs font-medium text-gray-500">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="text-gray-900 font-semibold uppercase tracking-tight">{order.payment?.method || "N/A"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className={`font-semibold uppercase tracking-tight ${order.payment?.status?.toLowerCase() === "verified" || order.payment?.status?.toLowerCase() === "completed" ? "text-emerald-600" : "text-gray-900"}`}>
                      {order.payment?.status || "N/A"}
                    </span>
                  </div>

                  {order.payment?.paymentId && (
                    <div className="flex justify-between items-center pt-1">
                      <span>Payment ID</span>
                      <span className="font-mono text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100/50 select-all max-w-[120px] truncate">
                        {order.payment.paymentId}
                      </span>
                    </div>
                  )}
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