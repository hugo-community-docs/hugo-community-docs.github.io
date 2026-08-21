---
title: '建立網站'
slug: quick-start
weight: 200
---

Hugo 安裝完成後，本篇說明如何建立一個新網站並啟動本地開發伺服器。

## 建立專案

```bash
hugo new project my-site
cd my-site
```

`hugo new project` 會建立基本的目錄結構，此時網站還沒有任何主題與內容。

## 安裝主題

> [!INFO] 安裝方式選擇
> Git submodule 方式雖然不需要 Go，但是你需要深厚的 Git 經驗才能正確操作，如果對 Git 不熟悉，hugo-community-docs 極度建議你直接使用 Hugo module方式安裝。
>
> 反之 Hugo modules 的指令相對單純：更新降版都是 `hugo mod get`，同樣任務 Git submodule 需要多個指令才能完成。

{{% tabs group="module" %}}
  {{< tab label="Hugo Modules" >}}

推薦的方式，本質上是 Go module。以 [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) 為例：

```bash
git init
hugo mod init github.com/your-username/my-site  # or hugo mod init my-project
hugo mod get github.com/gohugo-ananke/ananke/v2
```

`git init` 將目錄初始化成 Git 儲存庫，允許你追蹤專案的修改歷史記錄。`hugo mod init` 把你的網站變成 go module；`hugo mod get` 用於安裝主題。

接著在 `hugo.toml` 加入：

```toml
[module]
  [[module.imports]]
    path = "github.com/gohugo-ananke/ananke/v2"
```

  {{< /tab >}}

  {{< tab label="Git Submodule" >}}

不推薦的方式。以 [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) 為例：

```bash
git init
git submodule add https://github.com/gohugo-ananke/ananke.git themes/ananke
```

`git init` 將目錄初始化為 Git 儲存庫，是 Git submodule 的必跳條件。`git submodule add` 則將主題作為一個獨立、連結的儲存庫克隆到 `themes/ananke`。

接著在 `hugo.toml` 加入：

```toml
theme = ["ananke"]
```

  {{< /tab >}}
{{% /tabs %}}

## 啟動開發伺服器

首先新增幾篇文章

```bash
hugo new content _index.md                  # 主頁
hugo new content posts/_index.md            # 文章列表頁
hugo new content posts/article-1/index.md   # 獨立文章
hugo new content posts/article-2/index.md   # 獨立文章
hugo new content posts/article-3/index.md   # 獨立文章
```

然後啟動伺服器

```bash
hugo server -DEF
```

預設會在 `http://localhost:1313` 啟動網站，儲存檔案後瀏覽器會自動刷新，使用 `Ctrl + C` 結束伺服器。

> [!WARNING] 找不到頁面？
> Hugo 預設會跳過草稿、過期和未來日期發布的文章。如果缺少文章，請先檢查以下三個標誌：
> 
> - `-D` 會建立草稿文章，由 front matter 的 `draft` 控制
> - `-E` 會創建過期文章，由 front matter 的 `expiryDate` 控制
> - `-F` 會建立未來日期發布的文章，由 front matter 的 `date` 控制
>
> 若要徹底避免草稿問題，請從 `archetypes/default.md` 檔案中移除 `draft` 標誌，該檔案用於設定 `hugo new content` 的預設內容。

## 構建正式版本

```bash
hugo
```

構建結果會輸出到 `public/`，可直接部署到任何靜態網站託管服務。

{{% admonition type="tip" sign=" " title="技巧：gitignore" %}}

自動建立的檔案因為每次執行都會再次生成，追蹤他們沒有任何意義，不應該被版本控制系統追蹤。在專案根目錄新增 `.gitignore` 設定忽略規則：

```text
# Hugo
/public/
/resources/_gen/
/exampleSite/public/
/exampleSite/resources/
jsconfig.json
hugo_stats.json
.hugo_build.lock

# System
.DS_Store
.tmp*

# JS
node_modules
```

{{% /admonition %}}
