# 進捗管理

全チケットのTODOを一覧で管理するファイル。
完了したら `- [ ]` を `- [x]` に変更する。
各チケットの詳細・実装メモは個別ファイルを参照。

---

## [01 環境構築](./01-setup.md)

### パッケージ
- [ ] `@supabase/supabase-js` `@supabase/ssr` をインストール

### 環境変数
- [ ] `.env.local` を作成し、SupabaseのURL・Publishable Keyを設定

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

---

## [02 DB構築](./02-database.md)

### テーブル作成
- [ ] `users` テーブル作成
- [ ] `governors` テーブル作成
- [ ] `votes` テーブル作成（`UNIQUE(user_id, governor_id)` 制約あり）

### RLSポリシー設定
- [ ] `governors`：全員 SELECT 可
- [ ] `votes`：自分のレコードのみ SELECT / INSERT / UPDATE 可
- [ ] `users`：自分のレコードのみ SELECT / UPDATE / DELETE 可

### ビュー作成
- [ ] `ranking` ビュー作成（全員読み取り可）

### 初期データ投入
- [ ] 47都道府県の知事データを INSERT

---

## [03 認証実装](./03-auth.md)

### Google OAuth設定（手動作業）
- [ ] Google Cloud ConsoleでOAuthクライアントID・シークレットを作成
- [ ] SupabaseダッシュボードにクライアントID・Secretを登録
- [ ] 開発用リダイレクトURL `http://localhost:3000/**` をSupabaseに設定

### Server Actions
- [ ] `app/lib/actions/auth.ts` 作成
  - [ ] `signInWithGoogle()`
  - [ ] `signOut()`

### 動作確認
- [ ] Googleログインでサインインできる
- [ ] ログアウト後にセッションが消える
- [ ] 未認証で `/vote` → `/ranking` にリダイレクトされる
- [ ] 未認証で `/settings` → `/ranking` にリダイレクトされる

---

## [04 レイアウト・ヘッダー](./04-layout-header.md)

### レイアウト
- [ ] `app/layout.tsx` を更新（Provider・ヘッダー組み込み）

### ヘッダーコンポーネント
- [ ] 未ログイン時：Googleログインボタンのみ表示・ナビタブ非表示
- [ ] ログイン後：アバター・ユーザー名表示
- [ ] ログイン後：アバタータップで「設定」「ログアウト」メニュー表示
- [ ] ログイン後：「投票」「ランキング」ナビタブ表示（アクティブハイライト）

### レスポンシブ
- [ ] PC・スマホ両対応

---

## [05 トップ / ログインページ](./05-page-top.md)

- [ ] `app/page.tsx` 実装
  - [ ] 未ログイン時：サービス説明 + Googleログインボタン表示
  - [ ] ログイン済み：`/vote` へリダイレクト
- [ ] レスポンシブ対応

---

## [06 ランキングページ](./06-page-ranking.md)

### データ取得・表示
- [ ] `app/ranking/page.tsx` 作成
- [ ] `ranking` ビューからデータ取得・リスト表示
- [ ] 未ログイン時：ログイン誘導バナー表示

### リアルタイム更新
- [ ] Supabase Realtimeで `votes` テーブルの変更を購読
- [ ] 投票・変更時にランキングを自動更新

### レスポンシブ
- [ ] PC・スマホ両対応

---

## [07 投票ページ](./07-page-vote.md)

### ページ・データ取得
- [ ] `app/vote/page.tsx` 作成
- [ ] `governors` 全件取得
- [ ] ログインユーザーの既存投票を取得

### フィルタ・検索
- [ ] 地域フィルタ（8区分）
- [ ] テキスト検索（都道府県名・知事名）

### 投票UI
- [ ] 各知事カードにスコアボタン（1〜5）表示
- [ ] 投票済みバッジ / ハイライト表示
- [ ] スコアボタン押下でServer Action（upsert保存）
- [ ] 投票後のUI更新

### Server Action
- [ ] `app/lib/actions/vote.ts` 作成
  - [ ] `submitVote(governorId, score)` — upsert保存・ログイン確認・`revalidatePath`

### レスポンシブ
- [ ] PC・スマホ両対応

---

## [08 設定・退会ページ](./08-page-settings.md)

### ページ
- [ ] `app/settings/page.tsx` 作成
- [ ] ユーザー情報表示（名前・メール・アバター）

### ログアウト
- [ ] ログアウトボタン設置・Server Actionでセッション破棄

### 退会機能
- [ ] 退会ボタン設置・確認ダイアログ表示
- [ ] Server Action で退会処理
  - [ ] `votes` レコード削除
  - [ ] `users` レコード削除
  - [ ] Supabase Auth からユーザー削除
  - [ ] トップページへリダイレクト

### レスポンシブ
- [ ] PC・スマホ両対応

---

## [09 セッション切れエラーページ](./09-page-error.md)

- [ ] `app/auth/error/page.tsx` 作成
  - [ ] エラーメッセージ表示
  - [ ] トップページへのログインボタン表示
- [ ] レスポンシブ対応

---

## [10 テスト・リリース](./10-release.md)

### Vercel環境変数設定
- [ ] `NEXT_PUBLIC_SUPABASE_URL` を登録
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を登録
- [ ] `SUPABASE_SERVICE_ROLE_KEY` を登録

### Google OAuth 本番設定
- [ ] 本番ドメインのリダイレクトURIを追加
- [ ] Supabase Auth の Site URL を本番ドメインに変更

### 本番デプロイ
- [ ] Vercelに本番デプロイ実行
- [ ] ビルドエラーがないことを確認

### 動作確認
- [ ] Googleログイン・ログアウト
- [ ] 投票・スコア変更（upsert）
- [ ] ランキングのリアルタイム更新
- [ ] 未認証で `/vote` → `/ranking` リダイレクト
- [ ] 未認証で `/settings` → `/ranking` リダイレクト
- [ ] 退会（votes → users → Auth 削除）
- [ ] PC・スマホ両対応の表示確認
- [ ] セッション切れ時の `/auth/error` 表示
