import './style.css'
import { posts, series, site } from './data/posts.js'

const app = document.querySelector('#app')
let mascotTimer = null

const sortedPosts = [...posts].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
)

function attachScrollReveal() {
  const elements = document.querySelectorAll('.reveal')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.16 },
  )
  elements.forEach((element) => observer.observe(element))
}

function attachMascotBehavior() {
  const mascot = document.querySelector('.mascot-wrap')
  if (!mascot) return
  if (mascotTimer) clearInterval(mascotTimer)

  const moods = ['mood-idle', 'mood-listening', 'mood-hype']
  let index = 0
  mascot.classList.add(moods[index])

  mascotTimer = setInterval(() => {
    mascot.classList.remove(...moods)
    index = (index + 1) % moods.length
    mascot.classList.add(moods[index])
  }, 3200)
}

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
      <div class="topbar-right">
        <nav class="topnav">
          <a href="#/">Home</a>
          <a href="#/series/oldies">Oldies Spotlight</a>
          <a href="#/series/scouting">A&R Scout</a>
        </nav>
        <div class="mascot-wrap" aria-hidden="true">
          <svg class="mascot" viewBox="0 0 120 120">
            <circle class="mascot-shadow" cx="60" cy="106" r="20" />
            <g class="mascot-bob">
              <path class="mascot-ant" d="M67 24 C72 15, 82 14, 86 22" />
              <circle class="mascot-ant-tip" cx="87" cy="22" r="3.8" />
              <rect class="mascot-body" x="34" y="30" rx="22" ry="22" width="52" height="58" />
              <ellipse class="mascot-face" cx="60" cy="56" rx="18" ry="15" />
              <rect class="mascot-eye mascot-eye-l" x="50" y="51" width="5.5" height="8" rx="3" />
              <rect class="mascot-eye mascot-eye-r" x="64.5" y="51" width="5.5" height="8" rx="3" />
              <path class="mascot-smile" d="M53 65 C57 69, 63 69, 67 65" />
              <rect class="mascot-band" x="43" y="76" width="34" height="6.5" rx="3.25" />
              <rect class="mascot-bar bar-1" x="48" y="81" width="3" height="8" rx="1.5" />
              <rect class="mascot-bar bar-2" x="55" y="81" width="3" height="8" rx="1.5" />
              <rect class="mascot-bar bar-3" x="62" y="81" width="3" height="8" rx="1.5" />
              <rect class="mascot-bar bar-4" x="69" y="81" width="3" height="8" rx="1.5" />
            </g>
          </svg>
          <span class="mascot-name">VOLT</span>
        </div>
      </div>
    </header>
  `
}

function postCard(post) {
  const bucket = series[post.series]
  return `
    <article class="feed-card reveal">
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
      <section class="hero reveal is-visible">
        <div class="hero-orb hero-orb-a"></div>
        <div class="hero-orb hero-orb-b"></div>
        <p class="eyebrow">Oldies decoded. New heat spotted first.</p>
        <h1>Vault & Velocity is your daily music radar.</h1>
        <p class="intro">${site.description}</p>
      </section>

      <section class="visual-wall reveal">
        <article class="visual visual-a">
          <p>Live Pulse</p>
          <h3>Crowd energy, front row chaos, midnight sets.</h3>
        </article>
        <article class="visual visual-b">
          <p>Artist Focus</p>
          <h3>Faces and voices shaping the next era.</h3>
        </article>
        <article class="visual visual-c">
          <p>Studio to Stage</p>
          <h3>From raw demos to breakout moments.</h3>
        </article>
      </section>

      <section class="spotlight reveal">
        <p class="spotlight-label">Lead Story</p>
        <h2><a href="#/post/${featured.slug}">${featured.title}</a></h2>
        <p>${featured.excerpt}</p>
      </section>

      <section class="pulse-strip reveal">
        <p>Oldies spotlight</p>
        <p>New music scout</p>
        <p>Play it now</p>
      </section>

      <section class="grid reveal">
        <article class="panel reveal">
          <div class="panel-head">
            <h3>${series.oldies.label}</h3>
            <p>${series.oldies.description}</p>
          </div>
          <div class="feed-grid">${oldiesPosts.map(postCard).join('')}</div>
        </article>
        <article class="panel reveal">
          <div class="panel-head">
            <h3>${series.scouting.label}</h3>
            <p>${series.scouting.description}</p>
          </div>
          <div class="feed-grid">${scoutingPosts.map(postCard).join('')}</div>
        </article>
      </section>
    </main>
  `
  attachScrollReveal()
  attachMascotBehavior()
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
      <section class="hero compact reveal is-visible">
        <div class="hero-orb hero-orb-a"></div>
        <p class="eyebrow">Series</p>
        <h1>${bucket.label}</h1>
        <p class="intro">${bucket.description}</p>
      </section>
      <section class="panel reveal">
        <div class="feed-grid">${filtered.map(postCard).join('')}</div>
      </section>
    </main>
  `
  attachScrollReveal()
  attachMascotBehavior()
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
      <article class="post-page panel reveal is-visible">
        <p class="feed-meta">${bucket.label} · ${formatDate(post.publishedAt)}</p>
        <h1>${post.title}</h1>
        <p class="post-artist">${post.artist}</p>
        ${
          post.spotifyEmbedUrl
            ? `
        <section class="spotify-wrap">
          <p class="spotify-label">Listen on Spotify</p>
          <iframe
            src="${post.spotifyEmbedUrl}"
            title="Spotify player for ${post.title}"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </section>
        `
            : ''
        }
        <div class="post-body">
          ${post.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </div>
        ${post.score ? `<p class="review-score">Scout Score: ${post.score}</p>` : ''}
      </article>
    </main>
  `
  attachScrollReveal()
  attachMascotBehavior()
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
