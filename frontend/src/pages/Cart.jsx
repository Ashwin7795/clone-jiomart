import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
function Cart() {
  const [cart, setCart] = useState(null);
  const cartContext = useCart();
  const syncNavbarCart = cartContext ? cartContext.fetchCart : () => {};
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      console.log(error);
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
      console.log(error);
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

  if (!cart || !cart.items) {
    return <div className="text-center py-24 font-bold text-black text-2xl">Loading Cart...</div>;
  }
  if (cart.items.length === 0) {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-[#f3f4f6] px-6">
      
      <img
        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
        alt="Empty Cart"
        className="w-48 h-48 object-contain mb-6 opacity-90"
      />

      <h2 className="text-4xl font-bold text-black mb-3">
        Your cart is empty!
      </h2>

      <p className="text-gray-500 text-lg mb-8 text-center">
        It's a nice day to buy the items you saved for later!
      </p>

      <button
        onClick={() => window.location.href = "/"}
        className="bg-[#0078ad] hover:bg-[#00628f] text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
      >
        Continue Shopping
      </button>

    </div>
  );
}

  const subtotal = cart.items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);
  const dynamicDiscount = Math.round(subtotal * 0.4);
  const mrpTotal = subtotal + dynamicDiscount;

  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen py-10 font-sans antialiased text-[#141414]">
      {/* Expanded grid container layout mirroring image_4184e2.jpg bounds */}
      <div className="max-w-[1280px] mx-auto px-6">
        
        <h1 className="text-[28px] font-bold text-gray-900 mb-8 tracking-tight">Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Delivery & Active Selection Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Items Component Block */}
            <div className="bg-white rounded-[20px] p-8 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-5">
                <div>
                  <p className="text-[#00b259] font-bold text-[17px]">Delivery by 26th Jun</p>
                  <p className="text-gray-500 text-[14px] font-medium mt-0.5">Groceries ({cart.items.length} Item)</p>
                </div>
                <span className="font-bold text-[19px] text-black">₹{subtotal.toFixed(2)}</span>
              </div>

              {cart.items.map((item) => {
                if (!item.productId) return null;
                return (
                  <div key={item._id} className="flex gap-6 py-5 items-center justify-between border-b border-gray-50 last:border-0">
                    <div className="flex gap-5 items-center">
                      <img
                        src={item.productId?.images?.[0] || "https://www.jiomart.com/images/product/original/490002235/himalaya-purifying-neem-face-wash-200-ml-product-images-o490002235-p490002235-0-202203151327.png"}
                        alt={item.productId?.title}
                        className="w-24 h-24 object-contain rounded-lg shrink-0"
                      />
                      <h2 className="font-bold text-[17px] text-black max-w-[360px] leading-snug">
                        {item.productId?.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-8 shrink-0">
                      {/* Scaled Increment Control Block */}
                      <div className="flex items-center border border-[#0078ad] rounded-xl bg-[#e5f1f7] h-9 px-2 shadow-2xs">
                        <button
                          onClick={() => handleQuantityChange(item.productId._id, item.quantity, -1)}
                          className="text-[#0078ad] font-bold px-2.5 text-[20px]"
                        >
                          -
                        </button>
                        <span className="px-3 text-[16px] font-bold text-[#0078ad] min-w-[24px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId._id, item.quantity, 1)}
                          className="text-[#0078ad] font-bold px-2.5 text-[20px]"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right min-w-[100px]">
  <p className="font-bold text-[18px] text-black">
    ₹{item.productId?.price.toFixed(2)}
  </p>

  <p className="text-gray-400 line-through text-[13px] mt-0.5">
    ₹{(item.productId?.price * 1.4).toFixed(2)}
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

            {/* RECOMMENDATIONS SECTION ("You may also like") */}
            <div className="bg-[#fce6e7]/50 border border-[#fce6e7] rounded-[20px] p-8 shadow-sm">
              <h3 className="text-[20px] font-bold text-black mb-5 tracking-tight">You may also like</h3>
              
              <div className="flex flex-row gap-5 overflow-x-auto pb-4 scrollbar-none">
                {[
                  { 
                    title: "Tresemme Keratin Smooth Shampoo 1L", 
                    price: 599, 
                    old: 1070, 
                    img: "https://www.jiomart.com/images/product/original/491180235/tresemme-keratin-smooth-shampoo-580-ml-product-images-o491180235-p491180235-0-202203170724.png" 
                  },
                  { 
                    title: "Dove Cream Beauty Bathing Bar Soap", 
                    price: 340, 
                    old: 600, 
                    img: "https://www.jiomart.com/images/product/original/491372559/dove-cream-beauty-bathing-bar-75-g-pack-of-3-product-images-o491372559-p590116812-0-202203170425.png" 
                  },
                  { 
                    title: "Pears Pure & Gentle Bathing Bar 125g", 
                    price: 213, 
                    old: 260, 
                    img: "https://www.jiomart.com/images/product/original/490005741/pears-pure-gentle-bathing-bar-125-g-product-images-o490005741-p490005741-0-202203151351.png" 
                  }
                ].map((mockProduct, i) => (
                  <div key={i} className="min-w-[240px] max-w-[240px] bg-white rounded-2xl p-4 border border-gray-100 flex flex-col justify-between relative shadow-sm">
                    <button className="absolute top-4 left-4 text-gray-300 hover:text-red-500 text-2xl">♥</button>
                    <button className="absolute top-4 right-4 border border-[#0078ad] text-[#0078ad] bg-white font-bold text-[14px] px-4 py-1 rounded-lg hover:bg-[#e5f1f7]">Add</button>
                    <div className="w-40 h-40 my-4 mx-auto flex items-center justify-center">
                      <img src={mockProduct.img} alt="" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-[13px] text-gray-400 font-medium mb-1">1 Unit</p>
                      <h4 className="text-[15px] font-bold text-black line-clamp-2 leading-snug h-10 mb-2">{mockProduct.title}</h4>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[17px] font-black text-black">₹{mockProduct.price}</span>
                        <span className="text-[13px] text-gray-400 line-through">₹{mockProduct.old}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Highly Configured Summary Framework Modules */}
          <div className="space-y-5 w-full">
            
           

            {/* WhatsApp Updates Card */}
            <div className="bg-white rounded-[16px] p-5 border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4 max-w-[85%]">
                <span className="text-[#00b259] text-2xl">💬</span>
                <p className="text-[14px] text-gray-600 font-semibold leading-snug">
                  Enable order updates and important information on WhatsApp
                </p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-[#00b259] shrink-0 cursor-pointer" defaultChecked />
            </div>

            {/* Payment Details Container Card */}
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Odometer Header Widget */}
              <div className="bg-gradient-to-r from-[#3fa2d2] to-[#2573a7] text-white px-5 py-4 flex justify-between items-center text-[15px] font-bold shadow-inner">
                <span>🔥 You are saving ₹{dynamicDiscount.toFixed(2)} on this order</span>
                <div className="flex gap-0.5 bg-black/30 p-0.5 rounded border border-white/20 font-mono text-[16px] font-black px-2 tracking-tighter">
                  {String(dynamicDiscount).padStart(4, "0").split("").map((num, idx) => (
                    <span key={idx} className="px-0.5 border-r border-black/10 last:border-0">{num}</span>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-[17px] font-bold text-gray-800 border-b border-gray-50 pb-2">Payment Details</h3>
                
                <div className="flex justify-between font-medium text-gray-600 text-[15px]">
                  <span>MRP Total</span>
                  <span className="text-black">₹{mrpTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-medium text-gray-600 text-[15px]">
                  <span>Product Discount</span>
                  <span className="text-[#00b259] font-bold">-₹{dynamicDiscount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-medium text-gray-600 text-[15px] border-t border-dashed border-gray-200 pt-4">
                  <span>Subtotal</span>
                  <span className="text-black">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-[18px] font-bold text-black">Total</span>
                  <div className="text-right">
                    <p className="font-black text-[22px] text-black leading-none">₹{subtotal.toFixed(2)}</p>
                    <p className="text-[#00b259] text-[14px] font-bold mt-1.5">You Saved ₹{dynamicDiscount.toFixed(2)}</p>
                    <button
                      onClick={() => navigate("/checkout")}
  className="w-full mt-5 bg-[#0078ad] hover:bg-[#005f8f] text-white py-3 rounded-xl font-bold transition-colors"
>
  Proceed To Checkout
</button>
                  </div>
                </div>
              </div>
            </div>

         
            
            {/* Legal Disclaimers Box Component */}
            <div className="bg-white rounded-[16px] p-5 border border-gray-100 text-center shadow-2xs">
              <p className="text-[13px] text-gray-500 font-semibold leading-relaxed">
                Orders are eligible for cancellation or refund only before they are packed for delivery.
              </p>
              <button className="text-[#0078ad] text-[13px] font-bold underline mt-2 block mx-auto hover:text-[#00628f]">
                Cancellation policy
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;