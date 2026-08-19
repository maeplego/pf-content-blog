import assert from "node:assert/strict";
import test from "node:test";
import { assertSlug, normalizeSlug } from "./slug.ts";

test("normalizeSlug kebab-cases titles", () => {
  assert.equal(normalizeSlug(" Why Redirect Is Not Next.js "), "why-redirect-is-not-next-js");
});

test("assertSlug rejects reserved and short values", () => {
  assert.throws(() => assertSlug("admin"));
  assert.throws(() => assertSlug("ab"));
  assert.equal(assertSlug("why-redirect-is-not-nextjs"), "why-redirect-is-not-nextjs");
});
