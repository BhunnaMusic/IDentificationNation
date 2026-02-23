import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { searchSpotifyTrack, getSpotifyRecommendations } from "@/lib/spotify";
import { searchYouTubeTrack } from "@/lib/youtube";
import { searchSongContext } from "@/lib/googleSearch";
import type { Song } from "@/types";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.trim() === "") {
    return NextResponse.json({ error: "Missing query parameter 'q'." }, { status: 400 });
  }

  try {
    // ── Step 1: Fetch basic track data from Spotify (or YouTube fallback) ──
    let trackData: Partial<Song> | null = await searchSpotifyTrack(query);
    let source: "spotify" | "youtube" = "spotify";

    if (!trackData) {
      trackData = await searchYouTubeTrack(query);
      source = "youtube";
    }

    if (!trackData || (!trackData.isrc && !trackData.youtube_id)) {
      return NextResponse.json({ error: "No track found for that query." }, { status: 404 });
    }

    // ── Step 2: Check Supabase cache ──────────────────────────────────────
    if (trackData.isrc) {
      const { data: cached } = await supabase
        .from("songs")
        .select("*")
        .eq("isrc", trackData.isrc)
        .single();

      if (cached) {
        const similar = trackData.spotify_id
          ? await getSpotifyRecommendations(trackData.spotify_id, cached)
          : [];
        return NextResponse.json({ song: cached, similar_songs: similar, cached: true });
      }
    }

    // ── Step 3: Enrich with Google Search Grounding ───────────────────────
    let contextData = { backstory: "", lyric_meaning: "", sub_genre: "" };
    if (trackData.title && trackData.artist) {
      try {
        contextData = await searchSongContext(trackData.title, trackData.artist);
      } catch {
        // Non-fatal: proceed without context enrichment
      }
    }

    const song: Song = {
      isrc: trackData.isrc ?? "",
      title: trackData.title ?? "",
      artist: trackData.artist ?? "",
      bpm: trackData.bpm ?? null,
      key_number: trackData.key_number ?? null,
      mode: trackData.mode ?? null,
      camelot_key: trackData.camelot_key ?? null,
      energy: trackData.energy ?? null,
      danceability: trackData.danceability ?? null,
      backstory: contextData.backstory || null,
      lyric_meaning: contextData.lyric_meaning || null,
      sub_genre: contextData.sub_genre || null,
      spotify_id: trackData.spotify_id ?? null,
      youtube_id: trackData.youtube_id ?? null,
      album_art: trackData.album_art ?? null,
      preview_url: trackData.preview_url ?? null,
    };

    // ── Step 4: Persist to Supabase ───────────────────────────────────────
    if (song.isrc) {
      await supabase.from("songs").upsert(song, { onConflict: "isrc" });
    }

    // ── Step 5: Fetch similar tracks ─────────────────────────────────────
    const similar =
      source === "spotify" && song.spotify_id
        ? await getSpotifyRecommendations(song.spotify_id, {
            bpm: song.bpm ?? undefined,
            energy: song.energy ?? undefined,
          })
        : [];

    return NextResponse.json({ song, similar_songs: similar, cached: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
