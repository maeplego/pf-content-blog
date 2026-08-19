import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

export function renderMarkdown(source: string): string {
  const escaped = source.replace(/</g, "&lt;");
  return marked.parse(escaped) as string;
}
