"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DJStatsCard from "@/components/DJStatsCard";
import type { SearchResult } from "@/types";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; result: SearchResult };

function ResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [state, setState] = useState<FetchState>(
    query ? { status: "loading" } : { status: "idle" }
  );

  useEffect(() => {
    if (!query) return;

    let cancelled = false;

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(json.error ?? "Search failed.");
        setState({
          status: "success",
          result: { song: json.song, similar_songs: json.similar_songs ?? [] },
        });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setState({ status: "error", message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex flex-col items-center px-4 py-10 gap-8">
      <div className="w-full max-w-3xl flex items-center justify-between">
        <Link
          href="/"
          className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
        >
          ← New Search
        </Link>
        {query && (
          <p className="text-gray-400 text-sm truncate max-w-xs" title={query}>
            Results for:{" "}
            <span className="text-white font-medium">{query}</span>
          </p>
        )}
      </div>

      {state.status === "idle" && (
        <p className="text-gray-400">Enter a search query on the home page.</p>
      )}

      {state.status === "loading" && (
        <div
          role="status"
          aria-live="polite"
          className="text-gray-300 text-lg animate-pulse"
        >
          🔍 Searching…
        </div>
      )}

      {state.status === "error" && (
        <div
          role="alert"
          className="bg-red-900/60 border border-red-500 text-red-200 rounded-xl px-6 py-4 max-w-3xl w-full"
        >
          <strong>Error:</strong> {state.message}
        </div>
      )}

      {state.status === "success" && (
        <DJStatsCard
          song={state.result.song}
          similarSongs={state.result.similar_songs}
        />
      )}
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-950 flex items-center justify-center text-white text-lg animate-pulse">
          Loading…
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
