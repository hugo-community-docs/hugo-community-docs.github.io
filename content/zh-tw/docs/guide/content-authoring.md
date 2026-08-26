---
title: '內容撰寫'
slug: content-authoring
weight: 300
---

延續上一篇建立的網站，本篇說明撰寫內容時會用到的 Markdown、front matter 與 shortcode。

## Front Matter

Front matter 是每個內容檔案開頭的區塊，記錄該篇內容的中繼資料，支援 TOML、YAML、JSON 三種格式，純粹以分隔符號區分：

- TOML：`+++` 包起來
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

frontmatter 的設定會覆蓋 `hugo.toml` 的設定；`params` 則是主題自訂設定，雖然主題設定不放在 `params` 底下 Hugo 也能讀取，但是建議永遠加上，這樣在遷移主題、網站管理上會更直觀清晰。

> [!TIP]
> 如果你對 TOML/YAML/JSON 全都不熟悉，那麼建議把 `hugo.toml` 轉 YAML 格式，這樣你只需要學習一種格式，而不是一次學兩種格式把自己搞糊塗了。

## Markdown

Hugo 遵循 [CommonMark](https://commonmark.org/) 規範解析 Markdown，如果不熟悉 Markdown 語法，可以參考 [Learn Markdown in Y minutes](https://learnxinyminutes.com/zh-cn/markdown/)，或在 [Playground](https://spec.commonmark.org/dingus/) 即時測試語法渲染結果。

Markdown 內容中也能直接寫 HTML，但預設會被移除，需要在 `hugo.toml` 開啟：

```toml
[markup.goldmark.renderer]
  unsafe = true
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

圖片的存放位置決定了引用它的方式。 Hugo 中有三個常用的存放位置：`assets/` 目錄、與內容檔案並列的「頁麵包」（page bundle），以及 `static/` 目錄。後續章節將詳細介紹完整的目錄結構；目前僅針對這三種位置引用圖像的方法做介紹：

- `assets/`

  圖片放在 `assets/img/`，透過 Hugo Pipes 處理後引用：

  ```markdown
  ![說明文字](/img/photo.png)
  ```

- `Page Bundle`

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
- Page bundle 方式的圖片在其他頁面難以取用，需要複雜的設定。

> [!INFO]
> 若圖片路徑解析失敗，則代表主題的 [image render hook](https://gohugo.io/render-hooks/images/) 邏輯錯誤，應回報給主題，或是自行啟用 `renderHooks.image.useEmbedded = always`。

## 文章引用

hugo-community-docs 建議一律使用包含副檔名的方式連結，比如 `[link](../post-1/index.md)`，因為這樣 IDE 才能夠補全、跳轉以及檢查錯誤的連結。

> [!INFO]
> 若連結路徑解析失敗，則代表主題的 [link render hook](https://gohugo.io/render-hooks/links/) 邏輯錯誤，應回報給主題，或是自行啟用 `renderHooks.link.useEmbedded = always`。

> [!TIP]
> 如要偵測連結正確性，可以再整合外部工具如 [rumdl](https://github.com/rvben/rumdl)，其 [MD057](https://rumdl.dev/md057/) 規則支援 Markdown 連結以及資產，以及絕對連結偵測和補全，是目前所有 Markdown linter 工具獨一檔的存在。

## Shortcode

Shortcode 是在 Markdown 內容中插入模板邏輯的方式，用來處理 Markdown 語法做不到的事，例如插入影片、建立 tabs、呼叫主題提供的元件。

例如插入 YouTube 影片：

```markdown
{{</* youtube id="dQw4w9WgXcQ" */>}}
```

{{< youtube id="dQw4w9WgXcQ" >}}

Shortcode 有兩種語法：`{{</*   */>}}` 與 `{{%/*   */%}}`。實務上約九成情況會用到 `{{</*   */>}}`，但具體哪個 shortcode 該用哪種語法取決於該 shortcode 的原始碼實作方式，請以主題或該 shortcode 作者提供的文件為準。

如果要在內容中直接顯示 shortcode 語法本身而不執行它，需要用 `{{</*/* */*/>}}` 包起來：

```markdown
{{</*/* youtube id="dQw4w9WgXcQ" */*/>}}
```
