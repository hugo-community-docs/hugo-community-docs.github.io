---
title: '模板系統'
slug: templates
weight: 600
---

本篇說明 Hugo 如何決定每個頁面要套用哪個模板。

## Page Kind

Kind 決定內容在網站結構中的角色，對應 `content/` 的來源與 `layouts/` 的模板：

- `home`：網站首頁
- `section`：舊版稱作 `list`。區段列表頁
- `taxonomy`：某個分類法底下所有值的列表頁，如 `/tags/`。未提供對應內容檔案則由 Hugo 自動產生
- `term`：分類法底下單一詞條的頁面，如 `/tags/hugo/`。未提供對應內容檔案則由 Hugo 自動產生
- `page`：舊版稱作 `single`。單一內容頁面

對應的 `content/` 結構：

```text
content/
├── _index.md                    # home
├── posts/
│   ├── _index.md                # section
│   └── my-post/
│       └── index.md             # page (leaf bundle)
└── tags/
    ├── _index.md                # taxonomy（可選）
    └── hugo/
        └── index.md             # term（可選）
```

對應的 `layouts/` 結構：

```text
layouts/
├── home.html                    # home
├── section.html                 # section
├── taxonomy.html                # taxonomy
├── term.html                    # term
└── page.html                    # page
```

實際的[模板查找規則](https://gohugo.io/templates/new-templatesystem-overview/)遠比上述複雜，這裡僅列出最基礎的預設對應關係。

## Page Type

Type 預設值等於內容所在的目錄名稱，如 `content/movies/p1/index.md` 則 `type` 會被設定成 `movies`，可透過 front matter 的 `type` 欄位指定：

```markdown {title="content/movies/p1/index.md"}
---
title: '我的文章'
type: 'posts'
---
```

Kind 描述頁面在網站結構中的角色，type 進一步決定要套用哪一組模板。同樣是 `page` kind，`posts` 跟 `movies` 可以透過不同的 type 使用不同模板渲染，比如指定 movies 的模板：

```text
layouts/
├── movies
│   ├── page.html      # 專用的 page 模板
│   └── section.html   # 專用的 section 模板
├── home.html
├── section.html
├── taxonomy.html
├── term.html
└── page.html
```

## Layout

直接在 front matter 用 `layout` 欄位指定模板檔名：

```markdown
---
title: '我的文章'
layout: 'custom'
---
```

對應到

```text
layouts/
├── custom.html    # 使用 layout: custom 指定
├── home.html
├── section.html
├── taxonomy.html
├── term.html
└── page.html
```

layout 優先權高於依 kind／type 自動判斷的結果。

## 基礎模板

基礎模板是 `layouts/` 底下，非 `_partials` 以及 `_shortcodes` 目錄底下的 `.html` 檔案，用 Go template 語法撰寫，決定內容最終要如何呈現成 HTML。

```text
layouts/
├── baseof.html
├── page.html       # kind: page
├── page.html       # kind: page
├── home.html       # kind: home
├── section.html    # kind: section
├── taxonomy.html   # kind: taxonomy
├── term.html       # kind: term
├── _markup/        # 設定 Markdown 指定元素渲染
├── _shortcodes/    # 不是基礎模板
└── _partials/      # 不是基礎模板
```

其中 baseof 是所有模板的基礎，通常會使用 `{{ block "main" }}{{ end }}`，其他基礎模板則使用對應的 `{{ define "main" }}...{{ end }}`，就會填入 baseof 設定的 block main。

Hugo 渲染每個頁面時只關心這些基礎模板，`_partials` 只是可重用的區段，在基礎模板內被呼叫使用。

## 其餘基礎模板

Hugo 還有其他基礎模板但是較為次要因此放到這裡，包含

- [Sitemap](https://gohugo.io/templates/sitemap/)
- [RSS](https://gohugo.io/templates/rss/)
- [robots.txt](https://gohugo.io/templates/robots/)
- [404](https://gohugo.io/templates/404/)

## 查找順序

同一個頁面可能同時符合多個模板檔名，Hugo 會依照優先順序，挑選最符合的一個使用。優先順序大致如下（由高到低）：

1. front matter 手動指定的 `layout`
2. page kind（`home`、`section`、`taxonomy`、`term`、`page`）
3. 語言、輸出格式等其他條件
4. `all.html` 萬用模板

實際規則更複雜，這裡只提供最基礎的概念，完整規則請參考 [Hugo 官方模板查找文檔](https://gohugo.io/templates/new-templatesystem-overview/)。

## partials and template

`{{ template }}` 是 Go template 提供的 template 功能，只能直接渲染文字，沒有任何其他功能；`{{ partial }}` 則是 Hugo 在 template 的基礎包裝後提供的功能，有計數、回傳值、partialCache 等功能，基本上永遠使用 partial 即可。

## inline define

Hugo 除了以 `_partial` 檔案作為獨立 partial 呼叫以外，也支援 inline define 在行間定義模板。這通常用於將當前模板的部分內容抽出為子模板，但是不想或是沒必要新增獨立檔案的情況。注意 inline define 的模板是全局可見的。

實際使用範例如下：

```go-html-template
<!-- template -->
{{ define "foo" }}
foo
{{ end }}

{{ template "foo" }}

<!-- partial -->
{{ define "_partials/inline/foo.html" }}
foo
{{ end }}

{{ partial "inline/foo.html" }}
```

Hugo 初始化會首先掃描所有模板，因此 inline define 沒有順序問題。

## View

.Render 函式稱作 template [view](https://gohugo.io/templates/types/#view)，他的目的是透過模板查找系統自動讓 **partials** 使用對應路徑的版本。優點是系統自動對應不需手寫條件，缺點是只接受 current page 作為 context。

## Live reload 沒有自動更新

需在 `baseof.html` 最前面使用 `{{ $noop := partial "..." }}` 觸發更新機制。
