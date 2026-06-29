import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";
function FloatingCart() {
  const navigate = useNavigate();
  const { cartItems, cartCount } = useCart();
  const location = useLocation();
  if (
  location.pathname === "/cart" ||
  location.pathname === "/checkout"
) {
  return null;
}

  if (cartCount === 0) return null;

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-4 font-sans select-none">
      {/* High-Contrast Signature Blue Bar with Squircle Pill Radius */}
      <div className="bg-[#0078ad] text-white rounded-2xl px-5 py-3.5 shadow-[0_10px_25px_rgba(0,120,173,0.3)] flex items-center justify-between border border-white/10 backdrop-blur-xs">
        
        {/* Left Item & Price Overview Stack */}
       <div className="flex items-center gap-3">

  <img
    src={cartItems[0]?.productId?.images?.[0]}
    alt={cartItems[0]?.productId?.title}
    className="w-14 h-14 rounded-lg bg-white p-1 object-contain"
  />

  <div className="text-left">

    <p className="text-[12px] font-bold text-sky-100 uppercase tracking-wider">

      {cartCount} Item{cartCount > 1 ? "s" : ""}

    </p>

    <p className="text-sm font-semibold truncate max-w-[150px]">

      {cartItems[0]?.productId?.title}

      {cartItems.length > 1 &&
        ` +${cartItems.length - 1} more`}

    </p>

    <p className="text-[18px] font-black mt-1">

      ₹{totalPrice.toLocaleString("en-IN")}

    </p>

  </div>

</div>

        {/* Right Navigation Action Trigger */}
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="bg-white text-[#0078ad] hover:bg-gray-50 active:scale-[0.97] font-sans font-extrabold text-[13px] px-5 py-2.5 rounded-xl shadow-xs transition-all duration-150 cursor-pointer flex items-center gap-1 focus:outline-none"
        >
          <span>View Cart</span>
          <span className="text-[14px] font-medium leading-none">➔</span>
        </button>

      </div>
    </div>
  );
}

export default FloatingCart;