---
title: 'Logical Path'
slug: logical-path
weight: 200
---

When Hugo processes content, it actually works with logical paths, not physical paths on the filesystem.

## Logical Path

A logical path represents where content sits within the `content` directory. It's how Hugo interprets your `content` directory structure. Take this directory structure as an example:

```sh
content/
└── movies/
    ├── m1/
    │   └── index.md
    └── m2.md
```

Hugo interprets these as the logical paths `/movies/m1` and `/movies/m2`.

Logical paths aren't limited to files that physically exist in `content`. Hugo also assigns logical paths to pages it generates automatically, such as taxonomy and term pages.

## Why It Matters

Logical paths are used in `hugo.toml` settings, such as the `pageRef` field in menu configuration, which uses a logical path so Hugo can identify the corresponding page and call related object methods. For example, [`HasMenuCurrent`](https://gohugo.io/methods/page/hasmenucurrent/) can determine whether the current page belongs inside that menu item.
