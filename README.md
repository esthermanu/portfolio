# Esther Manu — Portfolio

An animated single-page portfolio built with Next.js 16, Tailwind CSS v4 and
Motion. Dark, editorial and typography-led: a warm gold accent on near-black,
with scroll-driven reveals throughout.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

## Making it yours

**Everything you need to edit lives in one file: [`content/site.ts`](content/site.ts).**
Every placeholder in it is marked with a ✏️ comment. Change the data there and
the whole site follows — you should not need to touch any component.

| What you want to change | Where |
| --- | --- |
| Name, role, location, tagline | `site` at the top of `content/site.ts` |
| Availability pill | `site.availability` — set `open: false` to mute it |
| About paragraphs and the four quick facts | `site.about`, `site.facts` |
| Email, social links | `site.email`, `site.socials` |
| Projects | the `projects` array |
| Skills columns and the scrolling row | `skillGroups`, `marqueeSkills` |
| Jobs / timeline | the `experience` array |
| Nav links & scroll-spy order | `sections` |

### Adding a photo

Drop the file in `public/` (e.g. `public/esther.jpg`), then set
`portrait: "/esther.jpg"` in `content/site.ts`. Until then, the About section
shows a gold monogram panel instead. A 4:5 portrait crop fits best.

### Adding project screenshots and clips

Put media in `public/projects/`, then point at it from that project:

```ts
image: "/projects/ledger.png",
video: "/projects/ledger.mp4",   // optional
```

A clip takes priority over a still, and the still becomes its poster frame so
nothing flashes blank while it loads. On desktop the clip plays muted in the
card that follows your cursor; on mobile (and for reduced-motion visitors) it
gets normal controls and waits to be tapped. Use MP4/H.264 — convert a phone
`.mov` first:

```bash
ffmpeg -i clip.mov -vcodec h264 -acodec aac -movflags +faststart clip.mp4
```

With both `image` and `video` left `null`, the project shows a gradient plate
built from its `accent` colours, so the site never looks unfinished.

### Résumé

Put a PDF at `public/esther-manu-cv.pdf`, or set `site.resume` to `null` to hide
both résumé buttons.

### Before launch

Set `site.url` to the real domain — it drives the SEO and social-share tags.

## Colours and type

The palette is defined once as tokens in the `@theme` block of
[`app/globals.css`](app/globals.css). Change a token there and every component
picks it up. The display face is Instrument Serif, the body face Geist, both
loaded via `next/font` in `app/layout.tsx`.

Two accents share the page:

- **Gold** (`--color-gold`) is structural — the primary button, links, the
  timeline, most section numbers.
- **Pink** (`--color-rose`) is expressive — the drifting fragments, the
  gold-into-pink headline gradients, text selection, project categories, and
  every other section number and timeline node.

Three gradient-text helpers are available on any element: `.gold-text`,
`.duo-text` (gold bleeding into pink — used on "Manu" and the contact headline)
and `.blush-text` (pink only). To dial the pink up or down globally, change
`--color-rose` and the stop opacities in
[`components/ui/fragments.tsx`](components/ui/fragments.tsx).

## How the animation is put together

- `components/intro-provider.tsx` — the opening curtain and counter. Plays once
  per browser session, then lifts. `useIntro()` tells the hero when to start.
- `components/ui/reveal.tsx` — the scroll-into-view fade/lift used everywhere.
- `components/ui/split-text.tsx` — masked per-word or per-letter type reveals.
- `components/ui/magnetic.tsx` — buttons that lean towards the pointer.
- `components/cursor.tsx` — the custom dot-and-ring pointer (mouse only).
- `components/projects.tsx` — the project preview card that follows the cursor.
- `components/experience.tsx` — the timeline spine that draws itself on scroll.
- `components/ui/media-lightbox.tsx` — the full-screen viewer behind each
  Watch/View button, for clips and stills alike. It portals to `document.body`:
  rendered in place it would sit inside the section's `z-10` stacking context,
  and the fixed nav would paint over it.
- `components/ui/network-mesh.tsx` — the drifting node-and-line field behind the
  whole page, on one fixed canvas. Canvas rather than SVG because every frame
  re-tests node pairs for proximity, which is thousands of segments a second.
  Two things keep it at 60fps: the node glow is a cached sprite (canvas
  `shadowBlur` is recomputed per draw call and is far slower), and the links use
  a spatial grid so each node only tests the 3×3 cells around it.

  It sits at `-z-10` — a positioned element at `z-0` paints *above* in-flow
  text, while a negative index puts it under the content but over the page
  background.

  **Avoid `blur-3xl` on large decorative elements.** A `filter: blur(64px)` on a
  46rem div cost roughly 24fps on its own here. Radial gradients fall off softly
  enough without it.

**Reduced motion is respected throughout.** If a visitor has
`prefers-reduced-motion: reduce` set, the curtain is skipped, the custom cursor
and parallax never mount, marquees freeze, and reveals become plain fades.

## Deploying

The whole page is statically prerendered, so any static host works. The simplest
route is [Vercel](https://vercel.com): push this folder to GitHub, import the
repo, and accept the defaults — no configuration or environment variables needed.
