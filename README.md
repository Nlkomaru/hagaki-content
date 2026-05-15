# hagaki-content

[hagaki](https://github.com/Nlkomaru/hagaki) の content リポジトリ。
Markdown 記事を `content/` に置き、Cloudflare Workers Assets で配信します。

main への push で GitHub Actions が自動デプロイします
(→ `https://content-hagaki.<your-subdomain>.workers.dev`)。

## ディレクトリ

```
content/
├── article/                  # 記事ごとのディレクトリ (uuid 名)
│   └── <uuid>/
│       ├── index.md          #   記事本体 (frontmatter 必須: slug, uuid)
│       └── assets/<file>     #   その記事専用の画像
├── categories/               # カテゴリ JSON
├── article.json              # ← scripts/generate-lists.ts が生成 (git管理外)
└── categories.json           # ← 同上
```

旧 `wiki/` + `img/` レイアウトからの移行は `pnpm migrate`
(`scripts/migrate-to-article.ts`) で行えます。画像欠損があれば
書き込み前に中断し、再実行しても重複しません (冪等)。

## 配信 URL

| パス | 内容 |
|---|---|
| `/article.json` | 記事一覧 (`hagaki.posts.list()` が読む。slug→uuid 解決にも使う) |
| `/article/<uuid>/index.md` | 個別記事 (`hagaki.posts.getBySlug()` / `getByUuid()` が読む) |
| `/article/<uuid>/assets/<filename>` | その記事の画像本体 |
| `/categories.json` | カテゴリ一覧 |

## ローカル開発

```sh
pnpm install
pnpm generate       # article.json などを再生成
pnpm dev            # http://localhost:8787
```

## 手動デプロイ

```sh
pnpm install
pnpm deploy
```

## 初回セットアップ (CI 自動デプロイ用)

GitHub Actions で自動デプロイするために以下の secret を設定:

1. **Cloudflare API token** を発行
   - <https://dash.cloudflare.com/profile/api-tokens> →
     **Create Token** → **Edit Cloudflare Workers** テンプレート
   - Account / Zone は使うアカウントを選ぶ
2. **Cloudflare Account ID** を確認
   - Cloudflare dashboard 右下、または `wrangler whoami` で表示
3. このリポジトリの GitHub Settings → **Secrets and variables → Actions** に追加:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. main に push すれば自動デプロイされる

## hagaki アプリ側との連携

[`hagaki/template/tanstack-workers`](https://github.com/Nlkomaru/hagaki/tree/main/template/tanstack-workers)
の `.env` (または wrangler secrets) で:

```
HAGAKI_GITHUB_OWNER=Nlkomaru
HAGAKI_GITHUB_REPO=hagaki-content
HAGAKI_GITHUB_TOKEN=ghp_xxx
HAGAKI_CDN_BASE_URL=https://content-hagaki.<your-subdomain>.workers.dev
```

エディタ画面からの保存はこのリポジトリへの **commit** として届きます。
commit が main にマージされると Actions が走り、worker に反映されます。

## このリポジトリの初期化元

[`hagaki/template/content-worker`](https://github.com/Nlkomaru/hagaki/tree/main/template/content-worker)
のスキャフォルドからコピーされました。
