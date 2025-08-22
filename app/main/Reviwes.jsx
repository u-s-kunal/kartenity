"use client";

import React, { useState, useEffect } from "react";

function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews?productId=${productId}`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, API_URL]);

  // --- Rating Calculations ---
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  if (loading) {
    return <p className="text-center text-gray-400">Loading reviews...</p>;
  }

  if (!reviews.length) {
    return (
      <div className="mt-16 text-center text-gray-400">
        <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
        <p>No reviews yet for this product.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Rating */}
      <div className="flex items-center space-x-3 mb-5">
        <div className="flex text-yellow-400">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill={i < Math.round(avgRating) ? "currentColor" : "none"}
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
          {avgRating.toFixed(1)} / 5 ({reviews.length} reviews)
        </p>
      </div>

      {/* --- Review Panel --- */}
      <div className="mt-16">
        <h2 className="text-3xl font-extrabold mb-6 border-b border-green-400 pb-2">
          Customer Reviews
        </h2>

        {/* Average Rating + Bars */}
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 bg-gray-800 rounded-xl p-6 shadow">
            <p className="text-5xl font-bold text-yellow-400">
              {avgRating.toFixed(1)}
            </p>
            <p className="text-gray-300">out of 5</p>
            <div className="flex text-yellow-400 my-2">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i < Math.round(avgRating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-400">{reviews.length} total reviews</p>
          </div>

          <div className="flex-1">
            {ratingCounts.map((count, idx) => {
              const star = 5 - idx;
              return (
                <div key={star} className="flex items-center mb-2">
                  <span className="w-12">{star}★</span>
                  <div className="flex-1 bg-gray-700 rounded h-3 mx-2">
                    <div
                      className="bg-yellow-400 h-3 rounded"
                      style={{
                        width: `${
                          reviews.length ? (count / reviews.length) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-10 grid gap-6">
          {reviews.map((r, index) => (
            <div
              key={r._id || index}
              className="bg-white text-black rounded-xl p-6 shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{r.title}</h3>
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={i < r.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-3">{r.comment}</p>
              {r.image && (
                <img
                  src={`${API_URL}${r.image}`} // ✅ use review's image
                  alt="review"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
