# Vault & Velocity

Two-series music blog for oldies spotlights and A&R scouting notes, built with Vite and vanilla JavaScript.

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
npm run new:post -- --title "Dreams Still Hits" --artist "Fleetwood Mac" --series oldies --tags "oldies,classic" --spotify "https://open.spotify.com/embed/track/0ofHAoxe9vBkTCp2UQIav"
```

The command inserts a new template at the top of `src/data/posts.js` with slug/date defaults.
