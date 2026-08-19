# P08 content-blog Kubernetes manifests

公開ブログ（Next.js）。管理は `CONTENT_DEV_AUTH`（P01 OIDC は未配線）。単体 apply ではなく `pf-cloud-k8s` overlay `e-content` から参照する。

Ingress（`pf-cloud-k8s`）:

| ホスト | Service | 用途 |
| --- | --- | --- |
| `blog.localhost` | web:3007 | 公開記事 / 管理 |

Postgres は platform の DB 名 `content`。短縮 API は cluster 内 `http://shortener.p08.svc.cluster.local:8094`。

```powershell
cd ..\..\pf-cloud-k8s
.\scripts\cluster-smoke-e-content.ps1
```

Compose 単体デモは `pf-content-infra/deploy/compose.yaml`。
