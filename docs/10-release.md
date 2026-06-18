# 10 テスト・リリース

本番環境へのデプロイと最終動作確認。

## TODO

### Vercel環境変数設定
- [ ] `NEXT_PUBLIC_SUPABASE_URL` を登録
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を登録
- [ ] `SUPABASE_SERVICE_ROLE_KEY` を登録（退会機能用）

### Google OAuth 本番設定
- [ ] Google Cloud ConsoleのOAuthクライアントに本番ドメインのリダイレクトURIを追加
- [ ] Supabase Auth の Site URL を本番ドメインに変更

### 本番デプロイ
- [ ] Vercelに本番デプロイ実行
- [ ] ビルドエラーがないことを確認

### 動作確認
- [ ] Googleログイン・ログアウト
- [ ] 投票・スコア変更（upsert）
- [ ] ランキングのリアルタイム更新
- [ ] 未認証で `/vote` アクセス → `/ranking` リダイレクト
- [ ] 未認証で `/settings` アクセス → `/ranking` リダイレクト
- [ ] 退会（votes削除 → users削除 → Auth削除）
- [ ] PC・スマホ両対応の表示確認
- [ ] セッション切れ時の `/auth/error` 表示
