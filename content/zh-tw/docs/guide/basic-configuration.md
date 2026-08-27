---
title: '基礎設定'
slug: basic-configuration
weight: 500
---

Hugo 的設定檔有上百個選項可以設定，初學者看到一定會非常迷惑，本文的目的是整理出 `hugo.yaml` 中最值得關注的設定，讓你不會在大量的設定中迷路。

## [baseURL](https://gohugo.io/configuration/all/#baseurl)

網站正式部署的網址，末尾需要有斜線：

```yaml
baseURL: 'https://example.com/'
```

## [locale](https://gohugo.io/configuration/all/#locale)

網站語言代碼，影響 RSS feed、HTML `lang` 屬性等輸出：

```yaml
locale: 'zh-TW'
```

> [!INFO]
> Hugo 文檔大量引用 RFC 5646，看似需要嚴格遵守大小寫規範，但是 Hugo 內部實際處理時，**所有語言字串都會被強制轉為小寫**，唯獨 locale 純粹只用於模板渲染完全不參與 Hugo 內部處理。這代表：
>
> 1. 只有 locale 應該用 `語言子標籤小寫-區域子標籤大寫`（zh-TW）的格式
> 2. 其餘所有語言設定永遠小寫以達成一致性，永遠不需額外考慮大小寫問題

## [title](https://gohugo.io/configuration/all/#title)

網站標題，多數主題會用在頁首、瀏覽器分頁標題：

```yaml
title: '我的網站'
```

## [theme](https://gohugo.io/configuration/all/#theme)

指定使用的主題，對應主題名稱（git submodule 方式）

```yaml
theme: ['ananke']
```

主題會在 `themes/anankee` 目錄中。

Hugo Modules 方式不使用 themes，以 modules 方式安裝

```yaml
module:
  imports:
    - path: github.com/gohugo-ananke/ananke
```

## [taxonomies](https://gohugo.io/configuration/taxonomies/)

自訂分類法，這個設定決定 Hugo 是否處理標籤，是否渲染標籤則由主題決定：

```yaml
taxonomies:
  tag: tags
  category: categories
```

## [pagination](https://gohugo.io/configuration/pagination/)

列表分頁的設定：

```yaml
pagination:
  pagerSize: 10  # 文章數量
  path: p        # 分頁路徑
```

## [menu](https://gohugo.io/configuration/menus/)

網站導覽選單，多數主題會讀取這個設定產生頁首或側欄連結：

```yaml
menus:
  main:
    - name: Home
      pageRef: /
      weight: 10
    - name: Posts
      pageRef: /posts
      weight: 20
```

- `name` 代表顯示的名稱
- `pageRef` 代表 [logical path](../concept/content-management.md#logical-path)
- `weight` 數字越小排序越前面
- 若指定目錄沒有被渲染，可嘗試新增 `identifier` field 解決
- `menu` 設定可以放到 `languages` 區塊底下以達成本地化，比如

  ```yaml
  languages:
    en-us:
      label: English
      locale: en-US
      weight: 1
      menus:
        main:
          - name: Home
            pageRef: /
            weight: 10
          - name: Posts
            pageRef: /posts
            weight: 20
    fr-fr:
      label: Français
      locale: fr-FR
      weight: 2
      menus:
        main:
          - name: Accueil
            pageRef: /
            weight: 10
          - name: Articles
            pageRef: /posts
            weight: 20
  ```

## params

主題自訂設定的區塊，內容完全由主題決定，請參考所使用主題的文件：

```yaml
params:
  showToc: true
```

`params` 和 `menus` 一樣可以被移動到 `languages.params` 以支援本地化，更多支援本地化的設定請見 [languages 文檔](https://gohugo.io/configuration/languages/#localized-settings)。

## [markup](https://gohugo.io/configuration/markup/)

### markup.goldmark

Hugo 內部負責轉換 Markdown 到 HTML 的是 [Goldmark](https://github.com/yuin/goldmark)，此設定用於指定細部轉換規則。

### [renderer unsafe](https://gohugo.io/configuration/markup/#rendererunsafe)

是否允許 Markdown 內容中的原始 HTML 被渲染，預設為 `false`：

```yaml
markup:
  goldmark:
    renderer:
      unsafe: true
```

未開啟時內容中的 HTML 標籤會被移除。

### [extensions typographer](https://gohugo.io/configuration/markup/#typographer)

設定 `...` `"` `'` 等符號渲染結果，預設會轉為 curly。

```yaml
markup:
  goldmark:
    extensions:
      typographer:
        apostrophe: "&rsquo;"
        disable: false
        ellipsis: "&hellip;"
        emDash: "&mdash;"
        enDash: "&ndash;"
        leftAngleQuote: "&laquo;"
        leftDoubleQuote: "&ldquo;"
        leftSingleQuote: "&lsquo;"
        rightAngleQuote: "&raquo;"
        rightDoubleQuote: "&rdquo;"
        rightSingleQuote: "&rsquo;"
```

## Permalinks

連結管理非常重要因此是獨立的一篇文章，請見[網址與路由](routing.md)。

## archetypes

archetypes 不在 `hugo.yaml` 的設定中，而是專案的其中一個目錄名稱。

他用於控制 `hugo new content` 建立的 Markdown 的預設內容，hugo-community-docs 建議移除 `draft: true`，避免只是因為忘記輸入 `-D` 旗標導致草稿頁面沒有構建，造成時間浪費除錯的問題。
