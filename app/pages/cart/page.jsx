"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../main/cartSlice";
import { ShoppingCart } from "lucide-react";

function Cart() {
  const [cart, setCart] = useState([]);
  const dispatch = useDispatch();

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(cartFromStorage);
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

const handleRemove = (id) => {
  const updatedCart = cart.map((item) => {
    if (item._id === id) {
      if (item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      // if quantity is 1, skip (will remove later)
      return null;
    }
    return item;
  }).filter(Boolean); // remove nulls (items with quantity 1)

  // Update Redux (optional if you're syncing with localStorage)
  dispatch(removeFromCart(id)); // optional depending on how you handle it in reducer

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-500 to-purple-500 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

      {cart?.length > 0 ? (
        <>
          <ul className="space-y-4 w-full max-w-3xl">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center w-[50%]">
                  {item.image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                      alt={item.name}
                      className="w-full md:h-26 h-20 object-contain"
                    />
                  )}
                  <div className="flex-col w-full px-6">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600">
                      ₹ {item.price.toLocaleString("en-IN")} × {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      Total: ₹{" "}
                      {(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 md:px-4 md:py-2 rounded-md"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 w-full max-w-3xl">
            <div className="bg-black text-white p-6 rounded-2xl shadow-xl flex flex-col gap-4">
              <div className="flex justify-between text-xl font-semibold">
                <span>Grand Total:</span>
                <span>
                  ₹
                  {Number(total).toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>

              <Link href="/pages/checkout">
                <button className="w-full flex items-center justify-center gap-2  text-white font-semibold py-3 rounded-xl bg-green-700  hover:bg-amber-700 transition duration-300 shadow-md">
                  <ShoppingCart size={18} />
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="text-white text-xl mt-20">🛒 Your cart is empty.</div>
      )}
    </div>
  );
}

export default Cart;
