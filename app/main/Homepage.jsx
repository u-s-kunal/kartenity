"use client";

import Link from "next/link";
import Search from "./Search";

import { ShoppingCart } from "lucide-react";

export default function HomePage() {
  const categories = [
    { name: "All Products", icon: "🛒" },
    { name: "Electronics", icon: "💻" },
    { name: "Books", icon: "📚" },
    { name: "Accessories", icon: "👜" },
    { name: "Stationary", icon: "✏️" },
    { name: "Beauty", icon: "💄" },
    { name: "Fashion", icon: "👗" },
    { name: "Appliances", icon: "🔌" },
    { name: "Home & Kitchen", icon:"🏠" },
    { name: "Vehicles", icon: "🚗" },
    { name: "Bathroom", icon: "🛁" },
    { name: "Cleaning", icon: "🧹" },
    { name: "Groceries", icon: "🛒" },
    { name: "Jewellery", icon: "💍" },
  ];

  return (
    <div className="min-h-[92vh] bg-gradient-to-b  from-gray-600  to-purple-600   flex flex-col items-center justify-start  ">
      {/* Tagline */}
      <div className="container flex flex-col items-center justify-start px-4 py-10 m-auto rounded-4xl shadow-2xl">
        <header className="text-center mb-10 ">
          <span className=" text-4xl  m-4  md:text-8xl  font-bold text-gray-100 justify-center drop-shadow-sm flex">
            Welcome to KartEnity <ShoppingCart size={38} />
          </span>
          <p className="text-gray-200 text-lg md:text-2xl mt-2">
            Find everything you need in one place!
          </p>
        </header>
        <div className="w-full max-w-xl mb-10">
          <Search />
        </div>

        {/* Categories */}
        <section className="w-full max-w-5xl text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">
            🛍️ Shop by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/pages/products",
                  query:
                    cat.name === "All Products" ? {} : { category: cat.name },
                }}
                passHref
              >
                <div className="w-24 h-24 flex flex-col items-center justify-center bg-white shadow-md hover:shadow-2xl rounded-xl p-3 hover:scale-135  transition-transform cursor-pointer">
                  <div className="text-3xl">{cat.icon}</div>
                  <span className="mt-2 text-sm text-gray-700">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
