# IDentificationNation

A **one-stop shop** for track BPM, Key (Camelot), Sub-genre, and deep cultural backstory — built for **Professional DJs and Music Producers**.

## Features

- **Search** by Artist/Title or paste a Spotify/YouTube URL
- **DJ Stats Card**: Large BPM and Camelot Key display (e.g. "126 BPM | 8A"), Energy and Danceability meters
- **Deep Dive**: Backstory, history, and lyric meaning via Google Search
- **Caching**: Supabase-backed cache keyed by ISRC for instant repeat lookups
- **Spotify API**: Fetch official Title, Artist, ISRC, BPM, Musical Key, Energy, Danceability
- **Camelot Conversion**: Utility to convert Spotify's key/mode into Camelot Wheel notation
- **YouTube Fallback**: For SoundCloud/indie tracks not on Spotify

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Supabase](https://supabase.com/) (Postgres + client SDK)
- Spotify Web API
- YouTube Data API v3
- Google Custom Search API

## Getting Started

1. **Clone and install dependencies:**

   ```bash
   git clone https://github.com/BhunnaMusic/IDentificationNation.git
   cd IDentificationNation
   npm install
   ```

2. **Set up environment variables:**

   Copy `.env.example` to `.env.local` and fill in your API keys:

   ```bash
   cp .env.example .env.local
   ```

3. **Set up the Supabase database:**

   Run the SQL schema in `supabase/schema.sql` against your Supabase project.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/search/route.ts   # Search API endpoint
│   ├── results/page.tsx       # Results page with DJ Stats Card
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Hero section with search bar
│   └── globals.css            # Global styles
├── lib/
│   ├── camelot.ts             # Spotify key/mode → Camelot conversion
│   ├── context-search.ts      # Google Search for backstory/lyrics
│   ├── search.ts              # Main search orchestration pipeline
│   ├── spotify.ts             # Spotify API integration
│   ├── supabase.ts            # Supabase client + cache operations
│   └── youtube.ts             # YouTube API fallback
├── __tests__/
│   ├── camelot.test.ts        # Camelot conversion tests
│   └── youtube.test.ts        # YouTube URL extraction tests
supabase/
└── schema.sql                 # SQL schema for the songs table
```

## Testing

```bash
npm test
```