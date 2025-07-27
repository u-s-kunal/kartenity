"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to the same page or a results page with query in URL
      router.push(`/pages/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex  text-amber-100 font-bold"
    >
      <input
        type="text"
        placeholder="🔍 Search for products, categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-5 py-3 border-none outline-none shadow-none focus:outline-none focus:ring-0 focus:border-none rounded-full"
      />
      <button
        type="submit"
        className="px-8 py-3 border-none outline-none shadow-none focus:outline-none focus:ring-0 focus:border-none rounded-full bg-gray-600"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

export default Search;
