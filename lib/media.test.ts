import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { coverUrlFromFileView } from "./media.ts";

describe("coverUrlFromFileView", () => {
  it("prefers detail then thumb then orig", () => {
    assert.equal(
      coverUrlFromFileView({
        variants: {
          orig: { url: "https://example.invalid/o" },
          thumb: { url: "https://example.invalid/t" },
          detail: { url: "https://example.invalid/d" },
        },
      }),
      "https://example.invalid/d",
    );
    assert.equal(
      coverUrlFromFileView({ variants: { orig: { url: "https://example.invalid/o" } } }),
      "https://example.invalid/o",
    );
    assert.equal(coverUrlFromFileView({ variants: {} }), null);
  });
});
