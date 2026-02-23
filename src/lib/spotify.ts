import { toCamelot } from "@/lib/camelot";
import type { AudioFeatures, Song } from "@/types";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing Spotify credentials: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set."
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    next: { revalidate: 3300 }, // cache token for ~55 minutes
  });

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

/** Search Spotify for a track by artist/title query or Spotify URL/URI. */
export async function searchSpotifyTrack(query: string): Promise<Partial<Song> | null> {
  const token = await getAccessToken();

  // Handle Spotify track URL or URI
  const urlMatch = query.match(/spotify\.com\/track\/([A-Za-z0-9]+)/);
  const uriMatch = query.match(/spotify:track:([A-Za-z0-9]+)/);
  const trackId = urlMatch?.[1] ?? uriMatch?.[1];

  let trackData: SpotifyTrack;

  if (trackId) {
    const res = await fetch(`${SPOTIFY_API_BASE}/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    trackData = await res.json();
  } else {
    const searchUrl = `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
    const res = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    trackData = json.tracks?.items?.[0];
    if (!trackData) return null;
  }

  const audioFeatures = await getAudioFeatures(trackData.id, token);

  return {
    title: trackData.name,
    artist: trackData.artists.map((a: SpotifyArtist) => a.name).join(", "),
    isrc: trackData.external_ids?.isrc ?? "",
    spotify_id: trackData.id,
    album_art: trackData.album?.images?.[0]?.url ?? null,
    preview_url: trackData.preview_url ?? null,
    bpm: audioFeatures?.bpm ?? null,
    key_number: audioFeatures?.key ?? null,
    mode: audioFeatures?.mode ?? null,
    camelot_key: audioFeatures ? toCamelot(audioFeatures.key, audioFeatures.mode) : null,
    energy: audioFeatures?.energy ?? null,
    danceability: audioFeatures?.danceability ?? null,
  };
}

async function getAudioFeatures(
  trackId: string,
  token: string
): Promise<{ bpm: number; key: number; mode: number; energy: number; danceability: number } | null> {
  const res = await fetch(`${SPOTIFY_API_BASE}/audio-features/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.error) return null;
  return {
    bpm: Math.round(data.tempo),
    key: data.key,
    mode: data.mode,
    energy: data.energy,
    danceability: data.danceability,
  };
}

export async function getSpotifyRecommendations(
  seedTrackId: string,
  audioFeatures: Partial<AudioFeatures>
): Promise<Partial<Song>[]> {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    seed_tracks: seedTrackId,
    limit: "5",
    ...(audioFeatures.bpm && {
      target_tempo: String(audioFeatures.bpm),
      min_tempo: String(audioFeatures.bpm - 10),
      max_tempo: String(audioFeatures.bpm + 10),
    }),
    ...(audioFeatures.energy && { target_energy: String(audioFeatures.energy) }),
  });

  const res = await fetch(`${SPOTIFY_API_BASE}/recommendations?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return [];

  const json = await res.json();
  return (json.tracks ?? []).map((t: SpotifyTrack) => ({
    title: t.name,
    artist: t.artists.map((a: SpotifyArtist) => a.name).join(", "),
    spotify_id: t.id,
    album_art: t.album?.images?.[0]?.url ?? null,
    camelot_key: null,
    bpm: null,
  }));
}

// ── Internal Spotify type helpers ────────────────────────────────────────────

interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: { images: { url: string }[] };
  external_ids: { isrc: string };
  preview_url: string | null;
}
