# 02 DB構築

Supabaseでテーブル・RLS・ビューを作成し、47知事の初期データを投入する。

## TODO

### テーブル作成
- [x] `users` テーブル作成
  - `id` uuid PK、`google_id` string UK、`avatar_url`、`created_at`
- [x] `governors` テーブル作成
  - `id` uuid PK、`prefecture`、`name`、`party`、`region`、`created_at`
- [x] `votes` テーブル作成
  - `id` uuid PK、`user_id` FK→users、`governor_id` FK→governors、`score` int、`created_at`、`updated_at`
  - `UNIQUE(user_id, governor_id)` 制約を追加

### RLSポリシー設定
- [x] `governors`：全員 SELECT 可（RLS有効化 + SELECT policy）
- [x] `votes`：ログインユーザーが自分のレコードのみ SELECT / INSERT / UPDATE 可
- [x] `users`：自分のレコードのみ SELECT / UPDATE / DELETE 可

### ビュー作成
- [x] `ranking` ビュー作成（全員読み取り可）
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

### 初期データ投入
- [x] 47都道府県の知事データを INSERT（名前・都道府県・政党・地域区分）
  - 地域区分：北海道 / 東北 / 関東 / 中部 / 近畿 / 中国 / 四国 / 九州

## 実装メモ

- `votes.score` には CHECK 制約 `score BETWEEN 1 AND 5` を追加する
- `votes` の upsert は `ON CONFLICT (user_id, governor_id) DO UPDATE` で行う
- RLS は各テーブルで `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` を忘れずに実行する
- `ranking` ビューには RLS を適用せず、全員読み取り可にする
- `ranking` ビューは `security_invoker = off`（デフォルト）のままにする。`security_invoker = true` にすると集計クエリが閲覧者自身の権限で実行され、`votes` のRLS（自分のレコードのみ閲覧可）が集計にも適用されてしまい、匿名/他ユーザーからは他人の投票が集計に含まれず `avg_score`/`vote_count` が正しく出ない（2026-06-29の `fix_ranking_view_security_invoker` マイグレーションで一度 `true` にした結果このバグが発生し、2026-07-03の `revert_ranking_view_security_invoker` で `off` に戻した）
  - 副作用としてSupabaseのlintで「Security Definer View」警告（ERRORレベル）が出るが、本ビューは `user_id` 等の個人情報を含まず集計値のみを公開する設計のため許容している
