import { createContentApp } from "hagaki/content-worker";

// 静的コンテンツを配信しつつ、draft 記事の article/<uuid>/ 配下を 404 にする。
// worker を通るのは cloudflare.config.ts の runWorkerFirst ("/article/*") だけ。
export default createContentApp();
