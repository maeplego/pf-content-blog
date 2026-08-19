"use client";

import { useCallback, useEffect, useState } from "react";

type Daily = { date: string; count: number };
type LinkRow = { id: string; code: string; shortUrl: string; url: string; clicks: number };

function DailyBars({ daily }: { daily: Daily[] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  if (daily.length === 0) {
    return <p className="muted">まだ日次クリックはありません。短縮 URL を開くと非同期で増えます。</p>;
  }
  return (
    <div className="bars" role="img" aria-label="daily click counts">
      {daily.map((d) => (
        <div className="bar-col" key={d.date}>
          <div className="bar" style={{ height: `${Math.round((d.count / max) * 120)}px` }} title={`${d.date}: ${d.count}`} />
          <span className="bar-label">
            {d.date.slice(5)}
            <br />
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ShortenerGraph() {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [selected, setSelected] = useState("");
  const [daily, setDaily] = useState<Daily[]>([]);
  const [msg, setMsg] = useState("");

  const loadLinks = useCallback(async () => {
    const res = await fetch("/api/short-links");
    if (!res.ok) {
      setMsg(res.status === 503 ? "短縮 API 未設定（Compose の SHORTENER_API_URL）" : `links ${res.status}`);
      return;
    }
    const body = (await res.json()) as { links: LinkRow[] };
    setLinks(body.links ?? []);
    setMsg("");
  }, []);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  async function loadStats(id: string) {
    setSelected(id);
    const res = await fetch(`/api/short-links?id=${encodeURIComponent(id)}`);
    if (!res.ok) {
      setMsg(`stats ${res.status}`);
      return;
    }
    const body = (await res.json()) as { daily: Daily[] };
    setDaily(body.daily ?? []);
  }

  return (
    <section className="card">
      <h2>短縮の日次クリック</h2>
      <p className="muted">
        計測はリダイレクト後に非同期です。数秒遅れて増えてよい、というのがこのデモの契約です。
      </p>
      <button type="button" className="secondary" onClick={() => void loadLinks()}>
        リンク再読込
      </button>
      {links.length === 0 ? <p className="muted">この編集者の短縮はまだありません。</p> : null}
      <ul className="link-list">
        {links.map((l) => (
          <li key={l.id}>
            <button type="button" className="secondary" onClick={() => void loadStats(l.id)}>
              グラフ
            </button>{" "}
            <a href={l.shortUrl} target="_blank" rel="noreferrer">
              {l.shortUrl}
            </a>
            <span className="muted"> · clicks {l.clicks}</span>
          </li>
        ))}
      </ul>
      {selected ? <DailyBars daily={daily} /> : null}
      {msg ? <pre className="muted">{msg}</pre> : null}
    </section>
  );
}
