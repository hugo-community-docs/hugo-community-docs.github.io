---
title: '專案結構與 UFS'
slug: project-structure
weight: 100
---

## 專案結構

標準的 Hugo 專案結構如下：

```text
my-project/
├── archetypes/         # 新內容的預設樣板
├── assets/             # 可經 Hugo Pipes 處理（CSS、JS、圖片）
├── static/             # 不會被處理，原樣複製到輸出目錄
├── config/
│   ├── _default/       # 預設設定
│   │   └── hugo.yaml   # 網站設定檔，也可放在專案根目錄
│   └── production/     # 環境專屬的覆寫設定
├── content/            # Markdown 內容
├── data/               # 供模板讀取的自訂資料檔（JSON/YAML/yaml）
├── i18n/               # 翻譯檔
├── layouts/            # 模板檔案，網站的 HTML 結構
├── public/             # 建置輸出目錄
├── resources/          # 資源處理快取
└── themes/             # 主題（若透過 git submodule 安裝）
```

其中 resources 和 public 每次構建都會重複生成，你應該將這兩個目錄設定到 `.gitignore` 中，因為 Git 追蹤被生成的檔案沒有任何意義。

## Unified File System{#ufs}

UFS（Unified File System）是 Hugo 用於合併檔案的核心機制，它會把專案根目錄、主題、模組中同名的目錄視為同一個虛擬檔案系統。這些層級依優先順序疊加：專案根目錄的檔案永遠會覆蓋主題的檔案，當多個主題有相同路徑的檔案時，較晚載入的主題會覆蓋較早載入的。接入 UFS 的目錄包含：

- `archetypes/`
- `assets/`
- `content/`
- `layouts/`
- `static/`
- `data/`
- `i18n/`

不論是 `themes/` 目錄底下的主題，還是透過 Hugo Modules 安裝的模組都會接入 UFS 系統。

UFS 系統讓你無須 fork 主題就能完成客製化，只要在專案根目錄的 `layouts/` 建立相同路徑的檔案即可：

```sh
.
├── layouts/
│   └── _partials/
│       └── xxx.html            # 你的覆蓋版本，優先套用
└── themes/
    └── ananke/
        └── layouts/
            └── _partials/
                └── xxx.html    # 主題原始檔案
```

> [!IMPORTANT]
> 除非你知道自己在做什麼，否則不要複製主題檔案到自己的專案中。一個常見的錯誤是把主題的 `assets` 複製到根目錄的 `assets` 中。未來更新主題時，你的網站仍會使用先前複製的舊檔案而非新版本，導致樣式損壞。

## UFS 的合併規則

相同檔名的檔案優先順序由前到後合併，並且不同目錄有各自的合併規則：

- `archetypes`、`assets`、`content`、`layouts`、`static`、`data`：以檔案為單位採用最靠近的那一份。
- `i18n`：依 key 深度合併，多個來源的翻譯或資料會疊加在一起。

`hugo.yaml` 設定檔也會被合併，並且不同的 field 有各自的合併規則，請見文檔 [Merge configuration settings](https://gohugo.io/configuration/introduction/#merge-configuration-settings)。
