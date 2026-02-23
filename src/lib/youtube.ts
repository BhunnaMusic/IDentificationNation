const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

export interface YouTubeTrackData {
  title: string;
  artist: string;
  youtubeId: string;
}

/**
 * Search YouTube for a video matching the query.
 * Used as a fallback when Spotify doesn't have the track (e.g. SoundCloud/indie).
 */
export async function searchYouTube(query: string): Promise<YouTubeTrackData | null> {
  const apiKey = process.env.YOUTUBE_API_KEY ?? "";
  if (!apiKey) return null;

  const res = await fetch(
    `${YOUTUBE_API}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=1&key=${encodeURIComponent(apiKey)}`
  );

  if (!res.ok) return null;

  const json = await res.json();
  const item = json?.items?.[0];
  if (!item) return null;

  return {
    title: item.snippet?.title ?? "",
    artist: item.snippet?.channelTitle ?? "",
    youtubeId: item.id?.videoId ?? "",
  };
}

/** Extract a YouTube video ID from a URL. */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
