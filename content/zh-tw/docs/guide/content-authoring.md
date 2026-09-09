---
title: '內容撰寫'
slug: content-authoring
weight: 300
---

本篇說明撰寫文章內容會用到的相關知識，包含 content 目錄結構，Markdown、front matter 與 shortcode。

## Content 內容結構{#content-structure}

content 資料夾結構如下：

```sh
content
├── _index.md              # 1. 主頁
├── docs
│   ├── _index.md          # 2. Section：文章列表頁
│   ├── p1.md              # 3-1. Page：僅使用檔名
│   ├── p2                 # 3-2. Page：使用 index.md
│   │   ├── foo.jpg
│   │   └── index.md
│   └── bar
│       ├── _index.md      # Section：巢狀 section
│       ├── post-1.md
│       └── post-2.md
│
│
├── tags                   # 可選：分類法與詞條
│   ├── _index.md          # 4. Taxonomy：tags 列表頁
│   └── my-tag.md          # 5. Term：單一 tag 頁面（my-tag）
│
└── categories             # 可選：另一種分類法
    ├── _index.md          # Taxonomy：categories 列表頁
    └── tutorials.md       # Term：單一 category 頁面（tutorials）
```

### 主頁（Home）

主頁是最上層的 `_index.md`。

### Section

`_index.md` 代表列表頁，例如 `docs/_index.md` 是 `docs` 底下所有文章的列表頁，`docs/bar/_index.md` 則是巢狀 section 的列表頁。

### Page

文章頁面可以用 `filename.md` 或 `filename/index.md` 兩種形式，且不能有子頁面。

### Taxonomy

`tags/` 和 `categories/` 都是文章的分類法。這些目錄底下的 `_index.md` 同樣是列表頁，例如 `tags/_index.md` 是所有 tag 的列表頁。

非必要，若不存在實體檔案，Hugo 仍會自動建立對應的 HTML 檔案。

### Term

分類法目錄底下的其他頁面則是單一詞條頁面，例如 `tags/my-tag.md` 是 `my-tag` 這個 tag 的頁面，`categories/tutorials.md` 則是 `tutorials` 這個 category 的頁面。

非必要，若不存在實體檔案，Hugo 仍會自動建立對應的 HTML 檔案。

### `p1.md` 還是 `p2/index.md`？

`p1.md` 和 `p2/index.md` 都能建立獨立的文章，但只有後者能擁有自身的頁面資源，如圖片或影片。應該預設使用 `post-name/index.md` 形式以維持專案結構一致，除非遇到以下兩種情況：

1. 網站幾乎沒有圖片等資源內容。
2. 網站所有資源都統一放在 `assets` 目錄管理。

這兩種情況都用不到頁面資源，因此直接使用 `post.md` 更簡潔乾淨。

## Front Matter

Front matter 是每個內容檔案開頭的區塊，記錄該篇內容的中繼資料，支援 yaml、YAML、JSON 三種格式，純粹以分隔符號區分：

- yaml：`+++` 包起來
- YAML：`---` 包起來
- JSON：直接用 `{ }` 包起來

三者沒有差異功能擇一使用即可，但建議使用 YAML，因為多數工具預設支援 YAML，甚至只支援 YAML。

一個 YAML 格式的 Markdown front matter 看起來會是這樣：

```markdown {title="posts/article-1/index.md"}
---
title: '我的第一篇文章'
date: '2026-08-15T10:00:00+08:00'
lastmod: '2026-08-15T10:00:00+08:00'
draft: false
tags: ['hugo', '筆記']
params:
  showToc: true
---

這裡開始是文章正文。
```

常見欄位：

| 欄位 | 用途 |
| --- | --- |
| `title` | 標題 |
| `date` | 發布日期，**若日期是未來則需要 `-F` 旗標才會構建該文章** |
| `lastmod` | 最後修改日期 |
| `draft` | 草稿狀態，**若是 `true` 則需要 `-D` 旗標才會構建該文章** |
| `tags` / `categories` | 分類，依主題支援情況顯示 |
| `weight` | 手動排序權重 |
| `params` | 主題自訂設定，Hugo 核心不處理，完全交由主題模板讀取 |

frontmatter 的設定會覆蓋 `hugo.yaml` 的設定；`params` 則是主題自訂設定，雖然主題設定不放在 `params` 底下 Hugo 也能讀取，但是建議永遠加上，這樣在遷移主題、網站管理上會更直觀清晰。

## Markdown

Hugo 遵循 [CommonMark](https://commonmark.org/) 規範解析 Markdown，如果不熟悉 Markdown 語法，可以參考 [Learn Markdown in Y minutes](https://learnxinyminutes.com/zh-cn/markdown/)，或在 [Playground](https://spec.commonmark.org/dingus/) 即時測試語法渲染結果。

Markdown 內容中也能直接寫 HTML，但預設會被移除，需要在 `hugo.yaml` 開啟：

```yaml
markup:
  goldmark:
    renderer:
      unsafe: true
```

未開啟時 HTML 標籤會被移除。

另外，HTML 與前後的 Markdown 內容之間**必須有空行**，否則 Goldmark 會將該區塊視為純 HTML，不會解析其中的 Markdown 語法：

```markdown
<div>

這裡的 **粗體** 會被正確渲染。

</div>
```

```markdown
<div>
這裡的 **粗體** 不會被渲染，會直接輸出星號。
</div>
```

## 圖片引用{#referencing-images}

圖片的存放位置決定了引用它的方式。 Hugo 中有三個常用的存放位置：`assets/` 目錄、與內容檔案並列的頁面資源，以及 `static/` 目錄。後續章節將詳細介紹完整的目錄結構；目前僅針對這三種位置引用圖像的方法做介紹：

- `assets/`

  圖片放在 `assets/img/`，透過 Hugo Pipes 處理後引用：

  ```markdown
  ![說明文字](/img/photo.png)
  ```

- `頁面資源`

  圖片與內容檔案都放在 `content` 資料夾中的同一個目錄，以用相對路徑直接引用：

  ```markdown
  ![說明文字](foo.png)
  ```

- `static/`

  圖片放在 `static/foo.png`，會被原封不動複製到輸出目錄，需要用絕對路徑引用：

  ```markdown
  ![說明文字](/foo.png)
  ```

hugo-community-docs 建議將圖片應該放在 `assets/`：

- `static/` 的檔案不會經過任何處理，即使沒用到也會被輸出。
- `static/` 使用絕對路徑（`/foo.png`），網站部署到子目錄（例如 `example.com/blog/`）時，所有連結都要跟著調整；`assets/` 透過 Hugo 產生的連結會自動對應正確路徑，網站搬遷或改變部署路徑時不需要手動修改任何連結。
- `頁面資源` 目的是在自身頁面取用自身資源，其他頁面難以取用別的頁面的頁面資源。

> [!INFO]
> 若圖片路徑解析失敗，則代表主題的 [image render hook](https://gohugo.io/render-hooks/images/) 邏輯錯誤，應回報給主題，或是自行啟用 `renderHooks.image.useEmbedded = always`。

## 文章引用

hugo-community-docs 建議一律使用包含副檔名的方式連結，比如 `[link](../post-1/index.md)`，因為這樣 IDE 才能夠補全、跳轉以及檢查錯誤的連結。

> [!INFO]
> 若連結路徑解析失敗，則代表主題的 [link render hook](https://gohugo.io/render-hooks/links/) 邏輯錯誤，應回報給主題，或是自行啟用 `renderHooks.link.useEmbedded = always`。

## Shortcodes

Shortcode 是在 Markdown 內容中插入模板邏輯的方式，用來處理 Markdown 語法做不到的事，例如插入影片、建立 tabs、呼叫主題提供的元件。

例如插入 YouTube 影片：

```markdown
{{</* youtube id="dQw4w9WgXcQ" */>}}
```

{{< youtube id="dQw4w9WgXcQ" >}}

Shortcode 有兩種語法：`{{</*   */>}}` 與 `{{%/*   */%}}`。大部分情況會用到 `{{</*   */>}}`，但具體哪個 shortcode 該用哪種語法取決於該 shortcode 的原始碼實作方式，請以主題或該 shortcode 作者提供的文件為準。

如果要在內容中直接顯示 shortcode 語法本身而不執行它，需要用 `{{</*/* */*/>}}` 包起來：

```markdown
{{</*/* youtube id="dQw4w9WgXcQ" */*/>}}
```
