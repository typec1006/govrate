# 進捗管理

全チケットのTODOを一覧で管理するファイル。
完了したら `- [ ]` を `- [x]` に変更する。
各チケットの詳細・実装メモは個別ファイルを参照。

---

## [01 環境構築](./01-setup.md)

### パッケージ
- [x] `@supabase/supabase-js` `@supabase/ssr` をインストール

### 環境変数
- [x] `.env.local` を作成し、SupabaseのURL・Publishable Keyを設定

### Supabaseクライアント
- [x] `lib/supabase/client.ts` 作成（ブラウザ用 `createBrowserClient`）
- [x] `lib/supabase/server.ts` 作成（サーバー用 `createServerClient`、`import 'server-only'` 付き）

### Proxy
- [x] `proxy.ts` 作成
  - [x] Supabaseトークンのリフレッシュ処理
  - [x] `/vote` `/settings` への未認証アクセスを `/ranking` へリダイレクト

### デプロイ連携
- [x] GitHubリポジトリ作成・プッシュ
- [x] Vercelプロジェクト作成・GitHubリポジトリと連携（自動デプロイ設定）

---

## [02 DB構築](./02-database.md)

### テーブル作成
- [x] `users` テーブル作成
- [x] `governors` テーブル作成
- [x] `votes` テーブル作成（`UNIQUE(user_id, governor_id)` 制約あり）

### RLSポリシー設定
- [x] `governors`：全員 SELECT 可
- [x] `votes`：自分のレコードのみ SELECT / INSERT / UPDATE 可
- [x] `users`：自分のレコードのみ SELECT / UPDATE / DELETE 可

### ビュー作成
- [x] `ranking` ビュー作成（全員読み取り可）

### 初期データ投入
- [x] 47都道府県の知事データを INSERT

---

## [03 認証実装](./03-auth.md)

### Google OAuth設定（手動作業）
- [x] Google Cloud ConsoleでOAuthクライアントID・シークレットを作成
- [x] SupabaseダッシュボードにクライアントID・Secretを登録
- [x] 開発用リダイレクトURL `http://localhost:3000/**` をSupabaseに設定

### Server Actions
- [x] `app/lib/actions/auth.ts` 作成
  - [x] `signInWithGoogle()`
  - [x] `signOut()`

### 動作確認
- [x] Googleログインでサインインできる
- [x] ログアウト後にセッションが消える
- [x] 未認証で `/vote` → `/ranking` にリダイレクトされる
- [x] 未認証で `/settings` → `/ranking` にリダイレクトされる

---

## [04 レイアウト・ヘッダー](./04-layout-header.md)

### レイアウト
- [x] `app/layout.tsx` を更新（Provider・ヘッダー組み込み）

### ヘッダーコンポーネント
- [x] 未ログイン時：Googleログインボタンのみ表示・ナビタブ非表示
- [x] ログイン後：アバター・ユーザー名表示
- [x] ログイン後：アバタータップで「設定」「ログアウト」メニュー表示
- [x] ログイン後：「投票」「ランキング」ナビタブ表示（アクティブハイライト）

### レスポンシブ
- [x] PC・スマホ両対応

---

## [05 トップ / ログインページ](./05-page-top.md)

- [x] `app/page.tsx` 実装
  - [x] 未ログイン時：サービス説明 + Googleログインボタン表示
  - [x] ログイン済み：`/vote` へリダイレクト
- [x] レスポンシブ対応

---

## [06 ランキングページ](./06-page-ranking.md)

### データ取得・表示
- [x] `app/ranking/page.tsx` 作成
- [x] `ranking` ビューからデータ取得・リスト表示
- [x] 未ログイン時：ログイン誘導バナー表示

### リアルタイム更新
- [x] Supabase Realtimeで `votes` テーブルの変更を購読
- [x] 投票・変更時にランキングを自動更新

### レスポンシブ
- [x] PC・スマホ両対応

---

## [07 投票ページ](./07-page-vote.md)

### ページ・データ取得
- [x] `app/vote/page.tsx` 作成
- [x] `governors` 全件取得
- [x] ログインユーザーの既存投票を取得

### フィルタ・検索
- [x] 地域フィルタ（8区分）
- [x] テキスト検索（都道府県名・知事名）

### 投票UI
- [x] 各知事カードにスコアボタン（1〜5）表示
- [x] 投票済みバッジ / ハイライト表示
- [x] スコアボタン押下でServer Action（upsert保存）
- [x] 投票後のUI更新

### Server Action
- [x] `app/lib/actions/vote.ts` 作成
  - [x] `submitVote(governorId, score)` — upsert保存・ログイン確認・`revalidatePath`

### レスポンシブ
- [x] PC・スマホ両対応

---

## [08 設定・退会ページ](./08-page-settings.md)

### ページ
- [x] `app/settings/page.tsx` 作成
- [x] ユーザー情報表示（名前・メール・アバター）

### ログアウト
- [x] ログアウトボタン設置・Server Actionでセッション破棄

### 退会機能
- [x] 退会ボタン設置・確認ダイアログ表示
- [x] Server Action で退会処理
  - [x] `votes` レコード削除
  - [x] `users` レコード削除
  - [x] Supabase Auth からユーザー削除
  - [x] トップページへリダイレクト

### レスポンシブ
- [x] PC・スマホ両対応

---

## [09 セッション切れエラーページ](./09-page-error.md)

- [x] `app/auth/error/page.tsx` 作成
  - [x] エラーメッセージ表示
  - [x] トップページへのログインボタン表示
- [x] レスポンシブ対応

---

## [10 テスト・リリース](./10-release.md)

### Vercel環境変数設定
- [x] `NEXT_PUBLIC_SUPABASE_URL` を登録
- [x] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を登録
- [x] `SUPABASE_SERVICE_ROLE_KEY` を登録

### Google OAuth 本番設定
- [x] 本番ドメインのリダイレクトURIを追加
- [x] Supabase Auth の Site URL を本番ドメインに変更

### 本番デプロイ
- [x] Vercelに本番デプロイ実行
- [x] ビルドエラーがないことを確認

### 動作確認
- [x] Googleログイン・ログアウト
- [x] 投票・スコア変更（upsert）
- [x] ランキングのリアルタイム更新
- [x] 未認証で `/vote` → `/ranking` リダイレクト
- [x] 未認証で `/settings` → `/ranking` リダイレクト
- [x] 退会（votes → users → Auth 削除）
- [x] PC・スマホ両対応の表示確認
- [x] セッション切れ時の `/auth/error` 表示
