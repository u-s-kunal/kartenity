"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeFromWish } from "../../main/slices/wishlistSlice";
import { addToCart } from "../../main/slices/cartSlice"; // ← ensure this exists

function Wishlist() {
  const [wishlist, setLocalWishlist] = useState([]);
  const dispatch = useDispatch();

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const wishlistFromStorage =
        JSON.parse(localStorage.getItem("wishlist")) || [];
      setLocalWishlist(wishlistFromStorage);
    }
  }, []);

  // 🗑 Remove from wishlist
  const handleRemove = (id) => {
  const updatedWishlist = wishlist
    .map((item) => {
      if (item._id === id) {
        if (item.quantity && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return null; // remove if quantity is 1 or undefined
      }
      return item;
    })
    .filter(Boolean);

  dispatch(removeFromWish(id)); // ✅ Fix: Dispatch only the removed item's ID
  setLocalWishlist(updatedWishlist);
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
};


  // 🛒 Add to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item)); // 👈 Send entire item
    // Optionally, you could show a toast or redirect to cart
  };

  return (
   <div className="min-h-screen bg-gradient-to-r from-pink-500 to-indigo-500 p-6">
  <h1 className="text-3xl font-bold text-white text-center mb-8">Your Wishlist</h1>

  {wishlist?.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
      {wishlist.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-between hover:shadow-lg transition relative"
        >
          {/* Product Image */}
          {item.image && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
              alt={item.name}
              className="w-full h-40 object-contain mb-3"
            />
          )}

          {/* Product Info */}
          <h2 className="text-lg font-semibold text-center line-clamp-1 text-black mb-1">
            {item.name}
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            Price: ₹{item.price.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mb-3 text-center h-[34px] line-clamp-2">
            {item.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-2 mt-auto">
            <button
              onClick={() => handleAddToCart(item)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium shadow w-full"
            >
              Add to Cart
            </button>
            <button
              onClick={() => handleRemove(item._id)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium shadow w-full"
            >
              Remove from Wishlist
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-white text-xl text-center mt-20">
      ❤️ Your wishlist is empty.
    </div>
  )}
</div>

  );
}

export default Wishlist;
