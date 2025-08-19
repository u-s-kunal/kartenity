"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
    type: "",       // complaint or suggestion
    orderId: "",    // only for complaints
    relatedTo: "",  // only for suggestions
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile must be 10 digits";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (formData.type === "complaint" && !formData.orderId.trim()) {
      newErrors.orderId = "Order ID is required for complaints";
    }
    if (formData.type === "suggestion" && !formData.relatedTo.trim()) {
      newErrors.relatedTo = "Please select a related category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Message sent successfully!", { position: "top-center" });
        setFormData({
          name: "",
          email: "",
          mobile: "",
          message: "",
          type: "",
          orderId: "",
          relatedTo: "",
        });
      } else {
        toast.error(`❌ Failed: ${data.error || "Unknown error"}`, { position: "top-center" });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("❌ Something went wrong!", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] bg-gradient-to-br from-indigo-500 via-purple-600 to-green-600 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[35vw] p-8 bg-black/30 backdrop-blur-lg shadow-2xl rounded-2xl text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Contact Us</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none text-white"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none text-white"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mobile</label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none text-white"
            placeholder="10-digit number"
          />
          {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}
        </div>

        {/* Type Radio */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="flex gap-6 text-white">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="suggestion"
                checked={formData.type === "suggestion"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value, orderId: "", relatedTo: "" })
                }
              />
              Suggestions
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="complaint"
                checked={formData.type === "complaint"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value, orderId: "", relatedTo: "" })
                }
              />
             Return / Cancellation
            </label>
          </div>
        </div>

        {/* Conditional Fields */}
        {formData.type === "complaint" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Order ID</label>
            <input
              type="text"
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              className="w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none text-white"
              placeholder="Enter your order ID"
            />
            {errors.orderId && <p className="text-red-400 text-sm">{errors.orderId}</p>}
          </div>
        )}

        {formData.type === "suggestion" && (
          <div className="mb-4 ">
            <label className="block text-sm font-medium mb-1">Related To</label>
            <select
              value={formData.relatedTo}
              onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
              className="w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-800  "
            >
              <option value="">Select...</option>
              <option value="appreciation">For Appreciation</option>
              <option value="About Products">About Products</option>
              <option value="About Orders">About Orers</option>
              <option value="ui">User Interface</option>
              <option value="website">Website Improvement</option>
              <option value="Other">Other Suggestions</option>
            </select>
            {errors.relatedTo && <p className="text-red-400 text-sm">{errors.relatedTo}</p>}
          </div>
        )}

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            rows="4"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none text-white"
            placeholder="Write your message..."
          />
          {errors.message && <p className="text-red-400 text-sm">{errors.message}</p>}
        </div>

        {/* Submit */}
        {!loading ? (
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md"
          >
            Submit
          </button>
        ) : (
          <button
            type="submit"
            disabled
            className="w-full bg-gray-400 py-3 rounded-xl font-semibold"
          >
            Sending...
          </button>
        )}
      </form>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
