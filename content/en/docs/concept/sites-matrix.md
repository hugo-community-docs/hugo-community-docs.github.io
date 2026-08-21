---
title: 'Sites Matrix'
slug: sites-matrix
weight: 500
description: 'How Hugo v0.153.0 extends the single-dimension site model into a three-dimensional matrix of language, version, and role.'
---

The previous page, [Multilingual Sites](multilingual.md), introduced the concept of a site and explained that each language in Hugo is its own independent site. [Hugo v0.153.0](https://github.com/gohugoio/hugo/releases/tag/v0.153.0) went further and introduced the sites matrix concept, raising the old single dimension model of "one language equals one site" into a combination of three dimensions. This page explains the concept and how to use it to control the scope of content generation.

## From One Dimension to Three

In the old model, a site had only one variable: language. The new model defines a site as the intersection of three combined dimensions:

- language: The language
- version: The version
- role: The role, for example the same documentation could have a version aimed at developers and a version aimed at general users

With combinations of multiple languages, versions, and roles, many sites can be produced. Four languages times five versions times two roles, for instance, produces 80 sites.

## The Sites Matrix

The [Sites Matrix](https://gohugo.io/content-management/front-matter/#sites) is the setting used to **specify which site combinations a piece of content or a template applies to**. It's written in front matter or in a module mount, expressed as `sites.matrix`, and can constrain `languages`, `versions`, and `roles` independently:

```yaml
sites:
  matrix:
    versions: [v2.0.0]
```

When multiple dimensions appear together, they're combined with AND logic. Constraining both `languages` and `versions` at once, for example, means the setting only applies to sites matching both the language and the version:

```yaml
sites:
  matrix:
    languages: [zh-cn]
    versions: [v2.0.0]
```

Values are written as a glob slice. You can use `**` to match everything, or a semver expression:

```yaml
sites:
  matrix:
    versions: '>= v2.0.0'
```

## Practical Configuration

Most projects have a simple version structure: one version maps to one folder, with no need for cross version fallback. In practice this is mainly used with **module mounts**:

```yaml {title="hugo.toml"}
module:
  mounts:
    - source: content/v2.0.0
      target: content
      sites:
        matrix:
          versions: [v2.0.0]

    - source: content/v1.0.0
      target: content
      sites:
        matrix:
          versions: [v1.0.0]
```

This means the `content/vN.0.0` module is **mounted** onto the `content` directory of the `vN.0.0` version. With this configuration, everything under `content/v2.0.0/` will only appear on the `v2.0.0` site.

Version constraints can also be written in front matter:

```yaml {title="index.md"}
---
title: New Feature
sites:
  matrix:
    versions: ["> v0.3.0"]
---
```

## Using It with Templates

Templates can use `.Rotate` the same way, to fetch the corresponding version of the same logical page across other dimension combinations. This is commonly used to build a version switcher:

```html
{{- with .Rotate "version" -}}
  <div>
    {{- range . -}}
      <a href="{{ .RelPermalink }}">{{ .Site.Version.Name }}</a>
    {{- end -}}
  </div>
{{- end -}}
```

Hugo defaults `version` to `v1.0.0`. Even if a project hasn't actually enabled multiple versions, `.Rotate "version"` will always return a result. So you still need an additional condition to decide whether to show a version switcher at all. You can't rely solely on whether `.Rotate` is empty.

## A Working Example

See [hugo-testing-56516](https://github.com/jmooring/hugo-testing/tree/hugo-forum-topic-56516).
