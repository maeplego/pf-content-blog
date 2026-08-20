import { NextResponse } from "next/server";

import { currentSub } from "@/lib/auth";
import { readCookie } from "@/lib/oidc/cookies";
import { oidcEnabled } from "@/lib/oidc/env";
import { coverUrlFromFileView, mediaApiBase, mediaApiConfigured } from "@/lib/media";

async function mediaHeaders(): Promise<Record<string, string> | null> {
  if (oidcEnabled()) {
    const access = await readCookie("rp_access");
    if (access) {
      return { Authorization: `Bearer ${access}` };
    }
    return null;
  }
  const sub = await currentSub();
  if (!sub) {
    return null;
  }
  return { "X-Dev-User-Sub": sub };
}

export async function POST(req: Request) {
  if (!(await currentSub())) {
    return NextResponse.json({ error: { message: "unauthorized" } }, { status: 401 });
  }
  if (!mediaApiConfigured()) {
    return NextResponse.json({ error: { message: "MEDIA_API_URL not configured" } }, { status: 503 });
  }
  const auth = await mediaHeaders();
  if (!auth) {
    return NextResponse.json({ error: { message: "unauthorized" } }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: { message: "file required" } }, { status: 400 });
  }
  const contentType = file.type || "image/png";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: { message: "images only" } }, { status: 400 });
  }

  const base = mediaApiBase();
  const presignRes = await fetch(`${base}/v1/uploads/presign`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      contentType,
      size: file.size,
      purpose: "blog-cover",
    }),
    cache: "no-store",
  });
  if (!presignRes.ok) {
    const text = await presignRes.text();
    return NextResponse.json({ error: { message: text || "presign failed" } }, { status: 502 });
  }
  const presign = (await presignRes.json()) as { uploadUrl?: string; fileId?: string };
  if (!presign.uploadUrl || !presign.fileId) {
    return NextResponse.json({ error: { message: "invalid presign response" } }, { status: 502 });
  }

  const putRes = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!putRes.ok) {
    return NextResponse.json({ error: { message: `upload failed (${putRes.status})` } }, { status: 502 });
  }

  const completeRes = await fetch(`${base}/v1/uploads/complete`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ fileId: presign.fileId, etag: putRes.headers.get("etag") || "" }),
    cache: "no-store",
  });
  if (!completeRes.ok) {
    const text = await completeRes.text();
    return NextResponse.json({ error: { message: text || "complete failed" } }, { status: 502 });
  }
  const view = await completeRes.json();
  const coverUrl = coverUrlFromFileView(view);
  if (!coverUrl) {
    return NextResponse.json({ error: { message: "no public url" } }, { status: 502 });
  }
  return NextResponse.json({ coverUrl, fileId: presign.fileId });
}

export async function GET() {
  return NextResponse.json({ enabled: mediaApiConfigured() });
}
