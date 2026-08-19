import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

function linkParts(
  tokenOrHref: { href?: string; title?: string | null; text?: string } | string,
  title?: string | null,
  text?: string,
): { href?: string; title?: string | null; text: string } {
  if (typeof tokenOrHref === "string") {
    return { href: tokenOrHref, title, text: text ?? "" };
  }
  return { href: tokenOrHref.href, title: tokenOrHref.title, text: tokenOrHref.text ?? "" };
}

marked.use({
  renderer: {
    link(tokenOrHref: never, title?: string | null, text?: string) {
      const { href, title: t, text: label } = linkParts(tokenOrHref, title, text);
      if (!isSafeHref(href, "link")) {
        return label;
      }
      const titleAttr = t ? ` title="${escapeAttr(t)}"` : "";
      return `<a href="${escapeAttr(href ?? "")}" rel="noopener noreferrer"${titleAttr}>${label}</a>`;
    },
    image(tokenOrHref: never, title?: string | null, text?: string) {
      const { href, title: t, text: label } = linkParts(tokenOrHref, title, text);
      if (!isSafeHref(href, "image")) {
        return escapeAttr(label);
      }
      const titleAttr = t ? ` title="${escapeAttr(t)}"` : "";
      return `<img src="${escapeAttr(href ?? "")}" alt="${escapeAttr(label)}"${titleAttr}>`;
    },
  },
});

/** Wiki プレビューと同じ。javascript: / data: などを <a href> にしない。 */
export function isSafeHref(href: string | null | undefined, kind: "link" | "image"): boolean {
  if (!href) {
    return false;
  }
  const compact = href.trim().replace(/[\u0000-\u0020]+/g, "");
  if (!compact) {
    return false;
  }
  if (compact.startsWith("/") && !compact.startsWith("//") && !compact.includes(":")) {
    return true;
  }
  if (kind === "link") {
    if (compact.startsWith("#")) {
      return true;
    }
    if (/^mailto:/i.test(compact)) {
      return true;
    }
  }
  return /^https?:/i.test(compact);
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;");
}

export function renderMarkdown(source: string): string {
  const escaped = source.replace(/</g, "&lt;");
  return marked.parse(escaped) as string;
}
