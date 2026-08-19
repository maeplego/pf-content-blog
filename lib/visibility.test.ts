import assert from "node:assert/strict";
import test from "node:test";
import { isPublic, publish, unpublish, type Post } from "./visibility.ts";

const now = new Date("2026-08-19T06:00:00Z");

function sample(over: Partial<Post> = {}): Post {
  return {
    id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
    slug: "demo-post",
    title: "Demo",
    bodyMd: "# hi",
    status: "draft",
    tags: ["demo"],
    coverUrl: "/harbor.svg",
    author: "Demo Author",
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    ...over,
  };
}

test("draft is not public even with a publishedAt", () => {
  const p = sample({ publishedAt: now });
  assert.equal(isPublic(p, now), false);
});

test("published without publishedAt is not public", () => {
  const p = sample({ status: "published", publishedAt: null });
  assert.equal(isPublic(p, now), false);
});

test("publish then public; unpublish hides again", () => {
  const published = publish(sample(), now);
  assert.equal(published.status, "published");
  assert.equal(isPublic(published, now), true);
  const hidden = unpublish(published, now);
  assert.equal(hidden.status, "draft");
  assert.equal(isPublic(hidden, now), false);
  assert.ok(hidden.publishedAt);
});

test("future publishedAt is not public yet", () => {
  const future = new Date("2026-08-20T00:00:00Z");
  const p = sample({ status: "published", publishedAt: future });
  assert.equal(isPublic(p, now), false);
  assert.equal(isPublic(p, future), true);
});
