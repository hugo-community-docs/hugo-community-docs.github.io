---
title: 'Sites Matrix'
slug: sites-matrix
weight: 500
---

本文說明 Sites Matrix，Hugo 每個語言都是獨立的 site，而 [Hugo v0.153.0](https://github.com/gohugoio/hugo/releases/tag/v0.153.0) 進一步將原本單一維度的「一個 language 對應一個 site」提升到三個維度的組合。

## 三個維度

新模型的 site 三個維度定義如下：

- language：語言
- version：版本
- role：角色，例如同一份文檔要給開發者看的版本，跟給一般使用者看的版本

在多種語言、多個版本、多種角色的組合下會產生多個 site，例如 4 種語言 × 5 個版本 × 2 種角色，可以產生 80 個 site。

## Sites Matrix

[Sites Matrix](https://gohugo.io/content-management/front-matter/#sites) 是用來指定某份內容或某個模板該套用到哪些 site 組合的設定，用 `sites.matrix` 表示，可以分別限制 `languages`、`versions`、`roles`。

多個維度同時出現時是 AND 條件，例如同時限制 `languages` 與 `versions`，代表只有語言與版本都符合的 site 才會套用，以 module mount 為例：

```yaml {title="hugo.yaml"}
module:
  mounts:
    - sites:
        matrix:
          languages:
            - zh-cn
          versions:
            - v2.0.0
```

代表指定 `zh-cn` 的 `v2.0.0`。Hugo 使用到 sites 的地方包含

- [Module mounts](https://gohugo.io/configuration/module/#default-mounts)
- [Segments](https://gohugo.io/configuration/segments/)
- [Front matter](https://gohugo.io/content-management/front-matter/#sites)
- [Cascade](https://gohugo.io/configuration/cascade/#sites)

## 實際設定

以多版本網站，一個版本對應一個資料夾為例：

```yaml {title="hugo.yaml"}
baseURL: https://example.org/
locale: en-US
title: Sites Matrix
defaultContentVersion: v2.0.0
defaultContentVersionInSubdir: true
versions:
  v1.0.0: {}
  v2.0.0: {}
module:
  mounts:
    - source: content/v2.0.0
      target: content
      sites:
        matrix:
          versions:
            - v2.0.0
    - source: content/v1.0.0
      target: content
      sites:
        matrix:
          versions:
            - v1.0.0
```

這樣設定後，`content/v1.0.0/` 底下的所有內容將只出現在 `v1.0.0` 這個 site，`v2.0.0` 也同理。

也支援在 front matter 寫版本限制：

```yaml {title="index.md"}
---
title: New Feature
sites:
  matrix:
    versions: ["> v3.0.0"]
---
```

不受版本控制的內容則可以建立專屬目錄：

```yaml {title="hugo.yaml"}
module:
  mounts:
    - source: content/unversioned
      target: content
      sites:
        matrix:
          versions: "**"  # 掛載到所有版本
```

## 搭配模板

模板可以用 [`.Rotate`](https://gohugo.io/methods/page/rotate/) 取得當前 logical path 在其他維度組合下的對應版本，以版本切換按鈕為例：

```html
{{- with .Rotate "version" -}}
  <div>
    {{- range . -}}
      <a href="{{ .RelPermalink }}">{{ .Site.Version.Name }}</a>
    {{- end -}}
  </div>
{{- end -}}
```

## 參考

- [混合版本化與非版本化內容](https://discourse.gohugo.io/t/question-about-the-multi-dimensional-content-model/57494)
