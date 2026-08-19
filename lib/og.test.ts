import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ogHeadline } from "./og.ts";

describe("ogHeadline", () => {
  it("keeps short titles", () => {
    assert.equal(ogHeadline("Why redirect is not Next.js"), "Why redirect is not Next.js");
  });

  it("truncates long titles with an ellipsis", () => {
    const long = "A".repeat(90);
    const out = ogHeadline(long, 80);
    assert.equal(out.length, 80);
    assert.equal(out.endsWith("…"), true);
  });

  it("falls back when empty", () => {
    assert.equal(ogHeadline("   "), "Harbor Press");
  });
});
