# pf-content-blog

P08 技術ブログ CMS（アイデア 07）です。**学習用であり、本番 CMS / メディア企業基盤の置き換えではありません。** シード記事は架空の Harbor Press で、実在の個人情報は含みません。

公開側は匿名で読めます。管理は `CONTENT_DEV_AUTH` の開発ログインだけ（P01 OIDC は未配線）。画像は `/public` のローカルファイル、または任意 URL（P03 未接続）。

短縮リンクのホットパスは兄弟 `pf-content-shortener` にあります。ブログから 302 は出しません。

## 構成

| パス | 役割 |
| --- | --- |
| `app/` | Next.js App Router。公開記事、管理、RSS / sitemap |
| `lib/` | slug、公開判定、Markdown、Postgres / メモリ |
| `public/harbor.svg` | 架空カバー（P03 代替） |

公開記事のシードは `why-redirect-is-not-nextjs` と `why-fifteen-products`（15 にまとめた理由とやらなかったこと）。下書きは未ログインの `GET /posts/:slug` で 404。Dev login 後に Draft Mode を有効にすると、同じ公開 URL でプレビューできる（cookie だけでは足りず編集者必須）。OG 画像は `app/posts/[slug]/opengraph-image.tsx`。管理画面に短縮の日次バーグラフがあります。

## 単体起動

ブログ + 短縮の一括デモは `pf-content-infra` を使ってください。ブログだけならメモリでも `npm run dev` できます。

```powershell
npm ci
npm test
npm run dev
```

| URL | 用途 |
| --- | --- |
| http://localhost:3007 | 公開一覧 |
| http://localhost:3007/demo | 受け入れ手順 |
| http://localhost:3007/admin | 下書き / 公開 |
| http://localhost:3007/api/health | liveness |

## 既知の制限

- Tailwind / MDX は未着手（Markdown + 小さな CSS）。Draft Mode と OG 画像はこのスライスで実装済み
- 予約投稿ワーカー、全文検索、いいね、コメントなし
- overlay E / K8s は `pf-cloud-k8s` overlay `e-content`（P11 なし）。単体デモは Compose が正。

設計: `project/portfolio-plan/content-platform/DESIGN.md`
