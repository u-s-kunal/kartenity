"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function ReviewFormPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId"); // extract from URL

  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // max 3 images
    const oversized = files.find((f) => f.size > 2 * 1024 * 1024);
    if (oversized) {
      toast.error("Each image must be ≤ 2MB ❌");
      return;
    }
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("product_id", productId);
      form.append("rating", formData.rating);
      form.append("title", formData.title);
      form.append("comment", formData.comment);

      images.forEach((img) => form.append("images", img));

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        body: form, // FormData sets correct content-type
      });

      if (!response.ok) throw new Error("Failed to submit review");

      toast.success("Review submitted successfully 🎉");
      setFormData({ rating: 5, title: "", comment: "" });
      setImages([]);
      setPreviews([]);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review ❌");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-300 to-cyan-800">
      <ToastContainer />
      <div className="max-w-xl mx-auto p-8 rounded-3xl shadow-xl text-white">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Write a Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="product_id" value={productId || ""} />

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Review Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Amazing product!"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-1">Your Review</label>
            <textarea
              name="comment"
              placeholder="Write your detailed review..."
              value={formData.comment}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Images (optional, max 3, ≤ 2MB each)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
            />
            <div className="flex gap-3 mt-3">
              {previews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="h-20 w-20 object-cover rounded border border-gray-400"
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-all duration-300 shadow-md"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
