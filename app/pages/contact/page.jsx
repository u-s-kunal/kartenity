"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully!");
      console.log(formData);
      setFormData({ name: "", email: "", mobile: "", message: "" });
    }
  };

  return (
    <div className="min-h-[92vh] bg-gradient-to-br from-blue-400 to-violet-600 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full  md:w-[35vw]  text-shadow-white p-8 shadow-2xl flex-col items-center justify-center rounded-2xl text-white"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Contact Us
        </h2>

        <div className="">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border border-gray-300 rounded-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm ">{errors.email}</p>
          )}
        </div>

        <div className="">
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-white"
          >
            Mobile:
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
            className="w-full border border-gray-300 rounded-full px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm ">{errors.mobile}</p>
          )}
        </div>

        <div className="mb-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-white"
          >
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.message && (
            <p className="text-red-500 text-sm ">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700  text-white py-2 rounded-full font-semibold transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
