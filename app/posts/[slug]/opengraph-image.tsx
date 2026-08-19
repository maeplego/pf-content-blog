import { ImageResponse } from "next/og";
import { getStore } from "@/lib/db";
import { ogHeadline } from "@/lib/og";
import { isPublic } from "@/lib/visibility";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Harbor Press";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await (await getStore()).bySlug(slug);
  const publicTitle = post && isPublic(post, new Date()) ? ogHeadline(post.title) : "Harbor Press";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f766e",
          color: "#fffdf8",
          padding: 72,
          fontSize: 48,
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85 }}>Harbor Press · demo</div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>{publicTitle}</div>
        <div style={{ fontSize: 24, opacity: 0.8 }}>Learning CMS. Not a production publisher.</div>
      </div>
    ),
    { ...size },
  );
}
