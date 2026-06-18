# 08 設定・退会ページ

`/settings` — ログイン必須。ユーザー情報の確認・ログアウト・退会を行う。

## TODO

### ページ
- [ ] `app/settings/page.tsx` 作成（Server Component）
- [ ] ログインユーザーの情報を表示（名前・メール・アバター画像）

### ログアウト
- [ ] ログアウトボタンを設置
- [ ] Server Action でセッション破棄 → トップページへリダイレクト

### 退会機能
- [ ] 退会ボタンを設置
- [ ] 退会前に確認ダイアログを表示（「本当に退会しますか？」）
- [ ] Server Action で退会処理を実装
  - [ ] `votes` テーブルから対象ユーザーのレコードを削除
  - [ ] `users` テーブルから対象ユーザーのレコードを削除
  - [ ] Supabase Auth からユーザーを削除（`supabase.auth.admin.deleteUser`）
  - [ ] 削除後トップページへリダイレクト

### レスポンシブ
- [ ] PC・スマホ両対応

## 実装メモ

- 退会Server Actionでは必ずログイン済みユーザーのIDをサーバー側で取得する（クライアント受け取り不可）
- `users` テーブルの削除前に `votes` を先に削除する（外部キー制約のため）
- `supabase.auth.admin.deleteUser` は Service Role Key が必要なため、サーバーのみで実行する（`SUPABASE_SERVICE_ROLE_KEY` を環境変数に追加）
- 削除後はセッションも無効化されているため、そのままトップページへリダイレクトする
