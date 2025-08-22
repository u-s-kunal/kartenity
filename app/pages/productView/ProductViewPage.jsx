"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../main/slices/cartSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { addToWish, removeFromWish } from "../../main/slices/wishlistSlice";
import Reviwes from "/app/main/Reviwes";
import { Edit2 } from "lucide-react";

const formatINR = (num) =>
  num.toLocaleString("en-IN", { minimumFractionDigits: 0 });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const ProductViewPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  

  const handleWriteReview = () => {
    router.push(`/pages/reviewForm?productId=${productId}`);
  };

  const wishlist = useSelector((state) => state.wishlist) || [];
  const products = useSelector((state) => state.products) || [];
  const cart = useSelector((state) => state.cart) || [];

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  const isInWishlist = (id) => wishlist?.some((item) => item._id === id);
  const cartItem = cart.find((item) => item._id === product?._id);

  // 🔹 Fetch product on first load OR when productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      // 1️⃣ Try Redux first
      let found = products.find((p) => p._id === productId);

      // 2️⃣ If not found, fetch from backend
      if (!found) {
        try {
          const res = await fetch(`${API_URL}/api/products/${productId}`);
          if (res.ok) {
            found = await res.json();
          }
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      }

      setProduct(found || null);
      setLoading(false);

      if (found?.image) {
        setMainImage(`${API_URL}${found.image}`);
      } else {
        setMainImage("");
      }
    };

    if (productId) fetchProduct();
  }, [productId, products]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white bg-gray-700">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white bg-gray-700">
        <p>Product not found.</p>
      </div>
    );
  }

  const toggleWishlist = (e, prod) => {
    e.stopPropagation();
    let updatedWishlist;
    if (isInWishlist(prod._id)) {
      updatedWishlist = wishlist.filter((item) => item._id !== prod._id);
      dispatch(removeFromWish(prod._id));
    } else {
      updatedWishlist = [...wishlist, prod];
      dispatch(addToWish(prod));
    }
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // --- Price & Discount
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
      {/* --- Product Main Section --- */}
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
                const imgPath = `/uploads/${imgUrl.split("/").pop()}`;
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

        {/* --- Product Details --- */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">{product.name}</h1>
            <p className="text-indigo-400 mb-3 uppercase tracking-wide font-semibold">
              {product.category}
            </p>

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
                    {discountType === "%"
                      ? `${discount}% OFF`
                      : `₹${discount} OFF`}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Cart + Wishlist Buttons */}
          <div className=" block md:flex gap-6 justify-center items-center">
            <button
              onClick={() => dispatch(addToCart(product))}
              disabled={product.stock === 0}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition ${
                cartItem
                  ? "bg-green-600 hover:bg-green-700 w-full m-2 "
                  : "bg-indigo-600 hover:bg-indigo-700 w-full m-2 "
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
                className="flex-1 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 font-semibold transition w-full m-2 "
              >
                Remove Item
              </button>
            )}

            <button
              onClick={(e) => toggleWishlist(e, product)}
              className="flex-1 px-6 py-3 rounded-full bg-yellow-600 hover:bg-red-700 font-semibold transition w-full m-2 "
            >
              {isInWishlist(product._id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
     {/* Reviews */}
          <div className="mt-16">
            <Reviwes productId={productId} />
      </div>
      

       {/* Product details here */}

        <button
  onClick={handleWriteReview}
  className="
    mt-4 
    px-6 py-3 
    bg-blue-600 text-white font-medium 
    rounded-lg 
    shadow-md 
    hover:bg-blue-700 
    hover:shadow-lg 
    transition 
    duration-300 
    ease-in-out
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-400 
    focus:ring-opacity-50
    flex items-center gap-2
  "
>
  <Edit2 className="w-5 h-5" />
  Write a Review
</button>


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
                onClick={() => router.push(`/pages/productView?id=${rp._id}`)}
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
