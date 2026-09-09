---
title: 'Content Management'
slug: content-management
weight: 200
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

## Cascade

Cascade lets you set values for every piece of content under a given path at once, so you don't have to configure each file individually. You can set cascade [in `hugo.yaml`](https://gohugo.io/configuration/cascade/), or [in front matter](https://gohugo.io/content-management/front-matter/#cascade-1).

## Content Structure

See [Content Authoring](../guide/content-authoring.md#content-structure).

## Referencing Posts and Images

See [Content Authoring](../guide/content-authoring.md#referencing-images).

## Shortcode

See [Content Authoring](../guide/content-authoring.md#shortcodes).

## Summary and Description

In Hugo, the difference is that Summary can be generated automatically from the start of a post and supports HTML, while Description is entered manually in front matter and only supports plain strings. How a site actually uses these two fields depends entirely on the theme, not on Hugo itself.

Automatic summary generation can be controlled with [`summaryLength`](https://gohugo.io/configuration/all/#summarylength), and it preserves `<p>` tags without truncating them mid-tag. You can also insert `<!--more-->` in Markdown to mark the cutoff point manually. Note that there must be no spaces inside the marker.

## Math

Hugo supports rendering math through its [passthrough render hook combined with the KaTeX engine](https://gohugo.io/functions/transform/tomath/), but how each theme actually implements math rendering varies. Check your theme's documentation for details.

## Syntax Highlighting

Hugo handles syntax highlighting with [Chroma](https://github.com/alecthomas/chroma), which offers [a range of styles](https://gohugo.io/quick-reference/syntax-highlighting-styles/#gallery) to choose from. Since syntax highlighting comes down to CSS, Hugo has no visibility into how a given theme implements it. Check your theme's documentation for the specific setup.

## Markdown Attributes

Markdown attributes are a Markdown extension that let you attach HTML attributes to a target element for finer control. You need to enable this feature in your configuration file:

```yaml {title="hugo.yaml"}
markup:
  goldmark:
    parser:
      attribute:
        block: true
        title: true
```

If your theme uses a custom render hook, that render hook needs to implement Markdown attributes correctly as well. Here's the syntax for each element:

**Heading**

```md
## H2{class="foo"}
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

Hugo lets you define additional taxonomies by setting the `taxonomies` field in `hugo.yaml`:

```yaml {title="hugo.yaml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
  film: films
```

Name each taxonomy using the `singular = plural` format.

## Authors

How authors are implemented depends entirely on the theme. Check your theme's documentation for details.

Hugo recommends treating authors as a taxonomy. This makes it painless to scale to multiple authors later, and fits naturally with how Hugo organizes content. See the [multi-author example](https://github.com/gohugoio/hugoDocs/issues/2494#issuecomment-2008486011) for a working setup.

## Related Content

For a typical blog, how related posts get selected largely comes down to whether two posts share the same taxonomies; other factors are hard to control directly. Beyond taxonomies, the only thing you can adjust as a user is [the weight of different fields in your configuration](https://gohugo.io/configuration/related-content/).

See [How related content works](../../tutorial/faq.md#related-article) for details.

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

As a user, you'll mainly use logical paths when configuring `hugo.yaml`, for example setting `pageRef` in a menu configuration to a logical path so Hugo can resolve the corresponding page and call related methods on it. For instance, [`HasMenuCurrent`](https://gohugo.io/methods/page/hasmenucurrent/) can check whether the current page falls under that menu item.

As a developer, [most path-related methods](https://gohugo.io/methods/page/path/#finding-pages) work with logical paths.

## Multilingual Sites

See [Multilingual Sites](multilingual.md).
