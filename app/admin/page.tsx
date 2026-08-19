"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  slug: string;
  title: string;
  bodyMd: string;
  status: "draft" | "published";
  tags: string[];
  coverUrl: string;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    bodyMd: "",
    tags: "",
    coverUrl: "/harbor.svg",
    status: "draft" as "draft" | "published",
  });

  async function refresh() {
    const res = await fetch("/api/posts?all=1");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    const body = await res.json();
    setPosts(body.posts ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login() {
    await fetch("/api/dev-login", { method: "POST" });
    await refresh();
  }

  async function logout() {
    await fetch("/api/dev-login", { method: "DELETE" });
    setAuthed(false);
    setPosts([]);
  }

  function load(p: Post) {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      bodyMd: p.bodyMd,
      tags: p.tags.join(", "),
      coverUrl: p.coverUrl,
      status: p.status,
    });
    setMsg("");
  }

  async function save(status: "draft" | "published") {
    setMsg("saving...");
    const payload = {
      title: form.title,
      slug: form.slug,
      bodyMd: form.bodyMd,
      tags: form.tags,
      coverUrl: form.coverUrl,
      status,
    };
    const res = await fetch(form.id ? `/api/posts/${form.id}` : "/api/posts", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    if (!res.ok) {
      setMsg(`${res.status} ${body.error?.message ?? ""}`);
      return;
    }
    setForm((f) => ({ ...f, id: body.id, slug: body.slug, status: body.status }));
    setMsg(`${res.status} ${body.status} ${body.slug}`);
    await refresh();
  }

  async function shorten() {
    if (!form.id) {
      setMsg("save first");
      return;
    }
    const res = await fetch(`/api/posts/${form.id}/shorten`, { method: "POST" });
    const body = await res.json();
    if (!res.ok) {
      setMsg(`${res.status} ${body.error?.message ?? ""}`);
      return;
    }
    setMsg(`short ${body.link.shortUrl}`);
  }

  if (!authed) {
    return (
      <main>
        <h1>管理</h1>
        <p className="muted">P01 は未配線。CONTENT_DEV_AUTH=true のときだけ開発ログインできます。</p>
        <button type="button" onClick={login}>
          Dev login as editor
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>管理</h1>
      <p className="muted">
        検索エンジン向けに <code>/admin</code> は robots で拒否します。コメント欄はありません。
      </p>
      <button type="button" className="secondary" onClick={logout}>
        Logout
      </button>
      <div className="grid2">
        <section>
          <h2>記事</h2>
          {posts.map((p) => (
            <div className="card" key={p.id}>
              <button type="button" className="secondary" onClick={() => load(p)}>
                編集
              </button>
              <strong> {p.title}</strong>
              <div className="muted">
                <span className="status">{p.status}</span> {p.slug}
              </div>
              {p.status === "draft" ? (
                <a href={`/admin/preview/${p.slug}`}>プレビュー</a>
              ) : (
                <a href={`/posts/${p.slug}`}>公開ページ</a>
              )}
            </div>
          ))}
        </section>
        <section>
          <h2>{form.id ? "編集" : "新規"}</h2>
          <label>title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label>slug</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <label>tags</label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <label>coverUrl（ローカルパスまたは URL。P03 任意）</label>
          <input value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
          <label>Markdown</label>
          <textarea value={form.bodyMd} onChange={(e) => setForm({ ...form, bodyMd: e.target.value })} />
          <button type="button" onClick={() => save("draft")}>
            Save draft
          </button>
          <button type="button" onClick={() => save("published")}>
            Publish
          </button>
          <button type="button" className="secondary" onClick={shorten}>
            Create short URL
          </button>
          <pre className="muted">{msg}</pre>
        </section>
      </div>
    </main>
  );
}
