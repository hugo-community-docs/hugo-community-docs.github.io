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

When you import multiple modules at once, files with the same name merge according to [UFS](project-structure.md) rules.

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

## Vendor

Use `hugo mod vendor` for local inspection and temporary debugging tweaks. This command copies every imported module into the `_vendor` directory.

Editing files inside `_vendor` directly is only useful for quick debugging. The next vendor run overwrites your changes. For real customization, keep using UFS: override the same path in your project root.

## Replace

Use the replace directive to permanently swap out a dependency, for example when you switch to your own fork:

```text {title="go.mod"}
require example.com/othermodule v0.1.0

replace example.com/othermodule => example.com/myfork/othermodule v0.1.0
```

Or point it to a local directory:

```text {title="go.mod"}
replace github.com/user/theme => /home/user/projects/theme
```

Because `replace` lives in `go.mod` and ships with your project, it applies to everyone who builds this project, including CI.

## Workspace{#workspace}

Use a workspace to configure modules for local development. Think of it as a temporary version of replace. For example, when you're developing a local module, you can point directly to your local files:

```text {title="hugo.work"}
go 1.20

use .
use ../theme
```

Enable it temporarily with an environment variable:

```sh
HUGO_MODULE_WORKSPACE=hugo.work hugo server
```

Or enable workspace mode long-term in `hugo.toml`:

```toml {title="hugo.toml"}
workspace = 'hugo.work'
```

The key difference between workspace and replace: workspace can be enabled temporarily and never gets written to `go.mod`. So when other people depend on your module, your replace settings won't affect them.

## Practical Examples

### Multilingual Sites

As described in [Multilingual Sites](multilingual.md#separate-directories), you can mount a given directory to a given site at a given location to complete multilingual configuration.

### Shared Component Libraries

The most basic use case: multiple sites sharing the same set of shortcodes, partials, or CSS. Extract them into an independent module that every site can import:

```toml
[module]
  [[module.imports]]
    path = 'github.com/your-org/shared-components'
```

### exampleSite

When building a theme, it's common to include an `exampleSite/` directory inside the theme's repo as a demo site. But that `exampleSite/` site depends on the theme sitting in the project's own root.

A workspace solves this cleanly:

```text {title="hugo.work"}
go 1.20

use .
use ../
```

```toml {title="hugo.toml"}
workspace = 'hugo.work'
```

### node_modules

Mounts also work with `node_modules`, letting you mount its contents directly into a target directory without manually vendoring the package. Configure it like this:

```toml
[module]
  [[module.mounts]]
  source = "assets"
  target = "assets"

  [[module.mounts]]
  source = "node_modules/@awmottaz/prettier-plugin-void-html/"
  target = "assets/prettier-plugin-void-html"
```

You can then use the contents of that directory directly in your JS and templates.

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
