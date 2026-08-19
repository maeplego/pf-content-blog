import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { seedIfEmpty } from "./seed.ts";

describe("seedIfEmpty", () => {
  it("publishes the 15-product design note", async () => {
    const posts = [];
    const store = {
      async ping() {},
      async listAll() {
        return posts;
      },
      async listPublic() {
        return [];
      },
      async bySlug(slug) {
        return posts.find((p) => p.slug === slug) ?? null;
      },
      async byId() {
        return null;
      },
      async create(input, now, id) {
        const post = {
          id,
          slug: input.slug,
          title: input.title,
          bodyMd: input.bodyMd,
          status: input.status,
          tags: input.tags,
          coverUrl: input.coverUrl,
          author: input.author,
          createdAt: now,
          updatedAt: now,
          publishedAt: input.status === "published" ? now : null,
        };
        posts.push(post);
        return post;
      },
      async update() {
        throw new Error("unused");
      },
    };
    await seedIfEmpty(store);
    const post = await store.bySlug("why-fifteen-products");
    assert.ok(post);
    assert.equal(post.status, "published");
    assert.match(post.bodyMd, /REVIEW\.md/);
    assert.match(post.bodyMd, /terraform apply/);
  });
});
