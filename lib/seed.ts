import { newId } from "./memory";
import type { PostStore } from "./store";

const publishedBody = `# Why the redirect path is not Next.js

This is a **fictional** seed article for the Harbor Press demo blog. It contains no real personal data.

The public blog can be cached at the edge. A URL shortener's hot path is the opposite: every hit is a 302, every miss is abuse-shaped, and click counts must not sit on the response.

Harbor Press therefore keeps:

1. Markdown articles and draft/publish in the blog process.
2. \`GET /:code\` in a small Go service with Redis in front of Postgres.
3. Click increments after the redirect is written.

Sequential codes are forbidden. Demo destinations must be on an allowlist so an open redirect cannot turn this into a phishing helper.

Cover image is a local SVG (\`/harbor.svg\`). P03 media is optional for this slice.
`;

const draftBody = `# Notes on scheduled posts (draft)

This draft must **not** appear on the public index or at \`/posts/notes-on-scheduled-posts\`.

Editors can open the admin preview. Publishing flips \`status\` and sets \`published_at\`.

Scheduled posts (future \`published_at\`) are modeled but the worker that flips them is not in this slice.
`;

export async function seedIfEmpty(store: PostStore): Promise<void> {
  const existing = await store.listAll();
  const now = new Date("2026-08-18T00:00:00Z");
  if (!existing.find((p) => p.slug === "why-redirect-is-not-nextjs")) {
    await store.create(
      {
        title: "Why the redirect path is not Next.js",
        slug: "why-redirect-is-not-nextjs",
        bodyMd: publishedBody,
        tags: ["design", "shortener"],
        coverUrl: "/harbor.svg",
        author: "Demo Author",
        status: "published",
      },
      now,
      newId(),
    );
  }
  if (!existing.find((p) => p.slug === "notes-on-scheduled-posts")) {
    await store.create(
      {
        title: "Notes on scheduled posts",
        slug: "notes-on-scheduled-posts",
        bodyMd: draftBody,
        tags: ["cms"],
        coverUrl: "/harbor.svg",
        author: "Demo Author",
        status: "draft",
      },
      now,
      newId(),
    );
  }
}
