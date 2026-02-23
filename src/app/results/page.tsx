"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

interface SongResult {
  title: string;
  artist: string;
  isrc: string | null;
  bpm: number | null;
  camelot: string | null;
  musicalKey: number | null;
  mode: number | null;
  energy: number | null;
  danceability: number | null;
  spotifyId: string | null;
  youtubeId: string | null;
  subGenre: string | null;
  backstory: string | null;
  lyricMeaning: string | null;
  source: string;
  cached: boolean;
}

function Meter({ label, value }: { label: string; value: number | null }) {
  const percentage = value !== null ? Math.round(value * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">
          {value !== null ? `${percentage}%` : "N/A"}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [result, setResult] = useState<SongResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q) {
      setError("No search query provided");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q!)}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Search failed");
          return;
        }
        const data: SongResult = await res.json();
        setResult(data);
      } catch {
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [q]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            Identifying track&hellip;
          </p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || "No results found"}</p>
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            &larr; Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="text-purple-400 hover:text-purple-300 text-sm mb-8 inline-block"
        >
          &larr; Back to search
        </Link>

        {/* DJ Stats Card */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{result.title}</h1>
            <p className="text-gray-400 text-lg">{result.artist}</p>
            {result.cached && (
              <span className="inline-block mt-2 text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">
                Cached result
              </span>
            )}
          </div>

          {/* BPM & Key - Large Display */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gray-900 rounded-xl px-8 py-4 text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider">BPM</p>
              <p className="text-4xl font-extrabold text-purple-400">
                {result.bpm ?? "—"}
              </p>
            </div>
            <div className="text-3xl text-gray-600">|</div>
            <div className="bg-gray-900 rounded-xl px-8 py-4 text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider">Key</p>
              <p className="text-4xl font-extrabold text-pink-400">
                {result.camelot ?? "—"}
              </p>
            </div>
            {result.subGenre && (
              <>
                <div className="text-3xl text-gray-600">|</div>
                <div className="bg-gray-900 rounded-xl px-8 py-4 text-center">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Genre</p>
                  <p className="text-xl font-bold text-gray-300">
                    {result.subGenre}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Energy & Danceability Meters */}
          <div className="mb-6">
            <Meter label="Energy" value={result.energy} />
            <Meter label="Danceability" value={result.danceability} />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
            {result.isrc && (
              <div>
                <span className="text-gray-600">ISRC:</span> {result.isrc}
              </div>
            )}
            <div>
              <span className="text-gray-600">Source:</span>{" "}
              <span className="capitalize">{result.source}</span>
            </div>
          </div>
        </div>

        {/* Deep Dive Section */}
        {(result.backstory || result.lyricMeaning) && (
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Deep Dive</h2>

            {result.backstory && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">
                  Backstory &amp; History
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {result.backstory}
                </p>
              </div>
            )}

            {result.lyricMeaning && (
              <div>
                <h3 className="text-lg font-semibold text-pink-400 mb-2">
                  Lyric Meaning
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {result.lyricMeaning}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
          <p>Loading&hellip;</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
