import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

export interface SongRow {
  id: string;
  isrc: string;
  title: string;
  artist: string;
  bpm: number | null;
  musical_key: number | null;
  mode: number | null;
  camelot: string | null;
  energy: number | null;
  danceability: number | null;
  spotify_id: string | null;
  youtube_id: string | null;
  sub_genre: string | null;
  backstory: string | null;
  lyric_meaning: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

/** Check cache for a song by ISRC. */
export async function findSongByIsrc(isrc: string): Promise<SongRow | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("songs")
    .select("*")
    .eq("isrc", isrc)
    .single();

  if (error || !data) return null;
  return data as SongRow;
}

/** Save a new song record to Supabase (upsert by ISRC). */
export async function upsertSong(
  song: Omit<SongRow, "id" | "created_at" | "updated_at">
): Promise<SongRow | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("songs")
    .upsert(song, { onConflict: "isrc" })
    .select()
    .single();

  if (error) {
    console.error("Supabase upsert error:", error.message);
    return null;
  }
  return data as SongRow;
}
