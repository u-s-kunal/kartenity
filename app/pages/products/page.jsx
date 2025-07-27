'use client';

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../main/cartSlice";
import { useSearchParams } from "next/navigation";
import { setProducts } from "../../main/productSlice";

function ProductList() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  // Load products from backend API and dispatch to Redux
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        dispatch(setProducts(data)); // ✅ dispatch here
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Something went wrong");
      }
    };
    fetchProducts();
  }, [dispatch]);

  const products = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product?.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : products;

  return (
    <div className="min-h-[92vh] p-4 bg-gradient-to-r from-gray-600 to-green-500">
      {error && (
        <p className="text-red-200 text-center text-sm mb-4">{error}</p>
      )}

      {filteredProducts.length === 0 ? (
        <p className="text-white text-lg text-center mt-10">
          No products available in{" "}
          <strong>{selectedCategory || "any"}</strong> category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            const price = product.price;

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center w-full"
              >
                {product.image && (
               <img
                    src={`http://localhost:5000${product.image}`} // e.g., "/uploads/pen.jpg"
                    alt={product.name}
                    className="w-full h-40 object-contain"
                  />

                )}
                <h2 className="text-lg font-semibold text-center line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {product.category}
                </p>
                <p className="text-indigo-600 font-semibold">
                  ₹{" "}
                  {price.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 mb-2 text-center h-[34px] line-clamp-2">
                  {product.description}
                </p>

                <button
                  onClick={() => dispatch(addToCart(product))}
                  className={`text-white text-sm px-3 w-full py-1 rounded transition-all ${
                    cartItem
                      ? "bg-green-600 hover:bg-red-700"
                      : "bg-indigo-600 hover:bg-gray-700"
                  }`}
                >
                  {cartItem
                    ? `${cartItem.quantity} Item${
                        cartItem.quantity > 1 ? "s" : ""
                      } Added to Cart`
                    : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductList;
