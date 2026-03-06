import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const POSTS_PATH = path.resolve(process.cwd(), 'src/data/posts.js')
const VALID_CATEGORIES = ['newies', 'oldies', 'ones-to-watch']

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) continue

    const key = token.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) {
      args[key] = true
      continue
    }

    args[key] = next
    i += 1
  }

  return args
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function makeUniqueSlug(base, existingSlugs) {
  if (!existingSlugs.has(base)) return base

  let count = 2
  while (existingSlugs.has(`${base}-${count}`)) count += 1
  return `${base}-${count}`
}

function escapeSingleQuotes(value) {
  return String(value).replace(/'/g, "\\'")
}

function normalizeCategory(value = '') {
  const candidate = String(value).toLowerCase()
  return VALID_CATEGORIES.includes(candidate) ? candidate : 'newies'
}

function parseSocials(args) {
  const pairs = [
    ['Instagram', args.instagram],
    ['TikTok', args.tiktok],
    ['X', args.x],
    ['YouTube', args.youtube],
  ].filter(([, url]) => Boolean(url))

  if (!pairs.length) return "    socials: [],\n"

  return `    socials: [\n${pairs
    .map(([label, url]) => `      { label: '${label}', url: '${escapeSingleQuotes(url)}' },`)
    .join('\n')}\n    ],\n`
}

function parseRelatedPosts(value = '') {
  return String(value)
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)
}

function parseVerdict(value, index = 0) {
  const trimmed = String(value || '').trim()
  if (trimmed) return trimmed

  return `${(6.8 + (index % 27) * 0.09).toFixed(1)}/10`
}

function buildPostBlock({
  slug,
  title,
  songTitle,
  artist,
  publishedAt,
  category,
  genre,
  mood,
  verdict,
  featured,
  spotifyEmbedUrl,
  spotifyArtistUrl,
  coverImageUrl,
  artistImageUrl,
  relatedPosts,
  socials,
}) {
  const related = relatedPosts.map((slug) => `      '${escapeSingleQuotes(slug)}'`).join(',\n')

  return `  {\n`
    + `    slug: '${slug}',\n`
    + `    title: '${escapeSingleQuotes(title)}',\n`
    + `    songTitle: '${escapeSingleQuotes(songTitle)}',\n`
    + `    artist: '${escapeSingleQuotes(artist)}',\n`
    + `    publishedAt: '${publishedAt}',\n`
    + `    summary: 'Write one concise summary sentence about the song and your main take.',\n`
    + `    review: [\n`
    + `      'Paragraph 1: immediate reaction and strongest section of the song.',\n`
    + `      'Paragraph 2: production, arrangement, and mix details.',\n`
    + `      'Paragraph 3: Editorial perspective on growth, positioning, or potential.',\n`
    + `    ],\n`
    + `    arNotes: [\n`
    + `      'Short bullet note 1.',\n`
    + `      'Short bullet note 2.',\n`
    + `      'Short bullet note 3.',\n`
    + `    ],\n`
    + `    category: '${category}',\n`
    + `    genre: '${escapeSingleQuotes(genre)}',\n`
    + `    mood: '${escapeSingleQuotes(mood)}',\n`
    + `    verdict: '${escapeSingleQuotes(verdict)}',\n`
    + `    featured: ${featured},\n`
    + `    relatedPosts: [\n${related ? `${related}\n` : ''}    ],\n`
    + `    coverImageUrl: '${escapeSingleQuotes(coverImageUrl)}',\n`
    + `    artistImageUrl: '${escapeSingleQuotes(artistImageUrl)}',\n`
    + `    spotifyEmbedUrl: '${escapeSingleQuotes(spotifyEmbedUrl)}',\n`
    + `    spotifyArtistUrl: '${escapeSingleQuotes(spotifyArtistUrl)}',\n`
    + `${socials}`
    + `  },\n`
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const title = String(args.title || '').trim()
  const songTitle = String(args.song || '').trim()
  const artist = String(args.artist || '').trim()
  const spotifyEmbedUrl = String(args.spotifyEmbed || '').trim()
  const spotifyArtistUrl = String(args.spotifyArtist || '').trim()

  if (!title || !songTitle || !artist || !spotifyEmbedUrl || !spotifyArtistUrl) {
    console.error(
      'Usage: npm run new:post -- \\\n'
        + '  --title "Review: Artist - Song" \\\n'
        + '  --song "Song" \\\n'
        + '  --artist "Artist" \\\n'
        + '  --spotifyEmbed "https://open.spotify.com/embed/track/..." \\\n'
        + '  --spotifyArtist "https://open.spotify.com/artist/..." \\\n'
        + '  [--category "newies|oldies|ones-to-watch"] [--genre "Genre"] [--mood "Mood"] [--verdict "8.2/10"] [--featured "true|false"] [--related "slug1,slug2"] [--cover "..."] [--artistImage "..."] [--instagram "..."] [--tiktok "..."] [--x "..."] [--youtube "..."]',
    )
    process.exit(1)
  }

  const publishedAt = String(args.date || todayIso())
  const coverImageUrl = String(args.cover || '').trim() || '/hero.jpg'
  const artistImageUrl = String(args.artistImage || '').trim() || '/hero.jpg'
  const category = normalizeCategory(args.category)
  const genre = String(args.genre || '').trim() || 'Editorial Pop'
  const mood = String(args.mood || '').trim() || 'Editorial'

  const file = await fs.readFile(POSTS_PATH, 'utf8')
  const existingSlugs = new Set([...file.matchAll(/"slug"\\s*:\\s*['"]([^'"]+)['"]/g)].map((m) => m[1]))
  const slug = makeUniqueSlug(slugify(`${artist} ${songTitle} review`), existingSlugs)
  const verdict = parseVerdict(String(args.verdict || '').trim(), existingSlugs.size)
  const relatedPosts = parseRelatedPosts(String(args.related || ''))
  const featured = String(args.featured || '').toLowerCase() === 'true'

  const marker = 'export const posts = [\n'
  if (!file.includes(marker)) {
    throw new Error('Could not find posts array in src/data/posts.js')
  }

  const socials = parseSocials(args)
  const block = buildPostBlock({
    slug,
    title,
    songTitle,
    artist,
    publishedAt,
    category,
    genre,
    mood,
    verdict,
    featured,
    spotifyEmbedUrl,
    spotifyArtistUrl,
    coverImageUrl,
    artistImageUrl,
    relatedPosts,
    socials,
  })

  await fs.writeFile(POSTS_PATH, file.replace(marker, `${marker}${block}`), 'utf8')

  console.log(`Added new post: ${slug}`)
  console.log('- file: src/data/posts.js')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
