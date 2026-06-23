import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Cart() {
  const [cart, setCart] = useState(null);
  const { fetchCart: syncNavbarCart } = useCart();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
    } catch (error) {
      console.log("Error loading cart details:", error);
    }
  };

  const handleQuantityChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      syncNavbarCart();
    } catch (error) {
      console.log("Error altering quantity values:", error);
    }
  };

  const handleRemove = async (productId) => {
  try {
    await axios.delete(
      "http://localhost:5000/api/cart/remove",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          productId,
        },
      }
    );

    fetchCart();
    syncNavbarCart();

  } catch (error) {
    console.log("Error removing item:", error);
  }
};

  if (!token) {
    return (
      <div className="text-center py-32 text-xl font-bold font-sans text-black">
        Please log in to view your cart items.
      </div>
    );
  }

  if (!cart || !cart.items) {
    return (
      <div className="text-center py-32 text-xl font-bold font-sans text-black animate-pulse">
        Loading Cart Details...
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-32 text-xl font-bold font-sans text-black">
        Your basket is empty. Let's add some items!
      </div>
    );
  }

  // Calculate matching dynamic layout prices
  const subtotal = cart.items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);
  const dynamicDiscount = Math.round(subtotal * 0.4); // Simulating JioMart's 40% Markdown Engine
  const mrpTotal = subtotal + dynamicDiscount;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 font-sans text-black" style={{ backgroundColor: "#f5f5f5" }}>
      <h1 className="text-[26px] font-bold text-black mb-6 tracking-tight">Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Hand Side Block Container */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            
            {/* Delivery Estimation Strip */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <div>
                <p className="text-[#00b259] font-bold text-[15px]">Delivery by 26th Jun</p>
                <p className="text-gray-500 text-[13px]">Groceries ({cart.items.length} Item)</p>
              </div>
              <span className="font-bold text-[16px]">₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Product Mapping Block */}
            {cart.items.map((item) => {
              if (!item.productId) return null;
              return (
                <div key={item._id} className="flex gap-4 py-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.productId.images?.[0] || "/placeholder.png"}
                      alt={item.productId.title}
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h2 className="font-bold text-[15px] text-black max-w-[340px] leading-tight">
                        {item.productId.title}
                      </h2>
                    </div>
                  </div>

                  {/* Quantity Actions Selector Grid Block */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-[#0078ad] rounded-lg bg-[#e5f1f7] h-8 px-1">
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, item.quantity, -1)}
                        className="text-[#0078ad] font-bold px-2 text-[16px]"
                      >
                        -
                      </button>
                      <span className="px-3 text-[14px] font-bold text-[#0078ad]">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, item.quantity, 1)}
                        className="text-[#0078ad] font-bold px-2 text-[16px]"
                      >
                        +
                      </button>
                    </div>
                    
                 <div className="text-right">
  <p className="font-bold text-[15px]">
    ₹{item.productId.price.toFixed(2)}
  </p>

  <p className="text-gray-400 line-through text-[12px]">
    ₹{(item.productId.price * 1.4).toFixed(2)}
  </p>

  <button
    onClick={() => handleRemove(item.productId._id)}
    className="mt-2 text-red-600 text-sm font-semibold hover:underline"
  >
    Remove
  </button>
</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand Sticky Control Summary Panel */}
        <div className="space-y-4 w-full">
          
          {/* Coupon Action Card Element */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-[#00b259] text-xl">🉐</span>
              <span className="text-[14px] font-bold text-gray-700">Login to apply coupon</span>
            </div>
            <span className="text-gray-400 text-sm">➔</span>
          </div>

          {/* WhatsApp Notification Opt-In Toggle Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3 max-w-[85%]">
              <span className="text-[#00b259] text-xl">💬</span>
              <p className="text-[13px] text-gray-600 font-medium leading-tight">
                Enable order updates and important information on WhatsApp
              </p>
            </div>
            <input type="checkbox" className="w-4 h-4 accent-[#00b259]" defaultChecked />
          </div>

          {/* Core Payments Breakdown Module Container Box */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Real Savings Dynamic Metric Header Strip Bar */}
            <div className="bg-[#0078ad] text-white px-4 py-2.5 flex justify-between items-center text-[13px] font-bold">
              <span>You are saving ₹{dynamicDiscount.toFixed(2)} on this order</span>
              <span className="bg-black/20 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider">
                ₹ {subtotal}
              </span>
            </div>

            <div className="p-5 space-y-4">
              <h3 className="text-[15px] font-bold border-b border-gray-100 pb-2">Payment Details</h3>
              
              <div className="flex justify-between text-[14px] text-gray-700 font-medium">
                <span>MRP Total</span>
                <span className="text-black">₹{mrpTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[14px] text-gray-700 font-medium">
                <span>Product Discount</span>
                <span className="text-[#00b259]">-₹{dynamicDiscount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[14px] text-gray-700 font-medium border-t border-dashed border-gray-200 pt-3">
                <span>Subtotal</span>
                <span className="text-black font-bold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[16px] font-bold text-black pt-2 border-t border-gray-100">
                <span>Total</span>
                <div className="text-right">
                  <p className="font-black text-[18px]">₹{subtotal.toFixed(2)}</p>
                  <p className="text-[#00b259] text-[12px] font-bold">You Saved ₹{dynamicDiscount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;