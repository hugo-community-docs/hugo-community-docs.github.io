---
lastmod: '2026-08-15T04:09:57+08:00'
title: '安裝 Hugo 以及其工具鏈'
linkTitle: '安裝'
slug: installation
weight: 100
---

本篇說明如何在各作業系統安裝 Hugo，並設定好執行所需的環境變數（PATH）。

## Hugo 版本

Hugo 提供三種發行版本：

- 無印版：基礎版本，不含 Sass/SCSS 處理功能。
- Extended 版：多數場景建議使用的版本，內建 Sass/SCSS 編譯能力。在 [v0.153.0](https://github.com/gohugoio/hugo/releases/tag/v0.153.0) 之後已經與無印版相同。
- Extended/Deploy 版：在 Extended 版基礎上額外整合 `hugo deploy` 指令，可直接部署到雲端儲存服務。

如果你沒有概念，那代表你應該安裝 **Extended 版**。

## 安裝方式

你可以透過套件管理器安裝，或是手動下載 binary 檔案。正如[認識 Hugo](./introduction.md#單一執行檔)所說的，Hugo 是一個二進制執行檔，因此你可以直接下載單一檔案直接執行，兩者差異如下：

- 套件管理器：以管理器統一管理電腦系統套件，但是需要學會使用方式。且有些管理器難以降版本、指定版本。
- 二進制安裝：手動安裝，手動管理版本，稍微麻煩但是沒有任何限制。

<br>
<br>

{{% tabs %}}
  {{< tab label="套件管理器" >}}

依作業系統選擇對應的套件管理器安裝，PATH 會自動設定完成。

- macOS: [Homebrew](https://brew.sh/) + `brew install hugo`
- Windows: [Chocolatey](https://chocolatey.org/) + `choco install hugo-extended` 或使用[Scoop](https://scoop.sh/) + `scoop install hugo-extended`
- Linux: 詳見 [Hugo 官方安裝文檔](https://gohugo.io/installation/linux/)

  {{< /tab >}}

  {{< tab label="手動下載 Binary" >}}

前往 [Hugo GitHub Releases](https://github.com/gohugoio/hugo/releases) 頁面，下載對應作業系統與架構的壓縮檔（檔名含 `extended` 字樣即為 Extended 版），解壓縮後將執行檔放入 PATH 設定的目錄。

下載完成後，系統不知道 `hugo` 位置，因此此時終端機輸入 `hugo` 會顯示錯誤。設定 PATH（Windows 稱為環境變數）就是告訴系統可以去該目錄尋找執行檔運行指令。

> [!NOTE]- macOS/Linux
> 打開終端機，複製貼上以下指令並執行：
> 
> ```bash
> # 建立用戶專屬的 PATH 目錄
> mkdir -p ~/.local/bin
> 
> # 將該路徑新增到系統 PATH
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
> ```
> 
> 然後將剛才下載的 hugo 執行檔移動到建立的 `~/.local/bin`，最後刷新 shell
> 
> ```sh
> source ~/.zshrc
> ```
> 
> 如果你的 shell 不是 zsh，則把 `~/.zshrc` 換成 `~/.bashrc`。

> [!NOTE]- Windows
> 打開 PowerShell，**注意是 PowerShell，不是 CMD 也不是 Windows PowerShell**，複製貼上以下指令並執行：
> 
> ```powershell
> # 建立用戶專屬的 PATH 路徑
> New-Item -ItemType Directory -Force -Path "$HOME\hugo\bin"
> 
> # 印出完整目錄路徑
> Write-Output "$HOME\hugo\bin"
> 
> # 將該路徑新增到系統 PATH
> [Environment]::SetEnvironmentVariable("PATH", "$HOME\hugo\bin;" + [Environment]::GetEnvironmentVariable("PATH", "User"), "User")
> ```
> 
> 然後將剛才下載的 hugo 執行檔移動到建立的 `$HOME\hugo\bin`，最後重新開啟終端機讓設定生效。

  {{< /tab >}}
{{% /tabs %}}

## 確認安裝成功

不論用哪種方式安裝，最後都執行以下指令：

```bash
hugo version
```

- 看到版本號代表安裝成功，可以繼續下一步。
- 看到 `command not found`（macOS/Linux）或 `不是內部或外部命令`（Windows）代表 PATH 沒有設定成功，請重新開啟終端機再試一次，或是確認上方指令是否有貼錯或漏執行。

## 相關工具

以下工具並非 Hugo 運作的必要條件，但實務上開發 Hugo 網站時經常會用到：

- [Git](https://git-scm.com/downloads)：版本控制軟體，安裝主題或管理專案時使用。
- [Go](https://go.dev/doc/install)：Hugo 也支援以 Go modules 更靈活的管理專案依賴，這代表你的網站專案本身會是一個 Go module，才能使用 `hugo mod` 系列指令。
