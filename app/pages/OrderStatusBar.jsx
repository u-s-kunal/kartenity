import React, { useEffect, useState } from "react";

const statuses = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "out-for-delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const statusColors = {
  pending: "bg-red-500",
  confirmed: "bg-orange-400",
  processing: "bg-yellow-400",
  shipped: "bg-yellow-600",
  "out-for-delivery": "bg-blue-500",
  delivered: "bg-green-600",
  cancelled: "bg-gray-600",
};

const OrderStatusBar = ({ currentStatus }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentIndex = statuses.findIndex(
    (status) => status.key === currentStatus.toLowerCase()
  );

  if (isMobile) {
    // Mobile view: only active status badge with padding and shadow
    const activeStatus = statuses[currentIndex] || { label: "Unknown", key: "" };
    return (
      <div
        className={`inline-block px-5 py-2 rounded-full font-semibold text-white shadow-md ${
          statusColors[activeStatus.key] || "bg-gray-400"
        }`}
        aria-label={`Current order status: ${activeStatus.label}`}
      >
        {activeStatus.label}
      </div>
    );
  }

  // Desktop view: full bar with labels and progress indicator
  const stepWidthPercent = 100 / statuses.length;

  return (
    <div
      className="w-[70%] p-4 select-none"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={statuses.length - 1}
      aria-valuenow={currentIndex}
      aria-label="Order status progress"
    >
      {/* Status labels with tooltips */}
      <div className="flex justify-between mb-3 text-sm font-semibold text-gray-800">
        {statuses.map(({ label, key }, idx) => (
          <div
            key={key}
            className="w-1/7 text-center truncate whitespace-nowrap relative group cursor-default"
            style={{ fontSize: "0.8rem", padding: "0 6px" }}
          >
            {label}

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10">
              {`Step ${idx + 1}: ${label}`}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar container */}
      <div className="relative h-5 flex bg-gray-200 rounded-full overflow-hidden shadow-inner">
        {/* Filled steps */}
        {statuses.map(({ key }, idx) => {
          const isActive = idx <= currentIndex;
          return (
            <div
              key={key}
              className={`${isActive ? statusColors[key] : "bg-gray-200"}`}
              style={{
                width: `${stepWidthPercent}%`,
                transition: "background-color 0.4s ease",
                backgroundImage: isActive
                  ? "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(0,0,0,0.1))"
                  : "none",
              }}
            />
          );
        })}

        {/* Active step indicator */}
        <div
          className="absolute top-1/2 left-0 w-6 h-6 rounded-full border-4 border-white shadow-lg bg-white animate-pulse"
          style={{
            transform: `translateX(calc(${
              (currentIndex + 0.5) * stepWidthPercent
            }% - 1.25rem)) translateY(-50%)`,
            transition: "transform 0.5s ease",
            zIndex: 10,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default OrderStatusBar;
