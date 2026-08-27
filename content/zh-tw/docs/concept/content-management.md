---
title: '內容管理'
slug: content-management
weight: 50
description: '本文介紹 Hugo content 目錄所有有關的內容。'
---

本文介紹與 content 目錄所有有關的內容。

<!--more-->

## Archetypes

Archetypes 是使用 `hugo new content` 指令建立新文章時，新文章的預設內容，支援使用函式或方法，比如

```yaml {title="archetypes/default.md"}
---
date: '{{ .Date }}'
title: '{{ .File.ContentBaseName }}'
---

... more
```

只要將該檔案放在 `archetypes/default.md` 即可。你也可以對各種頁面使用各自的預設值，詳細設定請見 [Archetypes 文檔](https://gohugo.io/content-management/archetypes/)。

## Page Bundle

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

- [Headless bundles](https://gohugo.io/content-management/build-options/)：進階用途，主要目的在不發佈頁面的情況下，只發佈指定的頁面、資產。

## Content 結構

一個典型的 content 資料夾結構如下：

```text
content
├── _index.md            # 1. 主頁
├── docs
│   ├── _index.md        # 2. 列表頁
│   ├── p1.md            # 3-1. 文章頁面：直接使用檔名
│   ├── p2               # 3-2. 文章頁面：使用 index.md
│   │   ├── foo.jpg
│   │   └── index.md
│   └── bar              # 深層頁面
│       ├── _index.md    # 深層頁面的列表頁
│       ├── post-1.md
│       └── post-2.md
└── tags
    ├── _index.md        # 4. 標籤頁面的列表頁
    └── my-tag.md        # 標籤頁
```

1. 主頁是放在最上層的 `_index.md`
2. 其餘帶有底線的 `_index.md` 都是列表頁
3. 文章頁面可以使用`檔名.md`，也可以使用`檔名/index.md`
4. 標籤頁的 `_index.md` 同樣代表列表頁

`p1.md` 和 `p2/index.md` 都可以建立獨立的文章，但是只有後者是 leaf bundle 可以擁有自身 bundle 的資源，如圖片或影片，後者不是 bundle，自然也無法擁有自身 bundle 的資源。

您應該永遠選擇 `post/index.md` 形式這樣專案結構才會統一，除非兩種情況：

1. 網站幾乎沒有圖片等資源
2. 網站資源規劃全部放到 `assets` 目錄

這兩種情況都用不到 bundle 資源，因此直接使用 `post.md` 顯然更乾淨簡潔。

## 引用文章和圖片

見[內容撰寫](../guide/content-authoring.md#referencing-images)的說明。

## Shortcode

見[內容撰寫](../guide/content-authoring.md#shortcodes)的說明。

## Summary and Description

在 Hugo 中兩者的差異為 Summary 能根據文章開頭自動生成，支援 HTML，而 Description 則是在 front matter 手動輸入，只支援字串。在實際網站中，完全看主題怎麼使用這兩個 API，這不是 Hugo 能決定的事情。

Summary 的自動生成可透過 `summaryLength` 控制，並且會保留、不截斷 `<p>` 標籤。也可以在 Markdown 中加入 `<!--more-->` 截斷，注意中間不可有空隔。

## 數學

Hugo 的 [passthrough render hook 結合 Katex 引擎](https://gohugo.io/functions/transform/tomath/)支援渲染數學式，但是實際上每個主題使用數學的方式不同，請見主題各自的文檔說明。

## 語法高亮

Hugo 使用 [Chroma](https://github.com/alecthomas/chroma) 完成語法高亮，有[多種不同主題](https://gohugo.io/quick-reference/syntax-highlighting-styles/#gallery)可選。由於語法高亮是 CSS 的問題，Hugo 不會知道主題怎麼實現的，具體如何設定應請教各自主題文檔。

## Markdown Attributes

Markdown attributes 是 Markdown 的擴充功能，讓你可以在 Markdown 裡面為目標元素注入 HTML 屬性提供更多控制。你需要在設定檔中啟用這個功能

```yaml {title="hugo.yaml"}
markup:
  goldmark:
    parser:
      attribute:
        block: true
        title: true
```

若主題有自訂 render hook，則需要該 render hook 有正確的實現 Markdown attributes 功能。以下是每個元素的語法：

**Heading**

```md
## H1{class="foo"}
```

**Paragraph**

```md
A Markdown paragraph.
{class="foo"}
```

**Table**

```md
| A | B |
| - | - |
| x | y |
{class="foo"}
```

**Codeblock**

`````md
```sh {class="foo"}
echo "Hello World"
```
`````

**Image**

```md
![foo](foo.jpg)
{class="foo"}
```

## 文章分類

Hugo 支援文章分類功能，核心是 `taxonomy` 和 `term`：

- `taxonomy` 代表分類的方式，比如 `/tags/` 表示這是 `tags` 分類方式
- `term` 代表該方式的每一個鍵，比如 `/tags/my-tag/` 中，`my-tag` 是 tags 的一個鍵

在 front matter 設定如下：

```md
---
title: Foo
tags:
  - Tag A
  - Tag B
---
```

Hugo 支援自訂更多分類方式，只需要在 `hugo.yaml` 設定 `taxonomies` 項目：

```yaml {title="hugo.yaml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
  film: films
```

設定時使用 `單數 = 複數` 格式命名分類學名稱。

## 文章作者

文章作者如何實現完全看主題各自的實現方式，應自行查看主題文檔。

Hugo 建議將作者視作一種文章分類的方式，這樣未來如果網站擴充為多作者時就能無痛切換，並且原生契合 Hugo 的內容組織方式，實際設定方式請見[多作者範例](https://discourse.gohugo.io/t/authors-taxonomy-to-handle-site-and-page-authors/56151)。

## 相關文章

對於一般部落格來說，相關文章的運作方式大致取決於兩篇文章的分類學是否吻合，其他變量都不好做控制，除了分類學以外，作為用戶能額外控制的只有[設定檔中不同項目的權重](https://gohugo.io/configuration/related-content/)。

詳細說明請見[相關文章運作](../faq.md#related-article)

## 邏輯路徑{#logical-path}

邏輯路徑 Logical path 代表內容在 `content` 目錄的對應路徑，是 Hugo 理解 `content` 目錄結構的方法，比如以下目錄結構：

```sh
content/
└── movies/
    ├── m1/
    │   └── index.md
    └── m2.md
```

對應到 Hugo 理解的 logical path 分別為 `/movies/m1` 和 `/movies/m2`。

邏輯路徑並不限於物理存在於 `content` 目錄下的檔案。 Hugo 也會為自動產生的頁面（例如分類法頁面和術語頁面）指派邏輯路徑。

作為用戶，邏輯路徑主要用途是設定 `hugo.yaml`，如 menus 設定中使用 `pageRef` 設定 logical path，Hugo 才能夠知道對應的頁面，並且有能力調用相關的物件方法，舉例來說，[HasMenuCurrent](https://gohugo.io/methods/page/hasmenucurrent/) 可以判斷當前頁面是否屬於該 menu 頁面內部。

作為開發者，和路徑相關的[大部分方法](https://gohugo.io/methods/page/path/#finding-pages)都使用邏輯路徑。

## 多語言網站

見[多語言網站](multilingual.md)。
