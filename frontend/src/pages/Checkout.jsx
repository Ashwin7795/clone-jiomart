import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
function Checkout() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const { fetchCart } = useCart();
    const navigate = useNavigate();

  const isFormValid = 
    fullName.trim() !== "" && 
    phone.trim().length >= 10 && 
    address.trim() !== "" && 
    city.trim() !== "" && 
    state.trim() !== "" && 
    pincode.trim().length === 6;
  
const handlePlaceOrder = async () => {
  try {

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/orders",
      {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
localStorage.setItem("cartUpdated", Date.now());
   await fetchCart();

navigate("/order-success");
  } catch (error) {

    console.log(error.response?.data);

    alert(
      error.response?.data?.message ||
      "Order Failed"
    );

  }
};
  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      {/* Exact 1170px centered layout frame matching our high-density desktop rules */}
      <div className="max-w-[1170px] mx-auto px-6">
        
        <h1 className="text-[26px] font-bold text-gray-900 mb-8 tracking-tight">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Shipping and Delivery Parameters Container */}
          <div className="lg:col-span-2 bg-white rounded-[20px] p-8 border border-gray-100 shadow-sm space-y-6">
            
            <h2 className="text-[19px] font-bold text-black border-b border-gray-100 pb-3 mb-2 tracking-tight">
              Delivery Address
            </h2>

            {/* Full Name Field */}
            <div className="w-full flex flex-col items-start">
              <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                Full Name
              </label>
              <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                <input
                  type="text"
                  placeholder="Enter recipient full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-full bg-transparent text-sm font-medium outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="w-full flex flex-col items-start">
              <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                Contact Mobile Number
              </label>
              <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                <span className="text-sm font-bold text-gray-400 mr-2 border-r border-gray-200 pr-2">+91</span>
                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-full bg-transparent text-sm font-medium outline-none"
                  required
                />
              </div>
            </div>

            {/* Address Area Field */}
            <div className="w-full flex flex-col items-start">
              <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                Flat / House No. / Floor / Building / Street Address
              </label>
              <textarea
                rows="3"
                placeholder="Enter absolute local landmark and block shipping details..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 focus:border-[#0078ad] focus:border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all resize-none"
                required
              />
            </div>

            {/* City, State, and Pincode Triple Execution Grid Row */}
            <div className="grid sm:grid-cols-3 gap-5 w-full">
              
              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  City
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  State
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">
                  Pincode
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                  <input
                    type="text"
                    placeholder="6 Digits"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-full bg-transparent text-sm font-medium outline-none tracking-wider text-left"
                    required
                  />
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Payment Configuration Module Frame */}
          <div className="space-y-5 w-full">
            
            <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm sticky top-28">
              
              <h2 className="text-[19px] font-bold text-black border-b border-gray-100 pb-4 mb-5 tracking-tight">
                Payment Option
              </h2>

              {/* JioMart Native Style Radio Button Field */}
              <div className="w-full border border-gray-200 rounded-xl p-4 bg-[#f9f9f9]/50 flex items-center gap-4 cursor-pointer hover:border-[#0078ad]/40 transition-all">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked
                  readOnly
                  className="w-5 h-5 accent-[#0078ad] cursor-pointer"
                />
                <label htmlFor="cod" className="flex flex-col cursor-pointer text-left">
                  <span className="text-[15px] font-bold text-black">Cash On Delivery (COD)</span>
                  <span className="text-[12px] text-gray-500 font-medium mt-0.5">Pay safely via Cash, UPI, or Card at your doorstep</span>
                </label>
              </div>

              {/* Interactive Submit Placement Block Anchor */}
              <button
                type="button"
                disabled={!isFormValid}
                onClick={handlePlaceOrder}
                className={`w-full h-13 mt-8 font-sans font-bold text-base rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                  isFormValid
                    ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer active:scale-[0.99]"
                    : "bg-[#b8e0f2] text-white cursor-not-allowed"
                }`}
              >
                Place Order
              </button>

              <p className="text-[12px] text-gray-400 font-medium text-center mt-4 leading-normal">
                By processing order checkouts, you agree to comply with our commercial store distribution policies.
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;