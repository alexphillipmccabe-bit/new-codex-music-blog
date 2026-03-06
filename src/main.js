import './style.css'
import { posts as seedPosts, site } from './data/posts.js'

const app = document.querySelector('#app')

const VALID_CATEGORIES = ['newies', 'oldies', 'ones-to-watch']
const DEFAULT_CATEGORY = 'newies'
const CATEGORY_LABELS = {
  newies: 'Newies',
  oldies: 'Oldies',
  'ones-to-watch': 'Ones to Watch',
}
const CATEGORY_HERO = {
  newies: {
    kicker: 'New Song Reviews',
    blurb:
      'New Song Releases: concise reviews of fresh tracks released within the last 12 months.',
  },
  oldies: {
    kicker: 'Classic Song Spotlights',
    blurb: 'Classic favourites reintroduced for a new generation of listeners.',
  },
  'ones-to-watch': {
    kicker: 'Ones to Watch',
    blurb:
      'Forward-looking tracks and artists with clear momentum, sharp craft, and momentum potential.',
  },
}

function normalizeCategory(value) {
  const candidate = String(value || DEFAULT_CATEGORY).toLowerCase()
  if (VALID_CATEGORIES.includes(candidate)) return candidate
  return DEFAULT_CATEGORY
}

function normalizePosts(items) {
  return items.map((post) => ({
    slug: post.slug || '',
    title: post.title || `Review: ${post.artist || 'Unknown'} - "${post.songTitle || 'Untitled'}"`,
    songTitle: post.songTitle || 'Untitled',
    artist: post.artist || 'Unknown Artist',
    publishedAt: post.publishedAt || new Date().toISOString().slice(0, 10),
    summary: post.summary || '',
    review: Array.isArray(post.review) ? post.review : [''],
    arNotes: Array.isArray(post.arNotes) ? post.arNotes : [''],
    coverImageUrl: post.coverImageUrl || '/hero.jpg',
    artistImageUrl: post.artistImageUrl || '',
    spotifyEmbedUrl: post.spotifyEmbedUrl || '',
    spotifyArtistUrl: post.spotifyArtistUrl || '',
    socials: Array.isArray(post.socials) ? post.socials : [],
    category: normalizeCategory(post.category || post.series),
    genre: String(post.genre || '').trim(),
    mood: String(post.mood || '').trim(),
    verdict: String(post.verdict || post.score || '').trim(),
    featured: Boolean(post.featured),
    relatedPosts: Array.isArray(post.relatedPosts)
      ? [...new Set(post.relatedPosts.map((item) => String(item).trim()).filter(Boolean))]
      : [],
  }))
}

const allPosts = normalizePosts(seedPosts).sort((a, b) => {
  return new Date(b.publishedAt) - new Date(a.publishedAt)
})

function formatDate(value, includeWeekday = false) {
  const extras = includeWeekday ? { weekday: 'long' } : {}
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
    ...extras,
  })
}

function categoryLabel(category) {
  return CATEGORY_LABELS[normalizeCategory(category)]
}

function postImage(post) {
  return post.coverImageUrl || post.artistImageUrl || '/hero.jpg'
}

function metaLine(post) {
  const parts = []
  const genre = post.genre ? `Genre: ${post.genre}` : null
  const mood = post.mood ? `Mood: ${post.mood}` : null
  const verdict = post.verdict ? `Verdict: ${post.verdict}` : null
  parts.push(categoryLabel(post.category))
  if (genre) parts.push(genre)
  if (mood) parts.push(mood)
  if (verdict) parts.push(verdict)
  return parts.join(' · ')
}

function topbarMarkup(activeCategory = DEFAULT_CATEGORY) {
  const now = new Date()
  const issueLine = formatDate(now, true).toUpperCase()

  return `
    <header class="topbar">
      <div class="masthead-divider"></div>
      <div class="masthead">
        <p class="masthead-kicker masthead-kicker-left">Music Criticism</p>
        <a href="#/${activeCategory}" class="brand-link">
          <p class="brand">${site.name}</p>
        </a>
        <p class="masthead-kicker masthead-kicker-right">EST. ${now.getUTCFullYear()}</p>
      </div>
      <p class="masthead-subline">${issueLine}</p>
      <nav class="category-switch" aria-label="Post categories">
        ${VALID_CATEGORIES.map(
          (category) => `
            <a
              href="#/${category}"
              class="category-link ${activeCategory === category ? 'active' : ''}"
            >${categoryLabel(category)}</a>
          `,
        ).join('')}
      </nav>
    </header>
  `
}

function feedCard(post) {
  const meta = metaLine(post)
  return `
    <article class="post-card">
      <a class="post-card-image-link" href="#/post/${post.slug}">
        <img class="post-card-image" src="${postImage(post)}" alt="${post.artist} cover" />
      </a>
      <div class="post-card-body">
        <p class="meta">${meta}</p>
        <h3><a href="#/post/${post.slug}">${post.songTitle}</a></h3>
        <p class="meta">${post.artist} · ${formatDate(post.publishedAt)}</p>
        <p class="summary">${post.summary}</p>
        <a class="inline-link" href="#/post/${post.slug}">Read full review</a>
      </div>
    </article>
  `
}

function featureCard(post, isLead = false) {
  return `
    <article class="feature-card${isLead ? ' feature-card--lead' : ''}">
      <a href="#/post/${post.slug}">
        <img class="feature-card-image" src="${postImage(post)}" alt="${post.artist} artwork" />
      </a>
      <div class="feature-card-body">
        <p class="meta">${categoryLabel(post.category)} · ${formatDate(post.publishedAt)}</p>
        <h2><a href="#/post/${post.slug}">${post.songTitle}</a></h2>
        <p class="meta">${post.artist}</p>
        <p class="summary">${post.summary}</p>
      </div>
    </article>
  `
}

function getPostsByCategory(category = DEFAULT_CATEGORY) {
  return allPosts.filter((post) => normalizeCategory(post.category) === normalizeCategory(category))
}

function buildFeaturedSet(categoryPosts) {
  const featured = []
  const seen = new Set()

  const main = categoryPosts.find((post) => post.featured)
  const pool = main ? [main, ...categoryPosts.filter((post) => post.featured && post.slug !== main.slug)] : categoryPosts

  for (const post of pool) {
    if (featured.length === 3) break
    if (seen.has(post.slug)) continue
    featured.push(post)
    seen.add(post.slug)
  }

  if (featured.length < 3) {
    for (const post of categoryPosts) {
      if (featured.length === 3) break
      if (seen.has(post.slug)) continue
      featured.push(post)
      seen.add(post.slug)
    }
  }

  const standard = categoryPosts.filter((post) => !seen.has(post.slug))
  return { featured, standard }
}

function renderHome(routeCategory = DEFAULT_CATEGORY) {
  const activeCategory = normalizeCategory(routeCategory)
  const categoryPosts = getPostsByCategory(activeCategory)
  const hero = CATEGORY_HERO[activeCategory]

  const { featured, standard } = buildFeaturedSet(categoryPosts)
  const lead = featured[0]
  const supporting = featured.slice(1)

  app.innerHTML = `
    ${topbarMarkup(activeCategory)}
    <main class="home">
      <section class="home-hero">
        <p class="home-kicker">${categoryLabel(activeCategory)}</p>
        <h1>${hero.kicker}</h1>
        <p>${hero.blurb}</p>
      </section>

      <section class="hero-featured">
        ${lead ? featureCard(lead, true) : '<p class="summary">No posts yet in this section.</p>'}
        ${supporting.length ? `<div class="hero-featured-secondary">${supporting.map((post) => featureCard(post)).join('')}</div>` : ''}
      </section>

      <section class="feed-grid">
        ${standard.length ? standard.map(feedCard).join('') : ''}
      </section>

      ${!categoryPosts.length ? '<p class="summary">No posts yet in this section.</p>' : ''}
    </main>
  `
}

function relatedPostsMarkup(post) {
  const related = getPostsByCategory(post.category)
    .filter((entry) => post.relatedPosts.includes(entry.slug) || false)
    .filter((entry) => entry.slug !== post.slug)

  const fallback = getPostsByCategory(post.category).filter((entry) => entry.slug !== post.slug)

  const selected = related.length
    ? related.slice(0, 3)
    : fallback.slice(0, 3)

  if (!selected.length) return ''

  return `
    <section class="related-posts">
      <h3>Related Reviews</h3>
      <div class="related-grid">
        ${selected
          .map(
            (item) => `
              <a class="related-post-link" href="#/post/${item.slug}">
                <img src="${postImage(item)}" alt="${item.artist} artwork" />
                <div>
                  <p class="meta">${formatDate(item.publishedAt)} · ${item.artist}</p>
                  <p class="related-title">${item.songTitle}</p>
                </div>
              </a>
            `,
          )
          .join('')}
      </div>
    </section>
  `
}

function postHeroMeta(post) {
  const rows = [
    `Category: ${categoryLabel(post.category)}`,
    post.genre ? `Genre: ${post.genre}` : null,
    post.mood ? `Mood: ${post.mood}` : null,
    post.verdict ? `Verdict: ${post.verdict}` : null,
  ].filter(Boolean)

  return rows.map((row) => `<li>${row}</li>`).join('')
}

function socialLinksMarkup(post) {
  if (!post.socials?.length) return ''

  return `
    <section class="socials">
      <h3>Artist socials</h3>
      <div class="social-list">
        ${post.socials
          .map(
            (social) =>
              `<a href="${social.url}" target="_blank" rel="noreferrer">${social.label}</a>`,
          )
          .join('')}
      </div>
    </section>
  `
}

function renderPost(slug) {
  const post = allPosts.find((entry) => entry.slug === slug)
  if (!post) return renderHome(getCurrentCategory())

  app.innerHTML = `
    ${topbarMarkup(post.category)}
    <main class="post-page">
      <article class="post-shell">
        <p><a class="inline-link" href="#/${post.category}">Back to ${categoryLabel(post.category)}</a></p>

        <header class="post-header">
          <p class="meta">${formatDate(post.publishedAt)} · ${categoryLabel(post.category)}</p>
          <h1>${post.songTitle}</h1>
          <p class="post-artist">${post.artist}</p>
          <ul class="post-metadata">${postHeroMeta(post)}</ul>
        </header>

        <img class="post-hero-image" src="${postImage(post)}" alt="${post.artist} image" />

        <p class="summary">${post.summary}</p>

        <section class="spotify-actions">
          <a href="${post.spotifyArtistUrl}" target="_blank" rel="noreferrer">Open Artist on Spotify</a>
        </section>

        <section class="spotify-wrap">
          <p class="spotify-label">Play This Track</p>
          <iframe
            src="${post.spotifyEmbedUrl}"
            title="Spotify player for ${post.songTitle}"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </section>

        <section class="review-text">
          ${post.review.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </section>

        ${post.arNotes.length
          ? `
            <section class="ar-notes">
              <h3>Editorial Notes</h3>
              <ul>
                ${post.arNotes.map((note) => `<li>${note}</li>`).join('')}
              </ul>
            </section>
          `
          : ''}

        ${socialLinksMarkup(post)}
        ${relatedPostsMarkup(post)}
      </article>
    </main>
  `
}

function getCurrentCategory(route = getRoutePath()) {
  const normalized = route.replace(/^category\//, '').trim().toLowerCase()
  return normalizeCategory(normalized)
}

function getRoutePath() {
  return window.location.hash
    .replace(/^#\/?/, '')
    .replace(/\?.*$/, '')
    .replace(/\/+$/, '')
}

function router() {
  const route = getRoutePath()
  if (!route || route === 'home') {
    return renderHome(DEFAULT_CATEGORY)
  }

  if (route.startsWith('post/')) {
    return renderPost(route.replace('post/', ''))
  }

  if (route.startsWith('category/')) {
    return renderHome(route.replace('category/', ''))
  }

  if (VALID_CATEGORIES.includes(route)) return renderHome(route)

  return renderHome(DEFAULT_CATEGORY)
}

window.addEventListener('hashchange', router)
router()
