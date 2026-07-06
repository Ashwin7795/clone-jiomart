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
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const { fetchCart, triggerToast } = useCart(); // Destructured your global toast engine launcher cleanly
  const navigate = useNavigate();
  const [processingPayment, setProcessingPayment] = useState(false);

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
      triggerToast("Failed to sync your addresses from the database", "error");
    }
  };

  const handleSaveAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      if (editingAddress) {
        await axios.put(
          `http://localhost:5000/api/address/${editingAddress._id}`,
          { fullName, phone, address, city, state, pincode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        triggerToast("Delivery address updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/address",
          { fullName, phone, address, city, state, pincode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        triggerToast("New address profile added to your account");
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
      triggerToast("Could not process address schema formatting updates", "error");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      triggerToast("Address record removed successfully");
      fetchAddresses();
    } catch (error) {
      console.log(error);
      triggerToast("Failed to drop address mapping target", "error");
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
        { addressId: selectedAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("cartUpdated", Date.now());
      await fetchCart();
      triggerToast("Order processed under cash collection terms!");
      navigate("/order-success");
    } catch (error) {
      console.log(error.response?.data);
      triggerToast(error.response?.data?.message || "Order placement request rejected", "error");
    }
  };

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
              { headers: { Authorization: `Bearer ${token}` } }
            );
            triggerToast("Payment validation cleared!");
            await fetchCart();
            navigate("/order-success");
          } catch (error) {
            console.log(error);
            triggerToast("Payment signature checksum validation mismatched", "error");
          } finally {
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            // REPLACED ALERT WITH TOAST
            triggerToast("Transaction authorization aborted by customer", "error");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log(response.error);
        setProcessingPayment(false);
        // REPLACED ALERT WITH TOAST
        triggerToast("Gateway gateway transaction channel dropped", "error");
      });

      razorpay.open();
    } catch (error) {
      console.log(error);
      setProcessingPayment(false);
      triggerToast("Failed to initialize gateway system order parameters", "error");
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
                    className="w-full border border-gray-300 focus:border-[#0078ad] focus:border-2 rounded-xl px-4 py-3 text-sm font-medium text-[#141414] outline-none placeholder-gray-300 text-left"
                  />
                </div>

                {/* City, State, Pincode Group */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div className="flex flex-col items-start">
                    <label className="text-xs font-semibold text-gray-500 mb-1.5">City</label>
                    <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent">
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-full bg-transparent text-sm font-medium outline-none" required />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-xs font-semibold text-gray-500 mb-1.5">State</label>
                    <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent">
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full h-full bg-transparent text-sm font-medium outline-none" required />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-xs font-semibold text-gray-500 mb-1.5">Pincode</label>
                    <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent">
                      <input type="text" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} className="w-full h-full bg-transparent text-sm font-medium outline-none tracking-wider" required />
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

          {/* RIGHT COLUMN: Sticky Payment Selection and Breakdown Card */}
          <div className="space-y-5 w-full">
            <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm sticky top-28 space-y-6">
              <h2 className="text-[19px] font-bold text-black border-b border-gray-100 pb-4 tracking-tight text-left">
                Payment Option
              </h2>

              {/* High-Fidelity Radio Card Selector Track */}
              <div className="flex flex-col gap-3.5 w-full">
                <label 
                  className={`w-full border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-[#0078ad] bg-[#e5f1f7]/30 shadow-3xs"
                      : "border-gray-200 bg-[#f9f9f9]/40 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="razorpay"
                    name="paymentOption"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-[#0078ad] shrink-0"
                  />
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[14px] font-bold text-black leading-tight">Online Payment</span>
                    <span className="text-[11px] text-gray-500 font-semibold mt-0.5 leading-snug">
                      Pay instantly via UPI, NetBanking, Credit or Debit Cards
                    </span>
                  </div>
                </label>

                <label 
                  className={`w-full border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#0078ad] bg-[#e5f1f7]/30 shadow-3xs"
                      : "border-gray-200 bg-[#f9f9f9]/40 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="cod"
                    name="paymentOption"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-[#0078ad] shrink-0"
                  />
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[14px] font-bold text-black leading-tight">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-gray-500 font-semibold mt-0.5 leading-snug">
                      Pay with cash, UPI or card right at your doorstep
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Submit Button */}
              <button
                type="button"
                disabled={!selectedAddress || processingPayment}
                onClick={paymentMethod === "razorpay" ? handlePayment : handlePlaceOrder}
                className={`w-full h-12 font-sans font-bold text-sm rounded-full flex items-center justify-center transition-all duration-200 shadow-xs ${
                  selectedAddress && !processingPayment
                    ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer active:scale-[0.995]"
                    : "bg-[#b8e0f2] text-white cursor-not-allowed opacity-80"
                }`}
              >
                {processingPayment
                  ? "Processing Payment..."
                  : paymentMethod === "razorpay"
                  ? "Proceed to Payment"
                  : "Place COD Order"}
              </button>

              <p className="text-[11px] text-gray-400 font-semibold text-center leading-normal">
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