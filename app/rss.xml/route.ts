import { getStore } from "@/lib/db";
import { isPublic } from "@/lib/visibility";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  const posts = await store.listPublic(new Date());
  const pub = (process.env.CONTENT_PUBLIC_URL ?? "http://localhost:3007").replace(/\/$/, "");
  const items = posts
    .filter((p) => isPublic(p, new Date()))
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${pub}/posts/${p.slug}</link>
      <guid>${pub}/posts/${p.slug}</guid>
      <pubDate>${(p.publishedAt ?? p.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(p.title)} — fictional Harbor Press seed. No real PII.</description>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Harbor Press (demo)</title>
    <link>${pub}</link>
    <description>Fictional tech blog seed for P08. Not a production CMS.</description>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
