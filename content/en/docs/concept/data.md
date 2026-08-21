---
title: 'Data'
weight: 700
description: 'What the Data directory is for, how its contents are loaded into memory, and when to use assets instead.'
---

The Data directory stores only three file types: TOML, YAML, and JSON. What makes this directory distinctive is that once Hugo starts, its contents get loaded into Hugo's memory and stay there until the build finishes, without ever being cleared in between. Large structural files that aren't shared across multiple pages should go in the `assets` directory instead, since Hugo garbage-collects the memory `assets` files occupy once processing completes.

For usage details, see the [official documentation](https://gohugo.io/content-management/data-sources/).
