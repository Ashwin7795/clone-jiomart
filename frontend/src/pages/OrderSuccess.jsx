import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-[#f3f3f3] flex items-center justify-center p-4 antialiased select-none">
      {/* Exact portrait container frame matching your Login/Register structural grids */}
      <div className="bg-white w-full max-w-[395px] rounded-[32px] shadow-[0px_10px_30px_rgba(0,0,0,0.06)] p-8 pt-12 pb-12 relative flex flex-col items-center transition-all">
        
        {/* Isolated Top Left Blue 'X' Close Button to easily exit back to home screen */}
        <button 
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-[#0078ad] hover:opacity-80 transition-all cursor-pointer focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Emerald Success Check Badge Frame */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mt-6 mb-6 text-[#00b259] shadow-inner">
          <svg className="w-10 h-10 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Header Typography Group */}
        <div className="flex flex-col items-center w-full text-center px-2">
          <h2 className="font-sans text-[24px] font-black text-[#141414] tracking-tight leading-tight">
            Order Placed Successfully!
          </h2>
          <p className="font-sans text-sm font-medium text-gray-500 tracking-tight mt-2.5 leading-relaxed">
            Thank you for shopping with us. Your dispatch manifest details and delivery metrics are processing inside the system workspace.
          </p>
        </div>

        {/* Action Button Navigation Group Block */}
        <div className="w-full mt-8 space-y-3">
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full h-12 bg-[#0078ad] text-white hover:bg-[#0c5273] active:bg-[#00364e] font-sans font-bold text-base rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 font-sans font-bold text-sm rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border border-gray-200"
          >
            Continue Shopping
          </button>
        </div>

        {/* Footer Support Prompt */}
        <p className="text-[11px] font-medium text-gray-400 mt-8 text-center leading-normal">
          Need cancellation info or change queries? Visit our global helper page or read our digital channel guidelines.
        </p>

      </div>
    </div>
  );
}

export default OrderSuccess;