export default function DemoPage() {
  return (
    <main>
      <h1>スライス 1 のデモ</h1>
      <ol>
        <li>
          公開記事{" "}
          <a href="/posts/why-redirect-is-not-nextjs">/posts/why-redirect-is-not-nextjs</a>{" "}
          が読める。
        </li>
        <li>
          下書きの公開 URL{" "}
          <a href="/posts/notes-on-scheduled-posts">/posts/notes-on-scheduled-posts</a>{" "}
          は 404。
        </li>
        <li>
          <a href="/admin">/admin</a> で Dev login → 下書きをプレビュー → Publish。
        </li>
        <li>公開後に「Create short URL」。返った shortUrl を開くと 302 で記事へ戻る。</li>
      </ol>
      <p className="muted">記事は架空の Harbor Press です。実在の氏名・連絡先は使いません。</p>
    </main>
  );
}
