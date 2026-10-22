# インフラ・deploy の安全性

## deploy の流れ
- deploy は通常 GitHub Actions (`.github/workflows/deploy.yml`) が行います。
  - PR と main への push で `pnpm install --frozen-lockfile` → `pnpm run typecheck` → `pnpm exec cf build --mode production` → `pnpm exec cf deploy --prebuilt --mode production --dry-run` を実行します。
  - main への push のときだけ `pnpm exec cf deploy --prebuilt --mode production` で本番に deploy します。
- 手動 deploy (`pnpm exec cf deploy --mode production`) や `pnpm run deploy` は、ユーザーに明示的に頼まれたとき以外は実行しないでください。
- 検証には認証情報の要らない `--dry-run` を使ってください。

## 認証情報
- `.env` (`.env.example` をコピー) に `CLOUDFLARE_ACCOUNT_ID` と `CLOUDFLARE_API_TOKEN` (Workers Scripts:Edit 権限) を入れます。`cf` は `.env` から読みます。
- GitHub secrets への登録は `gh secret set -f .env` です。
- `.env` の中身を表示・コミット・出力にそのまま含めないでください。

## Worker 設定
- Worker 設定とバインディングは `cloudflare.config.ts` にあります (`name: "hagaki-content"`, `workersDev: true`, `assets.runWorkerFirst: ["/article/*"]`, `ASSETS: bindings.assets()`)。
- ビルド設定 (`build.command`, `assetsDirectory: "./content"`) は `wrangler.config.ts` にあります。
- Worker 名、`runWorkerFirst`、`assetsDirectory` を変えると配信 URL や draft 記事の 404 処理に影響するので、変更する場合はユーザーに確認してください。
