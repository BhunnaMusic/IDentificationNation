"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    router.push(`/results?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl flex gap-2"
      role="search"
      aria-label="Search for a song"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by Artist / Title or paste a Spotify / YouTube URL…"
        className="flex-1 rounded-xl px-5 py-4 text-base text-gray-900 bg-white border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
        aria-label="Search query"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold px-6 py-4 shadow-md transition-colors"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
