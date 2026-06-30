import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  


  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(response.data);

      if (response.data.length > 0) {
        const defaultAddress = response.data.find((a) => a.isDefault);
        setSelectedAddress(defaultAddress?._id || response.data[0]._id);
      } else {
        setShowAddressForm(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      if (editingAddress) {
        await axios.put(
          `http://localhost:5000/api/address/${editingAddress._id}`,
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
      } else {
        await axios.post(
          "http://localhost:5000/api/address",
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
      }

      fetchAddresses();
      setEditingAddress(null);
      setShowAddressForm(false);

      setFullName("");
      setPhone("");
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm("Delete this address?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAddresses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAddress = (item) => {
    setEditingAddress(item);
    setFullName(item.fullName);
    setPhone(item.phone);
    setAddress(item.address);
    setCity(item.city);
    setState(item.state);
    setPincode(item.pincode);
    setShowAddressForm(true);
  };

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
          addressId: selectedAddress,
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
      alert(error.response?.data?.message || "Order Failed");
    }
  };

const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    // TODO: We'll replace this with the cart total later
    const amount = 50000;

    const response = await axios.post(
      "http://localhost:5000/api/payment/create-order",
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: response.data.amount,
      currency: response.data.currency,
      order_id: response.data.id,

      name: "JioMart",

      description: "Order Payment",

     handler: async function (payment) {

  try {

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/payment/verify",
      {
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,

        addressId: selectedAddress,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchCart();

    navigate("/order-success");

  } catch (error) {

    console.log(error);

    alert("Payment verification failed");

  }

},

      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.log(response.error);
      alert("Payment Failed");
    });

    razorpay.open();

  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen py-10 font-sans antialiased text-[#141414] select-none">
      <div className="max-w-[1170px] mx-auto px-6">
        <h1 className="text-[26px] font-bold text-gray-900 mb-8 tracking-tight">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: Shipping and Delivery Parameters Container */}
          <div className="lg:col-span-2 bg-white rounded-[20px] p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-[19px] font-bold text-black border-b border-gray-100 pb-3 mb-2 tracking-tight">
              Delivery Address
            </h2>

            {addresses.length > 0 && !showAddressForm && (
              <div className="space-y-4">
                {addresses.map((item) => (
                  <label
                    key={item._id}
                    className={`flex items-start gap-4 border rounded-xl p-5 cursor-pointer transition-all ${
                      selectedAddress === item._id 
                        ? "border-[#0078ad] bg-[#e5f1f7]/20 shadow-2xs" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddress === item._id}
                      onChange={() => setSelectedAddress(item._id)}
                      className="w-4 h-4 mt-1 accent-[#0078ad]"
                    />

                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-[15px]">{item.fullName}</p>
                          {item.isDefault && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                              Default
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-gray-500 mt-1">
                        📞 +91 {item.phone}
                      </p>

                      <p className="text-sm font-medium text-gray-600 mt-1.5 leading-relaxed">
                        {item.address}, {item.city}, {item.state} - <span className="font-bold text-gray-900">{item.pincode}</span>
                      </p>

                      {/* Unified Action Layout Group Block */}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100/60">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditAddress(item);
                          }}
                          className="text-[#0078ad] text-xs font-bold hover:underline cursor-pointer"
                        >
                          Edit Address
                        </button>
                        <span className="text-gray-300 text-xs">|</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteAddress(item._id);
                          }}
                          className="text-red-500 text-xs font-bold hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  </label>
                ))}

                <div className="pt-2 flex flex-col items-start">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(true);
                      setFullName("");
                      setPhone("");
                      setAddress("");
                      setCity("");
                      setState("");
                      setPincode("");
                    }}
                    className="text-[#0078ad] font-bold text-sm hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>+</span> Add New Delivery Address
                  </button>
                </div>
              </div>
            )}

            {showAddressForm && (
              <div className="space-y-5 animate-fadeIn">
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
                      className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
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
                    <span className="text-sm font-bold text-gray-400 mr-2 border-r border-gray-200 pr-2 select-none">+91</span>
                    <input
                      type="tel"
                      placeholder="10 digit mobile number"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
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
                    className="w-full border border-gray-300 focus:border-[#0078ad] focus:border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all resize-none text-black"
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
                        className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
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
                        className="w-full h-full bg-transparent text-sm font-medium outline-none text-black"
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
                        className="w-full h-full bg-transparent text-sm font-medium outline-none tracking-wider text-left text-black"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    disabled={!isFormValid}
                    className={`h-11 px-8 font-sans font-bold text-sm rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                      isFormValid
                        ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer"
                        : "bg-[#b8e0f2] text-white cursor-not-allowed"
                    }`}
                  >
                    {editingAddress ? "Update Address" : "Save Address"}
                  </button>

                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                      className="h-11 px-6 border border-gray-200 text-gray-500 hover:text-black font-bold text-sm rounded-full transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
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

              {/* Interactive Submit Placement Button */}
              <button
                type="button"
                disabled={!selectedAddress}
               onClick={handlePayment}
                className={`w-full h-13 mt-8 font-sans font-bold text-base rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                  selectedAddress
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