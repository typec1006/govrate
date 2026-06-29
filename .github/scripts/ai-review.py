import json
import os
import subprocess
import urllib.request

diff = open("/tmp/pr_diff.txt").read()
prompt = f"""以下のPR差分をコードレビューしてください。

次の観点で日本語でレビューしてください:
- バグ・潜在的な問題
- セキュリティの懸念
- パフォーマンスの問題
- コードの品質・可読性
- 改善提案

問題がなければ「特に問題はありません」と伝えてください。

```diff
{diff}
```"""

payload = json.dumps(
    {
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 2048,
        "messages": [{"role": "user", "content": prompt}],
    }
).encode()

req = urllib.request.Request(
    "https://api.anthropic.com/v1/messages",
    data=payload,
    headers={
        "x-api-key": os.environ["ANTHROPIC_API_KEY"],
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    },
)
with urllib.request.urlopen(req) as res:
    review = json.loads(res.read())["content"][0]["text"]

body = f"## AI Code Review\n\n{review}\n\n---\n*Claude Haiku による自動コードレビュー*"

subprocess.run(
    ["gh", "pr", "comment", os.environ["PR_NUMBER"], "--body", body],
    check=True,
)
