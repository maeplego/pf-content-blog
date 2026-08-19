import { notFound } from "next/navigation";
import { currentSub } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const sub = await currentSub();
  if (!sub) notFound();
  const { slug } = await params;
  const post = await (await getStore()).bySlug(slug);
  if (!post) notFound();
  const html = renderMarkdown(post.bodyMd);
  return (
    <main>
      <p className="muted">下書きプレビュー（公開 URL には出ません） · {post.status}</p>
      <article className="prose">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  );
}
