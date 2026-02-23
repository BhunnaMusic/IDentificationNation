-- Supabase SQL schema for the 'songs' table
-- This table stores all fetched track data, keyed by ISRC for deduplication.

CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  isrc TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  bpm NUMERIC,
  musical_key INTEGER,          -- Spotify key: 0=C, 1=C#, ..., 11=B
  mode INTEGER,                 -- Spotify mode: 1=major, 0=minor
  camelot TEXT,                 -- Derived Camelot notation (e.g. "8A")
  energy NUMERIC,
  danceability NUMERIC,
  spotify_id TEXT,
  youtube_id TEXT,
  sub_genre TEXT,
  backstory TEXT,
  lyric_meaning TEXT,
  source TEXT DEFAULT 'spotify', -- 'spotify' | 'youtube'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast ISRC lookups
CREATE INDEX IF NOT EXISTS idx_songs_isrc ON songs (isrc);

-- Index for searching by title/artist
CREATE INDEX IF NOT EXISTS idx_songs_title_artist ON songs (title, artist);
