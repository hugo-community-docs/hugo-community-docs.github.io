---
title: '邏輯路徑'
slug: logical-path
weight: 200
---

Hugo 處理內容時，實際使用的是邏輯路徑（logical path），而不是檔案系統上的實體路徑。

## Logical Path

Logical path 代表內容在 `content` 目錄的對應路徑，是 Hugo 理解 `content` 目錄結構的方法，比如以下目錄結構：

```sh
content/
└── movies/
    ├── m1/
    │   └── index.md
    └── m2.md
```

對應到 Hugo 理解的 logical path 分別為 `/movies/m1` 和 `/movies/m2`。

邏輯路徑並不限於物理存在於 `content` 目錄下的檔案。 Hugo 也會為自動產生的頁面（例如分類法頁面和術語頁面）指派邏輯路徑。

## 為什麼重要

邏輯路徑用於設定 `hugo.toml`，如 menus 設定中使用 `pageRef` 設定 logical path，Hugo 才能夠知道對應的頁面，並且有能力調用相關的物件方法（Methods），舉例來說，[HasMenuCurrent](https://gohugo.io/methods/page/hasmenucurrent/) 可以判斷當前頁面是否屬於該 menu 頁面內部。
