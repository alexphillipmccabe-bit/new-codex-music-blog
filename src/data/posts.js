export const site = {
  name: 'Pulse Index',
  strap: 'Two-Series Music Journal',
  description:
    'Two recurring formats only: Oldies Spotlight for younger listeners, and New Music A&R scouting notes.',
}

export const series = {
  oldies: {
    id: 'oldies',
    label: 'Oldies Spotlight',
    description:
      'Classic songs and artists explained in modern terms for the younger generation.',
  },
  scouting: {
    id: 'scouting',
    label: 'New Music A&R Scout',
    description:
      'Short scouting notes on new releases and emerging artists with breakout potential.',
  },
}

export const posts = [
  {
    slug: 'fleetwood-mac-dreams-oldies-spotlight',
    title: 'Why "Dreams" Still Sounds Fresh In 2026',
    series: 'oldies',
    artist: 'Fleetwood Mac',
    publishedAt: '2026-02-26',
    tags: ['oldies', 'soft-rock', 'classic'],
    score: null,
    excerpt:
      'A minimal groove, unmistakable vocal tone, and one of the most reusable hooks in pop history.',
    body: [
      'Dreams feels modern because it leaves space. The drum pulse and bassline do less, but every part lands.',
      'Stevie Nicks delivers the melody with restraint, which makes the chorus more durable over time.',
      'For new listeners, this is a masterclass in writing songs that feel effortless but stay memorable.',
    ],
    featured: true,
  },
  {
    slug: 'outkast-ms-jackson-oldies-spotlight',
    title: 'How "Ms. Jackson" Bridges Rap And Pop',
    series: 'oldies',
    artist: 'OutKast',
    publishedAt: '2026-02-25',
    tags: ['oldies', 'hip-hop', 'classic'],
    score: null,
    excerpt:
      'Sharp storytelling, melodic chorus writing, and production that still translates to today.',
    body: [
      'Ms. Jackson works because the concept is specific but universal: apology, ego, and consequence.',
      'Andre 3000 and Big Boi balance wit and vulnerability while keeping every section catchy.',
      'It is a perfect introduction for younger fans exploring early-2000s hip-hop craft.',
    ],
    featured: false,
  },
  {
    slug: 'luna-vale-silverline-scout-note',
    title: 'Scout Note: Luna Vale - "Silverline"',
    series: 'scouting',
    artist: 'Luna Vale',
    publishedAt: '2026-02-24',
    tags: ['scouting', 'alt-pop', 'a&r-watch'],
    score: '8.7',
    excerpt:
      'Fast hook entry and a vocal profile that stands out inside playlist-heavy alt-pop.',
    body: [
      'Silverline finds its hook quickly and never lets energy dip across the core sections.',
      'The topline and vocal texture are distinct enough to separate the track from trend-chasing peers.',
      'A strong candidate for playlist growth and short-form video traction.',
    ],
    featured: false,
  },
  {
    slug: 'sora-vale-three-single-run-scout-note',
    title: 'Scout Note: Sora Vale Is On A Smart Three-Single Run',
    series: 'scouting',
    artist: 'Sora Vale',
    publishedAt: '2026-02-23',
    tags: ['scouting', 'r&b', 'emerging'],
    score: '8.4',
    excerpt:
      'Release pace and consistency suggest a clear strategy, not random uploads.',
    body: [
      'Three singles in close sequence have clarified Sora Vale’s sonic identity.',
      'Each record tightens the writing and improves vocal capture.',
      'This profile is worth monitoring over the next two release cycles.',
    ],
    featured: false,
  },
]
