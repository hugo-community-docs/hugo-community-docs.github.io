---
title: 'Multilingual Sites'
slug: multilingual
weight: 400
description: 'How Hugo treats each language as its own independent site, and how to configure languages, content structure, and page relationships.'
---

In Hugo, each language is an independent site In a multilingual website, each language is a site on the `language` dimension. This page explains how to configure it.

> [!INFO]
> If you've made it this far, you can already build, and manage a Hugo site with confidence. This is the last user-facing topic. If you only need a simple personal site, feel free to skip everything after this.

## Configuration

Declare the languages your site uses in `hugo.toml`:

```toml
defaultContentLanguage = 'en'

[languages.en]
  label = 'English'
  locale = 'en'
  weight = 1

[languages.fr]
  label = 'Français'
  locale = 'fr'
  weight = 2
```

- `defaultContentLanguage`: The default language. Content with no language tag belongs to this language.
- `[languages.en]`, `[languages.fr]`: Used to match against a directory name or filename suffix (`en`, `fr`). Only an exact string match counts as the same language. If no matching string is found, Hugo falls back to the default language. **Because Hugo always lowercases these keys before comparing them, you should always write your settings in lowercase**[^lowercase].
- `weight`: Determines the ordering of languages in menus and switchers.

[^lowercase]: The `locale` setting is the exception, for the same reason explained in [Basic Configuration](../guide/basic-configuration.md#locale).

## Content Directory Structure

There are two ways to map content to a language. Pick one.

### Language Suffix in the Filename

Same path, same filename, distinguished by a language code suffix:

```text
content/
├── about.en.md
└── about.fr.md
```

[Hugo v0.161.0](https://github.com/gohugoio/hugo/releases/tag/v0.161.0) also supports more flexible naming.

### Separate Directories

Each language gets its own content directory, mapped through `contentDir`:

```toml
[languages.en]
  contentDir = 'content/en'

[languages.fr]
  contentDir = 'content/fr'
```

```text
content/
├── en/
│   └── about.md
└── fr/
    └── about.md
```

Content at the same path and filename under two different language directories is treated as a translation of the same page.

Under the hood, `contentDir` sets up a `module.mount` for you. Each language directory actually scopes `sites.matrix.languages`. It's just syntactic sugar. The `contentDir` setting above is equivalent to this module configuration:

```toml
[module]
  [[module.mounts]]
    source = 'content/en'
    target = 'content'

  [[module.mounts]]
    source = 'content/fr'
    target = 'content'
```

Worth remembering the term `module` here. It's a powerful part of Hugo that we'll cover in detail in a later page.

## Choosing Between the Two Structures

For a personal blog, the two approaches make no practical difference. If you want an actual comparison, here's hugo-community-docs's recommendation:

- Few languages, small amount of content: Use the filename suffix approach. It requires the least configuration.
- Many languages, or combined with other dimensions such as versioning (see [Sites Matrix](./sites-matrix)): Use separate directories. The structure is clearer, maps more directly to the underlying mount configuration, and is easier to extend later.

Developers who need more advanced functionality can refer to Hugo's official community discussion:

- [Using the multidimensional content model to fill-in missing translations](https://discourse.gohugo.io/t/using-the-multidimensional-content-model-to-fill-in-missing-translations/56741)
- [Do all page bundles need localized copies once you add a new language?](https://discourse.gohugo.io/t/do-all-page-bundles-need-localized-copies-once-you-add-a-new-language/37225)

## Page Relationships

Regardless of which structure you use, Hugo determines translation relationships by matching "same path plus same filename." If the path or filename differs, you need to manually set a matching `translationKey` in front matter, to force two pages to be linked as different language versions of the same page:

```yaml
---
translationKey: 'about'
---
```

> [!INFO]
> Congratulations! if you've read this far, you're now a confident Hugo user. What follows leans toward development needs, so feel free to skip it.
