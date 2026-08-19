import { getStore } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  const posts = await store.listPublic(new Date());
  const pub = (process.env.CONTENT_PUBLIC_URL ?? "http://localhost:3007").replace(/\/$/, "");
  const urls = [
    `  <url><loc>${pub}/</loc></url>`,
    ...posts.map((p) => `  <url><loc>${pub}/posts/${p.slug}</loc></url>`),
  ].join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
