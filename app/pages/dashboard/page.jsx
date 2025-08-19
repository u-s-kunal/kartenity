"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderManager from "../OrderManager"; // import the new component

function Dashboard() {
  // --- Product Form states ---
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // --- Handlers for product form ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      toast.success("Product added successfully!");

      // Reset form
      setName("");
      setCategory("");
      setPrice("");
      setDescription("");
      setSelectedFile(null);
      setPreview("");
      document.getElementById("fileInput").value = "";
    } catch (err) {
      console.error("Error submitting form:", err.message);
      toast.error("Something went wrong while adding product.");
    }
  };

  return (
    <div className="min-h-[92vh] flex flex-col md:flex-row items-start justify-center gap-8 p-6 bg-gradient-to-r from-sky-600 to-red-500">
      <ToastContainer />

      {/* --- Product Upload Card --- */}
      <div className="bg-transparent rounded-4xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Add New Product
        </h1>
        <form
          onSubmit={handleProductSubmit}
          className="space-y-4 flex flex-col items-center"
        >
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <select
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Accessories">Accessories</option>
            <option value="Stationary">Stationary</option>
            <option value="Beauty">Beauty</option>
            <option value="Fashion">Fashion</option>
            <option value="Appliances">Appliances</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Bathroom">Bathroom</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Groceries">Groceries</option>
            <option value="Jewellery">Jewellery</option>
          </select>

          <input
            type="file"
            accept="image/*"
            id="fileInput"
            className="w-full bg-white text-black file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:border-gray-300 file:text-sm file:font-semibold file:bg-indigo-100 hover:file:bg-indigo-200"
            onChange={handleImageChange}
            required
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-contain rounded-md border border-gray-300"
            />
          )}

          <button
            type="submit"
            className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* --- Order Manager Component --- */}
      <OrderManager />
    </div>
  );
}

export default Dashboard;
