import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OtpLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { phone }
      );
      console.log("OTP:", response.data.otp);
      setOtp(response.data.otp);
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { phone, otp }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "OTP Verification Failed");
    }
  };

  // Button handling variables matched to your exact criteria rules
  const isSendEnabled = phone.trim().length >= 10;
  const isVerifyEnabled = otp.trim().length >= 4;

  return (
    <div className="min-h-screen w-screen bg-[#f3f3f3] flex items-center justify-center p-4 antialiased select-none">
      {/* Exact portrait container frame matching your Login design blueprint */}
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
            {otpSent ? "Verify Code" : "OTP Login"}
          </h2>
          <p className="font-sans text-sm font-medium text-gray-700 tracking-tight mt-1">
            {otpSent ? "Enter the verification code sent to your device" : "Sign in seamlessly using your mobile number"}
          </p>
        </div>

        {/* Dynamic Form Interface Grid */}
        <div className="w-full flex flex-col items-start mt-8 space-y-5">
          
          {/* Mobile Phone Number Entry Field */}
          <div className="w-full flex flex-col items-start">
            <label className="text-xs font-semibold text-gray-500 mb-1.5">
              Mobile Number
            </label>
            <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
              {/* Country Code Prefix */}
              <span className="text-sm font-bold text-gray-400 mr-2 border-r border-gray-200 pr-2 select-none">
                +91
              </span>
              <input
                type="tel"
                placeholder="Enter 10 digit number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} // Only allow digits
                disabled={otpSent}
                className={`w-full h-full bg-transparent text-sm font-medium text-[#141414] outline-none placeholder-gray-300 tracking-wide ${otpSent ? "opacity-50 cursor-not-allowed" : ""}`}
                required
              />
            </div>
          </div>

          {/* Conditional Content Execution Stage */}
          {!otpSent ? (
            <div className="w-full pt-4">
              {/* Submit trigger with exact Pale Blue Disabled Theme Color tokens */}
              <button
                onClick={handleSendOtp}
                disabled={!isSendEnabled}
                className={`w-full h-12 font-sans font-bold text-base rounded-full flex items-center justify-center transition-all duration-200 ${
                  isSendEnabled
                    ? "bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] cursor-pointer"
                    : "bg-[#b8e0f2] text-white cursor-not-allowed"
                }`}
              >
                Send OTP
              </button>
            </div>
          ) : (
            <div className="w-full space-y-5 animate-fadeIn">
              {/* Verification OTP Input Field */}
              <div className="w-full flex flex-col items-start">
                <label className="text-xs font-semibold text-gray-500 mb-1.5">
                  Verification Code
                </label>
                <div className="w-full h-12 border border-gray-300 focus-within:border-[#0078ad] focus-within:border-2 rounded-xl flex items-center px-4 bg-transparent transition-all">
                  <input
                    type="text"
                    placeholder="Enter security code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim())}
                    className="w-full h-full bg-transparent text-sm font-bold text-[#141414] outline-none placeholder-gray-300 tracking-widest text-center"
                    required
                  />
                </div>
              </div>

              <div className="w-full pt-2 flex flex-col items-start">
                <button
                  onClick={handleVerifyOtp}
                  disabled={!isVerifyEnabled}
                  className={`w-full h-12 font-sans font-bold text-base rounded-full flex items-center justify-center transition-all duration-200 ${
                    isVerifyEnabled
                      ? "bg-[#00b259] text-white hover:bg-[#00964b] active:bg-[#006e37] cursor-pointer"
                      : "bg-emerald-200 text-white cursor-not-allowed"
                  }`}
                >
                  Verify OTP
                </button>

                <button 
                  onClick={() => setOtpSent(false)} 
                  className="text-xs text-[#0078ad] font-bold hover:underline mt-4 self-center cursor-pointer"
                >
                  Change Mobile Number
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Core Footer Compliance Disclaimer */}
        <p className="text-[11px] font-medium text-gray-400 leading-relaxed text-center w-full mt-8">
          By continuing, you agree to our &nbsp;
          <a target="_blank" rel="noreferrer" className="text-[#0078ad] font-semibold hover:underline" href="https://www.jiomart.com/terms-and-conditions/">
            Terms and Conditions
          </a> 
          &nbsp;and&nbsp;
          <a target="_blank" rel="noreferrer" className="text-[#0078ad] font-semibold hover:underline" href="https://www.jiomart.com/privacy-policy/">
            Privacy Policy
          </a>.
        </p>

      </div>
    </div>
  );
}

export default OtpLogin;