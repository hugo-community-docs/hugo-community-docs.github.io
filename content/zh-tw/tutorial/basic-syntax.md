---
title: '基礎語法'
slug: basic-syntax
weight: 200
---

延續前一篇的範例網站，全部寫在 `layouts/home.html`。

## 計算和比較

Hugo 沒有 `+`、`<` 這些符號，比較需用函式呼叫。

```go-html-template
{{ add 1 1 }}
{{ sub 2 1}}
{{ mul 2 2 }}
{{ div 4 2}}
{{ eq 1 1 }}
{{ ne 1 2 }}
{{ lt 1 2 }}
{{ le 2 2 }}
{{ gt 3 2 }}
{{ ge 2 2 }}
```

```text
2
1
4
2
true
true
true
true
true
true
```

## if / else if / else

基本的 if-else 語法。false、空字串、`0`、`nil`、空 slice、空字典都是 falsy value。

```go-html-template {title="layouts/home.html"}
{{ $x := 7 }}
{{ if eq $x 6 }}
  <p>是 6</p>
{{ else if eq $x 7 }}
  <p>是 7</p>
{{ else }}
  <p>其他</p>
{{ end }}
```

```html
<p>是 7</p>
```

## with / else with

`if` 只判斷條件，不改變上下文，`with` 判斷條件之外，還把上下文換成該值本身。

```go-html-template {title="layouts/home.html"}
{{ $v1 := "" }}
{{ $v2 := "橘子" }}
{{ with $v1 }}
  <p>{{ . }}</p>
{{ else with $v2 }}
  <p>{{ . }}</p>
{{ else }}
  <p>都是空的</p>
{{ end }}
```

```html
<p>橘子</p>
```

## and / or / not

邏輯判斷。

```go-html-template
{{ and true false }}
{{ or true false }}
{{ not false }}
```

```text
false
true
true
```

## range

range 等同於 for loop，Hugo 只有 for loop 沒有 while loop。

```go-html-template {title="layouts/home.html"}
{{ range slice "蘋果" "香蕉" "橘子" }}
  <p>{{ . }}</p>
{{ end }}
```

```html
<p>蘋果</p>
<p>香蕉</p>
<p>橘子</p>
```

或是包含計數索引

```go-html-template {title="layouts/home.html"}
{{ range $idx, $val := slice "蘋果" "香蕉" "橘子" }}
  <p>{{ $idx }}: {{ $val }}</p>
{{ end }}
```

```html
<p>0: 蘋果</p>
<p>1: 香蕉</p>
<p>2: 橘子</p>
```

## break / continue

`continue` 讓迴圈跳過該次循環，`break` 終止迴圈。

```go-html-template {title="layouts/home.html"}
{{ range slice "蘋果" "香蕉" "橘子" }}
  {{ if eq . "香蕉" }}
    {{ continue }}
  {{ end }}
  {{ if eq . "橘子" }}
    {{ break }}
  {{ end }}
  <p>{{ . }}</p>
{{ end }}
```

```html
<p>蘋果</p>
```

## slice

slice 是一個列表，使用 index 取出元素，使用 len 取出長度。

```go-html-template
{{ $s := slice 1 2 3 4 5 6 7 8 9 10 }}
{{ index $s 0 }}
{{ len $s }}
```

```text
1
10
```

如要取範圍區間，可以使用 after/first 方式

```go-html-template
{{ $s | first 5 | after 2 }}
```

```text
[3 4 5]
```

## seq

建立列表，`seq N` 產生 `1` 到 `N` 的整數列表，`seq A B` 產生 `A` 到 `B`。

```go-html-template
{{ range seq 3 }}{{ . }}{{ end }}
{{ range seq 2 5 }}{{ . }}{{ end }}
```

```text
123
2345
```

## dict

dict（map）是一個鍵值對（key-value pair），鍵可以用點語法直接取值，效果跟 `index` 相同。

```go-html-template
{{ $person := dict "name" "John" "age" 20 }}
{{ index $person "name" }}
{{ $person.name }}
```

```text
John
John
```

取用不存在的鍵不會報錯。

## cast

變數型別轉換。

```go-html-template
{{ $s := "42" }}
{{ $n := cast.ToInt $s }}
{{ add $n 8 }}
```

```text
50
```

`add "42" 8` 會拋出型別錯誤，因為 `add` 要求兩個運算元都是數字，字串必須先用 `cast.ToInt` 轉型。

## partial 與 return

partial 呼叫模板檔案。

**語法**

```text
{{ partial LAYOUT CONTEXT }}
```

**描述**

partial 是獨立的模板檔案。用 `partial` 函式呼叫模板（LAYOUT）時，CONTEXT 會成為該檔案裡的 `.`。

```go-html-template {title="layouts/_partials/price-tag.html"}
{{ if lt . 100 }}
  <span>特價</span>
{{ else }}
  <span>原價</span>
{{ end }}
```

```go-html-template
{{ partial "price-tag.html" 80 }}
```

```html
<span>特價</span>
```

若模板中沒有 `return`，Hugo 會將模板渲染為 HTML。若有 `return`，Hugo 則回傳該值：

```go-html-template {title="layouts/_partials/is-cheap.html"}
{{ return lt . 100 }}
```

```go-html-template
{{ $cheap := partial "is-cheap.html" 80 }}
{{ print $cheap }}
```

```html
true
```

在 Hugo v0.165.0 之前，一個 partial 只能有一個 `return`。[#15215](https://github.com/gohugoio/hugo/pull/15215) 之後（預計於 v0.166.0 發布），partial 可以有多個 `return`，也支援提前回傳（early return）。

**傳入多個值**

`partial` 只接收一個 CONTEXT 參數。若需要同時傳入重量和城市，用 `dict` 將兩者包成一個值：

```go-html-template {title="layouts/_partials/shipping-note.html"}
{{ if ge .weight 5 }}
  <p>{{ .city }}：超重加收運費</p>
{{ else }}
  <p>{{ .city }}：一般運費</p>
{{ end }}
```

```go-html-template
{{ partial "shipping-note.html" (dict "weight" 6 "city" "新竹") }}
```

```html
<p>新竹：超重加收運費</p>
```

`.weight` 與 `.city` 對應呼叫時 `dict` 裡的鍵。

**就地定義**

用 `define` 可將 partial 直接寫在呼叫它的模板裡：

```go-html-template
{{ partial "inline" 21 }}

{{ define "_partials/inline/double" }}
  {{ mul . 2 }}
{{ end }}
```

```text
42
```

Hugo 在渲染前會先掃描所有可用模板，因此就地定義沒有先後順序的限制。就地定義的模板全站皆可呼叫。

## 模板間傳值

模板之間只能透過 `{{ partial "foo.html" CONTEXT }}` 傳遞的 CONTEXT 傳值，或是使用 [`.Store`](#store)：用 `.Store.Set` 設定值，用 `.Store.Get` 取值。

## partialCached 快取模板

partialCached 呼叫模板並快取其輸出結果。

**語法**

```text
{{ partialCached LAYOUT CONTEXT [KEY1 KEY2 KEY3 ...] }}
```

**描述**

當 LAYOUT 的輸出結果重複，且渲染該模板已構成效能瓶頸時，可用 `partialCached` 取代 `partial`，將輸出結果快取起來，避免重複計算。

KEY1、KEY2、KEY3……為選填的額外快取鍵（cache key），用來讓同一個 LAYOUT 依不同條件產生多組快取結果。額外的快取鍵不參與模板本身的計算，僅作為區分快取結果之用；其數量可為零個或多個。

若未指定任何額外快取鍵，快取鍵即為 LAYOUT 本身（也就是該 partial 的名稱）。

> [!WARNING] 平行渲染
> Hugo 平行渲染多個頁面。第一次呼叫某個快取鍵時，Hugo 尚未完成該快取鍵的儲存，因此在此之前平行執行的其他頁面仍會各自重新渲染同一個模板。快取鍵儲存完成後，後續呼叫才會直接使用快取結果。

> [!INFO]
> 每個 site 的快取各自獨立。

## .Store

前面介紹的都是函式 function，`.Store` 則是方法 method，方法是需要綁定在物件上的，因此可以看到有 `.` 存在。

`.Store` 用於將內容儲存在目標物件上，用於在模板間傳值。`.Store` 可以在以下幾個物件中被呼叫：

| 作用域      | 使用方式                                            |
|-------------|---------------------------------------------------- |
| 全站        | [hugo.Store][hugo.Store]                            |
| 當前站[^1]  | [SITE.Store][SITE.Store]                            |
| 當前頁面    | [PAGE.Store][PAGE.Store]                            |
| 短碼        | [SHORTCODE.Store][SHORTCODE.Store]                  |
| 區域變數    | [collections.NewScratch][collections.NewScratch]    |

[^1]: 當前站的意思請見 [Sites Matrix](../docs/concept/sites-matrix.md) 說明。

[hugo.Store]: https://gohugo.io/functions/hugo/store/
[SITE.Store]: https://gohugo.io/methods/site/store/
[PAGE.Store]: https://gohugo.io/methods/page/store/
[SHORTCODE.Store]: https://gohugo.io/methods/shortcode/store/
[collections.NewScratch]: https://gohugo.io/functions/collections/newscratch/

`.Store` 有順序關係，若呼叫 `.Get` 之前尚未呼叫過 `.Store`，`.Get` 自然沒有值。

`.Store` 內容的生命週期是整個程式週期，不會因為當前頁面渲染結束就被回收。

`.Store` 本身有眾多 method 可調用，所有 `.Store` 的方法都相同，只是 `.Store` 綁定的物件不同。

**Example: 頁面初始化**

若頁面有繁瑣的初始化，且多個模板都需要用到初始化後的結果，可以在 baseof.html 最前面初始化，並且以 `.Page.Store` 儲存，就能在每個 partial 模板取用 `.Store` 結果。

{{% tabs %}}
  {{< tab label="baseof.html 呼叫" >}}

```go-html-template {title="layouts/baseof.html"}
<!doctype html>
{{- partial "init.html" . -}}
<html>
  ...
</html>
```

  {{< /tab >}}

  {{< tab label="init.html 初始化" >}}

```go-html-template {title="layouts/_partials/init.html"}
{{- with resource.Get "..." -}}
  {{- ... -}}
  {{- .Page.Store.Set "key" ... -}}
{{- end -}}
```

  {{< /tab >}}

  {{< tab label="後續模板調用" >}}

```go-html-template {title="layouts/_partials/foo.html"}
{{ with .Page.Store.Get "key" }}
  {{ ... }}
{{ end }}
```

```go-html-template {title="layouts/_partials/bar.html"}
{{ with .Page.Store.Get "key" }}
  {{ ... }}
{{ end }}
```

  {{< /tab >}}
{{% /tabs %}}

**Example: 呼叫計數**

在同一個頁面中記錄 shortcode 被呼叫了多少次。

```go-html-template {title="layouts/_shortcodes/figure.html"}
{{ $count := .Page.Store.Get "imageCounter" | default 0 }}
{{ $count = add $count 1 }}
{{ .Page.Store.Set "imageCounter" $count }}
<figure id="img-{{ $count }}">
  <img src="{{ .Get "src" }}" alt="{{ .Get "alt" }}">
</figure>
```

如果不需要計數，只需要查詢是否被呼叫，則可以用 [`.Page.HasShortcode`](https://gohugo.io/methods/page/hasshortcode/#article) 方法，此方法和 `.Store` 不同，沒有順序問題，因為 Hugo 會提前掃描一次 Markdown 文件，因此無須等到 shortcode 真的被渲染之後才使用 `.Page.HasShortcode`。

**Example: 資源載入**

一個常見的範例是呼叫 `.Page.Store.Set`，在該頁面記錄某功能被呼叫，就可以在該呼叫**之後**使用 `.Page.Store.Get` 執行對應邏輯。經典的使用範例如官方文檔中的 [Mermaid 圖表](https://gohugo.io/content-management/diagrams/#mermaid-diagrams)。
