"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    }finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Error deleting product");
    }
  };

  // Start Editing
  const startEdit = (product) => {
    setEditing(product._id);
    setForm({ ...product });
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const res = await fetch(`${API_URL}/api/products/${editing}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error();
      toast.success("Product updated");

      setEditing(null);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };

  // Filter products by name or category
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

   if (loading) {
    return (
      <div className="min-h-[92vh] flex items-center justify-center bg-gradient-to-r from-gray-700 to-green-800">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-purple-800  to-gray-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-white drop-shadow">
          Product Dashboard
        </h2>
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 text-white"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-white text-center mt-6">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4 flex flex-col"
            >
              <img
                src={`${API_URL}${p.image}`}
                alt={p.name}
                className="w-full h-48 object-contain rounded-lg mb-3 bg-white/10 p-1"
              />
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="text-sm text-gray-200">{p.category}</p>
              <p className="text-xl font-bold text-yellow-300 mt-2">
                ₹{p.price}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => startEdit(p)}
                  className="flex-1 bg-blue-500/80 hover:bg-blue-600 text-white py-1 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 bg-red-500/80 hover:bg-red-600 text-white py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-xl shadow-lg w-96 flex flex-col gap-3"
          >
            <h3 className="text-xl font-bold">Edit Product</h3>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files[0] })
              }
              className="border p-2 rounded"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
