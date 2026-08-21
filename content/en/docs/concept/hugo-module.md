---
title: 'Hugo Modules'
slug: hugo-modules
weight: 600
description: 'What a Hugo module is, how to initialize and import one, common hugo mod commands, and practical patterns like vendoring, replace, and multi-environment mounts.'
---

The previous pages, [Sites Matrix](sites-matrix.md) and [Multilingual](multilingual.md), both mentioned the module mount concept. This is one of Hugo's most significant features, and this page covers Hugo Modules and the corresponding `hugo mod` command in detail.

## What Is a Module

A module is Hugo's basic unit for organizing content. A module can be a full Hugo project, or it can be a small reusable package that provides just one type of component (content, layouts, assets, data, i18n, static, archetypes). A theme you install is, at its core, a module.

Modules can be combined freely, referenced in a nested way, and can even mount external directories, including directories from non-Hugo projects. Everything gets merged into the same [UFS](project-structure.md#ufs).

## Initialization and Imports

Your project must become a module itself before it can import other modules:

```bash
hugo mod init github.com/user/theme
```

This generates `go.mod`. If you don't plan on letting others import your module, the exact name doesn't matter much, pick anything reasonable.

Declare the module you want to import in `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = 'github.com/user/theme'
```

Running `hugo` to build the site automatically downloads the module, caches it, and generates `go.sum` to record its version and checksum.

When importing multiple modules, files with the same name are merged by priority, top to bottom, with different rules for different directories:

- `data`, `layouts`, `static`, `archetypes`: merged at the file level. Only the highest-priority version of each file is used, contents aren't combined.
- `i18n`: merged at the key level. Translations or data from multiple sources are combined together.

## Common Commands

Here is a summary of commonly used `hugo mod` commands:

- Update a single module:

    ```bash
    hugo mod get -u github.com/user/theme
    ```

- Pin a specific version:

    ```bash
    hugo mod get -u github.com/user/theme@v0.42.0
    ```

- Update all modules:

    ```bash
    hugo mod get -u
    ```

- Update modules recursively:

    ```bash
    hugo mod get -u ./...
    ```

- Clean up unused entries in `go.mod`/`go.sum`:

    ```bash
    hugo mod tidy
    ```

- Clear the module cache:

    ```bash
    hugo mod clean
    ```

## Vendoring: Local Inspection and Temporary Edits

`hugo mod vendor` copies every imported module into a `_vendor` directory:

```bash
hugo mod vendor
```

This is useful for offline builds, or when you need to temporarily inspect or modify a module's source code for debugging.

Editing files inside `_vendor` directly is only good for quick debugging. Running vendor again overwrites your changes. The proper way to customize is still through UFS, overriding at the same path in your project root.

## Replace: Permanent Dependency Override

Use `replace` in `go.mod` to permanently swap a module's source, for example switching to your own fork:

```text {title="go.mod"}
replace github.com/user/theme => github.com/your-fork/theme v0.1.0
```

Or point it to a local directory:

```text {title="go.mod"}
replace github.com/user/theme => /home/user/projects/theme
```

`replace` lives in `go.mod` and ships with your project, so it applies to everyone who builds it, including CI.

## hugo.work: Local Development{#workspace}

Use `hugo.work` to work on a local module, like a theme you're building, without publishing a new version for every change:

```text {title="hugo.work"}
go 1.25

use .
use ../theme
```

Point `hugo.toml` at this file to enable Go workspace mode:

```toml {title="hugo.toml"}
workspace = 'hugo.work'
```

Or enable it using environment variable:

```sh
HUGO_MODULE_WORKSPACE=hugo.work hugo server
```

## Practical Examples

The flexibility of modules isn't limited to installing themes. It can also solve real project structure problems.

### Multilingual Sites

As described in [Multilingual Sites](multilingual.md#separate-directories), you can mount a given directory to a given site at a given location to complete multilingual configuration.

### Shared Component Libraries

The most basic use case: multiple sites sharing the same set of shortcodes, partials, or CSS. Extract them into an independent module that every site can import:

```toml
[module]
  [[module.imports]]
    path = 'github.com/your-org/shared-components'
```

### exampleSite and hugo.work

A common pattern when developing a theme is to place an `exampleSite/` directory inside the theme repo, containing a demonstration `content/` and `hugo.toml`. This directory itself isn't part of the theme's component scope, since the theme itself only needs `layouts/`, `assets/`, and similar.

The configuration is the same as described in [hugo.work: Local Development](#workspace) above.

### Separating Content From Source Code

Split `content/` and `assets/` into their own module, backed by an independent git repo, so writers never need to touch the theme's source code:

```toml
[module]
  [[module.imports]]
    path = 'github.com/your-org/site-content'
```

Writers only need access to the independent `site-content` repo, so they can't accidentally touch `layouts/` or other code. Engineers only need to configure CI to download this module at build time, which cleanly separates responsibilities.

For local development where you need to see content changes immediately, combine this with the `replace` approach mentioned earlier, pointing to a local path, or mount it through a workspace instead.

### Separating Configuration Across Environments

Switch which `data/` or `params` gets imported depending on whether you're building the production site or the preview site:

```toml {title="config/staging/hugo.toml"}
[module]
  [[module.imports]]
    path = 'config-staging'
```

```toml {title="config/production/hugo.toml"}
[module]
  [[module.imports]]
    path = 'config-production'
```

The `config/staging` and `config/production` directories [switch automatically](https://gohugo.io/configuration/introduction/#example) based on an environment variable, or manually set via `hugo -e staging`. With CI/CD, the configuration module to import switches based on the deployment environment.
