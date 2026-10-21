# hagaki-content

[hagaki](https://github.com/Nlkomaru/hagaki) のサンプル content リポジトリ。
`content/` の記事を Cloudflare Workers (Worker 名 `hagaki-content`) の Static Assets で配信します。

配信 URL: `https://hagaki-content.<subdomain>.workers.dev` (subdomain は未確定)

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

- フォーマットの正は hagaki の [`sample/README.md`](https://github.com/Nlkomaru/hagaki/blob/main/sample/README.md)。
- 生成物は `cf dev` / `cf build` の前に `wrangler.config.ts` の build.command (`hagaki generate`) が作り、git にはコミットしません。単体で作るときは `pnpm run generate`。
  `info.json` の履歴は git log から作るので、浅い clone では欠けます。
- worker を通るのは `/article/*` だけで、それ以外は Assets から直接返します。
- hagaki は `github:Nlkomaru/hagaki#dist` (公開済みビルド) に依存しています。

## ローカル開発

Node.js 26.12 以上 (cf の対応範囲) と pnpm 12 が必要です。

```sh
pnpm install
pnpm exec cf dev    # hagaki generate を実行してから起動
pnpm run typecheck
```

## deploy

- **GitHub Actions**: PR と main への push で build と dry-run を実行し、main への push のときだけ本番に deploy します (`.github/workflows/deploy.yml`)。
- **手動**: `.env` を埋めたうえで

  ```sh
  pnpm exec cf deploy --mode production   # build (hagaki generate を含む) → deploy
  ```

## 初回セットアップ

1. `.env.example` を `.env` にコピーし、`CLOUDFLARE_ACCOUNT_ID` と `CLOUDFLARE_API_TOKEN` (Workers Scripts:Edit 権限) を入れる。`cf` は `.env` から読みます。
2. GitHub secrets に登録する: `gh secret set -f .env`

## hagaki アプリ側との連携

hagaki を使うアプリの環境変数で次のように指定します。

```text
HAGAKI_GITHUB_OWNER=Nlkomaru
HAGAKI_GITHUB_REPO=hagaki-content
HAGAKI_CDN_BASE_URL=https://hagaki-content.<subdomain>.workers.dev
```

エディタからの保存はこのリポジトリへの commit として届き、main に入ると Actions が deploy します。
