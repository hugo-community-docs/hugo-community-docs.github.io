---
title: 'Content Authoring'
slug: content-authoring
weight: 300
description: 'Markdown, front matter, and shortcode syntax used when writing content for the site created in the previous page.'
---

Building on the site created in the previous page, this page covers the Markdown, front matter, and shortcode syntax you'll use when writing content.

## Front Matter

Front matter is the block at the start of every content file that records that content's metadata. It supports three formats, TOML, YAML, and JSON, distinguished purely by delimiter:

- TOML: wrapped in `+++`
- YAML: wrapped in `---`
- JSON: wrapped directly in `{ }`

The three formats are functionally identical, so pick one. YAML is recommended, since most tools default to supporting YAML, and some support only YAML.

A YAML-format Markdown front matter block looks like this:

```markdown {title="posts/article-1/index.md"}
---
title: 'My First Post'
date: '2026-08-15T10:00:00+08:00'
lastmod: '2026-08-15T10:00:00+08:00'
draft: false
tags: ['hugo', 'notes']
params:
  showToc: true
---

The body of the post starts here.
```

Common fields:

| Field | Purpose |
| --- | --- |
| `title` | The title |
| `date` | Publish date. **If the date is in the future, the `-F` flag is required to build the page.** |
| `lastmod` | The last modification date |
| `draft` | Draft status. **If `true`, the `-D` flag is required to build the page.** |
| `tags` / `categories` | Categorization, displayed depending on theme support |
| `weight` | Manual sort weight |
| `params` | Theme-specific settings. Hugo's core doesn't process these. They're read entirely by theme templates. |

Front matter settings override the settings in `hugo.toml`. `params` holds theme-specific settings. Hugo can still read theme settings that aren't placed under `params`, but it's recommended to always nest them there, since this keeps things clearer and more intuitive when migrating themes or managing the site.

> [!TIP]
> If you're not familiar with TOML, YAML, or JSON at all, convert `hugo.toml` to YAML format. That way you only need to learn one format instead of confusing yourself by learning two at once.

## HTML in Markdown

Hugo parses Markdown according to the [CommonMark](https://commonmark.org/) spec. If you're not familiar with Markdown syntax, see [Learn Markdown in Y Minutes](https://learnxinyminutes.com/markdown/), or test rendering live in the [Playground](https://spec.commonmark.org/dingus/).

You can also write raw HTML directly inside Markdown content, but it's stripped out by default. To allow it, enable this in `hugo.toml`:

```toml
[markup.goldmark.renderer]
  unsafe = true
```

When this isn't enabled, HTML tags are removed.

Also, there **must be a blank line** between HTML and the surrounding Markdown content. Otherwise Goldmark treats that block as plain HTML and won't parse the Markdown syntax inside it:

```markdown
<div>

The **bold text** here will render correctly.

</div>
```

```markdown
<div>
The **bold text** here will not render, the asterisks will be output literally.
</div>
```

## Referencing Images

Where you place an image determines how you reference it. Hugo has three common locations: `assets/`, as a *page bundle* alongside your content, or `static/`. A later page covers the full directory structure; for now, here's how to reference images from each:

- `assets/`

  Place images in `assets/img/` and reference them after processing through Hugo Pipes:

  ```markdown
  ![Alt text](/img/photo.png)
  ```

- `Page Bundle`

  Place both the image and the content file in the same directory under `content`, and reference the image with a relative path:

  ```markdown
  ![Alt text](foo.png)
  ```

- `static/`

  Place images at `static/foo.png`. These are copied to the output directory unchanged and must be referenced with an absolute path:

  ```markdown
  ![Alt text](/foo.png)
  ```

hugo-community-docs recommends placing images in `assets/`:

- Files in `static/` aren't processed at all, and are output even if unused.
- `static/` uses absolute paths (`/foo.png`). If the site is deployed to a subdirectory (for example `example.com/blog/`), every link needs to be updated to match. Links generated through `assets/` automatically resolve to the correct path, so no manual link changes are needed if the site moves or its deployment path changes.
- Images placed as page bundles are difficult to reuse from other pages.

> [!INFO]
> If an image path fails to resolve, that indicates a bug in the theme's [image render hook](https://gohugo.io/render-hooks/images/) logic. Report it to the theme, or enable `renderHooks.image.useEmbedded = always` yourself.

## Referencing Posts

hugo-community-docs recommends always linking with the file extension included, for example `[link](../post-1/index.md)`, since this allows your IDE to autocomplete, navigate, and catch broken links.

> [!INFO]
> If a link path fails to resolve, that indicates a bug in the theme's [link render hook](https://gohugo.io/render-hooks/links/) logic. Report it to the theme, or enable `renderHooks.link.useEmbedded = always` yourself.

> [!TIP]
> To check link correctness, you can use external tools such as [rumdl](https://github.com/rvben/rumdl). Its [MD057](https://rumdl.dev/md057/) rule supports Markdown links and assets, along with absolute link detection and autocompletion, a feature currently unique among Markdown linters.

## Shortcodes

Shortcodes are a way to insert template logic into Markdown content, used to handle things Markdown syntax alone can't, such as embedding videos, building tabs, or calling components provided by a theme.

For example, embedding a YouTube video:

```markdown
{{</* youtube id="dQw4w9WgXcQ" */>}}
```

{{< youtube id="dQw4w9WgXcQ" >}}

Shortcodes use one of two syntaxes: `{{</*   */>}}` or `{{%/*   */%}}`. In practice, about 90% of cases use `{{</*   */>}}`, but which syntax a specific shortcode requires depends on how that shortcode is implemented internally. Follow the documentation provided by the theme or the shortcode's author.

To display shortcode syntax itself in your content without executing it, wrap it in `{{</*/* */*/>}}`:

```markdown
{{</*/* youtube id="dQw4w9WgXcQ" */*/>}}
```
