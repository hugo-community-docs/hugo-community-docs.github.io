---
title: '邏輯路徑 Logical Path'
slug: logical-path
weight: 200
---

Hugo 處理內容時，實際使用的是邏輯路徑（logical path），而不是檔案系統上的實體路徑。

## Logical Path

Logical path 是 Hugo 理解 `content` 目錄結構的方法，比如以下目錄結構：

```sh
content/
└── movies/
    ├── m1/
    │   └── index.md
    └── m2.md
```

對應到 Hugo 理解的 logical path：

```sh
content/
└── movies/
    ├── m1
    └── m2
```

## 為什麼重要

邏輯路徑用於設定 `hugo.toml`，如 menus 設定中使用 `pageRef` 設定 logical path，Hugo 才能夠知道對應的頁面，並且有能力調用相關的物件方法（Methods），舉例來說，[HasMenuCurrent](https://gohugo.io/methods/page/hasmenucurrent/) 可以判斷當前頁面是否屬於該 menu 頁面內部。

對於普通用戶來說只需要知道怎麼將 `content` 路徑寫成對應的 logical path 就夠了，實際上，Hugo 的文章頁面是被註冊到一顆 radix tree 裡面，Hugo 依賴這個 radix tree 理解 content 結構，這顆樹的路徑就是 logical path，不是實體檔案路徑。
