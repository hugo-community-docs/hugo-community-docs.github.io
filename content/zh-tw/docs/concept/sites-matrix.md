---
title: 'Sites Matrix'
slug: sites-matrix
weight: 500
---

在 Hugo 中每個語言都是獨立的 site，而 [Hugo v0.153.0](https://github.com/gohugoio/hugo/releases/tag/v0.153.0) 進一步引入了 sites matrix 概念，將原本單一維度的「一個 language 對應一個 site」提升到三個維度的組合。本篇說明這個概念，以及如何用它控制內容的產生範圍。

## 三個維度

舊模型裡，site 只有語言這一個變數，新模型把 site 定義為三個維度組合出來的交集：

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

設定檔使用到 sites 的地方包含

- [Module mounts](https://gohugo.io/configuration/module/#default-mounts)
- [Segments](https://gohugo.io/configuration/segments/)
- [Front matter](https://gohugo.io/content-management/front-matter/#sites)
- [Cascade](https://gohugo.io/configuration/cascade/#sites)

## 實際設定

多數專案的版本結構很單純：一個版本對應一個資料夾，不需要跨版本 fallback，實務上主要用在 module mount：

```yaml {title="hugo.yaml"}
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

意思是把 `content/vN.0.0` 這個模組<strong>固定（mount）</strong>在 `vN.0.0` 的版本 `content` 目錄，這樣設定後，`content/v2.0.0/` 底下的所有內容將只出現在 `v2.0.0` 這個 site。

也支援在 front matter 寫版本限制：

```yaml {title="index.md"}
---
title: New Feature
sites:
  matrix:
    versions: ["> v0.3.0"]
---
```

## 與模板搭配

模板同樣可以用 `.Rotate` 取得同一邏輯頁面在其他維度組合下的對應版本，常見於實作版本切換器：

```html
{{- with .Rotate "version" -}}
  <div>
    {{- range . -}}
      <a href="{{ .RelPermalink }}">{{ .Site.Version.Name }}</a>
    {{- end -}}
  </div>
{{- end -}}
```

Hugo 預設 `version` 為 `v1.0.0`，即使專案沒有真正啟用多版本，`.Rotate "version"` 也一定會有結果，因此外層仍需要額外條件判斷是否要顯示版本切換器，不能只靠 `.Rotate` 是否為空來判斷。

## 實際範例

請見 [hugo-testing-56516](https://github.com/jmooring/hugo-testing/tree/hugo-forum-topic-56516)。
