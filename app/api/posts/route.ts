import { NextResponse } from "next/server";
import { requireSub, subFromRequest } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { errorStatus, postJSON } from "@/lib/http";
import { newId, validateInput } from "@/lib/memory";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const store = await getStore();
  const now = new Date();
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  if (all) {
    try {
      requireSub(subFromRequest(req));
    } catch (err) {
      const { status, message } = errorStatus(err);
      return NextResponse.json({ error: { code: "unauthorized", message } }, { status });
    }
    const posts = await store.listAll();
    return NextResponse.json({ posts: posts.map(postJSON) });
  }
  const posts = await store.listPublic(now);
  return NextResponse.json({
    posts: posts.map((p) => {
      const j = postJSON(p);
      const { bodyMd: _body, ...rest } = j;
      return rest;
    }),
  });
}

export async function POST(req: Request) {
  try {
    requireSub(subFromRequest(req));
    const store = await getStore();
    const body = (await req.json()) as Record<string, unknown>;
    const input = validateInput(body, "draft");
    const post = await store.create(input, new Date(), newId());
    return NextResponse.json(postJSON(post), { status: 201 });
  } catch (err) {
    const { status, message } = errorStatus(err);
    const code = status === 401 ? "unauthorized" : status === 409 ? "conflict" : "invalid";
    return NextResponse.json({ error: { code, message } }, { status });
  }
}
