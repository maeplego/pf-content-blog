import { cookies } from "next/headers";

export const DEV_COOKIE = "content_dev_sub";

export function devAuthEnabled(): boolean {
  const v = process.env.CONTENT_DEV_AUTH ?? "";
  return v === "true" || v === "1";
}

export async function currentSub(): Promise<string | null> {
  if (!devAuthEnabled()) return null;
  const jar = await cookies();
  const fromCookie = jar.get(DEV_COOKIE)?.value?.trim();
  if (fromCookie) return fromCookie;
  return null;
}

export function subFromRequest(req: Request): string | null {
  if (!devAuthEnabled()) return null;
  const header = req.headers.get("x-dev-user-sub")?.trim();
  if (header) return header;
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|; )${DEV_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]).trim() : null;
}

export function requireSub(sub: string | null): string {
  if (!sub) {
    const err = new Error("unauthorized");
    (err as Error & { status: number }).status = 401;
    throw err;
  }
  return sub;
}
