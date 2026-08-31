---
title: '資源處理'
slug: resources
weight: 300
---

`resource.Resource` 物件用於 Hugo 的資源處理。

## 建立

有多種方式可以建立 `resource.Resource` 物件，以全局函式來說有以下幾種方式：

- [resources.Get](https://gohugo.io/functions/resources/get/)
- [resources.GetMatch](https://gohugo.io/functions/resources/getmatch/)
- [resources.Match](https://gohugo.io/functions/resources/match/)
- [resources.ByType](https://gohugo.io/functions/resources/bytype/)

這四種方式用於取得 `assets` 目錄的資源，如果要取得當前頁面 bundle 的資源則需改成 `.Resources.Get` `.Resources.GetMatch` 等等。

除了內部資源，Hugo 也能使用 [resources.GetRemote](https://gohugo.io/functions/resources/getremote/) 在構建期間發送請求取得外部資源，或是 [resources.FromString](https://gohugo.io/functions/resources/fromstring/) 將變數作為資源處理。

## 使用

`resource.Resource` 物件建立後不會自動發佈，要將其發佈則需手動呼叫 `.RelPermalink` 和 `.Publish`。

以圖片為例：

```go-html-template
{{ with resources.Get "/img/foo.jpg" }}
  <img src={{ .RelPermalink }}>
{{ end }}
```

以 JS/CSS 為例：

```go-html-template
{{ with resources.Get "js/main.js" }}
  <script type="module" src="{{ .RelPermalink }}"></script>
{{ end }}

{{ with resources.Get "css/main.css" }}
  <link rel="stylesheet" href="{{ .RelPermalink }}">
{{ end -}}
```

以字體為例：

```go-html-template
{{ range resources.Match "font/**" }}
	{{ .Publish }}
{{ end }}
```

以變數為例：

```go-html-template
{{ $text := "console.log('Hello!');" }}
{{ $r := resources.FromString "generated.js" $text | fingerprint }}
<script src="{{ $r.RelPermalink }}" integrity="{{ $r.Data.Integrity }}"></script>
```

使用 `with` 語法避免檔案不存在時對 `nil` 呼叫 `.RelPermalink` 造成錯誤。如果想直接報錯，則不要使用 `with` 語法。

你也可以使用 [`.Content`](https://gohugo.io/methods/resource/content/) 方法直接印出資源內容。

## 複製

使用 `.RelPermalink` 和 `.Publish` 方法只能輸出到 Hugo 預設路徑，如果要自訂輸出路徑則需使用 [`resources.Copy`](https://gohugo.io/functions/resources/copy/) 函式。此函式完全在記憶體中操作，直到呼叫 `.RelPermalink` / `.Publish` 才會發佈檔案。

## 方法和函式

方法是物件自帶的功能，函式則無關物件。`resource.Resource` 物件自帶的方法請見 [Methods/Resource](https://gohugo.io/methods/resource/)，能使用在 `resource.Resource` 物件的函式則包含以下：

- 圖片專用：[Functions/Images](https://gohugo.io/functions/images/)
- JS 專用：[Functions/js](https://gohugo.io/functions/js/)
- CSS 專用：[Functions/css](https://gohugo.io/functions/css/)
- 檢查變數類型：[Functions/reflect](https://gohugo.io/functions/reflect/)

## js.Build 和 css.Build

這兩個功能由 [esbuild](https://github.com/evanw/esbuild) 提供，讓你使用更現代的方式處理資源，比如支援檔案之間互相 import，自動 import node_modules 套件，或者從模板中輸入變數傳到 JS/CSS 中。

具體使用方式由於官方文檔已經很完善，這裡就不再重複撰寫。

- [js.Build](https://gohugo.io/functions/js/build/)
- [css.Build](https://gohugo.io/functions/css/build/)

## 合併資源

[resources.Concat](https://gohugo.io/functions/resources/concat/) 用於合併資源。如果是 JS/CSS 檔案，建議直接使用 `js.Build` / `css.Build` 即可，沒有必要使用此函式。

## 將資源以模板渲染

[resources.ExecuteAsTemplate](https://gohugo.io/functions/resources/executeastemplate/) 將資源內容視為 Go template 解析並執行，回傳執行結果作為新資源。CSS、JS 等原本不經模板引擎處理的檔案，也能因此使用 `{{ }}` 語法取用變數。

**語法**

```text
resources.ExecuteAsTemplate TARGETPATH CONTEXT RESOURCE
```

TARGETPATH 是輸出路徑；CONTEXT 決定模板內 `.` 所代表的上下文；RESOURCE 為來源資源。
以 CSS 為例：

```go-html-template {title="assets/css/theme.css"}
:root {
  --accent-color: {{ site.Params.accentColor | default "red" }};
}
```

```go-html-template
{{ with resources.Get "css/theme.css" }}
  {{ with resources.ExecuteAsTemplate "css/theme.css" $ . }}
    <link rel="stylesheet" href="{{ .RelPermalink }}">
  {{ end }}
{{ end }}
```

這裡的 `$` 等同目前頁面，檔案輸出到 `public/css/theme.css`。

也可以搭配 `resources.FromString` 先將字串轉為資源，再交給 `resources.ExecuteAsTemplate` 執行：

```go-html-template
{{ $tmpl := `:root { --accent-color: {{ site.Params.accentColor | default "red" }}; }` }}
{{ $r := resources.FromString "inline.css" $tmpl }}
{{ $r = resources.ExecuteAsTemplate "inline.css" . $r }}
{{ $r.Publish }}
```

檔案輸出到 `public/inline.css`。

或是反過來，先取出內容再進行字串操作：

```go-html-template
{{ $r := resources.Get "css/theme.css" }}
{{ $r = resources.ExecuteAsTemplate "path" . $r }}
{{ $s := $r.Content }}

{{/* 現在可以對 $s 進行字串操作 */}}
{{ $s = replace $s "accent-color" "brand-color" -}}

{{ $final := resources.FromString "css/theme.css" $s | minify }}
{{ $final.Publish }}
```

檔案輸出到 `public/css/theme.min.css`。

## 重要功能

- 壓縮資源：[resources.Minify](https://gohugo.io/functions/resources/minify/)
- 計算指紋：[resources.Fingerprint](https://gohugo.io/functions/resources/fingerprint/)
- try-except 語法：[try](https://gohugo.io/functions/go-template/try/)

## 快取

Hugo 會對資源快取避免重複計算。在單一次構建中，計算結果會被快取到記憶體，下次直接取用無須重複計算；在多次構建中，計算結果會被快取到檔案，下次構建則無須重複計算，除非使用 `--ignoreCache` 旗標。

## 複習

結束前複習本文的重點內容。

**取得資源**：內部資源用 `resources.Get`、`resources.GetMatch`、`resources.Match`、`resources.ByType`，頁面 bundle 資源則改用 `.Resources` 系列方法；外部資源用 `resources.GetRemote`；字串轉資源用 `resources.FromString`。

**使用資源**：資源建立後不會自動發佈，需呼叫 `.RelPermalink` 或 `.Publish` 才會輸出；搭配 `with` 語法可避免資源不存在時對 `nil` 呼叫方法而報錯；`.Content` 可直接取用資源內容。

**複製資源**：預設輸出路徑由 Hugo 決定，若需自訂路徑則用 `resources.Copy`，此函式同樣是延遲到呼叫 `.RelPermalink` 或 `.Publish` 時才真正發佈。

**方法與函式**：方法綁定在 `resource.Resource` 物件上，函式則與物件無關；圖片、JS、CSS 各有專屬函式集合，另有 `reflect` 系列函式可檢查變數類型。

**資源處理**：`js.Build` 與 `css.Build` 基於 esbuild，支援檔案間 import、自動載入 node_modules、模板變數注入；`resources.ExecuteAsTemplate` 將資源內容視為模板解析執行；`resources.Minify` 用於壓縮，`resources.Fingerprint` 用於計算指紋；`try` 提供 try-except 語法處理錯誤。

**快取**：單次構建內快取於記憶體，跨構建則快取於檔案，除非使用 `--ignoreCache` 旗標，否則不會重複計算。

## 文檔參照

以下是 Hugo 官方文檔中所有和 resource 處理有關的內容：

- https://gohugo.io/hugo-pipes/
- https://gohugo.io/functions/resources/
- https://gohugo.io/functions/images/
- https://gohugo.io/methods/resource/
- https://gohugo.io/functions/reflect/
