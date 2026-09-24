import type { NextConfig } from "next";

/* GitHub Pages serves this repo from esthermanu.github.io/portfolio, so every
   asset needs that prefix. Set GITHUB_PAGES=true in CI; local dev stays at "/"
   so `npm run dev` keeps working normally. */
const basePath = process.env.GITHUB_PAGES === "true" ? "/portfolio" : "";

const nextConfig: NextConfig = {
  /* Pages is a static host: no Node server, so pre-render every route to HTML. */
  output: "export",
  basePath,
  /* next/image's optimizer needs a running server, which a static host has not. */
  images: { unoptimized: true },
  /* Exposed so client components can prefix raw <img>/<video> srcs, which
     Next does NOT rewrite the way it rewrites next/image and next/link. */
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
