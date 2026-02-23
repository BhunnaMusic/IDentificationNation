import type { Song } from "@/types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * Search YouTube for a track when Spotify returns no result.
 * Returns a partial Song with a youtube_id populated.
 */
export async function searchYouTubeTrack(query: string): Promise<Partial<Song> | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY environment variable.");
  }

  // Allow bare YouTube URLs / IDs to be resolved directly
  const urlMatch = query.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  const videoId = urlMatch?.[1];

  if (videoId) {
    return resolveYouTubeId(videoId, apiKey);
  }

  const searchUrl =
    `${YOUTUBE_API_BASE}/search?` +
    new URLSearchParams({
      key: apiKey,
      q: query,
      part: "snippet",
      type: "video",
      videoCategoryId: "10", // Music
      maxResults: "1",
    }).toString();

  const res = await fetch(searchUrl);
  if (!res.ok) return null;

  const json = await res.json();
  const item = json.items?.[0];
  if (!item) return null;

  return {
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    youtube_id: item.id.videoId,
    isrc: "",
    spotify_id: null,
    album_art: item.snippet.thumbnails?.high?.url ?? null,
  };
}

async function resolveYouTubeId(
  videoId: string,
  apiKey: string
): Promise<Partial<Song> | null> {
  const url =
    `${YOUTUBE_API_BASE}/videos?` +
    new URLSearchParams({
      key: apiKey,
      id: videoId,
      part: "snippet",
    }).toString();

  const res = await fetch(url);
  if (!res.ok) return null;

  const json = await res.json();
  const item = json.items?.[0];
  if (!item) return null;

  return {
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    youtube_id: videoId,
    isrc: "",
    spotify_id: null,
    album_art: item.snippet.thumbnails?.high?.url ?? null,
  };
}
