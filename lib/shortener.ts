export type ShortLink = {
  id: string;
  code: string;
  url: string;
  shortUrl: string;
  clicks: number;
};

export function shortenerConfigured(): boolean {
  return Boolean(process.env.SHORTENER_API_URL?.trim());
}

export async function createShortLink(dest: string, sub: string): Promise<ShortLink> {
  const base = process.env.SHORTENER_API_URL?.trim();
  if (!base) {
    throw Object.assign(new Error("shortener is not configured"), { status: 503 });
  }
  const res = await fetch(`${base.replace(/\/$/, "")}/v1/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Dev-User-Sub": sub,
    },
    body: JSON.stringify({ url: dest }),
  });
  const body = (await res.json().catch(() => ({}))) as ShortLink & { error?: { message?: string } };
  if (!res.ok) {
    throw Object.assign(new Error(body.error?.message ?? `shortener ${res.status}`), { status: res.status });
  }
  return body;
}

export function publicPostUrl(slug: string): string {
  const pub = (process.env.CONTENT_PUBLIC_URL ?? "http://localhost:3007").replace(/\/$/, "");
  return `${pub}/posts/${slug}`;
}
