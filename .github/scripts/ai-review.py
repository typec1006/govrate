import json
import os
import subprocess
import sys
import urllib.request
from urllib.error import HTTPError, URLError

MODEL = "claude-haiku-4-5-20251001"
API_URL = "https://api.anthropic.com/v1/messages"
API_VERSION = "2023-06-01"
TIMEOUT = 30

api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    print("Error: ANTHROPIC_API_KEY is not set", file=sys.stderr)
    sys.exit(1)

pr_number = os.environ.get("PR_NUMBER")
if not pr_number:
    print("Error: PR_NUMBER is not set", file=sys.stderr)
    sys.exit(1)

try:
    with open("/tmp/pr_diff.txt", encoding="utf-8") as f:
        diff = f.read()
except FileNotFoundError:
    print("Error: /tmp/pr_diff.txt not found", file=sys.stderr)
    sys.exit(1)

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
        "model": MODEL,
        "max_tokens": 2048,
        "messages": [{"role": "user", "content": prompt}],
    }
).encode()

req = urllib.request.Request(
    API_URL,
    data=payload,
    headers={
        "x-api-key": api_key,
        "anthropic-version": API_VERSION,
        "content-type": "application/json",
    },
)

try:
    with urllib.request.urlopen(req, timeout=TIMEOUT) as res:
        response_body = res.read()
except HTTPError as e:
    print(f"Error: HTTP {e.code} {e.reason}", file=sys.stderr)
    sys.exit(1)
except URLError as e:
    print(f"Error: API request failed - {e}", file=sys.stderr)
    sys.exit(1)

try:
    response = json.loads(response_body)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON response - {e}", file=sys.stderr)
    sys.exit(1)

content = response.get("content") if isinstance(response, dict) else None
if not isinstance(content, list) or len(content) == 0:
    print("Error: Unexpected API response structure", file=sys.stderr)
    sys.exit(1)

try:
    review = content[0]["text"]
except (KeyError, IndexError) as e:
    print(f"Error: Unexpected API response format - {e}", file=sys.stderr)
    sys.exit(1)

body = f"## 🤖 AI Code Review\n\n{review}\n\n---\n*Claude Haiku による自動コードレビュー*"

result = subprocess.run(
    ["gh", "pr", "comment", pr_number, "--body", body],
    capture_output=True,
    text=True,
)
if result.returncode != 0:
    print(f"Error: Failed to post comment - {result.stderr}", file=sys.stderr)
    sys.exit(1)
