-- IdentificationNation – Supabase songs table schema
-- Run this in the Supabase SQL editor to create the required table.

create table if not exists public.songs (
  id            uuid            primary key default gen_random_uuid(),
  isrc          text            not null unique,
  title         text            not null,
  artist        text            not null,
  bpm           integer,
  key_number    smallint,       -- Spotify key 0-11
  mode          smallint,       -- 0 = minor, 1 = major
  camelot_key   text,           -- e.g. "8A", "3B"
  energy        numeric(4,3),   -- 0.000 – 1.000
  danceability  numeric(4,3),   -- 0.000 – 1.000
  backstory     text,
  lyric_meaning text,
  sub_genre     text,
  spotify_id    text,
  youtube_id    text,
  album_art     text,
  preview_url   text,
  created_at    timestamptz     not null default now()
);

-- Index for fast ISRC lookups (ISRC is already unique; this makes it explicit)
create index if not exists songs_isrc_idx on public.songs (isrc);

-- Enable Row Level Security (RLS) – read-only public access, write via service role
alter table public.songs enable row level security;

-- Allow anonymous / authenticated reads
create policy "Public read access"
  on public.songs
  for select
  using (true);

-- Only the service role (server-side API routes) can insert/update
create policy "Service role write access"
  on public.songs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
