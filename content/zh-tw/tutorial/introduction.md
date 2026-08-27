---
title: '入門'
slug: introduction
weight: 100
---

本文假設讀者已經對程式語言有基礎認知，不會從零介紹所有程式知識，並且在這個基礎認知上介紹 Hugo 的語法。

本文基於基礎範例網站介紹，使用以下指令初始化：

```sh
hugo new project my-site
cd my-site
hugo new theme test
echo "theme = [\"test\"]" >> hugo.yaml
```

## 理解專案結構

請見[專案結構](../docs/concept/project-structure.md)說明 layouts 目錄以外的結構，以及[模板系統](../docs/concept/templates.md)說明 layouts 目錄的結構。

## 平行渲染

Hugo 是多個頁面同時渲染的，務必要記得這點，避免寫出競態的程式碼。雖然你絕大部分時間不會遇到此問題，但是此問題的重要性值得一開始就特別強調。

## 第一個模板

`layouts/home.html`：

```go-html-template {title="layouts/home.html"}
{{ $v1 := 6 }}
{{ $v2 := 7 }}
<p>{{ mul $v1 $v2 }}</p>
```

```html
<p>42</p>
```

`{{ }}` 內是求值的地方，外面原樣輸出。

## 變數

```go-html-template {title="layouts/home.html"}
{{ $price := 100 }}
{{ $price = 120 }}
{{ $price = "特價中" }}
<p>{{ $price }}</p>
```

```html
<p>特價中</p>
```

`:=` 建立，`=` 賦值。同一個變數可以重複賦值，型別也能中途換掉，這裡 `$price` 就從數字變成了字串。

## 函式

```go-html-template {title="layouts/home.html"}
<p>{{ add 1 2 3 }}</p>
<p>{{ strings.ToLower "HUGO" }}</p>
```

```html
<p>6</p>
<p>hugo</p>
```

函式跟物件無關，是無狀態的：只看你給的參數，同樣的參數永遠回傳同樣的結果，不會因為在哪個模板呼叫而有差異。

## 上下文

上下文代表「目前位置的上下文內容」。例如在基礎模板 `baseof.html` 裡面：

```go-html-template
{{ . }}
```

會印出當前頁面的檔案名稱。之後每個模板透過傳遞的上下文決定它接收到什麼資訊，比如同樣在 `baseof.html` 裡面會看到這樣的呼叫：

```go-html-template
{{ partial "head.html" . }}
```

**這代表把「目前頁面（`.`）」作為上下文（context），傳遞到 `head.html` 這個模板中**。

同理，底下的 `{{ block "main" . }}{{ end }}` 把目前頁面（`.`）傳到名為 `"main"` 的佈局模板裡面，這些 `"main"` 則在 `layouts` 目錄的 page、home、section、term、taxonomy 被 `{{ define "main" }}` 定義。也就是說，這五個佈局模板的 `{{ define "main" }}` 內部的上下文，同樣也是「目前頁面」。

可以把上下文存成變數重複使用：

```go-html-template {title="layouts/home.html"}
{{ $page := . }}
<h1>{{ $page.Title }} - {{ $page.Title }}</h1>
```

## 方法

接在 `.` 後面呼叫的東西稱為方法，綁定的對象就是 `.` 代表的上下文本身，不同上下文，同樣的方法回傳結果就不同。

```go-html-template {title="layouts/home.html"}
<h1>{{ .Site.Title }} / {{ .Title }}</h1>
```

`.Site.Title` 是先呼叫 `.Site` 拿到網站物件，再對網站物件呼叫 `.Title`。

把 `about` 頁面作為變數，呼叫該頁面的 `.Title` 方法：

```go-html-template {title="layouts/home.html"}
{{ $about := .Site.GetPage "/about" }}
<p>{{ $about.Title }}</p>
```

## 上下文的切換

```go-html-template {title="layouts/home.html"}
<h1>{{ .Title }}</h1>

{{ range slice "蘋果" "香蕉" }}
  <p>{{ . }}</p>
{{ end }}

{{ with "橘子" }}
  <p>{{ . }} / {{ $.Title }}</p>
{{ end }}
```

```html
<h1>My Site Title</h1>
<p>蘋果</p>
<p>香蕉</p>
<p>橘子 / My Site Title</p>
```

`range`、`with` 裡面，`.` 換成當下的元素或值；`$.` 永遠回傳入當前模板最外層的上下文。

## 管線

不用管線：

```go-html-template {title="layouts/home.html"}
{{ strings.ToLower "Hugo" }}
{{ mul 6 (add 2 5) }}
```

用管線，把值從左邊傳到右邊當最後一個參數：

```go-html-template {title="layouts/home.html"}
{{ "Hugo" | strings.ToLower }}
{{ 5 | add 2 | mul 6 }}
```

兩種寫法結果相同：

```text
hugo
42
```

## 註解

Go template 註解，不會出現在輸出裡：

```go-html-template {title="layouts/home.html"}
{{/* 不會輸出 */}}
```

HTML 註解，會照樣輸出到最終的 HTML：

```go-html-template {title="layouts/home.html"}
<!-- 會輸出到 html -->
```

## 清除空白

```go-html-template {title="layouts/home.html"}
Start
{{ if true }}
  true
{{ end }}
End
```

會渲染成

```html
Start

  true

End
```

使用 `{{-  -}}` 或是註解使用 `{{- /*  */ -}}` 則可以跨行清除中間空白

```go-html-template {title="layouts/home.html"}
Start
{{- if true -}}
  {{- print " %s " "true" -}}
{{- end -}}
End
```

會渲染成

```html
Start true End
```

## 生命週期

變數的生命週期只存在於當前模板，而不是整個當前頁面。當變數是在獨立上下文區塊被建立，上下文區塊結束後變數也自動銷毀。

錯誤：

```go-html-template {title="layouts/home.html"}
{{ with "foo" }}
  {{ $x := 1 }}
{{ end }}

{{ $x }}
```

正確：

```go-html-template {title="layouts/home.html"}
{{ $x := 0 }}
{{ with "foo" }}
  {{ $x = 1 }}
{{ end }}

{{ $x }}
```
