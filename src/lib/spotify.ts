import { toCamelot } from "./camelot";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API = "https://api.spotify.com/v1";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry = 0;

/** Get a Spotify client-credentials access token. */
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID ?? "";
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status}`);
  }

  const json: SpotifyTokenResponse = await res.json();
  cachedToken = json.access_token;
  // Expire 60s early to avoid edge cases
  tokenExpiry = Date.now() + (json.expires_in - 60) * 1000;
  return cachedToken;
}

export interface SpotifyTrackData {
  title: string;
  artist: string;
  isrc: string;
  spotifyId: string;
  bpm: number | null;
  musicalKey: number | null;
  mode: number | null;
  camelot: string | null;
  energy: number | null;
  danceability: number | null;
}

/** Search Spotify for a track by query string and return enriched data. */
export async function searchSpotify(query: string): Promise<SpotifyTrackData | null> {
  const token = await getAccessToken();

  // Step 1: Search for the track
  const searchRes = await fetch(
    `${SPOTIFY_API}/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!searchRes.ok) return null;

  const searchJson = await searchRes.json();
  const track = searchJson?.tracks?.items?.[0];
  if (!track) return null;

  const isrc = track.external_ids?.isrc ?? "";
  const spotifyId = track.id;
  const title = track.name;
  const artist = track.artists?.map((a: { name: string }) => a.name).join(", ") ?? "";

  // Step 2: Get audio features for BPM, key, mode, energy, danceability
  const featuresRes = await fetch(`${SPOTIFY_API}/audio-features/${spotifyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let bpm: number | null = null;
  let musicalKey: number | null = null;
  let mode: number | null = null;
  let energy: number | null = null;
  let danceability: number | null = null;
  let camelot: string | null = null;

  if (featuresRes.ok) {
    const features = await featuresRes.json();
    bpm = features.tempo ? Math.round(features.tempo) : null;
    musicalKey = features.key ?? null;
    mode = features.mode ?? null;
    energy = features.energy ?? null;
    danceability = features.danceability ?? null;

    if (musicalKey !== null && mode !== null) {
      camelot = toCamelot(musicalKey, mode);
    }
  }

  return {
    title,
    artist,
    isrc,
    spotifyId,
    bpm,
    musicalKey,
    mode,
    camelot,
    energy,
    danceability,
  };
}

/** Fetch Spotify track data by Spotify track ID (from URL). */
export async function getSpotifyTrackById(trackId: string): Promise<SpotifyTrackData | null> {
  const token = await getAccessToken();

  const trackRes = await fetch(`${SPOTIFY_API}/tracks/${encodeURIComponent(trackId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!trackRes.ok) return null;

  const track = await trackRes.json();
  const isrc = track.external_ids?.isrc ?? "";
  const title = track.name;
  const artist = track.artists?.map((a: { name: string }) => a.name).join(", ") ?? "";

  const featuresRes = await fetch(`${SPOTIFY_API}/audio-features/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let bpm: number | null = null;
  let musicalKey: number | null = null;
  let mode: number | null = null;
  let energy: number | null = null;
  let danceability: number | null = null;
  let camelot: string | null = null;

  if (featuresRes.ok) {
    const features = await featuresRes.json();
    bpm = features.tempo ? Math.round(features.tempo) : null;
    musicalKey = features.key ?? null;
    mode = features.mode ?? null;
    energy = features.energy ?? null;
    danceability = features.danceability ?? null;

    if (musicalKey !== null && mode !== null) {
      camelot = toCamelot(musicalKey, mode);
    }
  }

  return {
    title,
    artist,
    isrc,
    spotifyId: trackId,
    bpm,
    musicalKey,
    mode,
    camelot,
    energy,
    danceability,
  };
}
