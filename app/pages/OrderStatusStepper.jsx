"use client";

import React, { useEffect, useState } from "react";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered"];

// Color codes for statuses (can customize)
const STATUS_COLORS = {
  pending: "#F59E0B", // amber
  processing: "#3B82F6", // blue
  shipped: "#10B981", // green
  delivered: "#059669", // darker green
};

const OrderStatusStepper = ({ orderId }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();
        setStatus(data.orderStatus || "pending");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  if (loading) return <p className="text-sm text-gray-500">Loading order status...</p>;
  if (error) return <p className="text-sm text-red-500">Error: {error}</p>;

  const currentIndex = ORDER_STATUSES.indexOf(status);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="mb-4 font-semibold text-lg text-gray-700">Order Status</h3>
      <div className="flex justify-between items-center relative">
        {ORDER_STATUSES.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const color = isCompleted ? STATUS_COLORS[step] : "#D1D5DB"; // gray for incomplete
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold`}
                style={{ backgroundColor: color, transition: "background-color 0.5s ease" }}
              >
                {index < currentIndex ? "✓" : index + 1}
              </div>

              {/* Label */}
              <span className="mt-2 text-xs text-gray-600 capitalize">{step}</span>

              {/* Connector Line */}
              {index < ORDER_STATUSES.length - 1 && (
                <div
                  className="absolute top-4 right-[-50%] w-full h-1 rounded"
                  style={{
                    backgroundColor: index < currentIndex ? STATUS_COLORS[ORDER_STATUSES[index + 1]] : "#E5E7EB",
                    transition: "background-color 0.5s ease",
                    zIndex: -1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusStepper;
