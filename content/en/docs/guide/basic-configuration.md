---
title: 'Basic Configuration'
slug: basic-configuration
weight: 500
description: 'The most important hugo.toml settings to know first, out of the hundreds available.'
---

Hugo's configuration file has hundreds of possible settings, which is bound to overwhelm beginners. This page's purpose is to highlight the settings in `hugo.toml` that matter most, so you don't get lost in the sheer volume of options.

## [baseURL](https://gohugo.io/configuration/all/#baseurl)

The site's production URL, which needs a trailing slash:

```toml
baseURL = 'https://example.com/'
```

## [locale](https://gohugo.io/configuration/all/#locale)

The site's language code, which affects output like the RSS feed and the HTML `lang` attribute:

```toml
locale = 'zh-TW'
```

> [!INFO]
> Hugo's docs reference RFC 5646 extensively, which seems to imply you need to follow its casing rules strictly. But internally, Hugo actually **forces every language string to lowercase**, with one exception: `locale`, which is used purely for template rendering and never touched by Hugo's internal processing. This means:
>
> 1. Only `locale` should follow the `language-REGION` format (e.g. `en-US`), with the language subtag in lowercase and the region subtag in uppercase.
> 2. Everything else stays lowercase for consistency, always. You never need to worry about casing beyond that.

## [title](https://gohugo.io/configuration/all/#title)

The site title, used by most themes in the header and the browser tab title:

```toml
title = 'My Site'
```

## [theme](https://gohugo.io/configuration/all/#theme)

Specifies which theme to use, matched by theme name (for the git submodule approach):

```toml
theme = ['ananke']
```

The theme lives in the `themes/ananke` directory.

The Hugo Modules approach doesn't use `themes` and is installed as a module instead:

```toml
[module]
  [[module.imports]]
    path = "github.com/gohugo-ananke/ananke"
```

## [taxonomies](https://gohugo.io/configuration/taxonomies/)

Custom taxonomies. This setting determines whether Hugo processes tags at all. Whether tags are actually rendered is up to the theme:

```toml
[taxonomies]
  tag = 'tags'
  category = 'categories'
```

## [pagination](https://gohugo.io/configuration/pagination/)

Settings for paginated lists:

```toml
[pagination]
  pagerSize = 10  # Number of posts per page
  path = "p"      # Pagination path
```

## [menu](https://gohugo.io/configuration/menus/)

The site's navigation menu. Most themes read this setting to generate header or sidebar links:

```toml
[menus]
  [[menus.main]]
    name = 'Home'
    pageRef = '/'
    weight = 10

  [[menus.main]]
    name = 'Posts'
    pageRef = '/posts'
    weight = 20
```

- `name` is the displayed label.
- `pageRef` refers to a [logical path](../concept/logical-path.md).
- Lower `weight` numbers sort earlier.
- If a target directory doesn't render, try adding an `identifier` field to resolve it.
- `menu` settings can be placed under the `languages` block to support localization, for example:

  ```toml {title=hugo.toml}
  [languages]
    [languages.en-us]
      label = 'English'
      locale = 'en-US'
      weight = 1
      [languages.en-us.menus]
        [[languages.en-us.menus.main]]
          name = 'Home'
          pageRef = '/'
          weight = 10
        [[languages.en-us.menus.main]]
          name = 'Posts'
          pageRef = '/posts'
          weight = 20
    [languages.fr-fr]
      label = 'Français'
      locale = 'fr-FR'
      weight = 2
      [languages.fr-fr.menus]
        [[languages.fr-fr.menus.main]]
          name = 'Accueil'
          pageRef = '/'
          weight = 10
        [[languages.fr-fr.menus.main]]
          name = 'Articles'
          pageRef = '/posts'
          weight = 20
  ```

## params

The block for theme-specific settings. Its contents are entirely up to the theme, so consult your theme's documentation:

```toml
[params]
  showToc = true
```

Like `menus`, `params` can be moved under `languages.params` to support localization. For more on localized settings, see the [languages documentation](https://gohugo.io/configuration/languages/#localized-settings).

## [markup](https://gohugo.io/configuration/markup/)

### markup.goldmark

[Goldmark](https://github.com/yuin/goldmark) is what converts Markdown to HTML internally in Hugo. This setting controls the fine grained conversion rules.

### [renderer unsafe](https://gohugo.io/configuration/markup/#rendererunsafe)

Whether raw HTML inside Markdown content is allowed to render. Defaults to `false`:

```toml
[markup.goldmark.renderer]
  unsafe = true
```

When this isn't enabled, HTML tags in your content are stripped out.

### [extensions typographer](https://gohugo.io/configuration/markup/#typographer)

Controls how characters like `...`, `"`, and `'` are rendered. By default they're converted to curly variants.

```toml
[markup]
  [markup.goldmark.extensions.typographer]
    apostrophe = '&rsquo;'
    disable = false
    ellipsis = '&hellip;'
    emDash = '&mdash;'
    enDash = '&ndash;'
    leftAngleQuote = '&laquo;'
    leftDoubleQuote = '&ldquo;'
    leftSingleQuote = '&lsquo;'
    rightAngleQuote = '&raquo;'
    rightDoubleQuote = '&rdquo;'
    rightSingleQuote = '&rsquo;'
```

## Permalinks

Link management is important enough to warrant its own page. See [URLs and Routing](routing.md).

## archetypes

`archetypes` isn't a setting inside `hugo.toml`. It's a directory in your project.

It controls the default content of Markdown files created by `hugo new content`. hugo-community-docs recommends removing `draft: true` from it first, so you don't waste time debugging a page that simply didn't build because you forgot the `-D` flag.
