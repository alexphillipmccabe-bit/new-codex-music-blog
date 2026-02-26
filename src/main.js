import './style.css'
import { posts, series, site } from './data/posts.js'

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
        <a href="#/series/oldies">Oldies Spotlight</a>
        <a href="#/series/scouting">A&R Scout</a>
      </nav>
    </header>
  `
}

function postCard(post) {
  const bucket = series[post.series]
  return `
    <article class="feed-card">
      <p class="feed-meta">${bucket.label} · ${formatDate(post.publishedAt)}</p>
      <h3><a href="#/post/${post.slug}">${post.title}</a></h3>
      <p class="feed-artist">${post.artist}</p>
      <p class="feed-excerpt">${post.excerpt}</p>
    </article>
  `
}

function renderHome() {
  const oldiesPosts = sortedPosts.filter((post) => post.series === 'oldies')
  const scoutingPosts = sortedPosts.filter((post) => post.series === 'scouting')
  const featured = oldiesPosts.find((post) => post.featured) ?? oldiesPosts[0] ?? sortedPosts[0]

  app.innerHTML = `
    <div class="grain"></div>
    ${navMarkup()}
    <main>
      <section class="hero">
        <p class="eyebrow">Simple format. Consistent cadence.</p>
        <h1>Two series. Daily publishing.</h1>
        <p class="intro">${site.description}</p>
      </section>

      <section class="spotlight">
        <p class="spotlight-label">Lead Story</p>
        <h2><a href="#/post/${featured.slug}">${featured.title}</a></h2>
        <p>${featured.excerpt}</p>
      </section>

      <section class="grid">
        <article class="panel">
          <div class="panel-head">
            <h3>${series.oldies.label}</h3>
            <p>${series.oldies.description}</p>
          </div>
          <div class="feed-grid">${oldiesPosts.map(postCard).join('')}</div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <h3>${series.scouting.label}</h3>
            <p>${series.scouting.description}</p>
          </div>
          <div class="feed-grid">${scoutingPosts.map(postCard).join('')}</div>
        </article>
      </section>
    </main>
  `
}

function renderSeries(seriesId) {
  const bucket = series[seriesId]
  if (!bucket) {
    renderHome()
    return
  }
  const filtered = sortedPosts.filter((post) => post.series === seriesId)
  app.innerHTML = `
    <div class="grain"></div>
    ${navMarkup()}
    <main>
      <section class="hero compact">
        <p class="eyebrow">Series</p>
        <h1>${bucket.label}</h1>
        <p class="intro">${bucket.description}</p>
      </section>
      <section class="panel">
        <div class="feed-grid">${filtered.map(postCard).join('')}</div>
      </section>
    </main>
  `
}

function renderPost(slug) {
  const post = sortedPosts.find((entry) => entry.slug === slug)
  if (!post) {
    renderHome()
    return
  }
  const bucket = series[post.series]
  app.innerHTML = `
    <div class="grain"></div>
    ${navMarkup()}
    <main>
      <article class="post-page panel">
        <p class="feed-meta">${bucket.label} · ${formatDate(post.publishedAt)}</p>
        <h1>${post.title}</h1>
        <p class="post-artist">${post.artist}</p>
        <div class="post-body">
          ${post.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </div>
        ${post.score ? `<p class="review-score">Scout Score: ${post.score}</p>` : ''}
      </article>
    </main>
  `
}

function router() {
  const route = window.location.hash.replace(/^#\/?/, '')
  if (!route) return renderHome()
  if (route.startsWith('series/')) return renderSeries(route.replace('series/', ''))
  if (route.startsWith('post/')) return renderPost(route.replace('post/', ''))
  return renderHome()
}

window.addEventListener('hashchange', router)
router()
