# 07 投票ページ

`/vote` — ログイン必須。47知事への評価をフィルタ・検索しながら投票できる。

## TODO

### ページ・データ取得
- [ ] `app/vote/page.tsx` 作成（Server Component）
- [ ] `governors` テーブルから全件取得
- [ ] ログインユーザーの既存投票を `votes` テーブルから取得（自分の票のみRLSで返る）

### フィルタ・検索（Client Component）
- [ ] 地域フィルタ（8区分：北海道 / 東北 / 関東 / 中部 / 近畿 / 中国 / 四国 / 九州）
- [ ] テキスト検索（都道府県名・知事名）
- [ ] フィルタ・検索はクライアントサイドで絞り込む（再フェッチ不要）

### 投票UI
- [ ] 各知事カードにスコアボタン（1〜5）を表示
- [ ] 投票済みの知事に「投票済み」バッジ or スコアのハイライト表示
- [ ] スコアボタン押下でServer Actionを呼び出し（upsert保存）
- [ ] 投票・変更後に楽観的UI更新 or ページ再フェッチ

### Server Action
- [ ] `app/lib/actions/vote.ts` 作成
  - [ ] `submitVote(governorId: string, score: number)` — upsert保存
  - [ ] Server Action内でログイン確認（`getClaims()` or `getUser()`）
  - [ ] 保存後に `revalidatePath('/ranking')` でランキングを更新

### レスポンシブ
- [ ] PC・スマホ両対応（カードレイアウトの調整）

## 実装メモ

- `votes` の upsert: `{ user_id, governor_id, score }` を `ON CONFLICT (user_id, governor_id) DO UPDATE SET score, updated_at`
- Server Actionでは必ずuser_idをサーバー側で取得する（クライアントから受け取らない）
- スコアの値は1〜5の整数のみ許可する（バリデーション必須）
- 投票者情報はランキングには表示しない
