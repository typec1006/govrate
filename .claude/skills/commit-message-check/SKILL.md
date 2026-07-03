---
name: commit-message-check
description: govrateリポジトリでgitのコミットメッセージやPRタイトルを作成・レビュー・提案するときに使うSkill。「Conventional Commitsのプレフィックスは英語、説明文は日本語」というプロジェクトの規約を強制する。「コミットメッセージ」「PRタイトル」といった言葉が出たとき、または `git commit` を実行する直前に発動する。
---

## ルール

govrateのコミットメッセージは **Conventional Commits + 日本語** で書く。

- プレフィックス（`feat` / `fix` / `perf` / `refactor` / `docs` / `chore` / `ci` / `test` など）は英語のまま
- プレフィックス以降の説明文は日本語
- PRタイトルも同じ形式に揃える

## 良い例

```
feat: Googleログイン機能を追加
fix: 投票後にスコアが更新されないバグを修正
perf: Suspenseストリーミングの追加とgetUser呼び出しの重複排除
docs: 公開前チェックリストを追記
ci: CI完了時にSlackへ通知するジョブを追加
```

## 悪い例

```
Add google login          # 英語の説明文はNG（日本語にする）
機能追加                   # プレフィックスがない
Feat: ログイン機能を追加    # プレフィックスは小文字にする
```

## 適用時の振る舞い

コミットメッセージやPRタイトルを作成・提案する際は、必ず上記の形式（`<prefix>: <日本語の説明>`）に従うこと。ユーザーから別の書き方を明示的に指示された場合はそちらを優先する。
