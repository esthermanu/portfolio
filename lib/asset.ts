/**
 * Prefix a public-folder path with the deployment's base path.
 *
 * Next rewrites `next/image` and `next/link` for `basePath` automatically, but
 * a plain `<img src="/x.jpg">`, `<video src="/x.mp4">` or `<a href="/cv.pdf">`
 * is passed through untouched — on GitHub Pages those would resolve to
 * esthermanu.github.io/x.jpg instead of /portfolio/x.jpg and 404.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string;
export function asset(path: null | undefined): undefined;
export function asset(path: string | null | undefined): string | undefined;
export function asset(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  /* Leave absolute URLs and anything already prefixed alone. */
  if (/^[a-z]+:\/\//i.test(path) || !path.startsWith("/")) return path;
  if (BASE && path.startsWith(`${BASE}/`)) return path;
  return `${BASE}${path}`;
}
