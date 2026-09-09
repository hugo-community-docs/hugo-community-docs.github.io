---
title: 'Content Authoring'
slug: content-authoring
weight: 300
description: 'Markdown, front matter, and shortcode syntax used when writing content for the site created in the previous page.'
---

This page covers the Markdown, front matter, and shortcode syntax you'll use when writing content.

## Content Structure {#content-structure}

A content directory looks like this:

```sh
content
├── _index.md              # 1. Home
├── docs
│   ├── _index.md          # 2. Section: List Page for Articles
│   ├── p1.md              # 3-1. Page: Filename Only
│   ├── p2                 # 3-2. Page: Using index.md
│   │   ├── foo.jpg
│   │   └── index.md
│   └── bar
│       ├── _index.md      # Section: Nested Section
│       ├── post-1.md
│       └── post-2.md
│
│
├── tags                   # Optional: Taxonomy and Term
│   ├── _index.md          # 4. Taxonomy: List Page for Tags
│   └── my-tag.md          # 5. Term: Single Tag Page (my-tag)
│
└── categories             # Optional: Another Taxonomy
    ├── _index.md          # Taxonomy: List Page for Categories
    └── tutorials.md       # Term: Single Category Page (tutorials)
```

### Home

Place the home page at `_index.md` in the top-level `content` directory.

### Section

Use `_index.md` to create a list page. `docs/_index.md` lists every article under `docs`. `docs/bar/_index.md` lists every article in the nested `bar` section.

### Page

Create a post with either `filename.md` or `filename/index.md`. Posts can't have child pages.

### Taxonomy

Use `tags/` and `categories/` to group articles into taxonomies. Just like a section, each taxonomy has its own `_index.md` as a list page. For example, `tags/_index.md` lists every tag.

Optional. Even without the actual file, Hugo still generates the corresponding HTML.

### Term

Each remaining file under a taxonomy directory is a single term page. `tags/my-tag.md` is the page for the `my-tag` tag. `categories/tutorials.md` is the page for the `tutorials` category.

Optional. Even without the actual file, Hugo still generates the corresponding HTML.

### p1.md or p2/index.md?

Both `p1.md` and `p2/index.md` create a standalone post, but only `p2/index.md` can hold its own page resources, such as images or videos. Default to the `post-name/index.md` form to keep your project structure consistent. Use `post.md` only in two cases:

1. Your site has little or no image or other asset content.
2. Your site manages all assets under the `assets` directory.

Neither case needs page resources, so `post.md` is simpler and cleaner.

## Front Matter

Front matter is the block at the start of every content file that records that content's metadata. It supports three formats, yaml, YAML, and JSON, distinguished purely by delimiter:

- yaml: wrapped in `+++`
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

Front matter settings override the settings in `hugo.yaml`. `params` holds theme-specific settings. Hugo can still read theme settings that aren't placed under `params`, but it's recommended to always nest them there, since this keeps things clearer and more intuitive when migrating themes or managing the site.

## HTML in Markdown

Hugo parses Markdown according to the [CommonMark](https://commonmark.org/) spec. If you're not familiar with Markdown syntax, see [Learn Markdown in Y Minutes](https://learnxinyminutes.com/markdown/), or test rendering live in the [Playground](https://spec.commonmark.org/dingus/).

You can also write raw HTML directly inside Markdown content, but it's stripped out by default. To allow it, enable this in `hugo.yaml`:

```yaml
markup:
  goldmark:
    renderer:
      unsafe: true
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

Where you place an image determines how you reference it. Hugo has three common locations: `assets/`, as a `page resource` alongside your content, or `static/`. A later page covers the full directory structure; for now, here's how to reference images from each:

- `assets/`

  Place images in `assets/img/` and reference them after processing through Hugo Pipes:

  ```markdown
  ![Alt text](/img/photo.png)
  ```

- `Page resource`

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
- `Page resources` are meant to be accessed from within the page that owns them. It's difficult for other pages to access another page's page resources.

> [!INFO]
> If an image path fails to resolve, that indicates a bug in the theme's [image render hook](https://gohugo.io/render-hooks/images/) logic. Report it to the theme, or enable `renderHooks.image.useEmbedded = always` yourself.

## Referencing Posts

hugo-community-docs recommends always linking with the file extension included, for example `[link](../post-1/index.md)`, since this allows your IDE to autocomplete, navigate, and catch broken links.

> [!INFO]
> If a link path fails to resolve, that indicates a bug in the theme's [link render hook](https://gohugo.io/render-hooks/links/) logic. Report it to the theme, or enable `renderHooks.link.useEmbedded = always` yourself.

## Shortcodes

Shortcodes are a way to insert template logic into Markdown content, used to handle things Markdown syntax alone can't, such as embedding videos, building tabs, or calling components provided by a theme.

For example, embedding a YouTube video:

```markdown
{{</* youtube id="dQw4w9WgXcQ" */>}}
```

{{< youtube id="dQw4w9WgXcQ" >}}

Shortcodes have two syntax forms: `{{</*   */>}}` and `{{%/*   */%}}`. Most cases use `{{</*   */>}}`, but which syntax a specific shortcode requires depends on how that shortcode is implemented internally. Refer to the documentation provided by the theme or the shortcode's author to be sure.

To display shortcode syntax itself in your content without executing it, wrap it in `{{</*/* */*/>}}`:

```markdown
{{</*/* youtube id="dQw4w9WgXcQ" */*/>}}
```
