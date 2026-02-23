import { findSongByIsrc, upsertSong, type SongRow } from "./supabase";
import { searchSpotify, getSpotifyTrackById } from "./spotify";
import { searchYouTube, extractYouTubeId } from "./youtube";
import { fetchSongContext } from "./context-search";

/** Parse input to determine if it's a Spotify URL, YouTube URL, or text query. */
function parseInput(input: string): {
  type: "spotify_url" | "youtube_url" | "query";
  value: string;
} {
  // Spotify URL: https://open.spotify.com/track/{id}
  const spotifyMatch = input.match(
    /open\.spotify\.com\/track\/([a-zA-Z0-9]+)/
  );
  if (spotifyMatch) {
    return { type: "spotify_url", value: spotifyMatch[1] };
  }

  // YouTube URL
  const ytId = extractYouTubeId(input);
  if (ytId) {
    return { type: "youtube_url", value: ytId };
  }

  return { type: "query", value: input.trim() };
}

export interface SearchResult {
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

/**
 * Main search function implementing the full data-fetching pipeline:
 * 1. Parse input (URL or query)
 * 2. Fetch from Spotify (or YouTube as fallback)
 * 3. Check Supabase cache by ISRC
 * 4. Enrich with context search
 * 5. Store to Supabase
 */
export async function searchSong(input: string): Promise<SearchResult | null> {
  const parsed = parseInput(input);

  // Step 1: Fetch from Spotify
  let spotifyData = null;
  if (parsed.type === "spotify_url") {
    spotifyData = await getSpotifyTrackById(parsed.value);
  } else if (parsed.type === "query") {
    spotifyData = await searchSpotify(parsed.value);
  }

  // Step 2: If we got Spotify data with an ISRC, check cache
  if (spotifyData?.isrc) {
    const cached = await findSongByIsrc(spotifyData.isrc);
    if (cached) {
      return {
        title: cached.title,
        artist: cached.artist,
        isrc: cached.isrc,
        bpm: cached.bpm,
        camelot: cached.camelot,
        musicalKey: cached.musical_key,
        mode: cached.mode,
        energy: cached.energy,
        danceability: cached.danceability,
        spotifyId: cached.spotify_id,
        youtubeId: cached.youtube_id,
        subGenre: cached.sub_genre,
        backstory: cached.backstory,
        lyricMeaning: cached.lyric_meaning,
        source: cached.source,
        cached: true,
      };
    }
  }

  // Step 3: YouTube fallback for non-Spotify tracks
  let youtubeData = null;
  if (!spotifyData && (parsed.type === "youtube_url" || parsed.type === "query")) {
    youtubeData =
      parsed.type === "youtube_url"
        ? { title: "", artist: "", youtubeId: parsed.value }
        : await searchYouTube(parsed.value);
  }

  if (!spotifyData && !youtubeData) {
    return null;
  }

  const title = spotifyData?.title ?? youtubeData?.title ?? "";
  const artist = spotifyData?.artist ?? youtubeData?.artist ?? "";

  // Step 4: Context search for backstory
  const context = await fetchSongContext(title, artist);

  const result: SearchResult = {
    title,
    artist,
    isrc: spotifyData?.isrc ?? null,
    bpm: spotifyData?.bpm ?? null,
    camelot: spotifyData?.camelot ?? null,
    musicalKey: spotifyData?.musicalKey ?? null,
    mode: spotifyData?.mode ?? null,
    energy: spotifyData?.energy ?? null,
    danceability: spotifyData?.danceability ?? null,
    spotifyId: spotifyData?.spotifyId ?? null,
    youtubeId: youtubeData?.youtubeId ?? null,
    subGenre: null,
    backstory: context.backstory,
    lyricMeaning: context.lyricMeaning,
    source: spotifyData ? "spotify" : "youtube",
    cached: false,
  };

  // Step 5: Store to Supabase
  if (result.isrc) {
    await upsertSong({
      isrc: result.isrc,
      title: result.title,
      artist: result.artist,
      bpm: result.bpm,
      musical_key: result.musicalKey,
      mode: result.mode,
      camelot: result.camelot,
      energy: result.energy,
      danceability: result.danceability,
      spotify_id: result.spotifyId,
      youtube_id: result.youtubeId,
      sub_genre: result.subGenre,
      backstory: result.backstory,
      lyric_meaning: result.lyricMeaning,
      source: result.source,
    });
  }

  return result;
}
