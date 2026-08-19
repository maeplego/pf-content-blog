export type ShortLink = {
  id: string;
  code: string;
  url: string;
  shortUrl: string;
  clicks: number;
};

export type DailyStat = { date: string; count: number };

export type LinkStats = {
  link: ShortLink;
  daily: DailyStat[];
};

function shortenerBase(): string {
  const base = process.env.SHORTENER_API_URL?.trim();
  if (!base) {
    throw Object.assign(new Error("shortener is not configured"), { status: 503 });
  }
  return base.replace(/\/$/, "");
}

export function shortenerConfigured(): boolean {
  return Boolean(process.env.SHORTENER_API_URL?.trim());
}

export async function listShortLinks(sub: string): Promise<ShortLink[]> {
  const res = await fetch(`${shortenerBase()}/v1/links`, {
    headers: { "X-Dev-User-Sub": sub },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { links?: ShortLink[]; error?: { message?: string } };
  if (!res.ok) {
    throw Object.assign(new Error(body.error?.message ?? `shortener ${res.status}`), { status: res.status });
  }
  return body.links ?? [];
}

export async function getLinkStats(id: string, sub: string): Promise<LinkStats> {
  const res = await fetch(`${shortenerBase()}/v1/links/${encodeURIComponent(id)}/stats`, {
    headers: { "X-Dev-User-Sub": sub },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as LinkStats & { error?: { message?: string } };
  if (!res.ok) {
    throw Object.assign(new Error(body.error?.message ?? `shortener ${res.status}`), { status: res.status });
  }
  return { link: body.link, daily: body.daily ?? [] };
}

export async function createShortLink(dest: string, sub: string): Promise<ShortLink> {
  const res = await fetch(`${shortenerBase()}/v1/links`, {
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
