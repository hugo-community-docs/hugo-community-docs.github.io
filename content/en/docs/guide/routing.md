---
title: 'URLs and Routing'
slug: routing
weight: 600
description: 'How Hugo determines each page URL, including default routing rules and how to customize them.'
---

This page explains how Hugo determines the URL for each page. Get URL management right from the start. Broken links damage a site more than almost anything else, so plan your approach early.

The default URL rules already fit most practical use cases, unless you have a clear, specific need. If you're building a general website or blog, skip ahead to [Setting a URL for a Single Page](#manually-setting-a-single-pages-url) and come back here later if you need to make adjustments.

## Default URL Rules

Hugo automatically generates a URL based on the file path under `content/`:

```text
content/posts/my-first-post.md   →   /posts/my-first-post/
content/about.md                 →   /about/
```

In other words, you don't need to set URLs manually. Place a file in the right directory and the URL is generated automatically.

## Custom URLs (Permalinks)

To change how URLs are generated, configure `permalinks` in `hugo.yaml`:

```yaml
[permalinks]
  posts = '/:year-:month-:slugorcontentbasename/'
```

The setting above makes URLs under `posts` include the year and month, for example:

```text
content/posts/my-first-post.md   →   /2026-08-my-first-post/
```

For the full configuration reference, see the [permalinks documentation](https://gohugo.io/configuration/permalinks/#article).

## Manually Setting a Single Page's URL

To change the URL of just one post, add `slug` to that post's front matter:

```markdown
---
title: 'My Post'
slug: 'custom-slug'
---
```

This changes only the final segment of the URL to `custom-slug`. To change the preceding path as well, use `url` to set the full path instead, for example `url: '/blog/post1'`.
