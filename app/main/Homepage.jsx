"use client";

import Link from "next/link";
import Search from "./Search";
import Image from "next/image";

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
    { name: "Home & Kitchen", icon: "🏠" },
    { name: "Vehicles", icon: "🚗" },
    { name: "Bathroom", icon: "🛁" },
    { name: "Cleaning", icon: "🧹" },
    { name: "Groceries", icon: "🛒" },
    { name: "Jewellery", icon: "💍" },
  ];

  return (
    <div className="min-h-[80vh] md:min-h-[92vh] bg-gradient-to-b from-gray-600 to-purple-600 flex flex-col items-center px-2">
      {/* Container */}
      <div className="container flex flex-col items-center sm:py-1 m-6  w-full">
        
        {/* Logo + Tagline */}
        <header className="flex flex-col items-center w-full text-center p-6  ">
          <Image
            src={"/logo.svg"}
            width={520}
            height={140}
            alt="KartEnity"
            className="m-4"
          />
        
        </header>

        {/* Search */}
        <div className="w-full max-w-md mb-6 sm:mb-10 px-4">
          <Search />
        </div>

        {/* Categories */}
        <section className="categories p-4 w-full max-w-5xl text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            🛍️ Shop by Category
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-6">
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
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center bg-white shadow-md hover:shadow-2xl rounded-xl p-2 sm:p-3 hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-2xl sm:text-3xl">{cat.icon}</div>
                  <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 text-center">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
