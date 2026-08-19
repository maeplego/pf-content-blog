# pf-content-blog

学習用の技術ブログです。公開記事はログインなしで読めます。管理は開発用ログインだけです。シード記事は架空の Harbor Press で、実在の個人情報は含みません。**本番 CMS の置き換えではありません。**

短縮 URL のリダイレクトは [pf-content-shortener](https://github.com/maeplego/pf-content-shortener) が担当します。ブログから 302 は出しません。両方まとめて動かすときは [pf-content-infra](https://github.com/maeplego/pf-content-infra) を使ってください。

## 起動（ブログだけ）

```powershell
npm ci
npm test
npm run dev
```

| URL | 用途 |
| --- | --- |
| http://localhost:3007 | 公開一覧 |
| http://localhost:3007/demo | 画面上の確認手順 |
| http://localhost:3007/admin | 下書きと公開 |
| http://localhost:3007/api/health | ヘルス |

下書きは未ログインの公開 URL では 404 です。開発ログイン後に Draft Mode を付けると、同じ URL でプレビューできます。OG 画像と、管理画面の短縮クリック日次グラフもあります。

Markdown + 小さな CSS です。記事の `javascript:` リンクは HTML の `href` にしません。予約投稿、全文検索、コメントはありません。

設計の詳細は [portfolio-plan](https://github.com/maeplego/portfolio-plan) の `portfolio-plan/content-platform/docs/` です。
