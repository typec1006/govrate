# 10 テスト・リリース

本番環境へのデプロイと最終動作確認。

## TODO

### Vercel環境変数設定
- [x] `NEXT_PUBLIC_SUPABASE_URL` を登録
- [x] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を登録
- [x] `SUPABASE_SERVICE_ROLE_KEY` を登録（退会機能用）

### Google OAuth 本番設定
- [x] Google Cloud ConsoleのOAuthクライアントに本番ドメインのリダイレクトURIを追加
- [x] Supabase Auth の Site URL を本番ドメインに変更

### 本番デプロイ
- [x] Vercelに本番デプロイ実行
- [x] ビルドエラーがないことを確認

### 動作確認
- [x] Googleログイン・ログアウト
- [x] 投票・スコア変更（upsert）
- [x] ランキングのリアルタイム更新
- [x] 未認証で `/vote` アクセス → `/ranking` リダイレクト
- [x] 未認証で `/settings` アクセス → `/ranking` リダイレクト
- [x] 退会（votes削除 → users削除 → Auth削除）
- [x] PC・スマホ両対応の表示確認
- [x] セッション切れ時の `/auth/error` 表示

### 公開前チェックリスト（外部参考）

参考記事: https://zenn.dev/catnose99/articles/547cbf57e5ad28

#### セキュリティ
- [ ] 認証Cookieの属性設定（HttpOnly / SameSite / Secure / Domain）
- [ ] ユーザー入力のバリデーション（クライアント・サーバー両側）
- [ ] レスポンスヘッダの設定（HSTS / X-Frame-Options 等）
- [ ] SQLインジェクション対策

#### メール・SEO・OGP
- [ ] SPF / DKIM / DMARC 設定（メール送信がある場合）
- [ ] titleタグ・canonical URL・noindex の適切な設定
- [ ] OGP タグの設定（og:title / og:description / og:image）

#### 品質・パフォーマンス
- [ ] favicon / apple-touch-icon 設定
- [ ] アクセシビリティ（alt属性・スクリーンリーダー対応）
- [ ] バンドル最適化・画像最適化・CDNキャッシュ
- [ ] クロスブラウザ・クロスOS動作確認
- [ ] エラーページの設計（404 / 500）
