# 推奨される書き方

## content
- 記事やカテゴリを追加・変更するときは、既存のサンプル (`content/article/*/index.mdx`, `content/categories/*.json`) の形式に合わせてください。
- 記事を参照するパスは slug ではなく uuid を使ってください。slug は変わりうるためです。
- 記事の画像はその記事の `assets/` に置き、他の記事の画像を参照しないでください。
- 生成物 (`info.json`, `article.json`, `slug-index.json`, `categories.json`) を確認したいときは `pnpm run generate` で作り直してください。`info.json` の履歴は git log から作られます。

## Worker
- `src/index.ts` は `createContentApp()` を export するだけに留め、配信ロジックを追加する必要がある場合は hagaki 側 (`@morinoparty/hagaki/content-worker`) での対応を検討してください。
- worker を通すパスを増やす場合は `cloudflare.config.ts` の `assets.runWorkerFirst` を変更します。それ以外のパスは Assets から直接返ります。

## 依存関係
- `@morinoparty/hagaki` を更新した場合は、`pnpm-workspace.yaml` の `minimumReleaseAgeExclude` と `pnpm-lock.yaml` も合わせて更新し、`pnpm run typecheck` と `pnpm run build` で確認してください。
