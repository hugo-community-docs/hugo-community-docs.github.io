---
title: 'Page Bundle'
slug: page-bundle
weight: 300
description: 'Leaf bundle 與 branch bundle 的差異，以及何時該用 post/index.md 而非 post.md。'
---

本篇說明 Hugo 如何透過目錄結構區分內容類型。

## Leaf Bundle 與 Branch Bundle

`index.md` 與 `_index.md` 只差一個底線，代表的語意完全不同。

- Leaf bundle：目錄下是 `index.md`，代表獨立頁面，**不會再有子頁面**。

```text
  content/posts/my-post/
  ├── index.md
  └── cover.png
```

- Branch bundle：目錄下是 `_index.md`，代表區段，底下可以有子頁面或子區段。

```text
  content/posts/
  ├── _index.md
  └── my-post/
      ├── index.md
      └── cover.png
```

- Headless bundles：進階用途，主要目的在不發佈頁面的情況下，只發佈指定的頁面、資產，請見[文檔](https://gohugo.io/content-management/build-options/)。

## post/index.md 與 post.md

`post/index.md` 和 `post.md` 都可以建立獨立的文章，但是只有前者是 leaf bundle 可以擁有自身 bundle 的資源，如圖片或影片，後者不是 bundle，自然也無法擁有自身 bundle 的資源。

您應該永遠選擇 `post/index.md` 形式這樣專案結構才會統一，除非兩種情況：

1. 網站幾乎沒有圖片等資源
2. 網站資源規劃全部放到 `assets` 目錄

這兩種情況都用不到 bundle 資源，因此直接使用 `post.md` 顯然更乾淨簡潔。
