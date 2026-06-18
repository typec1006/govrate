# 01 環境構築

Supabaseクライアントの導入と、プロジェクト全体の基盤セットアップ。

## TODO

### パッケージ
- [ ] `@supabase/supabase-js` `@supabase/ssr` をインストール

### 環境変数
- [ ] `.env.local` を作成し、SupabaseのURL・Publishable Keyを設定
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
  ```

### Supabaseクライアント
- [ ] `lib/supabase/client.ts` 作成（ブラウザ用 `createBrowserClient`）
- [ ] `lib/supabase/server.ts` 作成（サーバー用 `createServerClient`、`import 'server-only'` 付き）

### Proxy
- [ ] `proxy.ts` 作成
  - [ ] Supabaseトークンのリフレッシュ処理
  - [ ] `/vote` `/settings` への未認証アクセスを `/ranking` へリダイレクト

### デプロイ連携
- [ ] GitHubリポジトリ作成・プッシュ
- [ ] Vercelプロジェクト作成・GitHubリポジトリと連携（自動デプロイ設定）

## 実装メモ

- サーバークライアントはリクエストごとに新規作成する（シングルトンにしない）
- `lib/supabase/server.ts` には `import 'server-only'` を必ず付ける
- `proxy.ts` はトークンリフレッシュのため `supabase.auth.getUser()` を必ず呼ぶ
- 詳細な実装コードは CLAUDE.md の「Supabaseクライアントのルール」を参照
