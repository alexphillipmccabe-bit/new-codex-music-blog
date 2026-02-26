import './style.css'

document.querySelector('#app').innerHTML = `
  <header class="hero">
    <p class="eyebrow">Music Blog</p>
    <h1>Fresh Notes From The Listening Room</h1>
    <p class="intro">
      Reviews, favorite records, and short takes on new releases.
    </p>
  </header>

  <main class="posts">
    <article class="post">
      <h2>First Post</h2>
      <p>
        Replace this with your first review. Keep each post as a short, focused
        note on one track, album, or artist.
      </p>
    </article>
    <article class="post">
      <h2>What I'm Listening To</h2>
      <p>
        Add weekly picks here and link to your favorite songs, sets, or live sessions.
      </p>
    </article>
  </main>
`
