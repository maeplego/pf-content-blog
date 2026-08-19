export default function DemoPage() {
  return (
    <main>
      <h1>公開品質スライスのデモ</h1>
      <ol>
        <li>
          公開記事{" "}
          <a href="/posts/why-redirect-is-not-nextjs">/posts/why-redirect-is-not-nextjs</a>{" "}
          が読める。OG は <code>/posts/{"{slug}"}/opengraph-image</code>。
        </li>
        <li>
          未ログインで下書き{" "}
          <a href="/posts/notes-on-scheduled-posts">/posts/notes-on-scheduled-posts</a>{" "}
          は 404。
        </li>
        <li>
          <a href="/admin">/admin</a> で Dev login（Draft Mode も ON）→ 同じ公開 URL で下書きが見える。Disable すると再び 404。
        </li>
        <li>公開後に「Create short URL」。返った shortUrl を開き、管理画面の日次グラフで count が増える（非同期・数秒遅れ可）。</li>
      </ol>
      <p className="muted">記事は架空の Harbor Press です。実在の氏名・連絡先は使いません。</p>
    </main>
  );
}
