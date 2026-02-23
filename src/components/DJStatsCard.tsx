import type { Song, SimilarSong } from "@/types";
import Image from "next/image";
import EnergyMeter from "@/components/EnergyMeter";
import CrateDigging from "@/components/CrateDigging";

interface DJStatsCardProps {
  song: Song;
  similarSongs?: SimilarSong[];
}

export default function DJStatsCard({ song, similarSongs = [] }: DJStatsCardProps) {
  return (
    <article
      aria-label={`DJ Stats for ${song.title} by ${song.artist}`}
      className="w-full max-w-3xl bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-6 p-6 bg-gray-800">
        {song.album_art && (
          <Image
            src={song.album_art}
            alt={`${song.title} album art`}
            width={100}
            height={100}
            className="rounded-xl shadow-lg object-cover"
            priority
          />
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold truncate">{song.title}</h1>
          <p className="text-gray-300 text-lg truncate">{song.artist}</p>
          {song.sub_genre && (
            <span className="mt-1 inline-block bg-purple-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {song.sub_genre}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Big Stats */}
        <div className="flex flex-wrap gap-4" aria-label="Key DJ stats">
          <StatBadge
            label="BPM"
            value={song.bpm != null ? String(song.bpm) : "N/A"}
            highlight
          />
          <StatBadge
            label="Key"
            value={song.camelot_key ?? "N/A"}
            highlight
          />
          {song.isrc && (
            <StatBadge label="ISRC" value={song.isrc} small />
          )}
        </div>

        {/* Meters */}
        <div className="space-y-3">
          <EnergyMeter label="Energy" value={song.energy} color="bg-orange-500" />
          <EnergyMeter label="Danceability" value={song.danceability} color="bg-purple-500" />
        </div>

        {/* Deep Dive */}
        {(song.backstory || song.lyric_meaning) && (
          <section aria-labelledby="deep-dive-heading">
            <h2
              id="deep-dive-heading"
              className="text-xl font-bold mb-3 flex items-center gap-2"
            >
              🔍 Deep Dive
            </h2>
            {song.backstory && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-1">
                  Backstory
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {song.backstory}
                </p>
              </div>
            )}
            {song.lyric_meaning && (
              <div>
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-1">
                  Lyric Meaning
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {song.lyric_meaning}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Crate Digging */}
        <CrateDigging songs={similarSongs} />

        {/* Preview Player */}
        {song.preview_url && (
          <div>
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
              Preview
            </h3>
            {/* audio element intentionally lacks captions – preview clips do not have dialogue */}
            <audio
              controls
              src={song.preview_url}
              className="w-full rounded-lg"
              aria-label={`Preview of ${song.title}`}
            />
          </div>
        )}
      </div>
    </article>
  );
}

function StatBadge({
  label,
  value,
  highlight = false,
  small = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl px-5 py-3 ${
        highlight ? "bg-purple-700 shadow-lg" : "bg-gray-800"
      }`}
    >
      <span
        className={`font-extrabold ${small ? "text-lg" : "text-3xl"} text-white`}
      >
        {value}
      </span>
      <span className="text-xs text-gray-300 uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
}
