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
        <div className="site-shell">
          <header className="site-header">
            <div className="site-brand">
              <strong>
                <a href="/" className="card-link">
                  Harbor Press
                </a>
              </strong>
              <span className="muted">学習用ブログ CMS</span>
            </div>
            <nav className="site-nav">
              <a href="/">記事</a>
              <a href="/demo">デモ</a>
              <a href="/admin">管理</a>
              <a href="/rss.xml">RSS</a>
            </nav>
          </header>
          <main className="site-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
