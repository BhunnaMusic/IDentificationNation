import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6 mb-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
          Identification
          <span className="text-purple-400">Nation</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-xl">
          Instant BPM, Camelot Key, Sub-genre &amp; Song Backstory for DJs and
          Producers. Paste a Spotify/YouTube URL or just search by Artist &amp;
          Title.
        </p>
      </section>

      {/* Search */}
      <SearchBar />

      {/* Hint badges */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-400">
        {[
          "🎵 Spotify URLs",
          "▶️ YouTube URLs",
          "🔍 Artist + Title",
          "🎹 Camelot Key",
          "⚡ BPM",
          "📖 Backstory",
        ].map((hint) => (
          <span
            key={hint}
            className="bg-gray-800 rounded-full px-3 py-1 border border-gray-700"
          >
            {hint}
          </span>
        ))}
      </div>
    </main>
  );
}
