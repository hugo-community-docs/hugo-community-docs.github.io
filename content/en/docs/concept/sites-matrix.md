---
title: 'Sites Matrix'
slug: sites-matrix
weight: 500
---

This article covers the sites matrix. In Hugo, each language is its own site, and [Hugo v0.153.0](https://github.com/gohugoio/hugo/releases/tag/v0.153.0) extended this from a single dimension, one language per site, into a combination of three dimensions.

## Three Dimensions

The new model defines a site along three dimensions:

- language: the language
- version: the version
- role: the audience, for example a developer-facing version of a doc versus an end-user-facing version

Combining multiple languages, versions, and roles produces multiple sites. 4 languages × 5 versions × 2 roles, for instance, produces 80 sites.

## Sites Matrix

The [sites matrix](https://gohugo.io/content-management/front-matter/#sites) specifies which site combinations a piece of content or a template applies to. It's expressed with `sites.matrix`, which can restrict `languages`, `versions`, and `roles` independently.

Multiple dimensions combine with AND logic. Restricting both `languages` and `versions`, for example, means only sites matching both apply. Here's a module mount example:

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

This targets `v2.0.0` of `zh-cn` specifically. Hugo uses sites in the following places:

- [Module mounts](https://gohugo.io/configuration/module/#default-mounts)
- [Segments](https://gohugo.io/configuration/segments/)
- [Front matter](https://gohugo.io/content-management/front-matter/#sites)
- [Cascade](https://gohugo.io/configuration/cascade/#sites)

## Real-World Configuration

Here's a multi-version site where each version maps to one folder:

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

With this setup, everything under `content/v1.0.0/` appears only on the `v1.0.0` site, and the same goes for `v2.0.0`.

Version restrictions can also be set in front matter:

```yaml {title="index.md"}
---
title: New Feature
sites:
  matrix:
    versions: ["> v3.0.0"]
---
```

For content that shouldn't be versioned at all, create a dedicated directory:

```yaml {title="hugo.yaml"}
module:
  mounts:
    - source: content/unversioned
      target: content
      sites:
        matrix:
          versions: "**"  # mounts to every version
```

## Complements{#complements}

`matrix.mounts.sites` is fairly straightforward to understand. Another setting at the same level as `matrix` is complements, which lets other language versions borrow content from this source when they're missing the corresponding resource.

Here's a concrete example:

```yaml {title="hugo.yaml"}
module:
  mounts:
    - source: content/zh-cn
      target: content
      sites:
        matrix:
          languages:
            - zh-cn
    - source: content/en
      target: content
      sites:
        matrix:
          languages:
            - 'en'
        complements:
          languages:
           - "*"
```

Both Chinese and English are mounted only to their own sites, but English is set as the complement for all languages. So when the Chinese site is missing a page that exists on the English site, the missing page falls back to the English version, without generating missing files for the Chinese site.

The key difference is that when the Chinese site lacks a page, links pointing to it from other pages will resolve directly to the English site instead, so browsing will cross over between the Chinese and English sites.

## Using It in Templates

Templates can use [`.Rotate`](https://gohugo.io/methods/page/rotate/) to get the equivalent of the current logical path across other dimension combinations. Here's a version switcher:

```html
{{- with .Rotate "version" -}}
  <div>
    {{- range . -}}
      <a href="{{ .RelPermalink }}">{{ .Site.Version.Name }}</a>
    {{- end -}}
  </div>
{{- end -}}
```

## Reference

- [Mixing Versioned and Non-Versioned Content](https://discourse.gohugo.io/t/question-about-the-multi-dimensional-content-model/57494)
- [Performance in multilingual project with site content mount fallbacks](https://discourse.gohugo.io/t/performance-in-multilingual-project-with-site-content-mount-fallbacks/57586)
