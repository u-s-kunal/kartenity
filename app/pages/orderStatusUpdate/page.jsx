"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

function OrderManager() {
  const [orderId, setOrderId] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      toast.error("Please enter a valid Order ID.");
      return;
    }

    setIsUpdating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      toast.success("Order status updated successfully!");
      setOrderId("");
      setNewStatus("pending");
    } catch (error) {
      console.error("Status update error:", error.message);
      toast.error(`Failed to update order status: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center bg-gradient-to-br from-amber-700 to-violet-700">
      <div className=" rounded-3xl shadow-2xl p-8 w-full max-w-md text-white">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Update Order Status
        </h1>
        <form
          onSubmit={handleStatusUpdate}
          className="space-y-4 flex flex-col"
        >
          <input
            type="text"
            className="w-full p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />

          <select
            className="w-full p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderManager;
