---
lastmod: '2026-08-15T04:09:57+08:00'
title: '認識 Hugo'
slug: introduction
weight: 1
---

[Hugo](https://gohugo.io/) 是以 Go 語言撰寫的靜態網站生成器 (SSG)，構建的靜態網站讓你免於煩惱伺服器的開銷和維護問題。Hugo 有諸多特色，速度只是其中一個，設定靈活、可規模化、可擴展性以及開箱即用都只是他的眾多優點之一。

Hugo 整合以下工具，也理所當然的繼承了他們的優點：

- [go html/template](https://pkg.go.dev/html/template)、[go text/template](https://pkg.go.dev/text/template) 模板系統
- [Goldmark](https://github.com/yuin/goldmark) Markdown 解析和轉換
- [esbuild](https://esbuild.github.io/) 高速打包 JS/TS
- [PostCSS](https://postcss.org/)、[Dart Sass](https://sass-lang.com/dart-sass/)、[TailwindCSS](https://tailwindcss.com/) 整合
- [libwebp](https://developers.google.com/speed/webp/docs/libwebp)、[libavif](https://github.com/aomediacodec/libavif) 影像處理，內建裁切、縮放、格式轉換
- [Chroma](https://github.com/alecthomas/chroma) 語法高亮
- [Pandoc](https://pandoc.org/) 文件格式轉換
- [AsciiDoc](https://asciidoctor.org/)、[reStructuredText](https://docutils.sourceforge.io/rst.html) 等其他標記語言支援

Hugo 的角色是整合工具，定義好資料怎麼流動以構建出完整網站。

## 特色

### 單一執行檔

Hugo 只有一個執行檔，沒有 JS 生態的依賴，這代表即使外部工具鏈（npm registry、Node 版本等）全部出問題，你的網站依然能正常構建。

### 速度

Hugo 使用 Go 編譯成單一二進位檔，構建速度是市面上數一數二快的 SSG，中大型網站（幾千篇文章）的完整構建時間通常是秒級。

### 可規模化

Hugo 的規模化已經過實戰驗證，例如 [V&A 博物館超過百萬頁的線上典藏](https://discourse.gohugo.io/t/v-a-explore-the-collections-over-1-million-pages-generated-by-hugo/33227)。

### 模板覆蓋（UFS 系統）

Hugo 可以在專案根目錄建立與主題相同路徑的檔案來覆蓋主題內容，這讓你能只修改需要客製化的部分，同時保留跟隨上游主題更新的能力，不需要 fork 整個主題。

### 整合現代前端

`js.Build` 讓 `assets/` 內可以用 import 語句導入 `node_modules` 套件，支援 TypeScript 與 ESM 模組。

### 成熟度

Hugo 已發展超過十年，許多開箱即用的功能（permalinks 設定、render segment、content adapter、UFS override 系統等）都相當完整，現成主題的數量也遠多於同類工具。

## 已知限制

在開始使用前，有幾件事值得先有心理準備：

- 前後端混雜：Hugo 使用 Go 開發的模板引擎，即使你只做前端網站，語法本身仍然是 Hugo 獨有的一套（例如加法要寫成 `{{ add 1 1 }}`），所有東西都需要查閱文檔。
- 無插件系統：Hugo 不支援插件擴充，功能限於內建整合的範圍內，超出範圍就需要自行處理，前端開發者也難以直接參與 Go 專案的貢獻。
- 版本穩定性：Hugo 至今仍是 0.x 版本，尚未發布穩定 1.0 版本。
- 維護規模較小：核心維護者人數極少，應評估依賴風險。

本社群文檔會著重在「理解」而不是複製重寫官方文檔，遇到需要參考完整選項的地方，會直接連回官方文檔，你可以自行查閱。
