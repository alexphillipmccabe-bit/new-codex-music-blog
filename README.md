# The Rhythm Gazette

A premium, source-controlled music review site built with Vite.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

This project is Vercel-ready.

In the Vercel dashboard:

1. Import this GitHub repository.
2. Set Framework Preset to **Vite**.
3. Keep Build Command as `npm run build`.
4. Keep Output Directory as `dist`.

You can also deploy from the CLI.

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

## Data model

Posts live in `src/data/posts.js` and are designed to stay code-first.

Required fields:

- `slug`
- `title`
- `songTitle`
- `artist`
- `publishedAt`
- `summary`
- `review`
- `arNotes`
- `category`
- `genre`
- `mood`
- `verdict`
- `featured`
- `relatedPosts`
- `coverImageUrl`
- `artistImageUrl`
- `spotifyEmbedUrl`
- `spotifyArtistUrl`
- `socials`

### Categories

- `newies` — new song reviews
- `oldies` — classic song spotlights
- `ones-to-watch` — tracks with momentum and forward-looking positioning

## Add a post from terminal

Use the generator:

```bash
npm run new:post -- \
  --title "Review: Artist - Song Title" \
  --song "Song Title" \
  --artist "Artist Name" \
  --spotifyEmbed "https://open.spotify.com/embed/track/..." \
  --spotifyArtist "https://open.spotify.com/artist/..." \
  --category "newies" \
  --genre "Indie Pop" \
  --mood "Nocturnal" \
  --verdict "8.2/10"
```

Optional flags:

- `--featured true|false`
- `--related "slug-a,slug-b"`
- `--cover`, `--artistImage`
- `--instagram`, `--tiktok`, `--x`, `--youtube`
