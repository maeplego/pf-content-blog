import { NextResponse } from "next/server";
import { requireSub, subFromRequest } from "@/lib/auth";
import { errorStatus } from "@/lib/http";
import { getLinkStats, listShortLinks } from "@/lib/shortener";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const sub = requireSub(await subFromRequest(req));
    const url = new URL(req.url);
    const id = url.searchParams.get("id")?.trim();
    if (id) {
      const stats = await getLinkStats(id, sub);
      return NextResponse.json(stats);
    }
    const links = await listShortLinks(sub);
    return NextResponse.json({ links });
  } catch (err) {
    const { status, message } = errorStatus(err);
    return NextResponse.json(
      { error: { code: status === 401 ? "unauthorized" : "shortener", message } },
      { status },
    );
  }
}
