import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Harbor Press (demo)",
  description: "Fictional P08 content-platform blog. Not a production CMS.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="site">
          <a href="/" style={{ textDecoration: "none" }}>
            <strong>Harbor Press</strong>
            <span className="muted" style={{ marginLeft: "0.6rem", fontSize: "0.9rem" }}>
              学習用ブログ CMS
            </span>
          </a>
          <nav>
            <a href="/">記事</a>
            {" · "}
            <a href="/demo">デモ</a>
            {" · "}
            <a href="/admin">管理</a>
            {" · "}
            <a href="/rss.xml">RSS</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
