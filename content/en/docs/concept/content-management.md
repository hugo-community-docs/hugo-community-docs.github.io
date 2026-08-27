---
title: 'Content Management'
slug: content-management
weight: 50
description: 'This article covers everything related to Hugo''s content directory.'
---

This article covers everything related to the content directory.

<!--more-->

## Archetypes

Archetypes are the default content Hugo uses when you run `hugo new content` to create a new post. They support functions and methods, for example:

```yaml {title="archetypes/default.md"}
---
date: '{{ .Date }}'
title: '{{ .File.ContentBaseName }}'
---

... more
```

Just place the file at `archetypes/default.md`. You can also set different defaults for different page types. See the [Archetypes documentation](https://gohugo.io/content-management/archetypes/) for details.

## Page Bundle

`index.md` and `_index.md` differ by a single underscore, but they carry entirely different meaning.

- Leaf bundle: a directory containing `index.md` represents a standalone page that **cannot have child pages**.

  ```text
  content/posts/my-post/
  ├── index.md
  └── cover.png
  ```

- Branch bundle: a directory containing `_index.md` represents a section, which can contain child pages or child sections.

  ```text
  content/posts/
  ├── _index.md
  └── my-post/
      ├── index.md
      └── cover.png
  ```

- [Headless bundles](https://gohugo.io/content-management/build-options/): an advanced use case, mainly for publishing specific pages or assets without publishing the bundle itself.

## Content Structure

A typical content directory looks like this:

```text
content
├── _index.md            # 1. Home page
├── docs
│   ├── _index.md        # 2. List page
│   ├── p1.md            # 3-1. Post page: filename only
│   ├── p2               # 3-2. Post page: using index.md
│   │   ├── foo.jpg
│   │   └── index.md
│   └── bar              # Nested page
│       ├── _index.md    # List page for the nested section
│       ├── post-1.md
│       └── post-2.md
└── tags
    ├── _index.md        # 4. List page for tags
    └── my-tag.md        # Tag page
```

1. The home page is the `_index.md` at the top level
2. Every other `_index.md` with a leading underscore is a list page
3. A post page can use either a `filename.md` or a `filename/index.md`
4. A tag's `_index.md` is likewise a list page

Both `p1.md` and `p2/index.md` can create a standalone post, but only the latter is a leaf bundle, which can own its own bundle resources such as images or video. The former isn't a bundle, so it can't own bundle resources of its own.

You should default to the `post/index.md` form to keep your project structure consistent, except in two cases:

1. The site has little or no image or other asset content
2. All site assets are managed under the `assets` directory

Neither case needs bundle resources, so using `post.md` directly is simpler and cleaner.

## Referencing Posts and Images

See [Content Authoring](../guide/content-authoring.md#referencing-images).

## Shortcode

See [Content Authoring](../guide/content-authoring.md#shortcodes).

## Summary and Description

In Hugo, the difference is that Summary can be generated automatically from the start of a post and supports HTML, while Description is entered manually in front matter and only supports plain strings. How a site actually uses these two fields depends entirely on the theme, not on Hugo itself.

Automatic Summary generation can be controlled through `summaryLength`, and preserves `<p>` tags rather than cutting through them. You can also truncate a summary manually in Markdown with `<!--more-->`, but be careful not to leave any space around it.

## Math

Hugo supports rendering math through its [passthrough render hook combined with the KaTeX engine](https://gohugo.io/functions/transform/tomath/), but how each theme actually implements math rendering varies. Check your theme's documentation for details.

## Syntax Highlighting

Hugo handles syntax highlighting with [Chroma](https://github.com/alecthomas/chroma), which offers [a range of styles](https://gohugo.io/quick-reference/syntax-highlighting-styles/#gallery) to choose from. Since syntax highlighting comes down to CSS, Hugo has no visibility into how a given theme implements it. Check your theme's documentation for the specific setup.

## Markdown Attributes

Markdown attributes are a Markdown extension that let you attach HTML attributes to a target element for finer control. You need to enable this feature in your configuration file:

```toml {title="hugo.toml"}
[markup]
  [markup.goldmark.parser.attribute]
    block = true
    title = true
```

If your theme uses a custom render hook, that render hook needs to implement Markdown attributes correctly as well. Here's the syntax for each element:

**Heading**

```md
## H1{class="foo"}
```

**Paragraph**

```md
A Markdown paragraph.
{class="foo"}
```

**Table**

```md
| A | B |
| - | - |
| x | y |
{class="foo"}
```

**Code block**

`````md
```sh {class="foo"}
echo "Hello World"
```
`````

**Image**

```md
![foo](foo.jpg)
{class="foo"}
```

## Taxonomies

Hugo supports content classification built around `taxonomy` and `term`:

- `taxonomy` represents a classification scheme, such as `/tags/`, which represents the `tags` scheme
- `term` represents each key within that scheme; in `/tags/my-tag/`, `my-tag` is a term under tags

Set this in front matter as follows:

```md
---
title: Foo
tags:
  - Tag A
  - Tag B
---
```

Hugo lets you define additional taxonomies by setting the `taxonomies` field in `hugo.toml`:

```toml {title="hugo.toml"}
[taxonomies]
  category = 'categories'
  tag = 'tags'
  author = 'authors'
  film = 'films'
```

Name each taxonomy using the `singular = plural` format.

## Authors

How authors are implemented depends entirely on the theme. Check your theme's documentation for details.

Hugo recommends treating authors as a taxonomy. This makes it painless to scale to multiple authors later, and fits naturally with how Hugo organizes content. See the [multi-author example](https://discourse.gohugo.io/t/authors-taxonomy-to-handle-site-and-page-authors/56151) for a working setup.

## Related Content

For a typical blog, how related posts get selected largely comes down to whether two posts share the same taxonomies; other factors are hard to control directly. Beyond taxonomies, the only thing you can adjust as a user is [the weight of different fields in your configuration](https://gohugo.io/configuration/related-content/).

See [How related content works](../faq.md#related-article) for details.

## Logical Path

A logical path represents where a piece of content sits within the `content` directory. It's how Hugo understands the structure of that directory. For example, given this structure:

```sh
content/
└── movies/
    ├── m1/
    │   └── index.md
    └── m2.md
```

Hugo resolves these to the logical paths `/movies/m1` and `/movies/m2`, respectively.

A logical path isn't limited to files that physically exist under `content`. Hugo also assigns logical paths to automatically generated pages, such as taxonomy and term pages.

As a user, you'll mainly use logical paths when configuring `hugo.toml`, for example setting `pageRef` in a menu configuration to a logical path so Hugo can resolve the corresponding page and call related methods on it. For instance, [`HasMenuCurrent`](https://gohugo.io/methods/page/hasmenucurrent/) can check whether the current page falls under that menu item.

As a developer, [most path-related methods](https://gohugo.io/methods/page/path/#finding-pages) work with logical paths.

## Multilingual Sites

See [Multilingual Sites](multilingual.md).
