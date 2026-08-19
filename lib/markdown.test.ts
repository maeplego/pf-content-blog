import assert from "node:assert/strict";
import test from "node:test";
import { isSafeHref, renderMarkdown } from "./markdown.ts";

test("raw HTML in markdown is escaped", () => {
  const html = renderMarkdown("Hello <script>alert(1)</script>");
  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("&lt;script&gt;"), true);
});

test("javascript: markdown links are not rendered as href", () => {
  const html = renderMarkdown("[x](javascript:alert(1))");
  assert.equal(/href\s*=/i.test(html), false);
  assert.equal(html.includes("javascript:"), false);
  assert.equal(html.includes("x"), true);
});

test("mixed-case and whitespace javascript: links are rejected", () => {
  const html = renderMarkdown("[x](java\nscript:alert(1))");
  assert.equal(/href\s*=/i.test(html), false);
  const mixed = renderMarkdown("[x](JaVaScRiPt:alert(1))");
  assert.equal(/href\s*=/i.test(mixed), false);
});

test("data: and vbscript: links are not href", () => {
  assert.equal(/href\s*=/i.test(renderMarkdown("[x](data:text/html,hi)")), false);
  assert.equal(/href\s*=/i.test(renderMarkdown("[x](vbscript:msgbox(1))")), false);
});

test("http(s) and mailto and hash links remain", () => {
  const http = renderMarkdown("[docs](https://example.test/a)");
  assert.equal(http.includes('href="https://example.test/a"'), true);
  const mail = renderMarkdown("[mail](mailto:a@example.test)");
  assert.equal(mail.includes('href="mailto:a@example.test"'), true);
  const hash = renderMarkdown("[top](#intro)");
  assert.equal(hash.includes('href="#intro"'), true);
});

test("relative image paths stay, javascript images do not", () => {
  const ok = renderMarkdown("![](/harbor.svg)");
  assert.equal(ok.includes('src="/harbor.svg"'), true);
  const bad = renderMarkdown("![](javascript:alert(1))");
  assert.equal(bad.includes("javascript:"), false);
  assert.equal(/src\s*=/i.test(bad), false);
});

test("isSafeHref allowlist", () => {
  assert.equal(isSafeHref("https://example.test", "link"), true);
  assert.equal(isSafeHref("/harbor.svg", "image"), true);
  assert.equal(isSafeHref("javascript:alert(1)", "link"), false);
  assert.equal(isSafeHref("//evil.example", "link"), false);
});
