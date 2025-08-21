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

      <div className="flex p-10 m-4  text-center items-center justify-between  w-full ">

      <h1 className="text-4xl font-bold text-white  p-3 rounded-2xl drop-shadow">
       Admin Dashboard Panel
      </h1>
      
       <button
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.href = "/pages/login";
            }}
            className="bg-yellow-600 hover:bg-gray-800 text-white mx-6  px-4 py-2 rounded-lg"
          >
            Logout
      </button>
      </div>
      

    



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
