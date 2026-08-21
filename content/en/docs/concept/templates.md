---
title: 'The Template System'
slug: templates
weight: 600
description: 'What Hugo templates are, base template lookup order, and the difference between template, partial, and inline define.'
---

This page gives a brief overview of how Hugo decides which template to use when rendering a page.

## Page Kind

Kind determines a piece of content's role within the site structure, and maps a `content/` source to a `layouts/` template:

- `home`: The site's homepage
- `section`: Formerly called `list`. A section list page
- `taxonomy`: A page listing every value under a given taxonomy, such as `/tags/`. Hugo generates this automatically if no corresponding content file is provided.
- `term`: A page for a single term under a taxonomy, such as `/tags/hugo/`. Hugo generates this automatically if no corresponding content file is provided.
- `page`: Formerly called `single`. A single content page

The corresponding `content/` structure:

```text
content/
├── _index.md                    # home
├── posts/
│   ├── _index.md                # section
│   └── my-post/
│       └── index.md             # page (leaf bundle)
└── tags/
    ├── _index.md                # taxonomy (optional)
    └── hugo/
        └── index.md             # term (optional)
```

The corresponding `layouts/` structure:

```text
layouts/
├── home.html                    # home
├── section.html                 # section
├── taxonomy.html                # taxonomy
├── term.html                    # term
└── page.html                    # page
```

The actual [template lookup rules](https://gohugo.io/templates/new-templatesystem-overview/) are far more complex than this. What's listed here is only the most basic default mapping.

## Page Type

Type defaults to the name of the directory containing the content. For `content/movies/p1/index.md`, `type` defaults to `movies`. You can also set it explicitly through the `type` field in front matter:

```markdown {title="content/movies/p1/index.md"}
---
title: 'My Post'
type: 'posts'
---
```

Kind describes a page's role within the site structure. Type further determines which set of templates gets applied. Two pages can both have `page` kind, yet `posts` and `movies` can render with different templates by using different types. For example, to specify a template for movies:

```text
layouts/
├── movies
│   ├── page.html      # Dedicated page template
│   └── section.html   # Dedicated section template
├── home.html
├── section.html
├── taxonomy.html
├── term.html
└── page.html
```

## Layout

You can also specify a template filename directly using the `layout` field in front matter:

```markdown
---
title: 'My Post'
layout: 'custom'
---
```

This maps to

```text
layouts/
├── custom.html    # Selected via layout: custom
├── home.html
├── section.html
├── taxonomy.html
├── term.html
└── page.html
```

`layout` takes priority over whatever gets auto-determined from kind or type.

## Base Templates

Base templates are the `.html` files directly under `layouts/`, excluding the `_partials` and `_shortcodes` directories. They're written in Go template syntax and determine how content ultimately gets rendered as HTML.

```text
layouts/
├── baseof.html
├── page.html       # kind: page
├── home.html       # kind: home
├── section.html    # kind: section
├── taxonomy.html   # kind: taxonomy
├── term.html       # kind: term
├── _markup/        # Controls rendering for specific Markdown elements
├── _shortcodes/    # Not a base template
└── _partials/      # Not a base template
```

`baseof` is the foundation every template builds on. It typically uses `{{ block "main" }}{{ end }}`, and each other base template uses a matching `{{ define "main" }}...{{ end }}`, which gets inserted into the `main` block defined in `baseof`.

When Hugo renders a page, only these base templates matter directly. `_partials` are just reusable fragments that get called from within a base template.

## Other Base Templates

Hugo has other base templates too, but they're secondary, so they're covered here. These include:

- [Sitemap](https://gohugo.io/templates/sitemap/)
- [RSS](https://gohugo.io/templates/rss/)
- [robots.txt](https://gohugo.io/templates/robots/)
- [404](https://gohugo.io/templates/404/)

## Lookup Order

A single page can match multiple possible template filenames at once. Hugo picks the best match according to a priority order, roughly as follows, from highest to lowest:

1. A `layout` manually set in front matter
2. Page kind (`home`, `section`, `taxonomy`, `term`, `page`)
3. Other conditions such as language or output format
4. The `all.html` catch all template

What's covered here is just the basic concept, the actual rules are more complex. For the full rules, see the [official Hugo template lookup documentation](https://gohugo.io/templates/new-templatesystem-overview/).

## partial vs. template

`{{ template }}` is the templating feature built into Go's template package. It can only render text directly and offers nothing else. `{{ partial }}` is Hugo's own wrapper built on top of it, adding features like counting, return values, and partialCache. In practice, you should almost always use `partial`.

## Inline Define

Besides calling standalone `_partial` files, Hugo also supports defining a template inline, in the middle of another template. This is typically used to extract part of the current template into a sub template, in cases where creating a separate file isn't wanted or isn't necessary. Note that an inline define is visible globally.

Here's how it looks in practice:

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

Hugo scans every template first during initialization, so inline defines have no ordering problem.

## View

The `.Render` function is called a template [view](https://gohugo.io/templates/types/#view). Its purpose is to let **partials** automatically use the version at the matching path through the template lookup system. The upside is that the mapping happens automatically without writing conditionals by hand. The downside is that it only accepts

## Live reload will not update automatically

The update mechanism needs to be triggered by using `{{ $noop := partial "..." }}` at the beginning of the `baseof.html` file.
