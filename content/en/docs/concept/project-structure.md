---
title: 'Project Structure and UFS'
slug: project-structure
weight: 100
description: 'The standard Hugo directory layout and how the Unified File System merges project, theme, and module directories.'
---

## Project Structure

A standard Hugo project has this structure:

```text
my-project/
├── archetypes/         # Default templates for new content
├── assets/             # Can be processed via Hugo Pipes (CSS, JS, images)
├── static/             # Can't be processed, copied to output as is
├── config/
│   ├── _default/       # Default config
│   │   └── hugo.yaml   # Site configuration, can also live in the project root
│   └── production/     # Environment-specific overrides
├── content/            # Markdown content 
├── data/               # Data files (JSON/YAML/yaml) for templates
├── i18n/               # Translations
├── layouts/            # Template files, the site's HTML structure
├── public/             # Build output directory
├── resources/          # Resource processing cache
└── themes/             # Theme (if installed via git submodule)
```

`resources` and `public` are regenerated on every build. You should add both directories to `.gitignore`, since there's no benefit to tracking generated files in Git.

## Unified File System{#ufs}

UFS (Unified File System) is Hugo's core mechanism for merging files. It treats directories with the same name in your project root, your theme, and your modules as one virtual file system. These layers stack by priority: files in your project root always override the theme's files, and when multiple themes share the same path, the theme loaded later overrides the one loaded earlier. The directories connected to UFS include:

- `archetypes/`
- `assets/`
- `content/`
- `layouts/`
- `static/`
- `data/`
- `i18n/`

Themes under `themes/` directory, as well as modules installed through Hugo Modules, both connect to the UFS system.

UFS lets you customize a theme without forking it. Just create a file at the matching path under your project root's `layouts/`:

```sh
.
├── layouts/
│   └── _partials/
│       └── xxx.html            # Your override, takes priority
└── themes/
    └── ananke/
        └── layouts/
            └── _partials/
                └── xxx.html    # Theme's original file
```

> [!IMPORTANT]
> Don't copy theme files into your own project unless you know exactly what you're doing. A common mistake is copying a theme's `assets` into the root `assets` directory. When the theme is later updated, part of your site will still use the old copied files, causing broken styles.

## UFS Merge Rules

When multiple files share the same filename, priority runs from the first source to the last. Each directory follows its own merge rule:

- `archetypes`、`assets`、`content`、`layouts`、`static`、`data`: These merge file by file, using whichever copy sits closest.
- `i18n`: These merge by key depth, so translations or data from multiple sources stack together.

The `hugo.yaml` configuration file also gets merged, and each field follows its own merge rule. See [Merge configuration settings](https://gohugo.io/configuration/introduction/#merge-configuration-settings) for details.
