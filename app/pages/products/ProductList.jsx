"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../main/cartSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { setProducts } from "../../main/productSlice";
import { addToWish, removeFromWish } from "../../main/wishlistSlice";

function ProductList() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("relevance");
  const [priceFilter, setPriceFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        dispatch(setProducts(data));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dispatch]);

  const products = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist) || [];
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  let filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product?.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : products;

  if (priceFilter === "below500") {
    filteredProducts = filteredProducts.filter((p) => p.price < 500);
  } else if (priceFilter === "500to1000") {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= 500 && p.price <= 1000
    );
  } else if (priceFilter === "above1000") {
    filteredProducts = filteredProducts.filter((p) => p.price > 1000);
  }

  let sortedProducts = [...filteredProducts];
  if (sortOption === "priceLowToHigh") {
    sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === "priceHighToLow") {
    sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  const handleNavigateToProduct = (productId) => {
    router.push(`/pages/productView?id=${productId}`);
  };

  const isInWishlist = (productId) =>
    wishlist?.some((item) => item._id === productId);

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    let updatedWishlist;
    if (isInWishlist(product._id)) {
      updatedWishlist = wishlist.filter((item) => item._id !== product._id);
      dispatch(removeFromWish(product._id));
    } else {
      updatedWishlist = [...wishlist, product];
      dispatch(addToWish(product));
    }
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  if (loading) {
    return (
      <div className="min-h-[92vh] flex items-center justify-center bg-gradient-to-r from-gray-700 to-green-600">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[92vh] p-4 bg-gradient-to-r from-gray-700 to-green-600">
      {error && (
        <p className="text-red-300 text-center text-sm mb-4">{error}</p>
      )}

      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="rounded px-3 py-1 text-black bg-white"
        >
          <option value="relevance">Sort by Relevance</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="rounded px-3 py-1 text-black bg-white"
        >
          <option value="all">All Prices</option>
          <option value="below500">Below ₹500</option>
          <option value="500to1000">₹500 - ₹1000</option>
          <option value="above1000">Above ₹1000</option>
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="text-white text-lg text-center mt-10">
          No products available in <strong>{selectedCategory || "any"}</strong> category.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          {sortedProducts.map((product) => {
            const cartItem = cart.find((item) => item._id === product._id);
            const price = product.price;

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center cursor-pointer w-full hover:shadow-lg transition relative"
                onClick={() => handleNavigateToProduct(product._id)}
              >
                <button
                  onClick={(e) => toggleWishlist(e, product)}
                  className="absolute top-2 px-1 right-2 text-2xl text-red-500 bg-black rounded-full"
                >
                  {isInWishlist(product._id) ? "❤️" : "🤍"}
                </button>

                {product.image && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-contain"
                  />
                )}
                <h2 className="text-lg font-semibold text-center line-clamp-1 text-black">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {product.category}
                </p>
                <p className="text-red-400 font-semibold">
                  ₹{" "}
                  {price.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs text-gray-500 mb-2 text-center h-[34px] line-clamp-2">
                  {product.description}
                </p>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(addToCart(product));
                    }}
                    className={`text-white text-bold rounded-2xl px-3 w-full py-1 transition-all ${
                      cartItem
                        ? "bg-green-600 hover:bg-red-700"
                        : "bg-indigo-600 hover:bg-gray-700"
                    }`}
                  >
                    {cartItem
                      ? `${cartItem.quantity} Added to Cart`
                      : "Add to Cart"}
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!cartItem) dispatch(addToCart(product));
                    router.push("/pages/checkout");
                  }}
                  className="text-white text-bold rounded-2xl px-3 w-full bg-yellow-500 py-1 transition-all mt-1 hover:bg-yellow-700"
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

export default ProductList;
