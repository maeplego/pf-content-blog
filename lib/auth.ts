import { cookies } from "next/headers";

import { readCookie, cookieKey } from "@/lib/oidc/cookies";
import { internalBase, oidcEnabled } from "@/lib/oidc/env";

export const DEV_COOKIE = "content_dev_sub";

export function devAuthEnabled(): boolean {
  const v = process.env.CONTENT_DEV_AUTH ?? "";
  return v === "true" || v === "1";
}

async function subFromAccessToken(access: string): Promise<string | null> {
  const res = await fetch(`${internalBase()}/userinfo`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });
  if (!res.ok) {
    return null;
  }
  const ui = (await res.json()) as { sub?: string };
  return ui.sub?.trim() || null;
}

function accessFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const key = cookieKey("rp_access");
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = cookieHeader.match(new RegExp(`(?:^|; )${escaped}=([^;]+)`));
  return match ? decodeURIComponent(match[1]).trim() : null;
}

export async function currentSub(): Promise<string | null> {
  if (oidcEnabled()) {
    const access = await readCookie("rp_access");
    if (!access) {
      return null;
    }
    return await subFromAccessToken(access);
  }
  if (!devAuthEnabled()) return null;
  const jar = await cookies();
  const fromCookie = jar.get(DEV_COOKIE)?.value?.trim();
  if (fromCookie) return fromCookie;
  return null;
}

export async function subFromRequest(req: Request): Promise<string | null> {
  if (oidcEnabled()) {
    const access = accessFromRequest(req);
    if (!access) {
      return null;
    }
    return await subFromAccessToken(access);
  }
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
