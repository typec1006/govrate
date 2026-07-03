## プロダクト仕様：知事レーティングサービス

47都道府県の知事を1〜5点で評価・投票できるWebサービス。Googleログインで認証し、各知事への評価をリアルタイムでランキング表示する。

### 追加スタック

| 項目 | 技術 |
|------|------|
| DB / 認証 | Supabase |
| デプロイ | Vercel |

### 必要な環境変数

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 認証要件

- Googleログインのみ
- 退会時はvotes→usersの順にカスケード削除
- セッション切れは `/auth/error` へ
- `/vote` `/settings` は未認証時に `/ranking` へリダイレクト（`proxy.ts` で制御）

### DB設計

**`governors`テーブル**

| カラム | 型 |
|--------|-----|
| id | uuid (PK) |
| prefecture | string（都道府県名） |
| name | string（知事名） |
| party | string（政党） |
| region | string（北海道・東北・関東・中部・近畿・中国・四国・九州） |
| created_at | timestamp |

**`votes`テーブル**

| カラム | 型 |
|--------|-----|
| id | uuid (PK) |
| user_id | uuid (FK → users.id) |
| governor_id | uuid (FK → governors.id) |
| score | int（1〜5） |
| created_at | timestamp |
| updated_at | timestamp |

`UNIQUE(user_id, governor_id)` 制約あり（upsertで更新）。

**RLSポリシー**

- `governors`: 全員がSELECT可
- `votes`: SELECT/INSERT/UPDATE は自分のレコードのみ
- `users`: SELECT/UPDATE/DELETE は自分のレコードのみ

**`ranking`ビュー**（全員読み取り可）

```sql
CREATE VIEW ranking AS
SELECT
  g.id, g.prefecture, g.name, g.party, g.region,
  ROUND(AVG(v.score)::numeric, 1) AS avg_score,
  COUNT(v.id) AS vote_count
FROM governors g
LEFT JOIN votes v ON g.id = v.governor_id
GROUP BY g.id
ORDER BY avg_score DESC NULLS LAST;
```

**注意**: `ranking`ビューは `security_invoker = off`(デフォルト)のままにすること。`true`にすると集計が閲覧者自身のRLS権限で実行され、`votes`の「自分のレコードのみSELECT可」が集計にも適用されてしまい、匿名/他ユーザーからは他人の投票が見えず`avg_score`/`vote_count`が正しく出ない不具合が発生する(2026-07-03に実際に発生・修正済み)。副作用でSupabase lintの「Security Definer View」警告(ERROR)が出るが、本ビューは個人情報を含まず集計値のみを公開するため許容している。

### 画面一覧

| 画面 | パス | ログイン |
|------|------|----------|
| トップ / ログイン | `/` | 不要 |
| ランキング | `/ranking` | 不要（ログイン誘導バナーあり） |
| 投票 | `/vote` | 必須 |
| 設定 / 退会 | `/settings` | 必須 |
| セッション切れ | `/auth/error` | - |

**ナビ（ログイン後）**：「投票」「ランキング」タブをヘッダーに表示。未ログイン時はタブ非表示・ログインボタンのみ。

### 投票機能

- スコアは1〜5の整数
- 1知事につき1票（upsertで変更可）
- 自分のスコアは自分だけ見える（RLS）
- 地域（8区分）フィルタ・都道府県名/知事名検索あり
- 投票後リアルタイムでランキングに反映（Supabase Realtime）
- 表示情報：平均スコア・投票数のみ（投票者情報は匿名）

### 実装フェーズ

1. **環境構築** — Supabaseパッケージ導入・env設定・クライアント設定・`proxy.ts`
2. **DB構築** — テーブル/RLS/ビュー作成SQL・47知事の初期データ投入
3. **認証実装** — Supabase Auth + Googleログイン・`proxy.ts`でルート保護
4. **画面実装** — レイアウト・各ページ・Realtimeランキング・レスポンシブ
5. **テスト・リリース** — Vercel本番デプロイ・動作確認
