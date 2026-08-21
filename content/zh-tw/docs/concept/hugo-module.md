---
title: 'Hugo Modules'
slug: hugo-modules
weight: 600
---

前面的 [Sites Matrix](sites-matrix.md) 與 [Multilingual](multilingual.md) 都提到了 module mount 的概念，這是 Hugo 很重大的特色，本文專門介紹 Hugo Modules 以及對應的 `hugo mod` 指令。

## 什麼是 Module

Module 是 Hugo 組織內容的基本單位。一個 module 可以是完整的 Hugo 專案，也可以只是提供某一種元件（content、layouts、assets、data、i18n、static、archetypes）的小型可重用套件。你安裝的主題，本質上就是一個 module。

Module 可以任意組合、巢狀引用，也可以掛載外部目錄，甚至是非 Hugo 專案的目錄，全部併入同一個 [UFS](project-structure.md#ufs)。

## 初始化與引用

專案本身要先變成一個 module 才能引用其他 module：

```bash
hugo mod init github.com/user/theme
```

這會產生 `go.mod`。如果你不打算讓其他人導入你的模組，那麼具體的名稱並不重要，取個合理的名稱即可。

在 `hugo.toml` 宣告要引用的 module：

```toml
[module]
  [[module.imports]]
    path = 'github.com/user/theme'
```

執行 `hugo` 構建時，會自動下載 module、寫入快取，並產生 `go.sum` 記錄版本與校驗碼。

同時引用多個 module 時，相同檔名的檔案優先順序由上到下合併，並且不同目錄有各自的合併規則：

- `data`、`layouts`、`static`、`archetypes`：以檔案為單位採用優先權最高的那一份，不合併內容。
- `i18n`：依 key 深度合併，多個來源的翻譯或資料會疊加在一起。

## 常用指令

以下整理常用的 `hugo mod` 指令：

- 更新單一 module：

    ```bash
    hugo mod get -u github.com/user/theme
    ```

- 指定版本：

    ```bash
    hugo mod get -u github.com/user/theme@v0.42.0
    ```

- 更新全部 module：

    ```bash
    hugo mod get -u
    ```

- 遞迴更新 module：

    ```bash
    hugo mod get -u ./...
    ```

- 清理 `go.mod`/`go.sum` 中未使用的項目：

    ```bash
    hugo mod tidy
    ```

- 清除 module 快取：

    ```bash
    hugo mod clean
    ```

## Vendor：本地檢視與臨時修改

`hugo mod vendor` 會把所有引用的 module 複製一份到 `_vendor` 目錄：

```bash
hugo mod vendor
```

用途是離線構建，或需要臨時檢視、修改某個 module 原始碼進行除錯。

直接修改 `_vendor` 內的檔案僅用於快速除錯，再次 vendor 就會被覆蓋，正式的客製化方式仍然是透過 UFS 在專案根目錄用相同路徑覆蓋。

## Replace：永久替換依賴

在 `go.mod` 中使用 `replace` 永久替換某個 module 的來源，例如換成自己的 fork：

```text {title="go.mod"}
replace github.com/user/theme => github.com/your-fork/theme v0.1.0
```

也可以指向本地目錄：

```text {title="go.mod"}
replace github.com/user/theme => /home/user/projects/theme
```

`replace` 寫在 `go.mod` 裡並隨專案一起發布，因此對所有建置這個專案的人都會生效，包含 CI。

## hugo.work：本地開發{#workspace}

使用 `hugo.work` 開發本地 module（例如你正在製作的主題），不需要每次改動都發布新版本：

```text {title="hugo.work"}
go 1.25

use .
use ../theme
```

在 `hugo.toml` 指定這個檔案，啟用 Go workspace 模式：

```toml {title="hugo.toml"}
workspace = 'hugo.work'
```

或用環境變數啟用：

```sh
HUGO_MODULE_WORKSPACE=hugo.work hugo server
```

## 實際應用範例

Module 的彈性不只用在安裝主題，還能拿來解決專案結構上的實際問題。

### 多語言網站

如同[多語言網站](multilingual.md#獨立目錄)說的一樣，可以將指定目錄 mount 到指定位置的指定 site 上，以完成多語言設定。

### 共用元件庫

最基礎的應用，多個網站共用同一組 shortcode、partial 或 CSS，抽成獨立 module 讓所有網站引用：

```toml
[module]
  [[module.imports]]
    path = 'github.com/your-org/shared-components'
```

### exampleSite 與 hugo.work

開發主題時常見的做法，是在主題 repo 裡放一個 `exampleSite/` 目錄，內含展示用的 `content/`、`hugo.toml`，但這個目錄本身不屬於主題的元件範圍（主題本體只需要 `layouts/`、`assets/` 等）。

設定方式同上方段落 [hugo.work：本地開發](#workspace)的描述。

### 內容與源碼分離

把 `content/` `assets/` 獨立成一個 module（獨立的 git repo），讓寫手完全不需要碰觸主題原始碼：

```toml
[module]
  [[module.imports]]
    path = 'github.com/your-org/site-content'
```

寫手只需要對 `site-content` 這個獨立 repo 有存取權限，不會誤動到 layouts 等程式碼部分。工程師只需要設定 CI 構建時下載這個 module 即可簡單達成權責分離。

本地開發需要即時看到內容變更效果時，可以搭配前面提到的 `replace` 指向本地路徑或用 workspace 掛載。

### 多環境設定分離

把正式站與預覽站需要的不同 `data/` 或 `params` 依環境切換引用：

```toml {title="config/staging/hugo.toml"}
[module]
  [[module.imports]]
    path = 'config-staging'
```

```toml {title="config/production/hugo.toml"}
[module]
  [[module.imports]]
    path = 'config-production'
```

其中 `config/staging` 和 `config/production` 目錄會根據 environment variable [自動切換](https://gohugo.io/configuration/introduction/#example)，或是以 `hugo -e staging` 手動指定，也可搭配 CI/CD 依部署環境切換要引用的設定 module。
