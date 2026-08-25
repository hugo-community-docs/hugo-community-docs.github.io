---
title: FAQ
description: '針對建置 Hugo 網站時遇到的問題，提供切實可行的解決方案，這些方案均來自真實的故障排除經驗。'
---

## Partial 與 Template

`{{ template }}` 是 Go template 提供的 template 功能，只能直接渲染文字，沒有任何其他功能。`{{ partial }}` 則是 Hugo 在 template 的基礎包裝後提供的功能，額外支援計數、回傳值、`partialCache` 等功能。

應選擇 partial 而不是原生的 template。

## Inline Define

除了放在 `_partials` 目錄的獨立檔案，Hugo 也支援在模板內直接用 inline define 定義子模板，適合在不想額外建立檔案、只是要把當前模板裡的一小段內容抽離出來時採用。實際使用範例如下：

```go-html-template
<!-- template -->
{{ define "foo" }}
foo
{{ end }}

{{ template "foo" }}

<!-- partial -->
{{ define "_partials/inline/foo.html" }}
foo
{{ end }}

{{ partial "inline/foo.html" }}
```

Hugo 初始化時會先掃描所有模板，因此 inline define 沒有順序問題。inline define 定義的模板名稱是全域可見的，需注意命名問題。

## 設定檔合併

Hugo 對設定檔不同的鍵有不同的合併機制，分成不合併、淺層合併和深層合併，請見 [Merge configuration settings](https://gohugo.io/configuration/introduction/#merge-configuration-settings)。

最終的設定檔由於 UFS 機制所以設定會層層疊加，你可以用 `hugo config` 指令檢查最終結果。

## 環境變數

你可以透過環境變數在命令行中臨時修改設定而不需要更改檔案，比如 `HUGO_IGNOREFILES="['content/foo','content/bar']"`，詳細說明請見 [Environment variables](https://gohugo.io/configuration/introduction/#environment-variables)。

環境變數同時也能用於指定不同的 Hugo 設定目錄，請見官方的[設定教學](https://gohugo.io/configuration/introduction/#example)。

## 變數偵錯

只有以下方式，沒有任何其他方式：

1. `{{ $var }}`
2. `{{ debug.Dump $var }}`
3. `{{ highlight (jsonify (dict "indent" "  ") $var) "json" }}`
4. `{{ site.Store }}` + `{{ site.Get }}`
5. `{{ printf "type: %T, val: %s" $var $var }}`
6. `{{ warnf "%s $var" }}`
7. 以上方案搭配 console.log 在瀏覽器印出

以及 [debug 函式](https://gohugo.io/functions/debug/)，還有 [templates.Current](https://gohugo.io/troubleshooting/inspection/)。

## Live reload 沒有自動更新

某些情況下（例如模板只透過 partial 間接引用資料時），修改內容後 Hugo 的 live reload 不會自動偵測到變更。若遇到這種情況，可以在 `baseof.html` 最前面加上以下這行，強制觸發更新機制：

```go-html-template {title="layouts/baseof.html"}
{{ $noop := partial "..." }}
```

## .Page.Store.Get 沒有值

`.Page.Store` 有時序性，同一個 HTML 頁面的模板渲染，如果還沒執行到 `.Page.Store.Set` 則 `.Get` 不會有值。

若你的 `.Store.Set` 放在 *shortcode 內部*，只有這種情況可以使用 noop 技巧提前渲染：在模板前方使用 `{{ $noop := .Content }}` 提前渲染頁面，這樣會連同 shortcode 也一起渲染，`.Store.Set` 也連帶被執行。

`.Page.Content` method 在每個 HTML 頁面都是被快取的，因此此操作沒有任何副作用可以放心使用。

## Shortcode 運作

Shortcode 的目的是讓你不用手寫 HTML，運作方式則如下：

- Standard notation `{{</*  */>}}` 會先於 Markdown 其他內容渲染，並且被替換成一個佔位符號，這份包含佔位符號的 Markdown 則送進 Goldmark 渲染，渲染結束後再將佔位符號替換成 shortcode 先前已渲染好的結果，這份結果不會再被 Goldmark 處理一次。
- Markdown notation `{{%/*  */%}}` 同樣會先於 Markdown 其他內容渲染，但渲染結果會先插回 Markdown 內容裡，再一起送進 Goldmark 渲染，也就是說它會跟著整份頁面內容一起再處理一次。這通常用於將 shortcode 內容和頁面內容結合，如 ToC、footnote 這種頁面級別的功能就需要 Markdown notation。

## Nested shortcode 渲染順序

Nested shortcode 總是先渲染內層，再渲染外層。外層 shortcode 不知道內層的存在，而內層可以使用 `.Parent` 方式取得外層資訊。

## Nested shortcode 輸出損壞

這是因為 Markdown 對於空行和空隔敏感，以及使用錯誤的 shortcode notation。

核心原因為空行、空白、以及 Markdown 規範中四個空隔就會被視作 codeblock 渲染。

解決方式是 trim 所有空白，確保 nested shortcode 內外都被視作 HTML 處理，不被當作 Markdown 渲染。

## Nested shortcode 的 footnote/ToC

在 [shortcode 運作](#shortcode-運作)段落提到 ToC 這種需求需要 Markdown notation，那應該內層還是外層用？哪個應該使用 `.Page.RenderString`？

hugo-community-docs 的建議是外層 markdown notation，內層 standard notation，並且外層不要使用 `.Page.RenderString`。原理是內層先渲染成 HTML，放到外層，外層則和內層一起被放入 Markdown 文件內部再次送給 Goldmark 渲染，這時標題就會被納入整篇文章的 ToC 中。

## templates.Defer 運作

`templates.Defer` 目的是讓有些無法及時取得資訊的內容延後到所有內容都渲染結束，文件也已經寫入後，才再次寫入文件，這代表 `templates.Defer` 會對同一份文件寫入兩次拖累效能。

實際應用如[官方 `templates.Defer` 範例](https://gohugo.io/functions/templates/defer/)展示的一樣，TailwindCSS 在完全渲染之前不知道全部有哪些 classes，因此 defer 到所有內容都渲染結束，這就是他的最佳使用時機。

## partialCached 運作

Hugo 非常快，因此大多數情況無須擔心效能問題，而 [`partialCached`](https://gohugo.io/functions/partials/includecached/) 幾乎可以說是 Hugo 中唯一一個能進一步優化效能的方式。

他的原理是每個 [site](concept/sites-matrix.md) 各自獨立的 LRU cache，如果沒有設定 variant，則以 partial name 作為 cache key，否則以 partial name + variants 做 cache key，variant 可以是零個或多個。

目前（v0.165.0）`partialCached` 的 LRU size 設定為 1000，此數值為內部實現沒有對外保證，隨時可能變動。

## 相關文章運作

Hugo 的相關文章只依賴三個東西：

1. 文章的 taxonomy
2. 文章的 headings（如果開啟 [fragments](https://gohugo.io/content-management/related-content/#index-content-headings) 設定）
3. [其餘文章天生的屬性，屬於無法掌控的內容](https://github.com/gohugoio/hugo/blob/26f31ff6ce6c69f663b4ea1e62cae95cd6ab7b6d/resources/page/page.go#L264)

這個系統只會透過這兩個資訊將每篇文章的值進行精確字串匹配，並且剔除低於閾值的，以及剔除過常出現的標籤。這代表你的標籤要設定的剛剛好：不要太多太零散，也不能同質性過高。

## 正確的 UID 建立

UID 通常用於讓 JS 能明確指定節點，比如和 shortcode 搭配使用的 JS。雖然簡單的 `{{ time.Now.Unix }}` 可以正常運作，但是這會造成多次部署間即使內容不變，輸出的 HTML 仍然會變化，除了帶來 diff debug 的不方便之外，更大的問題是部署服務商會比較最近兩次部署結果並且只部署更改的檔案，這樣就浪費了網路傳輸和 CI 時間。

hugo-community-docs 的建議是使用 `.Store.Set` + `.Store.Get` 遞增變數，再加上一個 optional 的 slice 作為額外的 hash source，這樣即可做到穩定的 hash 來源，保證兩次構建的結果相同。
