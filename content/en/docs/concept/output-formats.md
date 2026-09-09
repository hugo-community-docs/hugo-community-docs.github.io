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

<details>

<summary>Minimal Fuse.js search example</summary>

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

</details>

## Example 3: Preprocessing With Build Order

Hugo determines the rendering order of output formats based on `weight`, with lower numbers rendering first. This means you can have one output format run first, write data into `.Store`, and let other formats rendered later (such as HTML) read it:

Write to the store during the JSON index render:

```go-html-template {title="layouts/home.searchIndex.json"}
{{- range site.RegularPages }}
  {{- $.Store.Set (printf "foo-%s" .RelPermalink) ($preProcessedResult) }}
{{- end }}
```

Then read it:

```go-html-template
{{ $.Store.Get (printf "foo-%s" .RelPermalink) }}
```

This approach works well when you need to aggregate across pages or precompute something, as with [backlinks](https://github.com/jmooring/hugo-module-backlinks).
