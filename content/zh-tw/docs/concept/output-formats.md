---
title: '輸出格式'
slug: output-formats
weight: 900
---

Hugo 支援一個頁面可以同時擁有多種輸出格式，此功能透過 [output formats](https://gohugo.io/configuration/output-formats/) 進行設定。

output formats 常見的用途有三種：

1. 產生全站搜尋用的 JSON 索引。
2. 利用構建順序在渲染前預先處理資料。
3. 輸出 Markdown 格式（例如 llms.txt）供 AI 或其他工具讀取。

## 基本設定

在 `hugo.yaml` 定義要輸出的格式：

```yaml
outputFormats:
  searchIndex:
    mediaType: application/json
    baseName: index
    isPlainText: true
```

接著在 `hugo.yaml` 指定哪些頁面要輸出這個格式：

```yaml
outputs:
  home:
    - html
    - rss
    - searchIndex
```

這會讓首頁除了 `index.html` 之外，額外產生 `index.json`。

輸出的內容由對應的模板決定，Hugo 會依格式名稱尋找模板，例如 `layouts/index.searchIndex.json`。

## 範例一：輸出 Markdown

每個頁面輸出純 Markdown：

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

對應模板 `_layouts/page.markdown.md` 直接輸出 Markdown 格式的內容。

## 範例二：JSON 索引

產生搜尋用的資料索引。模板遍歷所有頁面，輸出成一份 JSON：

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

前端搜尋功能則在瀏覽器端讀取這份 JSON 進行索引與搜尋，不需要後端伺服器參與。

<details>

<summary>Fuse.js 搜尋最小範例</summary>

```html {title="baseof.html"}
{{/* put this in the nav or header */}}
<input type="text" id="searchInput" placeholder="搜尋...">
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

## 範例三：利用構建順序預處理

Hugo 依照 `weight` 決定各 output format 的渲染順序，數字小的先渲染。這代表你可以讓某個 output format 先執行，把資料寫入 `.Store`，讓之後渲染的其他格式（例如 HTML）取用：

在 JSON 索引渲染期間寫入 store：

```go-html-template {title="layouts/home.searchIndex.json"}
{{- range site.RegularPages }}
  {{- $.Store.Set (printf "foo-%s" .RelPermalink) ($preProcessedResult) }}
{{- end }}
```

並且讀取：

```go-html-template
{{ $.Store.Get (printf "foo-%s" .RelPermalink) }}
```

此做法適合需要跨頁面彙總或預先計算一次的情境，如 [backlinks](https://github.com/jmooring/hugo-module-backlinks)。
