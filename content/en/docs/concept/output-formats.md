---
title: 'Output Formats'
slug: output-formats
weight: 900
description: 'How a single page can render in multiple output formats, and three practical uses.'
---

Hugo supports having a single page produce multiple [output formats](https://gohugo.io/configuration/output-formats/).

## Basic Configuration

Define the format you want to output in `hugo.yaml`:

```yaml
outputFormats:
  searchIndex:
    mediaType: application/json
    baseName: filename
    isPlainText: true
```

Then specify which pages should produce this format, also in `hugo.yaml`:

```yaml
outputs:
  home:
    - html
    - rss
    - searchIndex
```

And `layouts/home.searchIndex.json` renders `public/filename.json`.

## Example 1: Outputting Markdown

Output plain Markdown for every page:

```yaml
outputFormats:
  markdown:
    mediaType: text/markdown
    baseName: index
    isPlainText: true
```

```yaml
outputs:
  page:
    - html
    - rss
    - markdown
```

The corresponding template, `layouts/page.markdown.md`, outputs the Markdown content directly.

## Example 2: JSON Index

The template iterates over every page and outputs a JSON index for site search:

```yaml
outputFormats:
  searchIndex:
    mediaType: application/json
    baseName: searchIndex
    isPlainText: true
    weight: 1
outputs:
  home:
    - html
    - rss
    - searchIndex
```

```go-html-template {title="layouts/home.searchIndex.json"}
{{- $index := slice -}}
{{- range .Site.RegularPages -}}
  {{- $index = $index | append (dict
    "title" (.Title | emojify | safeJS)
    "content" (.Plain | safeJS)
    "url" .RelPermalink
    ) -}}
{{- end -}}
{{- $index | jsonify -}}
```

Search happens entirely in the browser by reading this JSON, so no backend server is required.

{{% details summary="Minimal Fuse.js search example" %}}

```html {title="baseof.html"}
{{/* put this in the nav or header */}}
<input type="text" id="searchInput" placeholder="Search...">
<ul id="results"></ul>
```

```html {title="baseof.html"}
{{/* put this before the end of </body> */}}
<script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
<script data-search-index="{{ site.Home.RelPermalink }}searchIndex.json">
  let fuse;
  const scriptEl = document.currentScript;
  const searchIndexUrl = scriptEl.dataset.searchIndex;

  fetch(searchIndexUrl)
    .then(res => res.json())
    .then(data => {
      fuse = new Fuse(data, {
        keys: ['title', 'content']
      });
    });

  document.getElementById('searchInput').addEventListener('input', function (e) {
    const query = e.target.value;
    const resultsEl = document.getElementById('results');
    resultsEl.innerHTML = '';

    if (!query || !fuse) return;

    const results = fuse.search(query);

    results.forEach(r => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = r.item.url;
      a.textContent = r.item.title;
      li.appendChild(a);
      resultsEl.appendChild(li);
    });
  });
</script>
```

{{% /details %}}

## Example 3: Generating a CSP Hash for `_headers`{#csp-hash}

Give `headers` a higher `weight` so Hugo renders `_headers` last, after all computations for other outputs are complete. Each HTML page stores the hash of its inline script in `hugo.Store`. Then `_headers` reads the stored hashes and builds the `Content-Security-Policy` header.

Define the format in `hugo.yaml`. Set `delimiter` to an empty string to name the file `_headers` without an extension:

```yaml
outputFormats:
  headers:
    mediaType: text/header
    baseName: _headers
    isPlainText: true
    notAlternative: true
    weight: 20
mediaTypes:
  text/header:
    delimiter: ''
outputs:
  home:
    - html
    - headers
```

Store the hash after the inline script. Hash the minified content so that minifying it again doesn't change the content:

```go-html-template {title="layouts/head.html"}
{{- $el := resources.Get "critical.js" | minify -}}
<script>{{ $el.Content | safeJS }}</script>
{{- $hash := printf "sha256-%s" ($el.Content | sha256 | encoding.HexDecode | base64Encode) -}}
{{- hugo.Store.SetInMap "js-hashes" "critical" $hash -}}
```

Read the stored hashes in `layouts/home.headers`:

```go-html-template {title="layouts/home.headers"}
{{- $s := "" -}}
{{- range $name, $hash := hugo.Store.Get "js-hashes" -}}
  {{- $s = printf "%s '%s'" $s $hash -}}
{{- end -}}
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' {{ $s }};
```
