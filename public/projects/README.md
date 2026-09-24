# Project media

Drop screenshots and clips here, then point at them from `content/site.ts`:

```ts
image: "/projects/ledger.png",
video: "/projects/ledger.mp4",   // optional
```

- **Stills**: PNG or JPG, roughly 16:10, ~1600px wide is plenty.
- **Clips**: MP4 (H.264) — a phone `.mov` should be converted first:
  `ffmpeg -i clip.mov -vcodec h264 -acodec aac -movflags +faststart clip.mp4`
- Keep clips short and under a few MB; they load on hover.
- Setting both gives the clip a poster frame, so nothing flashes blank.

A portrait photo goes in `public/` instead, wired up via `site.portrait`.
