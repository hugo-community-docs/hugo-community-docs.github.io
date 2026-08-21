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
│   │   └── hugo.toml   # Site configuration, can also live in the project root
│   └── production/     # Environment-specific overrides
├── content/            # Markdown content 
├── data/               # Custom data files (JSON/YAML/TOML) for templates
├── i18n/               # Translations
├── layouts/            # Template files, the site's HTML structure
├── public/             # Build output directory
├── resources/          # Resource processing cache
└── themes/             # Theme (if installed via git submodule)
```

`resources` and `public` are regenerated on every build. You should add both directories to `.gitignore`, since there's no benefit to tracking generated files in Git.

## UFS (Unified File System) {#ufs}

UFS is Hugo's core mechanism. Every directory except the two output and cache directories, `public/` and `resources/`, connects into UFS. This includes

- `archetypes/`
- `assets/`
- `content/`
- `layouts/`
- `static/`
- `data/`
- `i18n/`

Whether a theme lives under `themes/` as a git submodule or was installed as a Hugo Module, it connects into the UFS system the same way. UFS treats the project root and any matching directory names from themes or modules as a single virtual filesystem, layered by priority. Files in the project root take priority over the theme. When a file exists at the same path in both places, the root version overrides the theme version.

This means that to customize a theme's template, you don't need to touch the theme's source code at all. You just create a file at the same path under `layouts/` in your project root:

```text
themes/ananke/layouts/partials/xxx.html   # The theme's original file
layouts/partials/xxx.html                 # Your override, takes priority
```

This mechanism lets you keep updating the theme without losing your customizations, since your changes stay completely separate from the theme's source code. There's no need to fork the whole theme or manually merge changes.

> [!IMPORTANT]
> A common mistake is copying a theme's `assets` directory into the project root's `assets` directory. When the theme is later updated, the site still uses the old copied assets, and the styling breaks. Don't copy theme files into your own project unless you know exactly what you're doing.
