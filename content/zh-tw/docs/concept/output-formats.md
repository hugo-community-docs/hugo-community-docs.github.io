---
title: '輸出格式'
slug: output-formats
weight: 900
---

Hugo 支援一個頁面可以同時擁有多種[輸出格式](https://gohugo.io/configuration/output-formats/)。

## 基本設定

在 `hugo.yaml` 定義要輸出的格式：

```yaml
outputFormats:
  searchIndex:
    mediaType: application/json
    baseName: filename
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

`layouts/home.searchIndex.json` 就會渲染 `public/filename.json`。

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
    - rss
    - markdown
```

對應模板 `layouts/page.markdown.md` 直接輸出 Markdown 格式的內容。

## 範例二：JSON 索引

模板遍歷所有頁面輸出成 JSON 索引用於站內搜尋功能：

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

用戶端在瀏覽器端讀取這份 JSON，不需要後端伺服器參與。

{{% details summary="Fuse.js 搜尋最小範例" %}}

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

{{% /details %}}

## 範例 3：為 `_headers` 產生 CSP 雜湊{#csp-hash}

將 `headers` 設定為較高的 `weight` 讓 Hugo 最後才輸出 `_headers` 檔案，此時其他輸出都已完成所有計算。每個 HTML 頁面會把內嵌腳本的雜湊存進 `hugo.Store`。接著 `_headers` 讀取已儲存的雜湊，建立 `Content-Security-Policy` 標頭。

在 `hugo.yaml` 定義格式。將 `delimiter` 設為空字串，檔名就會是沒有副檔名的 `_headers`：

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

在內嵌腳本之後儲存雜湊。請對壓縮後的內容計算雜湊避免內容因再次壓縮而變動：

```go-html-template {title="layouts/head.html"}
{{- $el := resources.Get "critical.js" | minify -}}
<script>{{ $el.Content | safeJS }}</script>
{{- $hash := printf "sha256-%s" ($el.Content | sha256 | encoding.HexDecode | base64Encode) -}}
{{- hugo.Store.SetInMap "js-hashes" "critical" $hash -}}
```

在 `layouts/home.headers` 讀取已儲存的雜湊：

```go-html-template {title="layouts/home.headers"}
{{- $s := "" -}}
{{- range $name, $hash := hugo.Store.Get "js-hashes" -}}
  {{- $s = printf "%s '%s'" $s $hash -}}
{{- end -}}
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' {{ $s }};
```
