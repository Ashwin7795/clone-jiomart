function OrderTimeline({ status }) {
  const steps = [
    {
      label: "Pending",
      icon: "🛒",
    },
    {
      label: "Confirmed",
      icon: "✔️",
    },
    {
      label: "Shipped",
      icon: "🚚",
    },
    {
      label: "Delivered",
      icon: "📦",
    },
  ];

  // Map out current index cleanly using your original text label logic
  const currentStep = steps.findIndex((s) => s.label === status);

  if (status === "Cancelled") {
    return (
      <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-600 font-sans font-bold text-sm text-center flex items-center justify-center gap-2 shadow-2xs">
        <span>❌</span> This active checkout manifest order has been cancelled.
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 mt-6 select-none font-sans">
      <div className="w-full flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPastOrCurrent = index <= currentStep;
          const isFullyDelivered = status === "Delivered";

          // Clean, transparent circle background styling block
          let stepCircleStyle = "bg-transparent text-gray-400 border-gray-200";
          if (isPastOrCurrent) {
            stepCircleStyle = isFullyDelivered && isPastOrCurrent
              ? "bg-transparent text-white border-emerald-500 shadow-2xs"
              : "bg-transparent text-white border-[#0078ad] shadow-2xs";
          }

          return (
            <div
              key={step.label}
              className={`flex items-center ${index !== steps.length - 1 ? "flex-1" : ""}`}
            >
              {/* Individual Node Step Group */}
              <div className="flex flex-col items-center relative min-w-[70px]">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-300 ${stepCircleStyle}`}>
                  {step.icon}
                </div>

                <p className={`text-[12px] mt-2.5 font-bold tracking-tight text-center whitespace-nowrap transition-colors duration-300 ${
                  isCurrent 
                    ? isFullyDelivered ? "text-emerald-600 font-black" : "text-[#0078ad] font-black"
                    : isCompleted ? "text-gray-900" : "text-gray-400"
                }`}>
                  {step.label}
                </p>
              </div>

              {/* Connecting Horizontal Track Lines */}
              {index !== steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-100 rounded-full relative overflow-hidden shrink-0">
                  <div
                    className={`absolute inset-0 h-full transition-all duration-500 ease-out rounded-full ${
                      isCompleted 
                        ? isFullyDelivered ? "bg-emerald-500" : "bg-[#0078ad]" 
                        : "bg-gray-200"
                    }`}
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTimeline;