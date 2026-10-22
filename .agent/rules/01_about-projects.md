## このアプリケーションの概要
[hagaki](https://github.com/morinoparty/hagaki) のサンプル (テンプレート) となる content リポジトリです。
リポジトリ名は `hagaki-content` です。

## 目的
`content/` 配下の記事・カテゴリを、Cloudflare Workers (Worker 名 `hagaki-content`、workers.dev のみ) の Static Assets として配信します。

- 配信 URL: `https://hagaki-content.<subdomain>.workers.dev` (subdomain は未確定)
- hagaki のエディタからの保存は、このリポジトリへの commit として届きます (コミットメッセージは `Update post: <slug>` や `Update category: <slug>` など)。main に入ると GitHub Actions が deploy します。
- hagaki を使うアプリ側では、環境変数で次のように指定します。

```text
HAGAKI_GITHUB_OWNER=Nlkomaru
HAGAKI_GITHUB_REPO=hagaki-content
HAGAKI_CDN_BASE_URL=https://hagaki-content.<subdomain>.workers.dev
```

## content フォーマット
- フォーマットの正は hagaki の [`sample/README.md`](https://github.com/morinoparty/hagaki/blob/main/sample/README.md) です。
- パスは slug ではなく uuid ベースです (slug は変わりうるため)。
- 記事本体 `content/article/<uuid>/index.mdx` は frontmatter (`title`, `slug`, `uuid`, `category`, `description`, `image`) + MDX 本文です。
- 記事の画像は `content/article/<uuid>/assets/<imageId>.avif` に置き、本文からは `/article/<uuid>/assets/<imageId>.avif` で参照します。
- カテゴリ定義は `content/categories/<slug>.json` (`title`, `slug`, `body`) です。サンプルの `food.json` には `hasPosition` もあります。

## 生成物
- `content/article.json`, `content/slug-index.json`, `content/categories.json`, `content/article/<uuid>/info.json` は `hagaki generate` の生成物です。git にはコミットしません (`.gitignore` 済み)。
- `cf dev` / `cf build` の前に、`wrangler.config.ts` の `build.command` (`node_modules/.bin/hagaki generate`) が自動で生成します。単体で作るときは `pnpm run generate` を使います。
- `info.json` の履歴は git log から作るので、浅い clone では欠けます (Actions は `fetch-depth: 0` で checkout しています)。

## 配信の仕組み
- worker を通るのは `/article/*` だけ (`cloudflare.config.ts` の `assets.runWorkerFirst`) で、それ以外は Assets から直接返します。
- `src/index.ts` は `@morinoparty/hagaki/content-worker` の `createContentApp()` をそのまま export しており、draft 記事の `article/<uuid>/` 配下を 404 にします。

## 主な技術スタック
- TypeScript (`typescript` ^7、`tsc` で型チェックのみ。`noEmit`)
- `@morinoparty/hagaki` (content の生成と content worker。GitHub Packages から取得)
- Cloudflare Workers + Static Assets
- `cf` CLI (`cf` 1.0.0-beta.20。Worker 設定は `cloudflare.config.ts`) と wrangler (`wrangler.config.ts` のビルド設定)
- Node.js 26.12 以上 (cf の対応範囲)、pnpm 12 (`packageManager: pnpm@12.14.0`)

## 構成

```text
content/
├── article/<uuid>/
│   ├── index.mdx        # 記事本体 (frontmatter + MDX)
│   ├── info.json        # 生成物
│   └── assets/<id>.avif # 記事の画像
├── categories/<slug>.json
├── article.json         # 生成物
├── slug-index.json      # 生成物
└── categories.json      # 生成物
src/index.ts             # hagaki/content-worker の createContentApp() (draft 記事を 404 にする)
cloudflare.config.ts     # Worker 設定 (cf)
wrangler.config.ts       # ビルド設定 (build.command = hagaki generate, assets ディレクトリ)
```
