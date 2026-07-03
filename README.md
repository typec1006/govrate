# 知事レート

47都道府県の知事を1〜5点で評価・投票できるWebサービス。Googleログインで認証し、各知事への評価をリアルタイムでランキング表示する。

## 技術スタック

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4**
- **Supabase** (DB / 認証 / Realtime)
- **Vercel** (デプロイ)

## セットアップ

### 環境変数

`.env.local` を作成し、以下を設定する。

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

### 開発サーバー起動

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

## コマンド

```bash
npm run dev       # 開発サーバー起動（Turbopack）
npm run build     # 本番ビルド
npm run start     # 本番サーバー起動
npm run lint      # ESLint実行
npx next typegen  # PageProps/LayoutProps/RouteContext型ヘルパーの生成
```

## ドキュメント

- 開発方針・規約: [`CLAUDE.md`](./CLAUDE.md)
- 実装フェーズごとの詳細: [`docs/`](./docs)

## デプロイ

[Vercel](https://vercel.com/new) にリポジトリを接続し、上記の環境変数を設定してデプロイする。
