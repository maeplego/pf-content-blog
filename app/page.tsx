import { getStore } from "@/lib/db";

export default async function HomePage() {
  const posts = await (await getStore()).listPublic(new Date());
  return (
    <main>
      <h1>公開記事</h1>
      <p className="muted">
        架空の Harbor Press シードです。実在の個人情報は含みません。下書きは一覧に出ません。カバー画像はローカル SVG（P03 任意）。
      </p>
      {posts.length === 0 ? <p>公開記事はまだありません。</p> : null}
      {posts.map((p) => (
        <article className="card" key={p.id}>
          <a href={`/posts/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <h2 style={{ margin: "0 0 0.35rem" }}>{p.title}</h2>
            <div className="muted">
              {p.author} · {(p.publishedAt ?? p.createdAt).toISOString().slice(0, 10)} · {p.tags.join(", ")}
            </div>
          </a>
        </article>
      ))}
    </main>
  );
}
