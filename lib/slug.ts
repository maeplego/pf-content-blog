export function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function assertSlug(slug: string): string {
  const s = normalizeSlug(slug);
  if (s.length < 3) {
    throw new Error("slug must be at least 3 characters");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) {
    throw new Error("slug must be lowercase kebab-case");
  }
  const reserved = new Set(["admin", "api", "demo", "rss", "sitemap", "robots", "health", "ready"]);
  if (reserved.has(s)) {
    throw new Error("slug is reserved");
  }
  return s;
}
