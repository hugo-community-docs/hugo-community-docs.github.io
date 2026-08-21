---
title: 'Page Bundles'
slug: page-bundle
weight: 300
description: 'Leaf and branch bundles in Hugo'
---

This page explains how Hugo distinguishes content types through directory structure.

## Leaf Bundle and Branch Bundle

- Leaf bundle: A directory containing `index.md`, representing a standalone page that **can't have child pages**.

  ```text
  content/posts/my-post/
  ├── index.md
  └── cover.png
  ```

- Branch bundle: A directory containing `_index.md`, representing a section, which can contain child pages or child sections.

  ```text
  content/posts/
  ├── _index.md
  └── my-post/
      ├── index.md
      └── cover.png
  ```

- Headless bundles: An advanced use case, mainly for placing assets at a given location without publishing a page. See the [documentation](https://gohugo.io/content-management/build-options/).

`index.md` and `_index.md` differ by only one underscore, but they mean completely different things.

## post/index.md vs. post.md

Both `post/index.md` and `post.md` can create a leaf bundle, but only the former can hold its own bundle resources, such as images or videos. The latter isn't a bundle, so it naturally can't hold bundle resources either.

You should always choose the `post/index.md` form to keep your project structure consistent, with two exceptions:

1. The site has almost no image or other resources.
2. All site resources are planned to live in the `assets` directory.

Neither case needs bundle resources, so using `post.md` directly is simply cleaner.
