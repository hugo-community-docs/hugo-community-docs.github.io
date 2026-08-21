---
lastmod: '2026-08-15T04:09:57+08:00'
title: 'Installing Hugo and Its Toolchain'
linkTitle: Installation
slug: installation
weight: 100
description: 'How to install Hugo on each operating system and configure the PATH environment variable it needs to run.'
---

This page explains how to install Hugo on each operating system and set up the environment variable (PATH) it needs to run.

## Hugo Editions

Hugo ships in three editions.

- Standard: the base edition. It does not include Sass/SCSS processing.
- Extended: the edition recommended for most use cases. It includes built-in Sass/SCSS compilation. As of [v0.153.0](https://github.com/gohugoio/hugo/releases/tag/v0.153.0), it is identical to the standard edition.
- Extended/Deploy: builds on Extended and adds the `hugo deploy` command, which lets you deploy directly to cloud storage services.

If you are not sure which one to pick, install the **Extended edition**.

## Installation Methods

You can install Hugo through a package manager or by downloading the binary manually. As explained in [Understanding Hugo](introduction.md#single-executable), Hugo is a single binary executable, so you can also download it and run it directly. Here is how the two approaches compare.

- Package manager: manages your system packages in one place, but you need to learn how to use it. Some package managers also make it hard to downgrade or pin a specific version.
- Manual binary: you install and manage versions by hand. It takes a bit more effort, but comes with no restrictions.

<br>
<br>

{{% tabs %}}
  {{< tab label="Package Manager" >}}

Pick the package manager for your operating system. The PATH is set automatically.

- macOS: [Homebrew](https://brew.sh/) with `brew install hugo`
- Windows: [Chocolatey](https://chocolatey.org/) with `choco install hugo-extended`, or [Scoop](https://scoop.sh/) with `scoop install hugo-extended`
- Linux: see the [official Hugo installation docs](https://gohugo.io/installation/linux/)

  {{< /tab >}}

  {{< tab label="Manual Binary Download" >}}

Go to the [Hugo GitHub Releases](https://github.com/gohugoio/hugo/releases) page and download the archive for your operating system and architecture. A filename containing `extended` is the Extended edition. Extract the archive and place the executable in a directory listed in your PATH.

After downloading, your system does not know where `hugo` is, so running `hugo` in the terminal at this point will show an error. Setting the PATH (called an environment variable on Windows) tells your system to look in that directory to find and run the executable.

> [!NOTE]- macOS/Linux
>
> Open a terminal, then copy, paste, and run the following commands.
> 
> ```bash
> # create a user-specific PATH directory
> mkdir -p ~/.local/bin
> 
> # add that directory to the system PATH
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
> ```
> 
> Then move the Hugo executable you downloaded earlier into the `~/.local/bin` directory you just created, and reload the shell.
> 
> ```sh
> source ~/.zshrc
> ```
> 
> If your shell is not zsh, replace `~/.zshrc` with `~/.bashrc`.

> [!NOTE]- Windows
> Open PowerShell. **Make sure it is PowerShell, not CMD and not Windows PowerShell.** Copy, paste, and run the following commands.
> 
> ```powershell
> # create a user-specific PATH directory
> New-Item -ItemType Directory -Force -Path "$HOME\hugo\bin"
> 
> # print the full directory path
> Write-Output "$HOME\hugo\bin"
> 
> # add that directory to the system PATH
> [Environment]::SetEnvironmentVariable("PATH", "$HOME\hugo\bin;" + [Environment]::GetEnvironmentVariable("PATH", "User"), > "User")
> ```
> 
> Then move the Hugo executable you downloaded earlier into the `$HOME\hugo\bin` directory you just created, and restart your terminal for the change to take effect.

  {{< /tab >}}
{{% /tabs %}}

## Verifying the Installation

Whichever method you used, run the following command to check.

```bash
hugo version
```

- If you see a version number, the installation succeeded. You can move on to the next step.
- If you see `command not found` (macOS/Linux) or `is not recognized as an internal or external command` (Windows), the PATH was not set up correctly. Restart your terminal and try again, or check that you copied and ran the commands above correctly.

## Related Tools

The following tools are not required for Hugo to run, but you will commonly use them when building a Hugo site in practice.

- [Git](https://git-scm.com/downloads): version control software, used when installing themes or managing your project.
- [Go](https://go.dev/doc/install): Hugo also supports managing project dependencies more flexibly through Go modules. This means your site project itself becomes a Go module, which is required to use the `hugo mod` family of commands.
