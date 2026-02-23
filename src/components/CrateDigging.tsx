import type { SimilarSong } from "@/types";

interface CrateDiggingProps {
  songs: SimilarSong[];
}

export default function CrateDigging({ songs }: CrateDiggingProps) {
  if (!songs.length) return null;

  return (
    <section aria-labelledby="crate-digging-heading">
      <h2
        id="crate-digging-heading"
        className="text-xl font-bold text-white mb-4"
      >
        🎧 Crate Digging — Similar Tracks
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song, idx) => (
          <li
            key={song.spotify_id ?? idx}
            className="bg-gray-800 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{song.title}</p>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            </div>
            <div className="text-right shrink-0">
              {song.camelot_key && (
                <span className="text-purple-400 font-bold text-sm">
                  {song.camelot_key}
                </span>
              )}
              {song.bpm && (
                <p className="text-gray-400 text-xs">{song.bpm} BPM</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
