import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canReadPost, isPublic, type Post } from "./visibility.ts";

const now = new Date("2026-08-19T06:00:00Z");

function post(over: Partial<Post>): Post {
  return {
    id: "01",
    slug: "demo",
    title: "Demo",
    bodyMd: "x",
    status: "draft",
    tags: [],
    coverUrl: "",
    author: "Harbor",
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    ...over,
  };
}

describe("isPublic", () => {
  it("rejects drafts", () => {
    assert.equal(isPublic(post({ status: "draft" }), now), false);
  });

  it("accepts published with past publishedAt", () => {
    assert.equal(
      isPublic(post({ status: "published", publishedAt: new Date("2026-08-01T00:00:00Z") }), now),
      true,
    );
  });
});

describe("canReadPost", () => {
  it("lets an editor in Draft Mode read a draft", () => {
    assert.equal(canReadPost(post({ status: "draft" }), now, { draftMode: true, editor: true }), true);
  });

  it("does not leak drafts via Draft Mode cookie alone", () => {
    assert.equal(canReadPost(post({ status: "draft" }), now, { draftMode: true, editor: false }), false);
  });

  it("does not leak drafts to an editor without Draft Mode", () => {
    assert.equal(canReadPost(post({ status: "draft" }), now, { draftMode: false, editor: true }), false);
  });
});
