// Returns a public asset path prefixed with the deployment basePath
// (`/kwell` on GitHub Pages, empty in local dev). Needed because
// next/image with `unoptimized: true` does NOT apply basePath to the
// emitted <img src>, so referencing `/brand/foo.jpg` directly would
// 404 on Pages. Use for every absolute `/...` asset URL we hand to
// next/image or set as a CSS background.
//
// Reads NEXT_PUBLIC_BASE_PATH — must be NEXT_PUBLIC_* so it gets inlined
// into client bundles too.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  if (!BASE) return path;
  return `${BASE}${path}`;
}
