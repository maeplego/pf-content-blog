import assert from "node:assert/strict";
import test from "node:test";
import { renderMarkdown } from "./markdown.ts";

test("raw HTML in markdown is escaped", () => {
  const html = renderMarkdown("Hello <script>alert(1)</script>");
  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("&lt;script&gt;"), true);
});
