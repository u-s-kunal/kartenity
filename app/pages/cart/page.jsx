"use client";

import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../main/cartSlice";
import { ShoppingCart } from "lucide-react";

function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  console.log("Cart Items:", cart);
  console.log("Calculated Total:", total);

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-500 to-purple-500 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

      {cart && cart.length > 0 ? (
        <>
          <ul className="space-y-4 w-full max-w-3xl">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-4">
                   {item.image && (
               <img
                    src={`http://localhost:5000${item.image}`} // e.g., "/uploads/pen.jpg"
                    alt={item.name}
                    className="w-full md:h-26 h-20 object-contain"
                  />

                )}
                  <div className=" w-full">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600 flex w-fit">
                      ₹ {item.price.toLocaleString("en-IN", { minimumFractionDigits: 0,
                      })} × {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      Total: ₹
                      {(item.price * item.quantity).toLocaleString("en-IN", {
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
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
