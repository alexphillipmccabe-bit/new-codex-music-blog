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

function normalizeType(typeValue) {
  return typeValue === 'review' ? 'review' : 'spotlight'
}

function makeUniqueSlug(base, existingSlugs) {
  if (!existingSlugs.has(base)) return base
  let counter = 2
  while (existingSlugs.has(`${base}-${counter}`)) counter += 1
  return `${base}-${counter}`
}

function buildPostBlock({ slug, title, type, artist, publishedAt, tags }) {
  const defaultTags = type === 'review' ? ['review', 'new-release'] : ['spotlight', 'a&r-watch']
  const finalTags = tags.length ? tags : defaultTags
  const score = type === 'review' ? "'8.0'" : 'null'

  return `  {
    slug: '${slug}',
    title: '${title.replace(/'/g, "\\'")}',
    type: '${type}',
    artist: '${artist.replace(/'/g, "\\'")}',
    publishedAt: '${publishedAt}',
    tags: [${finalTags.map((tag) => `'${tag}'`).join(', ')}],
    score: ${score},
    excerpt: 'Write a one-line summary that captures why this post matters.',
    body: [
      'Paragraph 1: core take.',
      'Paragraph 2: standout moment or production note.',
      'Paragraph 3: A&R angle, momentum, or recommendation.',
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
      'Usage: npm run new:post -- --title "Post Title" --artist "Artist Name" [--type spotlight|review] [--tags "tag1,tag2"]',
    )
    process.exit(1)
  }

  const type = normalizeType(String(args.type || 'spotlight').toLowerCase())
  const publishedAt = String(args.date || todayIso())
  const tags = String(args.tags || '')
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)

  const file = await fs.readFile(POSTS_PATH, 'utf8')
  const slugs = new Set([...file.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]))
  const slug = makeUniqueSlug(slugify(`${artist} ${title}`), slugs)
  const marker = 'export const posts = [\n'

  if (!file.includes(marker)) {
    throw new Error('Could not find posts array in src/data/posts.js')
  }

  const block = buildPostBlock({ slug, title, type, artist, publishedAt, tags })
  const updated = file.replace(marker, `${marker}${block}`)
  await fs.writeFile(POSTS_PATH, updated, 'utf8')

  console.log(`Added new ${type} post:`)
  console.log(`- slug: ${slug}`)
  console.log(`- file: src/data/posts.js`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
