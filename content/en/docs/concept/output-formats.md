---
title: 'Output Formats'
slug: output-formats
weight: 900
description: 'How a single page can render in multiple output formats, and three practical uses: search indexes, build-order preprocessing, and Markdown output for AI tools.'
---

Hugo supports having a single page produce multiple output formats at once. This is configured through [output formats](https://gohugo.io/configuration/output-formats/).

There are three common uses for output formats:

1. Generating a JSON index for site-wide search.
2. Using build order to preprocess data before rendering.
3. Outputting Markdown (for example `llms.txt`) for AI tools or other tools to read.

## Basic Configuration

Define the format you want to output in `hugo.toml`:

```toml
[outputFormats.searchIndex]
  mediaType = 'application/json'
  baseName = 'index'
  isPlainText = true
```

Then specify which pages should output this format, also in `hugo.toml`:

```toml
[outputs]
  home = ['html', 'searchIndex']
```

This produces `index.json` in addition to `index.html` for the homepage.

The output content is determined by the matching template. Hugo looks for a template based on the format name, for example `layouts/index.searchIndex.json`.

## Use 1: JSON Index

The most common use is generating a data index for site-wide search. A template loops through every page and outputs a single JSON file:

```toml
[outputFormats.searchIndex]
  mediaType = 'application/json'
  baseName = 'searchIndex'
  isPlainText = true
  weight = 1
[outputs]
  home = ['html', 'rss', 'searchIndex']
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

A frontend search library such as Fuse.js then reads this JSON in the browser to build its index and run searches, with no backend server involved.

<details>

<summary>Minimal example</summary>

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

```html {title="baseof.html"}
{{/* put this in the nav or header */}}
<input type="text" id="searchInput" placeholder="Search...">
<ul id="results"></ul>
```

</details>

## Use 2: Preprocessing Through Build Order

Hugo determines each output format's render order by `weight`, with lower numbers rendering first. This means you can have one output format run first, write data into `.Store`, and let other formats rendered afterward (HTML, for example) read that data back out.

Writing to the store while the JSON index renders:

```go-html-template {title="layouts/home.searchIndex.json"}
{{- range site.RegularPages }}
  {{- $.Store.Set (printf "foo-%s" .RelPermalink) ($preProcessedResult) }}
{{- end }}
```

And read that value:

```go-html-template
{{ $.Store.Get (printf "foo-%s" .RelPermalink) }}
```

This approach fits situations that need cross page aggregation or a one-time precomputed value, such as [backlinks](https://github.com/jmooring/hugo-module-backlinks).

## Use 3: Outputting Markdown

Output formats can also output plain Markdown. A common use is generating `llms.txt`, which gives AI tools a plain text version of the site's content to read:

```toml
[outputFormats.llmText]
  mediaType = 'text/plain'
  baseName = 'llms'
  isPlainText = true
```

```toml
[outputs]
  home = ['html', 'llmText']
```

The matching template, `layouts/index.llmText.txt`, outputs Markdown formatted content directly, with no HTML conversion involved.
