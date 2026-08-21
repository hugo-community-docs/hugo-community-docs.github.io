---
title: 'Creating a Site'
slug: quick-start
weight: 200
description: 'How to scaffold a new Hugo site, install a theme, and start the local development server.'
---

With Hugo installed, this page explains how to create a new site and start the local development server.

## Create a Project

```bash
hugo new project my-site
cd my-site
```

`hugo new project` creates the basic directory structure. At this point, the site has no theme or content yet.

## Installing a Theme

> [!INFO] Choosing an Installation Method
> The Git submodule approach does not require Go, but it does require solid Git experience to use correctly. If you are not comfortable with Git, hugo-community-docs strongly recommends using Hugo modules instead.
>
> Hugo modules, by contrast, keep the commands simple. Updating or downgrading is just `hugo mod get`. The same tasks take multiple commands with Git submodules.
{{% tabs group="module" %}}
  {{< tab label="Hugo Modules" >}}

The recommended approach. It is a Go module under the hood. Using [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) as an example:

```bash
git init
hugo mod init github.com/your-username/my-site  # or hugo mod init my-project
hugo mod get github.com/gohugo-ananke/ananke/v2
```

`git init` sets up a Git repository so you can track changes to your project. `hugo mod init` turns your site into a Go module. `hugo mod get` installs the theme.

Then add this to `hugo.toml`.

```toml
[module]
  [[module.imports]]
    path = "github.com/gohugo-ananke/ananke/v2"
```

  {{< /tab >}}

  {{< tab label="Git Submodule" >}}

Not recommended. Using [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) as an example:

```bash
git init
git submodule add https://github.com/gohugo-ananke/ananke.git themes/ananke
```

`git init` sets up a Git repository, which is required before adding a submodule. `git submodule add` clones the theme into `themes/ananke` as a separate, linked repository.

Then add this to `hugo.toml`.

```toml
theme = ["ananke"]
```

  {{< /tab >}}
{{% /tabs %}}

## Start the Development Server

First, add a few content files:

```bash
hugo new content _index.md                  # homepage
hugo new content posts/_index.md            # post list page
hugo new content posts/article-1/index.md   # standalone post
hugo new content posts/article-2/index.md   # standalone post
hugo new content posts/article-3/index.md   # standalone post
```

Then start the server:

```bash
hugo server -DEF
```

By default, the site runs at `http://localhost:1313`. The browser refreshes automatically when you save a file. Press `Ctrl + C` to stop the server.

> [!WARNING] Pages not found?
> Hugo skips draft, expired, and future-dated posts by default. If a post is missing, check these three flags first:
>
> - `-D` builds *draft* posts, controlled by the [`draft`](https://gohugo.io/configuration/all/#builddrafts) field in front matter
> - `-E` builds *expired* posts, controlled by the [`expiryDate`](https://gohugo.io/content-management/front-matter/#expirydate) field in front matter
> - `-F` builds *future* posts, controlled by the `date` field in front matter
>
> To avoid the draft issue entirely, remove `draft` from `archetypes/default.md`, the file that sets the default content for `hugo new content`.

## Build the Production Site

```bash
hugo
```

The build output goes to `public/`, which you can deploy directly to any static site hosting service.

<br>

{{% admonition type="tip" sign=" " title="Tip: gitignore" %}}

Auto-generated files are regenerated on every run, so tracking them serves no purpose and they shouldn't be tracked by version control. Add a `.gitignore` file in the project root to ignore them:

```text
# Hugo
/public/
/resources/_gen/
/exampleSite/public/
/exampleSite/resources/
jsconfig.json
hugo_stats.json
.hugo_build.lock

# System
.DS_Store
.tmp*

# Custom
!.vscode
node_modules

# vscode-front-matter
frontmatter.json
.frontmatter
```

{{% /admonition %}}
