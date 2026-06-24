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
      alert(
        error.response?.data?.message ||
        "Failed to send OTP"
      );
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          phone,
          otp,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "OTP Verification Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="bg-white p-8 rounded-lg shadow w-[400px]">

        <h1 className="text-2xl font-bold mb-6">
          Login with OTP
        </h1>

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          className="border w-full p-3 mb-4"
        />

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              className="border w-full p-3 mb-4"
            />

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white p-3 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

      </div>

    </div>
  );
}

export default OtpLogin;