---
title: 'Development Setup'
slug: development-setup
weight: 150
---

This article covers development-related setup for working with Hugo.

## Editor Setup

- VS Code syntax highlighting and autocomplete: [theNewDynamic/language-hugo-vscode](https://github.com/theNewDynamic/language-hugo-vscode)
- JetBrains syntax highlighting and autocomplete: [Smart Hugo](https://www.smarthugo.dev/)

## Formatter Setup

### HTML

You can use a Prettier plugin to format HTML + Go template files.

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

Format files with `prettier --write --list-different FILE`.

Alternatively, you can use Hugo's official [gotmplfmt](https://github.com/gohugoio/gotmplfmt). Compared to Prettier, its main differences are that it doesn't support any configuration options, doesn't support `style` or `script` tags, and isn't part of the npm ecosystem.

### Markdown

[rumdl](https://github.com/rvben/rumdl) is a Markdown LSP, not just a formatter, and it supports Hugo-specific conventions such as shortcodes, [Markdown attributes](https://rumdl.dev/flavors/?h=hugo#flavor-details), and a [custom root](https://rumdl.dev/md057/?h=057#configuration), among others.
