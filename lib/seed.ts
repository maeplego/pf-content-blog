import { ulid } from "ulid";
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

const fifteenBody = `# Why this portfolio is 15 products, not 30 toys

This is a **fictional** Harbor Press article. It is not a real company blog post and names no real people.

Thirty idea files were merged when they shared an actor, a consistency boundary, and a stronger interview story. Login and file attach were **not** enough to merge: those go through the identity and media platforms instead of being copied.

What this portfolio **does not** do, on purpose:

- AWS \`terraform apply\` (modules exist; a live bill is not the demo)
- Putting the Expo habit app on Kubernetes
- Starting every product at once on a 12 GB Docker Desktop cluster
- Claiming labor-law completeness for attendance, or real card numbers for commerce

Recruiters should start at Compose packs (\`portfolio-plan/REVIEW.md\`), not overlay switching. Kubernetes overlays are an optional depth demo for infrastructure interviews.

The three-point live set is identity (P01), one UI product (workspace or commerce), and one depth pick (observability, developer platform, incidents, or recommend).
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
      ulid(),
    );
  }
  if (!existing.find((p) => p.slug === "why-fifteen-products")) {
    await store.create(
      {
        title: "Why this portfolio is 15 products, not 30 toys",
        slug: "why-fifteen-products",
        bodyMd: fifteenBody,
        tags: ["portfolio", "design"],
        coverUrl: "/harbor.svg",
        author: "Demo Author",
        status: "published",
      },
      now,
      ulid(),
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
      ulid(),
    );
  }
}
