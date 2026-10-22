## ディレクトリ配置規則

- content/article/<uuid>/index.mdx に記事本体 (frontmatter + MDX) を配置します。ディレクトリ名は frontmatter の `uuid` と一致させます。
- content/article/<uuid>/assets/ にその記事が持つ画像 (`<imageId>.avif`) を配置します。
- content/categories/ にカテゴリ定義 (`<slug>.json`) を配置します。
- content/article.json, content/slug-index.json, content/categories.json, content/article/<uuid>/info.json は生成物なので、手で作成・編集しないでください。
- src/ に Worker のエントリーポイント (`src/index.ts`) を配置します。
- .github/workflows/ に GitHub Actions のワークフロー (`deploy.yml`) を配置します。
- リポジトリ直下に設定ファイル (`cloudflare.config.ts`, `wrangler.config.ts`, `tsconfig.json`, `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.node-version`) を配置します。
- .cloudflare/ と .wrangler/ は cf / wrangler が作るディレクトリ (`.gitignore` 済み) なので編集しないでください。
