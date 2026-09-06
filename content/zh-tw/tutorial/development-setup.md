---
title: '開發設定'
slug: development-setup
weight: 400
---

本文介紹 Hugo 開發相關設定。

## 編輯器設定

- VS Code 語法高亮和補全：[theNewDynamic/language-hugo-vscode](https://github.com/theNewDynamic/language-hugo-vscode)
- JetBrains 語法高亮和補全：[Smart Hugo](https://www.smarthugo.dev/)

## Formatter 設定

可以使用 prettier 插件以格式化 HTML + go-template。

```sh
npm install --save-dev prettier prettier-plugin-go-template
```

```json {title=".prettierrc"}
{
  "plugins": ["prettier-plugin-go-template"],
  "overrides": [
    {
      "files": ["*.html"],
      "options": {
        "parser": "go-template"
      }
    }
  ]
}
```

並且使用 `prettier --write --list-different FILE` 格式化。

也可以使用 Hugo 官方的 [gotmplfmt](https://github.com/gohugoio/gotmplfmt)，和 prettier 相比最大的差異為 gotmplfmt 不支援沒有任何設定，不支援 `style` 和 `script` 標籤，而且不是 npm 生態系。

### Markdown

[rumdl](https://github.com/rvben/rumdl) 是 Markdown LSP 而不只是 formatter，並且支援 Hugo 特殊用法，比如 shortcode, Markdown attributes, [custom root](https://rumdl.dev/md057/?h=057#configuration) 等等。
