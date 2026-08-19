import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { currentSub } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";
import { ogHeadline } from "@/lib/og";
import { canReadPost, isPublic } from "@/lib/visibility";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await (await getStore()).bySlug(slug);
  if (!post || !isPublic(post, new Date())) {
    return { title: "Harbor Press" };
  }
  return {
    title: ogHeadline(post.title),
    description: post.bodyMd.slice(0, 160),
    openGraph: { title: ogHeadline(post.title), type: "article" },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await (await getStore()).bySlug(slug);
  const dm = await draftMode();
  const editor = Boolean(await currentSub());
  const now = new Date();
  if (!post || !canReadPost(post, now, { draftMode: dm.isEnabled, editor })) {
    notFound();
  }
  const html = renderMarkdown(post.bodyMd);
  const preview = !isPublic(post, now);
  return (
    <main>
      {preview ? (
        <p className="draft-banner">Draft Mode · この記事はまだ公開されていません。匿名読者には 404 です。</p>
      ) : null}
      {post.coverUrl ? (
        <p>
          <img src={post.coverUrl} alt="" width={120} height={64} />
        </p>
      ) : null}
      <article className="prose">
        <h1>{post.title}</h1>
        <p className="muted">
          {post.author} · {(post.publishedAt ?? post.createdAt).toISOString().slice(0, 10)}
        </p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  );
}
