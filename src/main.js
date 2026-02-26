import './style.css'
import { getAllTags, posts, site } from './data/posts.js'

const app = document.querySelector('#app')

const sortedPosts = [...posts].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
)

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function navMarkup() {
  return `
    <header class="topbar">
      <a href="#/" class="brand-link">
        <p class="brand">${site.name}</p>
        <p class="stamp">${site.strap}</p>
      </a>
      <nav class="topnav">
        <a href="#/">Home</a>
        <a href="#/tag/${encodeURIComponent('a&r-watch')}">A&R Watch</a>
        <a href="#/tag/review">Reviews</a>
      </nav>
    </header>
  `
}

function tagChip(tag) {
  return `<a class="tag-chip" href="#/tag/${encodeURIComponent(tag)}">${tag}</a>`
}

function postCard(post) {
  return `
    <article class="feed-card">
      <p class="feed-meta">${post.type} · ${formatDate(post.publishedAt)}</p>
      <h3><a href="#/post/${post.slug}">${post.title}</a></h3>
      <p class="feed-artist">${post.artist}</p>
      <p class="feed-excerpt">${post.excerpt}</p>
      <div class="tag-row">${post.tags.map(tagChip).join('')}</div>
    </article>
  `
}

function reviewCard(post) {
  return `
    <article class="review-card">
      <p class="review-type">${post.type}</p>
      <h3><a href="#/post/${post.slug}">${post.title}</a></h3>
      <p class="review-artist">${post.artist}</p>
      <p class="review-blurb">${post.excerpt}</p>
      <p class="review-score">${post.score ?? 'A&R Watch'}</p>
    </article>
  `
}

function renderHome() {
  const featured = sortedPosts.find((post) => post.featured) ?? sortedPosts[0]
  const latest = sortedPosts.slice(0, 6)
  const reviews = sortedPosts.filter((post) => post.type === 'review').slice(0, 3)
  const allTags = getAllTags()

  app.innerHTML = `
    <div class="grain"></div>
    ${navMarkup()}
    <main>
      <section class="hero">
        <p class="eyebrow">Daily song + artist spotlights</p>
        <h1>On-trend picks for what is breaking next</h1>
        <p class="intro">${site.description}</p>
        <div class="ticker">
          ${allTags.slice(0, 6).map((tag) => `<span>${tag}</span>`).join('')}
        </div>
      </section>

      <section class="spotlight">
        <p class="spotlight-label">Lead Spotlight</p>
        <h2><a href="#/post/${featured.slug}">${featured.title}</a></h2>
        <p>${featured.excerpt}</p>
        <div class="tag-row">${featured.tags.map(tagChip).join('')}</div>
      </section>

      <section class="grid">
        <article class="panel">
          <div class="panel-head">
            <h3>Latest Posts</h3>
            <p>Daily feed</p>
          </div>
          <div class="feed-grid">${latest.map(postCard).join('')}</div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <h3>Review Desk</h3>
            <p>Scored notes</p>
          </div>
          <div class="reviews">${reviews.map(reviewCard).join('')}</div>
        </article>
      </section>
    </main>
  `
}

function renderTag(tag) {
  const normalized = decodeURIComponent(tag).toLowerCase()
  const filtered = sortedPosts.filter((post) => {
    if (post.tags.includes(normalized)) return true
    if (normalized === 'review' && post.type === 'review') return true
    return false
  })

  app.innerHTML = `
    <div class="grain"></div>
    ${navMarkup()}
    <main>
      <section class="hero compact">
        <p class="eyebrow">Tag</p>
        <h1>#${normalized}</h1>
        <p class="intro">${filtered.length} post(s)</p>
      </section>
      <section class="panel">
        <div class="feed-grid">
          ${filtered.length ? filtered.map(postCard).join('') : '<p>No posts yet for this tag.</p>'}
        </div>
      </section>
    </main>
  `
}

function renderPost(slug) {
  const post = sortedPosts.find((entry) => entry.slug === slug)
  if (!post) {
    app.innerHTML = `
      <div class="grain"></div>
      ${navMarkup()}
      <main>
        <section class="panel">
          <h2>Post not found</h2>
          <p><a href="#/">Back to homepage</a></p>
        </section>
      </main>
    `
    return
  }

  app.innerHTML = `
    <div class="grain"></div>
    ${navMarkup()}
    <main>
      <article class="post-page panel">
        <p class="feed-meta">${post.type} · ${formatDate(post.publishedAt)}</p>
        <h1>${post.title}</h1>
        <p class="post-artist">${post.artist}</p>
        <div class="tag-row">${post.tags.map(tagChip).join('')}</div>
        <div class="post-body">
          ${post.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </div>
        <p class="review-score">${post.score ? `Score: ${post.score}` : 'A&R Watch'}</p>
      </article>
    </main>
  `
}

function router() {
  const route = window.location.hash.replace(/^#\/?/, '')
  if (!route) {
    renderHome()
    return
  }
  if (route.startsWith('tag/')) {
    renderTag(route.replace('tag/', ''))
    return
  }
  if (route.startsWith('post/')) {
    renderPost(route.replace('post/', ''))
    return
  }
  renderHome()
}

window.addEventListener('hashchange', router)
router()
