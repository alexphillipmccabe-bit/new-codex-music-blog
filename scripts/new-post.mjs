import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const POSTS_PATH = path.resolve(process.cwd(), 'src/data/posts.js')

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
  return value.replace(/'/g, "\\'")
}

function socialBlock(args) {
  const pairs = [
    ['Instagram', args.instagram],
    ['TikTok', args.tiktok],
    ['X', args.x],
    ['YouTube', args.youtube],
  ].filter(([, url]) => Boolean(url))

  if (!pairs.length) return "    socials: [],\n"

  return `    socials: [
${pairs
  .map(([label, url]) => `      { label: '${label}', url: '${escapeSingleQuotes(String(url))}' },`)
  .join('\n')}
    ],
`
}

function buildPostBlock({
  slug,
  title,
  songTitle,
  artist,
  publishedAt,
  spotifyEmbedUrl,
  spotifyArtistUrl,
  coverImageUrl,
  artistImageUrl,
  socials,
}) {
  return `  {
    slug: '${slug}',
    title: '${escapeSingleQuotes(title)}',
    songTitle: '${escapeSingleQuotes(songTitle)}',
    artist: '${escapeSingleQuotes(artist)}',
    publishedAt: '${publishedAt}',
    summary: 'Write one concise summary sentence about the song and your main take.',
    review: [
      'Paragraph 1: immediate reaction and strongest section of the song.',
      'Paragraph 2: production/vocal/songwriting details.',
      'Paragraph 3: A&R perspective on growth, positioning, or potential.',
    ],
    arNotes: [
      'Short bullet note 1.',
      'Short bullet note 2.',
      'Short bullet note 3.',
    ],
    coverImageUrl: '${escapeSingleQuotes(coverImageUrl)}',
    artistImageUrl: '${escapeSingleQuotes(artistImageUrl)}',
    spotifyEmbedUrl: '${escapeSingleQuotes(spotifyEmbedUrl)}',
    spotifyArtistUrl: '${escapeSingleQuotes(spotifyArtistUrl)}',
${socials}  },
`
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const title = String(args.title || '').trim()
  const songTitle = String(args.song || '').trim()
  const artist = String(args.artist || '').trim()
  const spotifyEmbedUrl = String(args.spotifyEmbed || '').trim()
  const spotifyArtistUrl = String(args.spotifyArtist || '').trim()
  const coverImageUrl = String(args.cover || '').trim() || '/hero.jpg'
  const artistImageUrl = String(args.artistImage || '').trim() || '/hero.jpg'

  if (!title || !songTitle || !artist || !spotifyEmbedUrl || !spotifyArtistUrl) {
    console.error(
      'Usage: npm run new:post -- --title "Review: Artist - Song" --song "Song" --artist "Artist" --spotifyEmbed "https://open.spotify.com/embed/track/..." --spotifyArtist "https://open.spotify.com/artist/..." [--cover "..."] [--artistImage "..."] [--instagram "..."] [--tiktok "..."] [--x "..."] [--youtube "..."]',
    )
    process.exit(1)
  }

  const publishedAt = String(args.date || todayIso())
  const file = await fs.readFile(POSTS_PATH, 'utf8')
  const existingSlugs = new Set([...file.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]))
  const slug = makeUniqueSlug(slugify(`${artist} ${songTitle} review`), existingSlugs)

  const socials = socialBlock(args)
  const marker = 'export const posts = [\n'
  if (!file.includes(marker)) {
    throw new Error('Could not find posts array in src/data/posts.js')
  }

  const block = buildPostBlock({
    slug,
    title,
    songTitle,
    artist,
    publishedAt,
    spotifyEmbedUrl,
    spotifyArtistUrl,
    coverImageUrl,
    artistImageUrl,
    socials,
  })

  const updated = file.replace(marker, `${marker}${block}`)
  await fs.writeFile(POSTS_PATH, updated, 'utf8')

  console.log(`Added new post: ${slug}`)
  console.log('- file: src/data/posts.js')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
