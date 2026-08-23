---
title: 'Build a Theme Step by Step'
slug: build-a-theme
weight: 900
---

This article walks you through building a theme from scratch. Learning by doing gets you there faster.

## Create the Project

```bash
hugo new project my-blog --format=yaml
cd my-blog
```

## Stylesheet

Get the styles ready first. CSS has nothing to do with templates, so copy a simple template into `assets/css/main.css` for now.

The reason it goes in `assets/` instead of `static/` is the same as what's covered in [Image References](guide/content-authoring.md): only resources under `assets/` get processed through Hugo Pipes. Anything in `static/` gets served as is, uncompressed.

{{% admonition type="note" sign="-" title="CSS Template" %}}

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

## baseof: The Shared Skeleton

`baseof` is the HTML skeleton shared by every page. Create `layouts/baseof.html`:

```go-html-template {title="layouts/baseof.html"}
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

The rendered `lang` attribute uses `{{ .Site.Language.Locale }}`, the same `locale` setting covered in [Basic Configuration](guide/basic-configuration.md#locale), rendered directly. That's why you need a region code in capital form, like `en-US`.

`<head>` and `<header>` are simple skeleton setup, nothing more.

`block "main"` is the key part here. It uses Hugo's [block](https://gohugo.io/functions/go-template/block/) function. When rendering different [Page Kinds](concept/templates.md#page-kind), Hugo maps to a different base template and slots that template's `{{ define "main" }}{{ end }}` into this spot. This is also the only place `{{ block "main" . }}{{ end }}` appears in the whole layouts directory.

The `<footer>` is, again, basic skeleton setup.

## Create Base Templates

Right now the skeleton has no base template, so running it throws an error. Start with the simplest fallback, `all.html`. When Hugo can't find a matching template, `all.html` is the last resort:

```go-html-template {title="layouts/all.html"}
{{ define "main" }}
  <main>
    {{ .Content }}

    {{ with .Pages }}
      {{ range . }}
        <a href="{{ .RelPermalink }}">{{ .LinkTitle }}</a>
      {{ end }}
    {{ end }}
  </main>
{{ end }}
```

This is a minimal page. `.Content` renders the Markdown file's content as HTML. `with .Pages` means that when child pages exist, it loops through them with `range` and prints each one's link and title. Create a few Markdown files now to see the result:

```sh
hugo new content _index.md
hugo new content blog/_index.md
hugo new content blog/p1.md
hugo new content blog/p2.md

hugo server -D
```

A blank page is expected. These Markdown files don't have content yet. Write something quick in `content/_index.md` to check:

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

## Load the Stylesheet

Still just plain text. Recall that `assets/` only produces output when referenced. The template still doesn't load `css/main.css`, so there's no styling yet.

Go back to `baseof.html` and add the stylesheet inside `<head>`:

```go-html-template {title="baseof.html"}
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
      {{ site.Title }}
    </title>
    <!-- add this block -->
    {{ with resources.Get "/css/main.css" }}
      <link rel="stylesheet" href="{{ .RelPermalink }}">
    {{ end }}
    <!-- add this block -->
  </head>
```

Reload the page. It should look much cleaner now. The `resources` function is one piece of Hugo Pipes. Importing JS works in a similar way.

## Set Up the Menu

`<head>` has styles now. `<header>` should have a menu. Add the menu config in `hugo.yaml`:

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

Update the template to add the header nav under `<header>`:

```go-html-template {title="baseof.html"}
		<header class="site-header">
			<a class="site-title" href="{{ site.Home.RelPermalink }}">{{ site.Title }}</a>
			<nav class="site-nav">
				<!-- add this block -->
				{{ range site.Menus.main }}
					<a href="{{ .URL }}">{{ .Name }}</a>
				{{ end }}
				<!-- add this block -->
			</nav>
		</header>
```

Check the page. The header should now show Home and Blog links.

## Add More Base Templates

`all.html` was only a temporary stopgap. Stop the server with `Ctrl + C` and build more base templates so each Page Kind renders with its own dedicated template.

{{% tabs %}}
  {{< tab label="page.html" >}}

`page.html` renders regular article pages.

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

`section.html` renders article list pages.

```html {title="layouts/section.html"}
{{ define "main" }}

<main>
  <h1 class="page-title">Section page {{ .Title }}: everything below is a regular article</h1>
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

`taxonomy.html` renders the tag section page (/tags/).

```html {title="layouts/taxonomy.html"}
{{ define "main" }}

<main>
  <h1 class="page-title">Site taxonomy, categorized by {{ .Title }}</h1>
  {{ with .Content }}<article class="prose">{{ . }}</article>{{ end }}

  <ul class="post-list">
    {{- range .Data.Terms.ByCount -}}
      <li>
        <a href="{{ .Page.RelPermalink }}">{{ .Page.LinkTitle }}</a>
        ({{ .Count }})
      </li>
    {{- end -}}
  </ul>
</main>

{{ end }}
```

  {{< /tab >}}

  {{< tab label="term.html" >}}

`term.html` renders each individual tag (/tags/hugo/).

```html {title="layouts/term.html"}
{{ define "main" }}

<main>
  <h1 class="page-title">Posts tagged {{ .Title }}</h1>
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

Run `hugo server -D` again. Browse between pages, tweak the Markdown or partials, add tags and categories, and watch what changes on each page. Once every change maps back to its cause, you've fully understood the system.

## Split Out Partials

Everything sits in the base template right now, and as the project grows it's time to split things up. Splitting is straightforward: take the entire content of the `<head>` tag, move it into `layouts/_partials/head.html`, and use `{{ partial "head.html" . }}` in its original spot.

> [!INFO] [context](https://gohugo.io/templates/introduction/#context)
> The `.` after `partial` represents the context of the current scope. For a regular page, the outermost `.` represents `.Page`, the page itself[^1], so the `head.html` partial receives the current page as context. `{{ range }}` and `{{ with }}` syntax also changes context. For instance, `{{ range site.Menus.main }}` changes the context to each individual menu item. A common mistake is getting the scope wrong, or missing a `.`. With no context passed in, the internal rendering naturally breaks.

[^1]: The outermost `.` represents `.Page`, the page itself. The current context is the page, and the page context has a method called `Page`, so `.Page` returns itself. In Hugo, and in any programming language, knowing the current context is fundamental and important.

## Final Directory Structure

Assuming `<head>`, `<header>`, and `<footer>` are all split out, the final result looks like this:

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

The five layout files, `baseof`, `page`, `section`, `taxonomy`, and `term`, correspond to the five Page Kinds covered in [Page Kind](concept/templates.md). The three partials correspond to reusable blocks. This is a small theme with no external dependency, fully under your own control.

> [!TIP]
> You can also move all theme-related content into the themes directory to turn it into an actual theme. Doing so gives you a clearer separation of responsibility between your source code and your Markdown content.

## Advanced Stylesheet Loading

The earlier example covered only the simplest way to load CSS. A typical Hugo project usually writes CSS loading like this:

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

Minification and fingerprinting aren't needed during local development, so this pattern enables them only in production.

> [!INFO]
> Without fingerprinting, the filename stays fixed, so watch for browser cache issues during local development, especially when editing styles. Don't forget the `--noHTTPCache` flag, or the browser may serve a stale CSS file.

This example loads a single stylesheet. A typical project usually has multiple CSS files. Start with the traditional `resources.Concat` approach:

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

`resources.Concat` performs simple concatenation and has several limitations. Hugo 0.158.0's new `css.Build` feature is more powerful. It supports `@import` between CSS files, which makes development more modern. The template usage stays simple:

```go-html-template
<!-- just add " | css.Build " to get this feature -->
{{- $buildOpts := dict
	"minify" (hugo.IsProduction)
	"target" (slice "chrome121" "firefox122" "safari17.3")
-}}

{{ with resources.Get "css/main.css" | css.Build $buildOpts }}
  {{ if hugo.IsDevelopment }}
    <link rel="stylesheet" href="{{ .RelPermalink }}">
  {{ else }}
    {{ with . | fingerprint }}
      <link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
    {{ end }}
  {{ end }}
{{ end }}
```

CSS now supports more capabilities:

```css {title="assets/css/main.css"}
/* supports CSS cascade layer */
@import "./tokens.css" layer(base);
@import "./layout.css" layer(base);

/* supports importing from node_modules */
/* the .woff2 files are hashed automatically */
@import "@fontsource-variable/nunito-sans";
```

There's an even more advanced technique: treat the resource as a template itself, which lets you build optional, configurable sections directly inside the CSS file.

```go-html-template
{{- with resources.Get "css/main.css" | resources.ExecuteAsTemplate "css/main-bundle.css" . -}}
	{{- with . | css.Build $buildOpts -}}
		{{- if hugo.IsDevelopment -}}
			<link rel="stylesheet" href="{{ .RelPermalink }}">
		{{- else -}}
			{{- with . | fingerprint -}}
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

Your `main.css` would then look something like this:

```css
@import "./tokens.css" layer(base);
@import "./layout.css" layer(base);
@import "@fontsource-variable/nunito-sans";


{{ if site.Params.feature }}
@import "./feature.css";
{{ end }}
```

This section covered three different ways to load stylesheets. Hugo's built-in Pipes are powerful enough that a complete asset processing pipeline needs no external tooling at all.
