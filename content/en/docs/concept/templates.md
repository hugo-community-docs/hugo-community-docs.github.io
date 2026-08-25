---
title: 'Template System'
slug: templates
weight: 600
description: "Learn how Hugo's template lookup system chooses which template renders a page, based on page kind, type, layout, filename conditions, and directory structure."
---

This article introduces Hugo's template lookup mechanism, which determines which template applies to each page. Three core concepts drive this mechanism: page kind, page type, and the layout manually specified in front matter. Once you understand these core concepts, we'll walk through the full template classification, then explain the complete lookup order. Two examples at the end will tie everything together.

## Page Kind

Hugo defines five kinds:

- `home`: the site's home page
- `page`: a single content page, formerly called `single`
- `section`: a section list page, formerly called `list`
- `taxonomy`: a list page for all terms under a taxonomy, such as `/tags/`. Hugo generates this automatically if no content file exists
- `term`: a page for a single term under a taxonomy, such as `/tags/hugo/`. Hugo generates this automatically if no content file exists

Mapping between the `content/` structure and page kind:

```text
content/
├── _index.md                    # home
├── posts/
│   ├── _index.md                # section
│   └── my-post/
│       └── index.md             # page
└── tags/
    ├── _index.md                # taxonomy (optional)
    └── hugo/
        └── index.md             # term (optional)
```

Mapping between the `layouts/` structure and page kind by default:

```text
layouts/
├── home.html                    # home
├── section.html                 # section
├── taxonomy.html                # taxonomy
├── term.html                    # term
└── page.html                    # page
```

## Page Type

After Hugo determines the page kind, it determines the page type, which decides which set of templates to use within that kind.

For example, pages of the same `page` kind under `content/posts/` and `content/movies/` can use different templates through different types:

```text
layouts/
├── movies/
│   ├── page.html      # page template for movies
│   └── section.html   # section template for movies
├── home.html
├── section.html
├── taxonomy.html
├── term.html
└── page.html
```

Type defaults to the name of the directory containing the content. For example, `content/movies/p1/index.md` defaults to type `movies`. You can also set it explicitly through the `type` field in front matter:

```markdown {title="content/movies/p1/index.md"}
---
title: 'My Post'
type: 'posts'
---
```

## Layout

Beyond kind and type, you can specify a template filename directly through the `layout` field in front matter:

```markdown
---
title: 'My Post'
layout: 'custom'
---
```

This maps to:

```text
layouts/
├── custom.html    # set by layout: custom
├── home.html
├── section.html
├── taxonomy.html
├── term.html
└── page.html
```

The `layout` field takes precedence over kind- or type-based resolution.

> [!TIP]
> A simple way to think about the three:
>
> 1. Page kind identifies the page type, such as a tag list or a regular post.
> 2. Page type further narrows this down, letting different types use different templates.
> 3. Layout is set manually in front matter, suited to standalone pages like about or privacy.

## Template Categories

This section introduces the template categories under the `layouts` directory, including important content such as base templates and page templates.

### Base Templates{#base-template}

A base template is `baseof.html`, the shared outer structure for all page templates. It typically defines common elements such as `html`, `head`, and `body`, keeping the site consistent and easier to maintain.

A base template typically calls the [block](https://gohugo.io/functions/go-template/block/) function, which Hugo replaces with the matching section from a [page template](#page-template) when the following conditions are met:

- The page template contains a `define` action
- The page template contains no content that would render directly

If these conditions aren't met, Hugo ignores the base template and renders the page template on its own. Examples of correct and incorrect usage follow:

{{% tabs %}}
  {{< tab label="Correct" >}}

```go-html-template {title="layouts/baseof.html"}
<!DOCTYPE html>
<html lang="{{ site.Language.Locale }}">
<body>
  <main>
    {{ block "main" . }}
      This content gets replaced by the matching
      define "main" action in the page template
      that applies this base template.
    {{ end }}
  </main>
</body>
</html>
```  

```go-html-template {title="layouts/home.html"}
{{ define "main" }}
  This content replaces the block "main" action
  in the base template.
  {{ template "inlineTemplate" }}
{{ end }}

{{/* Only whitespace and comments are allowed outside define actions */}}

{{ define "inlineTemplate" }}
  Inline define is allowed here because it doesn't render directly.
{{ end }}
```

  {{< /tab >}}

  {{< tab label="Incorrect" >}}

`layouts/baseof.html` is identical to the correct example, but the page template contains content that would render directly.

```go-html-template {title="layouts/home.html"}
{{ define "main" }}
  This content can't replace the block, because the line below
  contains content that would render directly (<!-- Foo -->).
  As a result, the home page doesn't apply baseof.html,
  and the template renders blank.
{{ end }}

<!-- Foo -->
```

  {{< /tab >}}
{{% /tabs %}}

### Page Templates{#page-template}

Page templates map one to one with page kinds. Common page templates include:

```text
layouts/
├── baseof.html
├── page.html       # kind: page
├── home.html       # kind: home
├── section.html    # kind: section
├── taxonomy.html   # kind: taxonomy
├── term.html       # kind: term
├── single.html     # fallback for page
├── list.html       # fallback for home / section / taxonomy / term
├── all.html        # final fallback for every page template
├── _markup/        # controls how Markdown elements render (render hooks)
├── _shortcodes/    # called from content pages, not a page template
└── _partials/      # reusable sections, not a page template
```

Where:

- `single` is the fallback when no `page` template exists
- `list` is the fallback when no `home`, `section`, `taxonomy`, or `term` template exists
- `all` is the final fallback for every page template

### Other Templates

Beyond page templates, Hugo supports the following specialized template types:

- [Sitemap](https://gohugo.io/templates/sitemap/): the site map
- [RSS](https://gohugo.io/templates/rss/): feed content
- [robots.txt](https://gohugo.io/templates/robots/): crawler rules
- [404](https://gohugo.io/templates/404/): content shown for missing pages

### Render Hooks

Render hooks let you customize how Hugo converts specific Markdown elements to HTML, such as customizing the output of images, links, or headings. Render hooks live under `_markup/` and support the following types:

- [Blockquote](https://gohugo.io/render-hooks/blockquotes/)
- [Code block](https://gohugo.io/render-hooks/code-blocks/)
- [Heading](https://gohugo.io/render-hooks/headings/)
- [Image](https://gohugo.io/render-hooks/images/)
- [Link](https://gohugo.io/render-hooks/links/)
- [Passthrough](https://gohugo.io/render-hooks/passthrough/)
- [Table](https://gohugo.io/render-hooks/tables/)

### The `_partials` Directory{#partials}

`layouts/_partials` holds reusable template fragments, invoked with the `partial` function. To render `layouts/_partials/head.html`:

```go-html-template
{{ partial "head.html" . }}
```

The first argument is the template name, and the second (`.`) is the context passed in.

### The `_shortcodes` Directory{#shortcodes}

`layouts/_shortcodes` holds templates called from Markdown content, used to insert structured components such as embedded audio, video, or other HTML elements.

### View

A [view](https://gohugo.io/templates/types/#view) template automatically applies a different template depending on the page, rather than always rendering through one fixed template the way `partial` does.

View templates render through the `.Render` method, and follow the same [lookup order](#lookup-order) as other Hugo templates.

## Lookup Order{#lookup-order}

The basic priority order is as follows:

1. A `layout` set manually in front matter
2. A dedicated template for the page kind (home, section, taxonomy, term, page)
3. The `single` fallback for page, or the `list` fallback for home / section / taxonomy / term
4. `all.html`, the final fallback

This covers only the basic concepts. Hugo's actual lookup rules go further: filenames can chain multiple conditions with `.`, and the directory depth of a template also affects priority. Both are covered below.

### Chaining Conditions with `.`{#conditional-template}

A filename separated by `.` lets a single template filter on multiple conditions at once, such as language, output format, or page kind. Separate each condition with `.` in the filename:

```text
home.rss.xml           → applies only to RSS output for the home page
section.de.html        → applies only to the German section page

baseof.section.de.html → the baseof base template for the German section page
```

Conditions include:

- language: language
- role: role (see [Sites Matrix](sites-matrix.md))
- version: version (see [Sites Matrix](sites-matrix.md))
- outputformat: [output format](https://gohugo.io/configuration/output-formats/), such as a custom JSON output
- mediatype: [media type](https://gohugo.io/configuration/output-formats/)
- kind: kind
- type: type
- layout: layout

As of [v0.161.0](https://github.com/gohugoio/hugo/releases/tag/v0.161.0), you can also mark these more explicitly, for example `home._outputformat_rss_.xml`, `section._language_de_.html`, or `baseof._kind_section_._language_de_.html`.

Support for each condition varies by template type:

| Template Type               | Page Kind | Output Format | Language | Path Distance |
|------------------------------|:---------:|:--------------:|:--------:|:----------:|
| [Base template](#base-template) | Yes   | Yes             | Yes      | Yes        |
| [Page template](#page-template) | Yes   | Yes             | Yes      | Yes        |
| Render hook                  | ❌        | Yes             | Yes      | Yes        |
| Shortcode                    | ❌        | Yes             | Yes      | ❌         |
| Partial                      | ❌        | ❌              | ❌       | ❌         |
| View                         | ❌        | ❌              | ❌       | ❌         |

See below for path distance.

### Path Distance{#path-distance}

The closer a template's path is to the content being rendered, the higher its priority, and **path distance takes precedence over filename conditions**. Hugo only compares filename conditions when path distance is equal.

For example, given both `layouts/movies/page.html` and `layouts/page.de.html`, when rendering a German page under `content/movies/`, `page.de.html` matches an additional condition (language), but Hugo still picks `movies/page.html`, since its path is closer.

## Complete Site Example

The following two examples show how every template type covered in this article comes together in a real project.

### Simple Site

The most basic site needs only one base template, plus one page template per page kind.

```text
layouts/
├── baseof.html
├── home.html
├── page.html
├── section.html
├── taxonomy.html
├── term.html
├── _markup/
│   └── render-image.html
├── _partials/
│   ├── header.html
│   └── footer.html
└── _shortcodes/
    └── audio.html
```

### Complex Site

A larger site may need dedicated templates and render hooks for specific types or sections, and use view templates to render the same content differently depending on context.

```text
layouts/
├── baseof.html
├── home.html
├── page.html
├── section.html
├── taxonomy.html
├── term.html
├── all.html
├── custom.html
├── movies/
│   ├── page.html
│   ├── section.html
│   ├── _markup/
│   │   └── render-image.html
│   └── action/
│       ├── page.html
│       └── _markup/
│           └── render-image.html
├── films/
│   ├── _views/
│   │   └── card.html
│   ├── page.html
│   └── section.html
├── _markup/
│   └── render-image.html
├── _partials/
│   ├── header.html
│   └── footer.html
└── _shortcodes/
    └── audio.html
```
