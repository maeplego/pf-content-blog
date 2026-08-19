import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { currentSub, devAuthEnabled } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!devAuthEnabled()) {
    return NextResponse.json({ error: { code: "unauthorized", message: "dev auth disabled" } }, { status: 401 });
  }
  const sub = await currentSub();
  if (!sub) {
    return NextResponse.json({ error: { code: "unauthorized", message: "login first" } }, { status: 401 });
  }
  const dm = await draftMode();
  dm.enable();
  return NextResponse.json({ ok: true, draft: true });
}

export async function DELETE() {
  const dm = await draftMode();
  dm.disable();
  return NextResponse.json({ ok: true, draft: false });
}

export async function GET() {
  const dm = await draftMode();
  const sub = await currentSub();
  return NextResponse.json({ draft: dm.isEnabled, editor: Boolean(sub) });
}
