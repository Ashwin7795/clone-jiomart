import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

     localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

const user = response.data.user;

if (user.role === "admin") {
  navigate("/admin");
} else {
  navigate("/");
}
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  const isButtonEnabled = email.trim() !== "" && password.length >= 6;

  return (
    <div className="min-h-screen w-screen bg-[#f3f3f3] flex items-center justify-center p-4 antialiased select-none">
      {/* Exact portrait container frame from the JioMart screenshot */}
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
            Almost there!
          </h2>
          <p className="font-sans text-sm font-medium text-gray-700 tracking-tight mt-1">
            Simply sign in to place your order
          </p>
        </div>

        {/* Core Input Form Block */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-start mt-8 space-y-5">
          
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

          {/* Password Row Box */}
          <div className="w-full flex flex-col items-start">
            <label className="text-xs font-semibold text-gray-500 mb-1.5">
              Password
            </label>
            <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full bg-transparent text-sm font-medium text-[#141414] outline-none placeholder-gray-300 text-left"
                required
              />
            </div>
          </div>

          {/* Terms & CTA Button Block Section */}
          <div className="w-full pt-4 flex flex-col items-start">
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed text-left w-full">
              By signing in, you agree to our &nbsp;
              <a target="_blank" rel="noreferrer" className="text-[#0078ad] font-semibold hover:underline" href="https://www.jiomart.com/terms-and-conditions/">
                Terms and Conditions of Use
              </a> 
              &nbsp;and&nbsp;
              <a target="_blank" rel="noreferrer" className="text-[#0078ad] font-semibold hover:underline" href="https://www.jiomart.com/privacy-policy/">
                Privacy Policy
              </a>.
            </p>

            {/* Submit Action Button with exact Pale Blue Disabled Theme Color */}
            <button
              type="submit"
              disabled={!isButtonEnabled}
              className={`w-full h-12 mt-6 font-sans font-bold text-base rounded-full flex items-center justify-center transition-all duration-200 ${
                isButtonEnabled
                  ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer"
                  : "bg-[#b8e0f2] text-white cursor-not-allowed"
              }`}
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Register Alternate Link Footer Block */}
        <p className="w-full text-center mt-6 text-sm text-gray-600 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#0078ad] font-bold hover:underline"
          >
            Register
          </Link>
        </p>

        <p className="text-center mt-4">
  <Link
    to="/otp-login"
    className="text-[#0078ad] font-bold"
  >
    Login with OTP
  </Link>
</p>

      </div>
    </div>
  );
}

export default Login;