---
title: 'Output Formats'
slug: output-formats
weight: 900
description: 'How a single page can render in multiple output formats, and three practical uses.'
---

Hugo supports having a single page produce multiple output formats. This is configured through [output formats](https://gohugo.io/configuration/output-formats/).

Output formats commonly serve three purposes:

1. Generating a site-wide JSON index for search.
2. Using build order to preprocess data before rendering.
3. Outputting Markdown (for example, llms.txt) for AI tools or other consumers to read.

## Basic Configuration

Define the format you want to output in `hugo.yaml`:

```yaml
outputFormats:
  searchIndex:
    mediaType: application/json
    baseName: index
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

This makes the home page produce `index.json` in addition to `index.html`.

The output content is determined by the corresponding template. Hugo looks up the template by format name, for example `layouts/index.searchIndex.json`.

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
    - markdown
```

The corresponding template, `_layouts/page.markdown.md`, outputs the Markdown content directly.

## Example 2: JSON Index

Generate a data index for search. The template iterates over every page and outputs a JSON file:

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

A frontend search feature then reads this JSON in the browser to build an index and run searches, with no backend server involved.

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

This approach works well when you need to aggregate across pages or perform a one-time precomputation, as with [backlinks](https://github.com/jmooring/hugo-module-backlinks).
