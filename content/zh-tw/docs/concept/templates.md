---
title: '模板系統'
slug: templates
weight: 600
---

本文介紹 Hugo 的模板查找機制，查找機制決定每個頁面該套用哪個模板，主要由三個因素決定：page kind、page type，以及 front matter 手動指定的 layout。

## Page Kind

Hugo 定義了以下五種 kind：

- `home`：網站首頁
- `page`：單一內容頁面，舊版稱作 `single`
- `section`：區段列表頁，舊版稱作 `list`
- `taxonomy`：某個分類法（taxonomy）底下所有詞條（term）的列表頁，例如 `/tags/`。若未提供對應的內容檔案，Hugo 會自動產生
- `term`：分類法底下單一詞條的頁面，例如 `/tags/hugo/`。若未提供對應的內容檔案，Hugo 會自動產生

`content/` 目錄結構與 page kind 的對應關係：

```text
content/
├── _index.md                    # home
├── posts/
│   ├── _index.md                # section
│   └── my-post/
│       └── index.md             # page
└── tags/
    ├── _index.md                # taxonomy（可選）
    └── hugo/
        └── index.md             # term（可選）
```

`layouts/` 目錄結構與 page kind 的預設對應關係：

```text
layouts/
├── home.html                    # home
├── section.html                 # section
├── taxonomy.html                # taxonomy
├── term.html                    # term
└── page.html                    # page
```

## Page Type

決定 page kind 之後，Hugo 接著會判斷 page type，用來決定同一種 kind 底下要套用哪一組模板。

舉例來說，同樣是 `page` kind，`content/posts/` 與 `content/movies/` 底下的文章，可以透過不同的 type 套用不同模板：

```text
layouts/
├── movies/
│   ├── page.html      # movies 專用的 page 模板
│   └── section.html   # movies 專用的 section 模板
├── home.html
├── section.html
├── taxonomy.html
├── term.html
└── page.html
```

Type 的預設值等於內容所在的目錄名稱。例如 `content/movies/p1/index.md` 的 type 會預設為 `movies`。你也可以透過 front matter 的 `type` 欄位手動指定：

```markdown {title="content/movies/p1/index.md"}
---
title: '我的文章'
type: 'posts'
---
```

## Layout

除了 kind 與 type，你也可以直接在 front matter 用 `layout` 欄位指定模板檔名：

```markdown
---
title: '我的文章'
layout: 'custom'
---
```

這會對應到：

```text
layouts/
├── custom.html    # 由 layout: custom 指定
├── home.html
├── section.html
├── taxonomy.html
├── term.html
└── page.html
```

`layout` 欄位的優先權高於依 kind 或 type 自動判斷的結果。

> [!TIP]
> 三種分類方式的簡單理解：
>
> 1. page kind 判斷頁面類型，例如標籤頁或一般文章頁
> 2. page type 進一步細分，讓不同 type 套用不同模板
> 3. layout 由 front matter 手動指定，適合 about、privacy 這類獨立頁面

## 模板分類

本段落介紹 `layouts` 目錄底下的模板分類，包含基礎模板、頁面模板等重要內容。

### 基礎模板{#base-template}

基礎模板就是 `baseof.html`，是所有頁面模板共用的外層架構，通常定義 `html`、`head`、`body` 等共通結構，以維持一致性，讓網站更容易維護。

基礎模板中通常會使用 [block](https://gohugo.io/functions/go-template/block/) 函數，當符合條件時，block 函數就會使用[頁面模板](#page-template)中的指定區塊渲染，條件為：

- 頁面模板需包含 `define`
- 頁面模板不能包含能直接被渲染的內容

若不符合條件，基礎模板會被忽略，該檔案直接使用頁面模板渲染。基礎模板和頁面模板的使用範例如下：

{{% tabs %}}
  {{< tab label="正確" >}}

```go-html-template {title="layouts/baseof.html"}
<!DOCTYPE html>
<html lang="{{ site.Language.Locale }}">
<body>
  <main>
    {{ block "main" . }}
      這段內容會被套用此基礎模板的頁面模板中，
      對應的 define "main" 取代。
    {{ end }}
  </main>
</body>
</html>
```  

```go-html-template {title="layouts/home.html"}
{{ define "main" }}
  這段內容會取代基礎模板裡的 block "main"。
  {{ template "inlineTemplate" }}
{{ end }}

{{/* 只允許空白、註解放在外部 */}}

{{ define "inlineTemplate" }}
  Inline define 是被允許的，因為它不會被直接渲染。
{{ end }}
```

  {{< /tab >}}

  {{< tab label="錯誤" >}}

layouts/baseof.html 和正確版本相同，但是頁面模板包含可以被直接渲染的文字。

```go-html-template {title="layouts/home.html"}
{{ define "main" }}
  這段內容無法取代 block，因為下方多了可直接渲染的內容（<!-- Foo -->），
  導致 home 頁面不會套用 baseof.html，模板顯示空白。
{{ end }}

<!-- Foo -->
```

  {{< /tab >}}
{{% /tabs %}}

### 頁面模板{#page-template}

頁面模板與 page kind 一一對應，常見的頁面模板包括：

```text
layouts/
├── baseof.html
├── page.html       # kind: page
├── home.html       # kind: home
├── section.html    # kind: section
├── taxonomy.html   # kind: taxonomy
├── term.html       # kind: term
├── single.html     # page 的後備模板
├── list.html       # home / section / taxonomy / term 的後備模板
├── all.html        # 所有頁面模板的最終後備模板
├── _markup/        # 設定 Markdown 元素的渲染方式（render hook）
├── _shortcodes/    # 供內容頁面呼叫，不屬於頁面模板
└── _partials/      # 可重用區段，不屬於頁面模板
```

其中：

- single 是 page 模板的後備選項
- list 是 home、section、taxonomy、term 模板的後備選項
- all 是所有頁面模板的後備選項

### 其他模板

除了頁面模板，Hugo 還包含下列用途較特定的模板類型：

- [Sitemap](https://gohugo.io/templates/sitemap/)：網站地圖
- [RSS](https://gohugo.io/templates/rss/)：訂閱資訊
- [robots.txt](https://gohugo.io/templates/robots/)：搜尋引擎爬蟲規則
- [404](https://gohugo.io/templates/404/)：找不到頁面時顯示的內容

### Render hook

Render hook 讓你自訂 Markdown 指定元素轉換成 HTML 的方式，例如自訂圖片、連結、標題等元素的輸出結果。Render hook 放在 `_markup/` 目錄下，支援以下類型：

- [Blockquote](https://gohugo.io/render-hooks/blockquotes/)
- [Code block](https://gohugo.io/render-hooks/code-blocks/)
- [Heading](https://gohugo.io/render-hooks/headings/)
- [Image](https://gohugo.io/render-hooks/images/)
- [Link](https://gohugo.io/render-hooks/links/)
- [Passthrough element](https://gohugo.io/render-hooks/passthrough/)
- [Table](https://gohugo.io/render-hooks/tables/)

### _partials 目錄

`layouts/_partials` 底下放可重用的模板片段，用 `partial` 函數呼叫。以渲染 `layouts/_partials/head.html` 為例：

```go-html-template
{{ partial "head.html" . }}
```

第一個參數是模板名稱，二個參數（`.`）是傳入的 context。

### _shortcodes 目錄

`layouts/_shortcodes` 底下放供 Markdown 呼叫的模板，用於在 Markdown 內容裡插入結構化元件，例如嵌入音訊、影片，或其他 HTML 區塊。

例如以下 shortcode 渲染一個音訊播放器：

```go-html-template {title="layouts/_shortcodes/audio.html"}
{{ with resources.Get (.Get "src") }}
  <audio controls preload="auto" src="{{ .RelPermalink }}"></audio>
{{ end }}
```

在 Markdown 裡呼叫：

```md {title="content/example.md"}
{{</* audio src="/audio/test.mp3" */>}}
```

### View

[View](https://gohugo.io/templates/types/#view) 模板用於自動在不同頁面使用不同的 `partial` 模板，而不是和 `partial` 一樣以指定的固定模板渲染。

View 模板必須以 `.Render` 渲染，查找規則與 Hugo 的[模板查找順序](#lookup-order)相同。

## 查找順序{#lookup-order}

最基礎的優先級判斷如下：

1. front matter 手動指定的 `layout`
2. 對應 page kind 的專用模板（home、section、taxonomy、term、page）
3. page 的後備模板 `single`，或 home / section / taxonomy / term 的後備模板 `list`
4. `all.html` 最終後備模板

這是只使用基礎概念的範例，實際上 Hugo 支援更複雜的查找規則：檔名可以用 `.` 分隔條件，且模板放置的目錄深度同樣會影響優先權。以下分別說明。

### 以 `.` 分隔條件{#conditional-template}

使用 `.` 分隔的檔名讓模板能同時過濾多個條件，包含語言、輸出格式、page kind 等等，在檔名中用 `.` 分隔各項條件即可：

```text
home.rss.xml           → 只用於首頁的 RSS 輸出
section.de.html        → 只用於德語的 section 頁面

baseof.section.de.html → 只用於德語的 section 頁面的 baseof 基礎模板
```

條件包含

- language: 語言
- role: 角色（見 [Sites Matrix](sites-matrix.md)）
- version: 版本（見 [Sites Matrix](sites-matrix.md)）
- outputformat: [輸出格式](https://gohugo.io/configuration/output-formats/)，如自訂 JSON 輸出
- mediatype: [媒體類型](https://gohugo.io/configuration/output-formats/)
- kind: 種類
- type: 類型
- layout: 佈局

在 [v0.161.0](https://github.com/gohugoio/hugo/releases/tag/v0.161.0) 之後，你也可以用更精確的方式標記，比如 `home._outputformat_rss_.xml`、`section._language_de_.html`、`baseof._kind_section_._language_de_.html`。

不同模板支援的條件類型如下：

| 模板類型                   | Page Kind | 輸出格式 | 語言 | 路徑深度 |
|----------------------------|:---------:|:--------:|:----:|:--------:|
| [基礎模板](#base-template) | 支援      | 支援     | 支援 | 支援     |
| [頁面模板](#page-template) | 支援      | 支援     | 支援 | 支援     |
| Render hook                | ❌        | 支援     | 支援 | 支援     |
| Shortcode                  | ❌        | 支援     | 支援 | ❌       |
| Partial                    | ❌        | ❌       | ❌   | ❌       |
| View                       | ❌        | ❌       | ❌   | ❌       |

路徑深度請見下方說明。

### 路徑深度{#path-distance}

路徑匹配越接近目前渲染的內容，優先權越高，且**路徑深度的優先權高於檔名條件**，只有當兩者路徑距離相同時，才會回頭比較檔名條件的比對結果。

例如同時存在 `layouts/movies/page.html` 與 `layouts/page.de.html`，渲染 `content/movies/` 底下的德語頁面時，`page.de.html` 雖然多比對了語言，但 `movies/page.html` 路徑更接近，Hugo 仍優先選擇 `movies/page.html`。

## 一個完整網站的範例

以下用兩個範例，展示本篇介紹的所有模板類型在實際專案中會如何組合出現。

### 簡單網站

最基礎的網站只需要一個基礎模板，搭配每種 page kind 各一份頁面模板。

```text
layouts/
├── baseof.html
├── home.html
├── page.html
├── section.html
├── taxonomy.html
├── term.html
├── _markup/
│   └── render-image.html
├── _partials/
│   ├── header.html
│   └── footer.html
└── _shortcodes/
    └── audio.html
```

### 複雜網站

規模較大的網站，可能需要針對特定 type 或 section 使用專屬模板與 render hook，用 view 依情境渲染同一批內容的不同呈現方式。

```text
layouts/
├── baseof.html
├── home.html
├── page.html
├── section.html
├── taxonomy.html
├── term.html
├── all.html
├── custom.html
├── movies/
│   ├── page.html
│   ├── section.html
│   ├── _markup/
│   │   └── render-image.html
│   └── action/
│       ├── page.html
│       └── _markup/
│           └── render-image.html
├── films/
│   ├── _views/
│   │   └── card.html
│   ├── page.html
│   └── section.html
├── _markup/
│   └── render-image.html
├── _partials/
│   ├── header.html
│   └── footer.html
└── _shortcodes/
    └── audio.html
```

## Partial 與 Template

`{{ template }}` 是 Go template 提供的 template 功能，只能直接渲染文字，沒有任何其他功能。`{{ partial }}` 則是 Hugo 在 template 的基礎包裝後提供的功能，額外支援計數、回傳值、`partialCache` 等功能。

應選擇 partial 而不是原生的 template。

## Inline Define

除了放在 `_partials` 目錄的獨立檔案，Hugo 也支援在模板內直接用 inline define 定義子模板，適合在不想額外建立檔案、只是要把當前模板裡的一小段內容抽離出來時採用。實際使用範例如下：

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

Hugo 初始化時會先掃描所有模板，因此 inline define 沒有順序問題。inline define 定義的模板名稱是全域可見的，需注意命名問題。

## Live Reload 未自動觸發更新

某些情況下（例如模板只透過 partial 間接引用資料時），修改內容後 Hugo 的 live reload 不會自動偵測到變更。若遇到這種情況，可以在 `baseof.html` 最前面加上以下這行，強制觸發更新機制：

```go-html-template {title="layouts/baseof.html"}
{{ $noop := partial "..." }}
```
