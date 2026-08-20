import { NextResponse } from "next/server";
import { requireSub, subFromRequest } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { errorStatus, postJSON } from "@/lib/http";
import { createShortLink, publicPostUrl } from "@/lib/shortener";
import { isPublic } from "@/lib/visibility";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const sub = requireSub(await subFromRequest(req));
    const store = await getStore();
    const post = await store.byId(id);
    if (!post) {
      return NextResponse.json({ error: { code: "not_found", message: "not found" } }, { status: 404 });
    }
    if (!isPublic(post, new Date())) {
      return NextResponse.json(
        { error: { code: "invalid", message: "publish the article before creating a public short URL" } },
        { status: 400 },
      );
    }
    const link = await createShortLink(publicPostUrl(post.slug), sub);
    return NextResponse.json({ post: postJSON(post), link }, { status: 201 });
  } catch (err) {
    const { status, message } = errorStatus(err);
    return NextResponse.json({ error: { code: status === 401 ? "unauthorized" : "shortener", message } }, { status });
  }
}
