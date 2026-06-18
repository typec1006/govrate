# 03 認証実装

Supabase Auth + Googleログインの設定と、ログイン・ログアウトのUI実装。

## TODO

### Google OAuth設定（手動作業）
- [ ] Google Cloud ConsoleでOAuthクライアントID・シークレットを作成
  - 承認済みリダイレクトURIに `https://<project>.supabase.co/auth/v1/callback` を追加
- [ ] Supabaseダッシュボード → Authentication → Providers → Google に Client ID / Secret を登録
- [ ] 開発用リダイレクトURL `http://localhost:3000/**` をSupabaseに設定

### Server Actions
- [ ] `app/lib/actions/auth.ts` 作成
  - [ ] `signInWithGoogle()` — Supabaseのsignle sign-on開始
  - [ ] `signOut()` — セッション破棄 + トップページへリダイレクト

### 動作確認
- [ ] Googleログインボタンからサインインできる
- [ ] ログアウト後にセッションが消える
- [ ] 未認証で `/vote` にアクセス → `/ranking` にリダイレクトされる
- [ ] 未認証で `/settings` にアクセス → `/ranking` にリダイレクトされる

## 実装メモ

- サーバーコードでは `getSession()` を使わず `getClaims()` または `getUser()` を使う
- `signInWithGoogle` は `supabase.auth.signInWithOAuth({ provider: 'google' })` を使用
- `proxy.ts` はトークンリフレッシュも兼ねているため、認証後も正しく動作するか確認する
- セッション切れ時は `/auth/error` に誘導する（エラーハンドリングは 09 チケットで実装）
