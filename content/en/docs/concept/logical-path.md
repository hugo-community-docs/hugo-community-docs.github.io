---
title: 'Logical Path'
slug: logical-path
weight: 200
description: 'How Hugo uses logical paths, rather than physical file paths, to understand the content directory structure.'
---

When Hugo processes content, what it actually works with is the logical path, not the file's physical path on disk.

## Logical Path

The logical path is how Hugo interprets the `content` directory structure. Take this directory structure, for example:

```sh
content/
└── movies/
    ├── m1/
    │   └── index.md
    └── m2.md
```

This maps to the logical path Hugo understands:

```sh
content/
└── movies/
    ├── m1
    └── m2
```

## Why It Matters

Logical paths are used in `hugo.toml` settings, such as the `pageRef` field in menu configuration, which uses a logical path so Hugo can identify the corresponding page and call related object methods. For example, [`HasMenuCurrent`](https://gohugo.io/methods/page/hasmenucurrent/) can determine whether the current page belongs inside that menu item.

For most users, it's enough to know how to convert a `content` path into its logical path. Under the hood, Hugo's content pages are registered into a radix tree, and Hugo relies on this tree to understand the content structure. The paths in that tree are logical paths, not physical file paths.
