export const site = {
  name: 'Pulse Index',
  strap: 'A&R Journal',
  description: 'Daily song and artist spotlights with short-form reviews.',
}

export const posts = [
  {
    slug: 'luna-vale-silverline',
    title: 'Luna Vale Finds A Crossover Hook On "Silverline"',
    type: 'spotlight',
    artist: 'Luna Vale',
    publishedAt: '2026-02-26',
    tags: ['alt-pop', 'a&r-watch', 'spotlight'],
    score: null,
    excerpt:
      'Fast chorus entry, bright topline, and a mix that can travel from indie to radio.',
    body: [
      'Silverline opens with restraint, then lands its main hook before most tracks even find their groove.',
      'The vocal stack carries enough texture to stand out in playlists full of similar production palettes.',
      'For A&R, this feels like an artist with a repeatable lane and strong single instincts.',
    ],
    featured: true,
  },
  {
    slug: 'aria-north-lost-tapes-vol-2-review',
    title: 'Review: Aria North - LOST TAPES VOL. 2',
    type: 'review',
    artist: 'Aria North',
    publishedAt: '2026-02-25',
    tags: ['electro-pop', 'album-review', 'new-release'],
    score: '8.9',
    excerpt:
      'Dense synth architecture with clean melodic writing and an excellent closing run.',
    body: [
      'LOST TAPES VOL. 2 sounds engineered for repeat listening without sacrificing personality.',
      'The standout cuts lean into restraint: fewer layers, sharper contrast, and cleaner vocal framing.',
      'A strong project with enough variation to avoid fatigue across a full playthrough.',
    ],
    featured: false,
  },
  {
    slug: 'sora-vale-breakout-run',
    title: 'Sora Vale Is Building A Smart Three-Single Run',
    type: 'spotlight',
    artist: 'Sora Vale',
    publishedAt: '2026-02-24',
    tags: ['r&b', 'a&r-watch', 'emerging'],
    score: null,
    excerpt:
      'Three releases in six weeks, each with a clearer identity and stronger recall.',
    body: [
      'Sora Vale is pacing releases like a campaign: concise songs, visual consistency, and steady profile growth.',
      'The latest single has the best vocal capture and most immediate chorus in the run so far.',
      'Momentum is real; this is the profile to watch over the next quarter.',
    ],
    featured: false,
  },
  {
    slug: 'riot-cinema-no-sleep-city-review',
    title: 'Track Review: Riot Cinema - "No Sleep City"',
    type: 'review',
    artist: 'Riot Cinema',
    publishedAt: '2026-02-23',
    tags: ['neo-punk', 'single-review', 'late-night'],
    score: '8.1',
    excerpt:
      'Tight runtime, aggressive pacing, and an outro built for live set transitions.',
    body: [
      'No Sleep City keeps pressure high by avoiding unnecessary bridges and instrumental detours.',
      'The mix is intentionally rough in places, which supports the urgency of the performance.',
      'A concise single that does exactly what this band needs right now.',
    ],
    featured: false,
  },
]

export function getAllTags() {
  return [...new Set(posts.flatMap((post) => post.tags))].sort()
}
