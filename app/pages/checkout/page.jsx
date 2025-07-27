"use client";
import React from "react";
import { useSelector } from "react-redux";

const Checkout = () => {
  const cart = useSelector((state) => state.cart);

  const generateInvoice = () => {
    const input = document.getElementById("invoice");
    window.print();
  };

  return (
    <div className="p-6 bg-white shadow rounded-md max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <div id="invoice">
        {cart.map((item) => (
          <div key={item._id} className="mb-4 border-b pb-2">
            <p><strong>Product:</strong> {item.name}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
          </div>
        ))}
        <p className="font-bold mt-4">Total: ₹{cart.totalAmount}</p>
      </div>

      <button
        onClick={generateInvoice}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Invoice
      </button>
    </div>
  );
};

export default Checkout;
