---
title: '網址與路由'
slug: routing
weight: 600
---

這篇文章說明 Hugo 如何決定每個頁面的網址。從一開始就把網址管理做對，失效連結對網站的傷害幾乎大於一切，因此要及早規劃好你的做法。

除非有非常明確的需求，否則預設的網址規則對大多數人來說就是最符合實務需求的設定。若只是想架設一般網站或部落格，可以直接跳到[手動指定單篇網址](#手動指定單篇網址)，需要調整時再回來查閱。

## 預設網址規則

Hugo 會依照 `content/` 底下的檔案路徑，自動產生對應的網址：

```text
content/posts/my-first-post.md   →   /posts/my-first-post/
content/about.md                 →   /about/
```

也就是說你不需要手動設定網址，把檔案放在對的目錄，網址就自動產生好了。

## 自訂網址（permalinks）

如果想要改變網址的產生規則，可以在 `hugo.toml` 設定 `permalinks`：

```toml
[permalinks]
  posts = '/:year-:month-:slugorcontentbasename/'
```

上面的設定會讓 `posts` 底下的文章網址變成包含年份與月份，例如：

```text
content/posts/my-first-post.md   →   /2026-08-my-first-post/
```

完整設定方式請參閱 [permalink 文檔](https://gohugo.io/configuration/permalinks/#article)。

## 手動指定單篇網址

如果只想改變某一篇文章的網址，可以在該篇文章的 front matter 加上 `slug`：

```markdown
---
title: '我的文章'
slug: 'custom-slug'
---
```

這會將網址的「最後一段路徑」改為 `custom-slug`。如果想要連前面的路徑都修改，則使用 `url` 設定完整路徑，如 `url: '/blog/post1'`。
