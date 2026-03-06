import './style.css'
import { posts, site } from './data/posts.js'

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

function postImage(post) {
  return post.coverImageUrl || post.artistImageUrl || '/hero.jpg'
}

function topbarMarkup() {
  return `
    <header class="topbar">
      <a href="#/" class="brand-link">
        <p class="brand">${site.name}</p>
        <p class="strap">${site.strap}</p>
      </a>
    </header>
  `
}

function feedCard(post) {
  return `
    <article class="post-card">
      <a class="post-card-image-link" href="#/post/${post.slug}">
        <img class="post-card-image" src="${postImage(post)}" alt="${post.artist} artwork" />
      </a>
      <div class="post-card-body">
        <p class="meta">${formatDate(post.publishedAt)} · ${post.artist}</p>
        <h2><a href="#/post/${post.slug}">${post.title}</a></h2>
        <p class="summary">${post.summary}</p>
        <a class="inline-link" href="#/post/${post.slug}">Read full review</a>
      </div>
    </article>
  `
}

function renderHome() {
  app.innerHTML = `
    ${topbarMarkup()}
    <main class="home">
      <section class="home-hero">
        <h1>New Song Reviews</h1>
        <p>${site.description}</p>
      </section>
      <section class="feed">
        ${sortedPosts.map(feedCard).join('')}
      </section>
    </main>
  `
}

function socialLinksMarkup(post) {
  if (!post.socials?.length) return ''
  return `
    <section class="socials">
      <h3>Artist Socials</h3>
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
  const post = sortedPosts.find((entry) => entry.slug === slug)
  if (!post) return renderHome()

  app.innerHTML = `
    ${topbarMarkup()}
    <main class="post-page">
      <article class="post-shell">
        <p><a class="inline-link" href="#/">Back to all posts</a></p>
        <img class="post-hero-image" src="${postImage(post)}" alt="${post.artist} image" />
        <p class="meta">${formatDate(post.publishedAt)} · ${post.artist}</p>
        <h1>${post.title}</h1>
        <p class="summary">${post.summary}</p>

        <section class="spotify-actions">
          <a href="${post.spotifyArtistUrl}" target="_blank" rel="noreferrer">Open Artist on Spotify</a>
        </section>

        ${
          post.spotifyEmbedUrl
            ? `
        <section class="spotify-wrap">
          <p class="spotify-label">Play This Track</p>
          <iframe
            src="${post.spotifyEmbedUrl}"
            title="Spotify player for ${post.songTitle}"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </section>
        `
            : ''
        }

        <section class="review-text">
          ${post.review.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </section>

        <section class="ar-notes">
          <h3>A&R Notes</h3>
          <ul>
            ${post.arNotes.map((note) => `<li>${note}</li>`).join('')}
          </ul>
        </section>

        ${socialLinksMarkup(post)}
      </article>
    </main>
  `
}

function router() {
  const route = window.location.hash.replace(/^#\/?/, '')
  if (!route) return renderHome()
  if (route.startsWith('post/')) return renderPost(route.replace('post/', ''))
  return renderHome()
}

window.addEventListener('hashchange', router)
router()
