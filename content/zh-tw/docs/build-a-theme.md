---
title: '手把手建立主題'
slug: build-a-theme
weight: 900
---

這篇文章帶從零你建立主題，做中學更快理解，你說對吧。

## 建立專案

```bash
hugo new project my-blog --format=yaml
cd my-blog
```

## CSS 樣式表

先把樣式準備好，CSS 和模板無關，這裡直接複製一個簡易範本到 `assets/css/main.css` 即可。

放在 `assets/` 而不是 `static/` 的原因則如同[圖片引用](guide/content-authoring.md)說的，`assets/` 底下的資源才能經過 Hugo Pipes 處理，放在 `static/` 則會以未經壓縮的原樣輸出。

{{% admonition type="note" sign="-" title="CSS 範本" %}}

```css
:root {
	--measure: 640px;
	--color-bg: oklch(0.99 0.003 84);
	--color-text: oklch(0.23 0.005 67);
	--color-muted: oklch(0.45 0.01 67);
	--color-border: oklch(0.92 0.007 80);
	--color-link: oklch(0.23 0.005 67);
	--font-serif:
		'Noto Serif TC', 'Noto Serif JP', 'Noto Serif SC', 'PingFang TC', 'Microsoft JhengHei', Georgia, serif;
	--space-1: 0.5rem;
	--space-2: 1rem;
	--space-3: 1.75rem;
	--space-4: 3rem;
	--space-5: 5rem;
	--text-1: 0.85rem;
	--text-2: 0.95rem;
}

* {
	box-sizing: border-box;
}

html {
	-webkit-text-size-adjust: 100%;
	color-scheme: light;
	font-size: 120%;
	@media (width < 768px) {
		font-size: 100%;
	}
}

body {
	margin: 0;
	background: var(--color-bg);
	color: var(--color-text);
	font-family: var(--font-serif);
	font-size: 19px;
	line-height: 1.75;
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
	@media (width < 768px) {
		font-size: 17px;
	}
}

a {
	color: var(--color-link);
	text-decoration-color: var(--color-border);
	text-underline-offset: 3px;
	&:visited {
		color: var(--color-link);
	}
}


table {
	display: block;
	overflow: auto;
}

table {
	width: 100%;
	margin: var(--space-3) 0;
	border-collapse: collapse;
	font-size: calc((var(--text-1) + var(--text-2)) / 2);
}

th,
td {
	padding: var(--space-1) var(--space-2);
	text-align: left;
	border-bottom: 1.2px solid var(--color-border);
	vertical-align: top;
}

th {
	font-weight: 700;
	color: var(--color-text);
	border-bottom: 1.2px solid var(--color-border);
}

td {
	color: var(--color-text);
}

tbody tr:hover {
	background: color-mix(in oklch, var(--color-border) 40%, transparent);
}

p {
	margin: 0 0 var(--space-3);
}

blockquote {
	margin: var(--space-3) 0;
	padding-left: var(--space-3);
	border-left: 2px solid var(--color-muted);
	color: var(--color-muted);
	font-style: italic;
}

pre {
	background: #f4f2ee;
	padding: var(--space-2);
	overflow-x: auto;
	font-size: 0.85rem;
	line-height: 1.6;
}

:not(pre) > code {
	background-color: #f4f2ee;
	font-weight: normal;
	padding: 1.6px;
	padding-inline: 4px;
	border-radius: 0.5em;
	border: 1.25px solid oklch(0.697 0.153 272.01);
	font-size: 0.875em;
	line-height: 1.4;
}

pre code {
	background: none;
	padding: 0;
}

hr {
	border: none;
	border-top: 1px solid var(--color-border);
	margin: var(--space-4) 0;
}

.site-header,
.site-footer,
main {
	max-width: var(--measure);
	margin-left: auto;
	margin-right: auto;
	padding-left: var(--space-2);
	padding-right: var(--space-2);
}

.site-header {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: var(--space-2);
	padding-top: var(--space-4);
	padding-bottom: var(--space-4);
	@media (width < 768px) {
		padding-top: var(--space-3);
		padding-bottom: var(--space-3);
	}
}

.site-title {
	font-size: 1.05rem;
	font-weight: 700;
	letter-spacing: 0.02em;
	color: var(--color-text);
	text-decoration: none;
}

.site-nav {
	display: flex;
	gap: var(--space-3);
}

main {
	min-height: 50vh;
	padding-bottom: var(--space-5);
}

.site-footer {
	padding-top: var(--space-4);
	padding-bottom: var(--space-4);
	border-top: 1px solid var(--color-border);
	font-size: var(--text-1);
}

.page-title {
	font-size: 1.6rem;
	margin: 0 0 var(--space-4);
}

.intro {
	margin-bottom: var(--space-4);
	color: var(--color-muted);
}
```

{{% /admonition %}}

## baseof：共用骨架

baseof 是所有頁面共用的 HTML 骨架。建立 `layouts/baseof.html`：

```go-html-template
<!doctype html>
<html lang="{{ .Site.Language.Locale }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
      {{ site.Title }}
    </title>
  </head>
  <body>
    <header class="site-header">
      <a class="site-title" href="{{ site.Home.RelPermalink }}">{{ site.Title }}</a>
      <nav class="site-nav">
      </nav>
    </header>
    {{ block "main" . }}{{ end }}
    <footer class="site-footer">
      <p>&copy; {{ now.Year }} {{ site.Title }}</p>
    </footer>
  </body>
</html>
```

首先渲染 `lang` 使的 `{{ .Site.Language.Locale }}` 就是[基礎篇](guide/basic-configuration.md#locale)的 `locale` 設定，直接被渲染，因此才會需要 `en-US` 這種區域碼大寫的形式。

接下來 `<head>` `<header>` 都是簡單的基本骨架設定。

`block "main"` 是本段落重點，使用 Hugo 的 [block](https://gohugo.io/functions/go-template/block/) 函式，在渲染不同的 [Page Kind](concept/templates.md#page-kind) 時會對應到不同的基礎模板，並且將基礎模板的 `{{ define "main" }}{{ end }}` 放進來。這也是 `{{ block "main" . }}{{ end }}` 在整份 layouts 裡唯一會出現的一次。

最後的 `<footer>` 同樣是基本骨架設定。

## 建立基礎模板

現在我們只有骨架還沒有任何基礎模板，因此執行會報錯的，先以最簡單的 fallback `all.html`，試試看，當 Hugo 找不到對應的模板時，`all.html` 是最後的 fallback：

```go-html-template {title="layouts/all.html"}
{{ define "main" }}
  <main>
    {{ .Content }}
  </main>

  {{ with .Pages }}
    {{ range . }}
      <a href="{{ .RelPermalink }}">{{ .LinkTitle }}</a>
    {{ end }}
  {{ end }}
{{ end }}
```

這是一個最簡的頁面，.Content 代表渲染 Markdown 檔案內容成 HTML，`with .Pages` 意思是當子頁面存在時，對所有子頁面 `range` 一輪印出他們的連結和標題。這時候我們已經可以建立幾個 Markdown 看渲染結果了：

```sh
hugo new content _index.md
hugo new content blog/_index.md
hugo new content blog/p1.md
hugo new content blog/p2.md

hugo server -D
```

一片空白是正常的！因為這些 Markdown 也還沒有內容，先在 `content/_index.md` 隨便寫點東西看看：

{{% admonition type="info" sign="-" title="Lorem Markdownum" %}}

```md {title="content/_index.md"}
---
date: '2026-08-16T04:33:19+08:00'
draft: true
title: ''
---

# Munere illum rates age

Lorem markdownum a intendens forte nexuque, terga attrahitur letum ministrarum
lacerto disceditis mihi **lacrimis**. Et inpietatis licet, floresque gravi sit.

Mendacia partu corporis tenens di heros et factum secabatur versus **curvamine
oblitus rectum** in calorque in erat? Celebravit quae respondit incurrite trabe
si [animi lacusque](#munere-illum-rates-age) tumulati maledicere fortibus erat
hoc tela monitae nivibus iurgia. **Plumas manifestam**, in in sub Lycaoniae!
Turba quoque est armis adfatur totumque rectum, est `processor` detexisse isti
summum virgo viri visum, te. Meo potentem rogant!

Si quas; nunc saepe volucri: supposita saepe toto videtur. Subito *manibusque
parsque*! Hoc et, iuvenes populusque viros leae quae Alcmenae? Sed contra
nymphas, artis hoc totidemque deperit aquis secum `veronica` protecta mea
saltumque durum flammamque illis tulit? Peragit et quercum
[collum](#munere-illum-rates-age), nec baculo *frena circumstetit pittheam*,
ramos Apis Orphea.

> Facto `key_cybercrime` animusque Troiana, curvata murmura te et tactusque ora
> `remote` mandasset. Conspecta deae nec pertimuitque tempore Cypro, hunc Niobe
> pia agros veteres iam neque utrumque tibi? Est ardor lucem, vocem satis sic
> germana tamen sequitur. Opperiuntur omnes advolat me qui undis orbem pars ne
> Achaemenias vivitur deos, gerit Turni arbor.

Animisque ferae, myricae ille; nec `mail` non aegide, sic accedat insignis
caput! Via rerum tendunt alvum lacrimaeque virorum coniugiique est alteriusque
fuge verbisque. Per in rupti Phrygias, durescit *arserunt tardos*! Victa parvae,
quae levati anhelitus extendi, decuit et precari.

1. Iuvant scinditur illum lustro
2. Protinus prius fluit inde
3. His in ducit utrumque
4. Iunctissima illa Cupidinis fines nostra absistit
5. Prensamque decerpserat vetabant perstat meritorum Pergama
6. Ora monstrique illa tenues quoniam sanguine Tirynthius

Victores discreta e alienae **videtur imperiis**; ad est cognatumque locis
pollutosque herbis teretem. Quid ereptamque **dolor**, eras eadem, non falso
**deerat et** finibus rubentia cervix Latia: nec. Gradive
[frustra](#munere-illum-rates-age) inducto, mercede ubi Spercheides me [undam
loquentem](#munere-illum-rates-age), et mihi ter `interlacedLteFinder` erat:
talia *summa*.

In adsensu portus beatam arcus pignora, in fulvaque. [Misceat insidiae
et](#munere-illum-rates-age) actusque susurra caelum. Classe noctem nomenque
`virus` tu, mare erat, Coronis animos, nec Phoenicas.

Et latet truncus [cornua soror](#munere-illum-rates-age) temperie evanida, hoc
illa passaque nihil, mea est alto excutit, adsis. Et munere infra actis increvit
coepitque gratare.
```

{{% /admonition %}}

## 引入樣式表

沒錯，還是只有純文字，還記得之前說的 `assets/` 只有需要時才會輸出嗎？我們還沒有在模板裡面引入前面的 `css/main.css`，自然沒有任何樣式。

現在回到 `baseof.html`，我們在 `<head>` 標籤裡加上樣式表：

```go-html-template {title="baseof.html"}
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
      {{ site.Title }}
    </title>
    <!-- 新增這段 -->
    {{ with resources.Get "/css/main.css" }}
      <link rel="stylesheet" href="{{ .RelPermalink }}">
    {{ end }}
    <!-- 新增這段 -->
  </head>
```

回到網頁應該會看到樣式美觀多了。代碼的 `resources` 就是 Hugo Pipes 的其中一個功能，引入 JS 也是差不多的方式。

## 設定選單

`<head>` 樣式有了，接下來看 `<header>` 應該放個選單，首先在 `hugo.yaml` 加入選單設定

```yaml
menu:
  main:
    - name: Blog
      pageRef: /blog
      weight: 10
    - name: Tags
      pageRef: /tags
      weight: 20
```

再來更新模板，在 `<header>` 部分新增頁首選單

```go-html-template
		<header class="site-header">
			<a class="site-title" href="{{ site.Home.RelPermalink }}">{{ site.Title }}</a>
			<nav class="site-nav">
				<!-- 新增這段 -->
				{{ range site.Menus.main }}
					<a href="{{ .URL }}">{{ .Name }}</a>
				{{ end }}
				<!-- 新增這段 -->
			</nav>
		</header>
```

看網頁應該就會看到頁首多了 Home 和 Blog 兩個按鈕。

## 建立更多基礎模板

剛才只建立了 `all.html` 暫時頂一下，現在我們先 `Ctrl + C` 停止伺服器，建立更多基礎模板，讓每種 Page Kind 都使用專屬的模板渲染。

{{% tabs %}}
  {{< tab label="page.html" >}}

  `page.html` 用於渲染一般文章頁面。

```html {title="layouts/page.html"}
{{ define "main" }}

<main>
  <article>
    <h1 class="page-title">{{ .Title }}</h1>
    {{ .Content }}
  </article>
</main>

{{ end }}
```

  {{< /tab >}}

  {{< tab label="section.html" >}}

  `section.html` 用於渲染文章列表頁面。

```html {title="layouts/section.html"}
{{ define "main" }}

<main>
  <h1 class="page-title">分區頁面 {{ .Title }}：底下全都是一般文章</h1>
  {{ with .Content }}<article class="intro prose">{{ . }}</article>{{ end }}

  <ul>
    {{ range .Pages.ByDate.Reverse }}
    <li>
      <a href="{{ .RelPermalink }}">{{ .Title }}</a>
    </li>
    {{ end }}
  </ul>
</main>

{{ end }}
```

  {{< /tab >}}

  {{< tab label="taxonomy.html" >}}

  `taxonomy.html` 用於渲染標籤分區頁面（/tags/）。

```html {title="layouts/taxonomy.html"}
{{ define "main" }}

<main>
  <h1 class="page-title">網站分類法：以 {{ .Title }} 分類</h1>
  {{ with .Content }}<article class="prose">{{ . }}</article>{{ end }}

  {{ range .Pages }}
    <p>
      <a href="{{ .RelPermalink }}">{{ .Title }}</a>
    </p>
  {{ end }}
</main>

{{ end }}
```

  {{< /tab >}}

  {{< tab label="term.html" >}}

  `term.html` 用於渲染每一個獨立標籤（/tags/hugo/）。

```html {title="layouts/term.html"}
{{ define "main" }}

<main>
  <h1 class="page-title">帶有 {{ .Title }} 標籤的文章</h1>
  {{ with .Content }}<article class="prose">{{ . }}</article>{{ end }}

  {{ range .Pages.ByDate.Reverse }}
    <p>
      <a href="{{ .RelPermalink }}">{{ .Title }}</a>
    </p>
  {{ end }}
</main>

{{ end }}
```

  {{< /tab >}}

{{% /tabs %}}

接著同樣 `hugo server -D`，你可以在各個頁面間瀏覽、更新 Markdown 或是 partial、新增標籤、分類等等，看看在對應的頁面有什麼變化，能將變化一一對應起來就代表你已經完全理解這個系統了。

## 拆分 partial

現在我們把內容全部寫在基礎模板裡，隨著專案膨脹就開始要拆分。拆分也很簡單，比如把整個 `<head>` 標籤的內容放到 `layouts/_partials/head.html`，然後在原本的位置使用 `{{ partial "head.html" . }}` 就好了。

> [!INFO] [context](https://gohugo.io/templates/introduction/#context)
> 請注意 `partial` 後面的 `.` 代表 「目前 scope 的 context」，比如一般頁面最外層的 `.` 代表 `.Page` 頁面本身[^1]，因此 `head.html` partial 接收到的就是目前頁面。或是 `{{ range }}` 和 `{{ with }}` 也會改變 context，像是剛才的 `{{ range site.Menus.main }}` 就改變成各個 menu，常見的錯誤是搞錯 scope，或是少打一個 `.`，沒有 context 傳入，內部渲染自然出錯。

[^1]: 最外層的 `.` 代表 `.Page` 頁面本身，這個意思是目前的 context 就是 page 自己，而 page 這個 context 包含一個 method 叫做 `Page`，因此 `.Page` 出來的還是自己。在 Hugo 或是任何程式語言，搞清楚目前的 context 是一件基本且重要的事情。

## 完成後的目錄結構

假設我們把 `<head>`, `<header>`, `<footer>` 都拆分出來，最後的結果會像這樣

```text
my-blog/
├── assets/
│   └── css/
│       └── main.css
├── content
│   ├── _index.md
│   └── blog
│       ├── _index.md
│       ├── p1.md
│       └── p2.md
├── layouts/
│   ├── baseof.html
│   ├── page.html
│   ├── section.html
│   ├── taxonomy.html
│   ├── term.html
│   └── _partials/
│       ├── head.html
│       ├── header.html
│       └── footer.html
└── hugo.toml
```

五個 layout 檔案（`baseof`、`page`、`section`、`taxonomy`、`term`）對應到前面 [Page Kind](concept/templates.md) 那篇整理過的五種 kind，三個 partials 對應可重複使用的區塊。這是一個沒有主題依賴、完全自己掌控的小巧主題。

> [!TIP]
> 你也可以把主題相關的內容都放到 themes 目錄讓他真的變成 theme，這樣做的好處是讓源碼與 Markdown 內容有更清晰的權責分離。

## 進階的樣式表引入

前面只介紹了最簡單的 CSS 引入方式，還有很多地方可以改進。一個 Hugo 專案通常會這樣寫 CSS：

```go-html-template
{{ with resources.Get "/css/main.css" }}
	{{ if hugo.IsDevelopment }}
		<link rel="stylesheet" href="{{ .RelPermalink }}">
	{{ else }}
		{{ with . | minify | fingerprint }}
			<link
				rel="stylesheet"
				href="{{ .RelPermalink }}"
				integrity="{{ .Data.Integrity }}">
		{{ end }}
	{{ end }}
{{ end }}
```

大意是本地開發時因為壓縮和指紋都不必要，只有生產環境才啟用 minify、計算檔案指紋。

> [!INFO]
> 有一好沒兩好，由於沒有 fingerprint 因此檔名固定，這時就要注意如果本地開發時瀏覽器的快取刷新問題，尤其是正在修改樣式時別忘了 `--noHTTPCache` 旗標才能避免瀏覽器使用舊版 CSS。

這個範例中只引入了一個樣式表，而一般專案通常會有多個 CSS 檔案，首先我們先介紹使用傳統的 `resources.Concat` 引入方案：

```go-html-template
{{ $css := slice
	| append (resources.Get "css/main.css")
	| append (resources.Get "css/chroma.css")
	| resources.Concat "css/main.css"
}}

{{ if hugo.IsProduction }}
	{{ $css = $css | minify | fingerprint }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ .Data.Integrity }}">
{{ else }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}">
{{ end }}
```

`resources.Concat` 只是簡單的串接，有很多限制，而 Hugo 0.158.0 新推出的 `css.Build` 功能更為強大，支援在 CSS files 間互相使用 `@import` 語法，讓開發更現代化。模板使用很簡單：

```go-html-template
<!-- 只須加上 " | css.Build " 即可享受此功能 -->
{{ with resources.Get "css/main.css" | css.Build }}
  {{ if hugo.IsDevelopment }}
    <link rel="stylesheet" href="{{ .RelPermalink }}">
  {{ else }}
    {{ with . | fingerprint }}
      <link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
    {{ end }}
  {{ end }}
{{ end }}
```

但是 CSS 新增了很多功能：

```css {title="assets/css/main.css"}
/* 支援 CSS cascade layer 語法 */
@import "./tokens.css" layer(base);
@import "./layout.css" layer(base);

/* 支援從 node_modules 中 import */
@import "@fontsource-variable/nunito-sans";
```

還沒有完，我們甚至可以將資源作為模板處理，在 CSS 檔案裡面做到選項化的構建

```go-html-template
{{- with resources.Get "css/main.css" | resources.ExecuteAsTemplate "css/main-bundle.css" . -}}
	{{- with . | css.Build $buildOpts -}}
		{{- if hugo.IsDevelopment -}}
			<link rel="stylesheet" href="{{ .RelPermalink }}">
		{{- else -}}
			{{- with . | minify | fingerprint -}}
				<link
					rel="stylesheet"
					href="{{ .RelPermalink }}"
					integrity="{{ .Data.Integrity }}"
					crossorigin="anonymous">
			{{- end -}}
		{{- end -}}
	{{- end -}}
{{- end -}}
```

這時你的 main.css 大概會像這個樣子：

```css
@import "./tokens.css" layer(base);
@import "./layout.css" layer(base);
@import "@fontsource-variable/nunito-sans";


{{ if site.Params.feature }}
@import "./feature.css";
{{ end }}
```

這裡我們演示了三種不同的引入方式，可以看到 Hugo 內建的 Pipes 非常強大，你不需要設定任何工具，直接使用內建套件就能完成整套資產處理流程。
