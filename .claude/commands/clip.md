---
allowed-tools: PowerShell, Read
description: Windowsクリップボードの画像（PrintScreenやSnipping Toolでコピーしたもの）をファイルに保存して確認する
---

## 目的

Git Bash / Cursorのターミナルなど、Claude Codeへの画像の直接貼り付け（Ctrl+V）が効かない環境向けの代替手段。
クリップボードにある画像をファイルに保存し、Readツールで内容を確認する。

## 手順

1. 以下のPowerShellコマンドを実行し、クリップボードの画像を `%TEMP%\claude-clipboard.png` に保存する。

```powershell
Add-Type -AssemblyName System.Windows.Forms
$img = [System.Windows.Forms.Clipboard]::GetImage()
if ($img -ne $null) {
    $path = "$env:TEMP\claude-clipboard.png"
    $img.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "SAVED:$path"
} else {
    Write-Output "NO_IMAGE_IN_CLIPBOARD"
}
```

2. `SAVED:<path>` が返ってきたら、そのパスをReadツールで開いて画像内容を確認する。
3. `NO_IMAGE_IN_CLIPBOARD` の場合は、先にスクリーンショットを撮ってクリップボードにコピーしてから再実行するようユーザーに伝える。
