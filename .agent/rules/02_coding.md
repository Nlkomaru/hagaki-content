# コーディングプラクティス

## 実装手順

1. **型設計**
   - まず型 (interface / type) を定義

2. **純粋関数から実装**
   - 外部依存のない関数を先に実装

## プラクティス

- 小さく始めて段階的に拡張
- 過度な抽象化を避ける
- コードよりも型を重視
- 複雑さに応じてアプローチを調整

## コードスタイル

- 常に既存コードの設計や記法を参考にしてください。
- このリポジトリのコードは設定ファイルと `src/index.ts` だけです。content の生成や配信のロジックは hagaki 側 (`@morinoparty/hagaki`) にあるので、ここで再実装せず、必要なら [hagaki](https://github.com/morinoparty/hagaki) 側の変更を検討してください。
- TypeScript は `strict` で書いてください (`tsconfig.json`)。
- 書籍「リーダブルコード」のようなベストプラクティスを常に適用してください。
- コードの意図・背景などのコメントを日本語で積極的に入れてください。
- コードを書いた後は、`pnpm run typecheck` と `pnpm run build` を実行して、型チェックとビルド (`hagaki generate` を含む) が通ることを確認してください。
- 作業後に勝手に開発サーバーの起動 (`pnpm run dev`) やデプロイ (`pnpm run deploy` / `cf deploy`) は行わないでください。

## パッケージ管理

- パッケージ管理には必ず pnpm を使ってください。npm / npx は使わず、`pnpm exec` / `pnpm dlx` を使ってください。
- `@morinoparty/hagaki` は GitHub Packages から取得します (`.npmrc` で `@morinoparty` スコープを `https://npm.pkg.github.com` に向けている)。ローカルでは `read:packages` を持つトークンが `~/.npmrc` に必要です。
- `pnpm-workspace.yaml` の `minimumReleaseAgeExclude` には、リリース直後でも入れる必要のある版 (cf, wrangler, hagaki など) を列挙しています。これらの版を上げるときは合わせて更新してください。

## ビルド・確認コマンド

- 依存関係のインストール: `pnpm install`
- 型チェック: `pnpm run typecheck` (`cf workers types && tsc`)
- ビルド: `pnpm run build` (`cf build --mode production`。`hagaki generate` を含む)
- 生成物だけを作る: `pnpm run generate`
- 開発サーバー: `pnpm run dev` (`cf dev`。`hagaki generate` を実行してから起動)
- 認証情報なしで deploy を検証: `pnpm exec cf deploy --prebuilt --mode production --dry-run`

`cf dev` / `cf build` / `cf deploy` は `cloudflare.config.ts` のあるリポジトリのルートで実行してください。
