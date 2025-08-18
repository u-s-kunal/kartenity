"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../main/cartSlice";
import { setProducts } from "../../main/productSlice";
import Fuse from "fuse.js";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryRaw = searchParams.get("query") || "";
  const query = queryRaw.toLowerCase().trim();
  const products = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Load products from localStorage on mount
  useEffect(() => {
    const productsFromStorage = JSON.parse(localStorage.getItem("products")) || [];
    dispatch(setProducts(productsFromStorage));
  }, [dispatch]);

  // Fuzzy search configuration
  const fuseOptions = {
    keys: ["name", "category", "description"],
    threshold: 0.4, // 0.0 = exact match, 1.0 = very fuzzy
  };

  const fuse = new Fuse(products, fuseOptions);

  const filtered = query ? fuse.search(query).map(result => result.item) : products;

  // Navigate to product view page with product ID
  const handleNavigateToProduct = (productId) => {
    router.push(`/pages/productView?id=${productId}`);
  };

  return (
    <div className="min-h-[92vh] p-4 bg-gradient-to-r from-gray-600 to-green-500">
      <h1 className="text-2xl font-bold text-white mb-6">
        Search results for: <span className="text-amber-300">{queryRaw}</span>
      </h1>

      {filtered.length === 0 ? (
        <p className="text-white text-lg text-center">No matching products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => {
            const cartItem = cart.find((c) =>  c._id === product._id);

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                onClick={() => handleNavigateToProduct(product._id)}
              >
                {product.image && (
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-contain"
                  />
                )}

                <h2 className="text-lg font-semibold text-center line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-1">{product.category}</p>
                <p className="text-red-600 font-semibold">
                  ₹ {product.price.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-gray-500 mb-2 text-center h-[34px] line-clamp-2">
                  {product.description}
                </p>
<button
  onClick={(e) => {
    e.stopPropagation(); // Prevent navigation when clicking button
    dispatch(addToCart(product));
  }}
  className={`w-full text-sm py-2 rounded-full transition font-semibold ${
    cartItem
      ? "bg-green-600 hover:bg-red-700 text-white"
      : "bg-indigo-600 hover:bg-gray-700 text-white"
  }`}
>
  {cartItem
    ? `${cartItem.quantity} Item${cartItem.quantity > 1 ? "s" : ""} in Cart`
    : "Add to Cart"}
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    if (!cartItem) {
      dispatch(addToCart(product));
    }
    router.push("/pages/checkout");
  }}
  className="w-full mt-2 py-1 rounded-full bg-yellow-500 text-white font-semibold transition hover:bg-yellow-700"
>
  Buy Now
</button>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
