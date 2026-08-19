import { NextResponse } from "next/server";
import { requireSub, subFromRequest } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { errorStatus, postJSON } from "@/lib/http";
import { validateInput } from "@/lib/memory";
import { isPublic } from "@/lib/visibility";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const store = await getStore();
  const post = await store.byId(id);
  if (!post) {
    return NextResponse.json({ error: { code: "not_found", message: "not found" } }, { status: 404 });
  }
  const sub = subFromRequest(req);
  if (!isPublic(post, new Date()) && !sub) {
    return NextResponse.json({ error: { code: "not_found", message: "not found" } }, { status: 404 });
  }
  return NextResponse.json(postJSON(post));
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    requireSub(subFromRequest(req));
    const store = await getStore();
    const body = (await req.json()) as Record<string, unknown>;
    const cur = await store.byId(id);
    if (!cur) {
      return NextResponse.json({ error: { code: "not_found", message: "not found" } }, { status: 404 });
    }
    const merged = {
      title: body.title ?? cur.title,
      slug: body.slug ?? cur.slug,
      bodyMd: body.bodyMd ?? cur.bodyMd,
      tags: body.tags ?? cur.tags,
      coverUrl: body.coverUrl ?? cur.coverUrl,
      author: body.author ?? cur.author,
      status: body.status ?? cur.status,
    };
    const input = validateInput(merged, cur.status);
    const post = await store.update(id, input, new Date());
    return NextResponse.json(postJSON(post));
  } catch (err) {
    const { status, message } = errorStatus(err);
    const code = status === 401 ? "unauthorized" : status === 409 ? "conflict" : "invalid";
    return NextResponse.json({ error: { code, message } }, { status });
  }
}
