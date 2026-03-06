# Vault & Velocity

A simple song-review blog focused on new music, Spotify playback, and artist links.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Create a new daily post

```bash
npm run new:post -- \
  --title "Review: Artist Name - Song Title" \
  --song "Song Title" \
  --artist "Artist Name" \
  --spotifyEmbed "https://open.spotify.com/embed/track/..." \
  --spotifyArtist "https://open.spotify.com/artist/..." \
  --cover "https://..." \
  --artistImage "https://..." \
  --instagram "https://instagram.com/..." \
  --tiktok "https://tiktok.com/@..." \
  --x "https://x.com/..." \
  --youtube "https://youtube.com/@..."
```

The command inserts a new review template at the top of `src/data/posts.js`.
