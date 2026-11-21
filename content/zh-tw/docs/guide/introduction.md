---
title: '認識 Hugo'
lastmod: '2026-11-21T17:20:00+08:00'
date: '2026-08-15T04:09:57+08:00'
slug: introduction
weight: 1
description: 理解 Hugo 是什麼、其核心元件、主要優勢，以及目前已知的限制。
---

[Hugo](https://gohugo.io/) 是以 Go 語言撰寫的靜態網站生成器 (SSG)，構建的靜態網站讓你免於煩惱伺服器的開銷和維護問題。

Hugo 的核心是 [Go html/template](https://pkg.go.dev/html/template) 模板系統，搭配 [Goldmark](https://github.com/yuin/goldmark) 解析和轉換 Markdown，以及內部的 [UFS](../concept/project-structure.md#ufs) 檔案系統。

## 特色

### 單一執行檔

Hugo 只有一個執行檔，這代表即使外部工具鏈（npm registry、Node 版本等）全部出問題，你的網站依然能正常構建。

### 速度和可規模化

Hugo 使用 Go 編譯成單一二進位檔，構建速度是市面上數一數二快的 SSG，中大型網站（幾千篇文章）的完整構建時間通常是秒級。

Hugo 的規模化已經過實戰驗證，例如 [V&A 博物館超過百萬頁的線上典藏](https://discourse.gohugo.io/t/v-a-explore-the-collections-over-1-million-pages-generated-by-hugo/33227)。

### 整合現代前端

`js.Build` 和 `css.Build` 基於 [esbuild](https://esbuild.github.io/)，支援導入 `node_modules` 套件，也支援 TypeScript 與 ESM 模組。

### 模板覆蓋（UFS 系統）

Hugo 可以在專案根目錄建立與主題相同路徑的檔案來覆蓋主題內容，這讓你能只修改需要客製化的部分，同時保留跟隨上游主題更新的能力，不需要 fork 整個主題。

### 成熟度

Hugo 已發展超過十年，許多開箱即用的功能（permalinks 設定、render segment、content adapter、UFS override 系統等）都相當完整，現成主題的數量也遠多於同類工具。

## 已知限制

開始使用前應該提前知道的限制：

- 前後端混雜：Hugo 使用模板引擎，語法是 Hugo 獨有的一套（例如加法要寫成 `{{ add 1 1 }}`），所有語法都需要查閱文檔。
- 無插件系統：Hugo 不支援插件擴充，功能限於內建整合的範圍內，也不支援在構建過程中調用外部指令。
- 版本穩定性：Hugo 至今仍是 0.x 版本，尚未發布穩定 1.0 版本。
