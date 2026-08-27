---
title: '多語言網站'
slug: multilingual
weight: 400
---

Hugo 每個語言就是獨立一個 site，每個 site 各自獨立，多語言網站中每種語言都是 language 這個維度上的一個 site，本篇說明具體應該如何設定。

## 設定

在 `hugo.yaml` 宣告網站使用的語言：

```yaml
defaultContentLanguage: en
languages:
  en:
    label: English
    locale: en
    weight: 1
  fr:
    label: Français
    locale: fr
    weight: 2
```

- `defaultContentLanguage`：預設語言，沒有標註語言的內容會歸屬於這個語言。
- `[languages.en]`, `[languages.en]` 用於和目錄名稱或檔名結尾比對（`en`, `fr`），字串完全相同才會視作同一種語言，若找不到相同的字串則回退到預設語言。**由於 Hugo 總是 lowercases 這些 key 又進行字串比較，因此你總是應該使用小寫設定**[^lowercase]。
- `weight`：決定語言在選單、切換器中的排序。

[^lowercase]: locale 設定除外，原因如同[基礎設定](../guide/basic-configuration.md#locale)所說。

## Content 目錄結構

有兩種方式把內容對應到語言，擇一使用即可。

### 檔名後綴標註語言

同一路徑、同一檔名，用語言代碼作為後綴區分：

```text
content/
├── about.en.md
└── about.fr.md
```

[Hugo v0.161.0](https://github.com/gohugoio/hugo/releases/tag/v0.161.0) 則支援更靈活的命名方式。

### 獨立目錄

每個語言用獨立的內容目錄，透過 `contentDir` 對應：

```yaml
module:
  mounts:
    - source: content/en
      target: content
    - source: content/fr
      target: content
```

```text
content/
├── en/
│   └── about.md
└── fr/
    └── about.md
```

兩個語言目錄底下相同路徑、相同檔名的內容，會被視為彼此的翻譯版本。

`contentDir` 實際運作是幫你設定了 `module.mount`，只是一個語法糖，前面的 `contentDir` 設定等同此 module 設定：

```yaml
module:
  mounts:
    - source: content/en
      target: content
    - source: content/fr
      target: content
```

我們可以先記住 `module` 這個詞彙，這是 Hugo 很強大的一個工具，在 [Hugo Modules](hugo-module.md) 我們會專門介紹他。

## 兩種結構如何選擇

對於個人部落格用戶兩者完全沒有任何差別，真要比較的話 hugo-community-docs 會這樣建議：

- 語言數量少、內容量小：用檔名結尾標註語言即可，設定最少。
- 語言數量多、或需要搭配版本（見 [Sites Matrix](./sites-matrix)）等其他維度混合使用：用獨立目錄，結構更清楚，也更容易對應到底層的 mount 設定，方便之後擴充。

開發者需要更多功能的則見 Hugo 在官方社群的說明

- [Using the multidimensional content model to fill-in missing translations](https://discourse.gohugo.io/t/using-the-multidimensional-content-model-to-fill-in-missing-translations/56741)
- [Do all page bundles need localized copies once you add a new language?](https://discourse.gohugo.io/t/do-all-page-bundles-need-localized-copies-once-you-add-a-new-language/37225)

## 頁面關聯

不論用哪種結構，Hugo 都以「路徑 + 檔名相同」判斷翻譯關聯。如果路徑或檔名不同，需要在 front matter 手動指定相同的 `translationKey`，強制關聯為同一頁面的不同語言版本：

```yaml
---
translationKey: 'about'
---
```

> [!INFO]
> 恭喜，如果你一路讀到這裡，代表你已經是一個能夠靈活運用 Hugo 的使用者了！後續內容偏向開發需求，你可以放心的跳過。
