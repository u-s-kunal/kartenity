"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../main/cartSlice";
import { useSearchParams, useRouter } from "next/navigation";

// Helper: format INR
const formatINR = (num) =>
  num.toLocaleString("en-IN", { minimumFractionDigits: 0 });

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""; // ✅ Use env var for Vercel

const ProductViewPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const products = useSelector((state) => state.products) || [];
  const cart = useSelector((state) => state.cart) || [];

  const product = products.find((p) => p._id === productId);
  const cartItem = cart.find((item) => item._id === product?._id);

  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (product?.image) {
      setMainImage(`${API_URL}${product.image}`);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white bg-gray-700">
        <p>Product not found.</p>
      </div>
    );
  }

  // Price & Discount Handling
  const price = product.price;
  const discount = product.discount || 0;
  const discountType = product.discountType || "%";

  let finalPrice = price;
  if (discount) {
    finalPrice =
      discountType === "%"
        ? price - price * (discount / 100)
        : price - discount;
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p._id !== product._id
  );

  return (
    <div className="min-h-[92vh] p-6 bg-gradient-to-br from-gray-900 to-green-800 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Product Images */}
        <div>
          <div className="border rounded-lg overflow-hidden mb-6 bg-white">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-80 object-contain"
              />
            ) : (
              <div className="w-full h-80 bg-gray-600 flex items-center justify-center text-gray-300 text-lg">
                No Image
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((imgUrl, idx) => {
                const imgPath = `${API_URL}${imgUrl}`;
                return (
                  <img
                    key={idx}
                    src={imgPath}
                    alt={`${product.name} ${idx + 1}`}
                    className={`h-20 w-20 object-contain rounded cursor-pointer border-2 ${
                      mainImage === imgPath
                        ? "border-indigo-500"
                        : "border-transparent"
                    } transition`}
                    onClick={() => setMainImage(imgPath)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">{product.name}</h1>
            <p className="text-indigo-400 mb-3 uppercase tracking-wide font-semibold">
              {product.category}
            </p>

            {/* Rating */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={
                      i < Math.round(product.rating || 0)
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-indigo-300">
                {product.reviewsCount || 0} Review
                {product.reviewsCount > 1 ? "s" : ""}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6 max-h-48 overflow-y-auto text-gray-300 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-5 mb-6">
              <p className="text-4xl font-bold text-green-400">
                ₹{formatINR(finalPrice > 0 ? finalPrice : 0)}
              </p>
              {discount > 0 && (
                <>
                  <p className="line-through text-lg text-gray-400">
                    ₹{formatINR(price)}
                  </p>
                  <span className="bg-red-600 text-sm px-2 py-1 rounded font-semibold">
                    {discountType === "%" ? `${discount}% OFF` : `₹${discount} OFF`}
                  </span>
                </>
              )}
            </div>

            {/* Extra Details */}
            <div className="mb-6 grid grid-cols-2 gap-x-10 gap-y-2 text-gray-300">
              {product.sku && (
                <div>
                  <span className="font-semibold">SKU:</span> {product.sku}
                </div>
              )}
              {product.stock !== undefined && (
                <div>
                  <span className="font-semibold">Availability:</span>{" "}
                  {product.stock > 0 ? (
                    <span className="text-green-400">In Stock</span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </div>
              )}
              {product.brand && (
                <div>
                  <span className="font-semibold">Brand:</span> {product.brand}
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="font-semibold">Weight:</span> {product.weight}
                </div>
              )}
            </div>
          </div>

          {/* Cart Buttons */}
          <div className="flex gap-2 md:w-[40%] w-full">
            <button
              onClick={() => dispatch(addToCart(product))}
              disabled={product.stock === 0}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition ${
                cartItem
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {cartItem
                ? `${cartItem.quantity} Added to Cart`
                : product.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            {cartItem && (
              <button
                onClick={() => dispatch(removeFromCart(product._id))}
                className="flex-1 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 font-semibold transition"
              >
                Remove Item
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold mb-6 border-b border-green-400 pb-2">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {relatedProducts.slice(0, 5).map((rp) => (
              <div
                key={rp._id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-black cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/productView?id=${rp._id}`)} // ✅ fixed path
              >
                {rp.image && (
                  <img
                    src={`${API_URL}${rp.image}`}
                    alt={rp.name}
                    className="w-full h-36 object-contain mb-3"
                  />
                )}
                <p className="font-semibold text-center line-clamp-2">
                  {rp.name}
                </p>
                <p className="text-indigo-700 font-bold mt-auto">
                  ₹{formatINR(rp.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductViewPage;
