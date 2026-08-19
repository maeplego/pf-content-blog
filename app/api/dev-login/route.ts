import { NextResponse } from "next/server";
import { DEV_COOKIE, devAuthEnabled } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!devAuthEnabled()) {
    return NextResponse.json({ error: { code: "unauthorized", message: "dev auth disabled" } }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, sub: "editor" });
  res.cookies.set(DEV_COOKIE, "editor", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEV_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
