"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Box, ClipboardList } from "lucide-react"; // Icons

export default function DashboardHome() {
  const router = useRouter();

  const cards = [
    {
      name: "Add Product",
      icon: <Box className="w-10 h-10 text-white" />,
      path: "/pages/productForm",
    },
    {
      name: "Manage Products",
      icon: <ShoppingCart className="w-10 h-10 text-white" />,
      path: "/pages/productDashboard",
    },
    {
      name: "Update Order Status",
      icon: <ClipboardList className="w-10 h-10 text-white" />,
      path: "/pages/orderStatusUpdate",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-red-800  to-gray-700 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-white mb-12 drop-shadow">
       Admin Dashboard Panel
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl">
        {cards.map((card) => (
          <div
            key={card.name}
            onClick={() => router.push(card.path)}
            className={`cursor-pointer p-8 rounded-3xl shadow-2xl backdrop-blur-md bg-white/20 border border-white/30 flex flex-col items-center justify-center gap-4 hover:scale-105 transform transition-all duration-300 ${card.color} bg-gradient-to-br`}
          >
            {card.icon}
            <h2 className="text-xl font-semibold text-white">{card.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
