import { notFound } from "next/navigation";
import { getStore } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";
import { isPublic } from "@/lib/visibility";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await (await getStore()).bySlug(slug);
  if (!post || !isPublic(post, new Date())) notFound();
  const html = renderMarkdown(post.bodyMd);
  return (
    <main>
      {post.coverUrl ? (
        <p>
          <img src={post.coverUrl} alt="" width={120} height={64} />
        </p>
      ) : null}
      <article className="prose">
        <p className="muted">
          {post.author} · {(post.publishedAt ?? post.createdAt).toISOString().slice(0, 10)}
        </p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  );
}
