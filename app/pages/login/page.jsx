"use client";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = "/pages/dashboard"; // redirect after login
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="min-h-[92vh] flex items-center justify-center bg-gradient-to-l from-blue-600 to-green-600">
      <div className=" p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h1>

        <div className="space-y-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition-all duration-200"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
