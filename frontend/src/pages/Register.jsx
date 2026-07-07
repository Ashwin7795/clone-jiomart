import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext"; // Hook injection

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const { triggerToast } = useCart(); // Extract global toast launcher

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ADDITIONAL VALUE CHECK: Basic phone number layout validation
    if (phone && !/^\d{10}$/.test(phone.trim())) {
      triggerToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
          phone,
          role,
        }
      );

      console.log(response.data);
      // REPLACED ALERT WITH SUCCESS TOAST
      triggerToast("Registration Successful! Welcome aboard.");
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);
      // REPLACED ALERT WITH ERROR TOAST
      triggerToast(
        error.response?.data?.message || "Registration Failed",
        "error"
      );
    }
  };

  const isButtonEnabled = name.trim() !== "" && email.trim() !== "" && password.length >= 6;

  return (
    <div className="min-h-screen w-screen bg-[#f3f3f3] flex items-center justify-center p-4 antialiased select-none">
      {/* Exact portrait container frame matching your Login design structure */}
      <div className="bg-white w-full max-w-[395px] rounded-[32px] shadow-[0px_10px_30px_rgba(0,0,0,0.06)] p-8 pt-10 pb-12 relative flex flex-col transition-all">
        
        {/* Isolated Top Left Blue 'X' Close Button */}
        <button 
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-[#0078ad] hover:opacity-80 transition-all cursor-pointer focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Typography Group */}
        <div className="flex flex-col items-start w-full mt-10 text-left">
          <h2 className="font-sans text-[26px] font-black text-[#141414] tracking-tight leading-tight">
            Create Account
          </h2>
          <p className="font-sans text-sm font-medium text-gray-700 tracking-tight mt-1">
            Sign up to get started on your shopping journey
          </p>
        </div>

        {/* Core Input Form Block */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-start mt-8 space-y-4">
          
          {/* Full Name Row Box */}
          <div className="w-full flex flex-col items-start">
            <label className="text-xs font-semibold text-gray-500 mb-1.5">
              Full Name
            </label>
            <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-full bg-transparent text-sm font-medium text-[#141414] outline-none placeholder-gray-300 text-left"
                required
              />
            </div>
          </div>

          {/* Email Row Box */}
          <div className="w-full flex flex-col items-start">
            <label className="text-xs font-semibold text-gray-500 mb-1.5">
              Email Address
            </label>
            <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-full bg-transparent text-sm font-medium text-[#141414] outline-none placeholder-gray-300 text-left"
                required
              />
            </div>
          </div>

          {/* Phone Number Row Box - UPGRADED TO MATCH HIGH-FIDELITY DESIGN SPEC */}
          <div className="w-full flex flex-col items-start">
            <label className="text-xs font-semibold text-gray-500 mb-1.5">
              Phone Number
            </label>
            <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-full bg-transparent text-sm font-medium text-[#141414] outline-none placeholder-gray-300 text-left"
              />
            </div>
          </div>

          {/* Password Row Box */}
          <div className="w-full flex flex-col items-start">
            <label className="text-xs font-semibold text-gray-500 mb-1.5">
              Password
            </label>
            <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
              <input
                type="password"
                placeholder="Create password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full bg-transparent text-sm font-medium text-[#141414] outline-none placeholder-gray-300 text-left"
                required
              />
            </div>
          </div>

          {/* Account Type Option Dropdown Selector */}
          <div className="w-full flex flex-col items-start">
            <label className="text-xs font-semibold text-gray-500 mb-1.5">
              Account Type
            </label>
            <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-full bg-transparent text-sm font-bold text-[#141414] outline-none cursor-pointer appearance-none text-left"
              >
                <option value="user">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute right-4 pointer-events-none text-[#0078ad]">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Terms & CTA Button Block Section */}
          <div className="w-full pt-2 flex flex-col items-start">
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed text-left w-full">
              By creating an account, you agree to our &nbsp;
              <a target="_blank" rel="noreferrer" className="text-[#0078ad] font-semibold hover:underline" href="https://www.jiomart.com/terms-and-conditions/">
                Terms and Conditions of Use
              </a> 
              &nbsp;and&nbsp;
              <a target="_blank" rel="noreferrer" className="text-[#0078ad] font-semibold hover:underline" href="https://www.jiomart.com/privacy-policy/">
                Privacy Policy
              </a>.
            </p>

            {/* Submit Action Button using your precise toggle states */}
            <button
              type="submit"
              disabled={!isButtonEnabled}
              className={`w-full h-12 mt-6 font-sans font-bold text-base rounded-full flex items-center justify-center transition-all duration-200 ${
                isButtonEnabled
                  ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer"
                  : "bg-[#b8e0f2] text-white cursor-not-allowed"
              }`}
            >
              Register
            </button>
          </div>
        </form>

        {/* Login Alternate Link Footer Block */}
        <p className="w-full text-center mt-6 text-sm text-gray-600 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#0078ad] font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;