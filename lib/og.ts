/** Share-card headline. Truncate so generated OG images stay readable. */
export function ogHeadline(title: string, max = 80): string {
  const t = title.trim().replace(/\s+/g, " ");
  if (!t) return "Harbor Press";
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}
