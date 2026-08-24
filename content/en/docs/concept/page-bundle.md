---
title: 'Page Bundles'
slug: page-bundle
weight: 300
description: 'Leaf and branch bundles in Hugo'
---

This page explains how Hugo distinguishes content types through directory structure.

## Leaf Bundle and Branch Bundle

`index.md` and `_index.md` differ by only one underscore, but they mean completely different things.

- Leaf bundle: a directory containing `index.md`, representing a standalone page that **can't have child pages**.

  ```text
  content/posts/my-post/
  ├── index.md
  └── cover.png
  ```

- Branch bundle: a directory containing `_index.md`, representing a section, which can contain child pages or child sections.

  ```text
  content/posts/
  ├── _index.md
  └── my-post/
      ├── index.md
      └── cover.png
  ```

- Headless bundles: an advanced use case. The goal is to publish a bundle's content and assets without publishing the bundle's own page. See the [documentation](https://gohugo.io/content-management/build-options/) for details.

## post/index.md vs. post.md

Both `post/index.md` and `post.md` can create a standalone post, but only the former is a leaf bundle, which can own its own bundle resources, such as images or videos. The latter isn't a bundle, so it can't own any bundle resources.

You should always default to the `post/index.md` form for a consistent project structure, except in two cases:

1. The site has few or no image resources.
2. All site resources are managed under the `assets` directory.

Neither case needs bundle resources, so using `post.md` is simply cleaner and more straightforward.
