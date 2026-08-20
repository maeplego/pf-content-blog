import { getStore } from "@/lib/db";

export default async function HomePage() {
  const posts = await (await getStore()).listPublic(new Date());
  return (
    <>
      <section className="hero">
        <h1 className="page-title">公開記事</h1>
        <p className="page-lead">
          架空の Harbor Press シードです。実在の個人情報は含みません。下書きは一覧に出ません。カバー画像はローカル SVG（P03 任意）。
        </p>
      </section>
      {posts.length === 0 ? (
        <div className="card">
          <p className="muted">公開記事はまだありません。</p>
        </div>
      ) : (
        <div className="stack">
          {posts.map((p) => (
            <article className="card" key={p.id}>
              <a href={`/posts/${p.slug}`} className="card-link">
                <h2 style={{ margin: "0 0 0.35rem" }}>{p.title}</h2>
                <div className="muted">
                  {p.author} · {(p.publishedAt ?? p.createdAt).toISOString().slice(0, 10)} · {p.tags.join(", ")}
                </div>
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
