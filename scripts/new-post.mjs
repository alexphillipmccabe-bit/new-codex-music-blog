import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const POSTS_PATH = path.resolve(process.cwd(), 'src/data/posts.js')

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function normalizeSeries(value) {
  return value === 'oldies' ? 'oldies' : 'scouting'
}

function makeUniqueSlug(base, existingSlugs) {
  if (!existingSlugs.has(base)) return base
  let counter = 2
  while (existingSlugs.has(`${base}-${counter}`)) counter += 1
  return `${base}-${counter}`
}

function buildPostBlock({ slug, title, series, artist, publishedAt, tags, spotifyEmbedUrl }) {
  const defaultTags = series === 'oldies' ? ['oldies', 'classic'] : ['scouting', 'a&r-watch']
  const finalTags = tags.length ? tags : defaultTags
  const score = series === 'scouting' ? "'8.0'" : 'null'
  const spotifyValue = spotifyEmbedUrl
    ? `'${spotifyEmbedUrl.replace(/'/g, "\\'")}'`
    : 'null'

  return `  {
    slug: '${slug}',
    title: '${title.replace(/'/g, "\\'")}',
    series: '${series}',
    artist: '${artist.replace(/'/g, "\\'")}',
    publishedAt: '${publishedAt}',
    tags: [${finalTags.map((tag) => `'${tag}'`).join(', ')}],
    score: ${score},
    spotifyEmbedUrl: ${spotifyValue},
    excerpt: 'Write a one-line summary that captures why this post matters.',
    body: [
      'Paragraph 1: core take.',
      'Paragraph 2: standout moment or production note.',
      'Paragraph 3: why this matters for your audience.',
    ],
    featured: false,
  },
`
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const title = String(args.title || '').trim()
  const artist = String(args.artist || '').trim()
  if (!title || !artist) {
    console.error(
      'Usage: npm run new:post -- --title "Post Title" --artist "Artist Name" [--series oldies|scouting] [--tags "tag1,tag2"] [--spotify "https://open.spotify.com/embed/..."]',
    )
    process.exit(1)
  }

  const series = normalizeSeries(String(args.series || 'scouting').toLowerCase())
  const publishedAt = String(args.date || todayIso())
  const tags = String(args.tags || '')
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
  const spotifyEmbedUrl = String(args.spotify || '').trim()

  const file = await fs.readFile(POSTS_PATH, 'utf8')
  const slugs = new Set([...file.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]))
  const slug = makeUniqueSlug(slugify(`${artist} ${title}`), slugs)

  const marker = 'export const posts = [\n'
  if (!file.includes(marker)) {
    throw new Error('Could not find posts array in src/data/posts.js')
  }
  const block = buildPostBlock({
    slug,
    title,
    series,
    artist,
    publishedAt,
    tags,
    spotifyEmbedUrl,
  })
  const updated = file.replace(marker, `${marker}${block}`)
  await fs.writeFile(POSTS_PATH, updated, 'utf8')

  console.log(`Added new ${series} post:`)
  console.log(`- slug: ${slug}`)
  console.log(`- file: src/data/posts.js`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
