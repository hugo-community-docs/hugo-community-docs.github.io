---
title: 'Introduction'
slug: introduction
weight: 100
---

This article assumes you already have a basic understanding of programming languages, so it won't introduce programming concepts from scratch. Instead, it builds on that foundation to introduce Hugo's syntax.

The examples in this article are based on a basic sample site, initialized with the following commands:

```sh
hugo new project my-site --format yaml
cd my-site
hugo new theme test
echo "theme: [\"test\"]" >> hugo.yaml
```

`hugo new theme test` creates a theme skeleton at `themes/test/`. You'll make your theme changes in this folder.

## Understanding the Project Structure

See [Project Structure](../docs/concept/project-structure.md) for everything outside the `layouts` directory, and [Template System](../docs/concept/templates.md) for what goes inside it.

## Parallel Rendering

Hugo renders multiple pages at the same time. Keep this in mind so you don't end up writing code with race conditions. You won't run into this issue often, but it's important enough to call out early.

## Your First Template

`layouts/home.html`:

```go-html-template {title="layouts/home.html"}
{{ $v1 := 3 }}
{{ $v2 := 4 }}
<p>{{ add $v1 $v2 }}</p>
```

```html
<p>7</p>
```

Everything inside `{{ }}` gets evaluated. Everything outside it is output as-is.

## Variables

```go-html-template {title="layouts/home.html"}
{{ $price := 100 }}
{{ $price = 120 }}
{{ $price = "On sale" }}
{{ $price }}
```

```html
On sale
```

Use `:=` to declare a variable and `=` to assign a new value. You can reassign the same variable multiple times, and even change its type along the way. Here, `$price` goes from a number to a string.

## Functions

```go-html-template {title="layouts/home.html"}
{{ add 1 2 3 }}
{{ strings.ToLower "HUGO" }}
```

```html
6
hugo
```

Functions have no connection to objects. They're stateless: given the same arguments, a function always returns the same result, no matter which template calls it.

## Context

Context represents "the content at your current position." For example, in the base template `baseof.html`:

```go-html-template
{{ . }}
```

This prints the current page's filename. From there, each template determines what information it receives based on the context passed to it. You'll see calls like this in `baseof.html`:

```go-html-template
{{ partial "head.html" . }}
```

**This passes the current page (`.`) as context into the `head.html` template.**

Similarly, `{{ block "main" . }}{{ end }}` passes the current page (`.`) into a layout block named `"main"`. That block is defined with `{{ define "main" }}` in the page, home, section, term, and taxonomy templates under `layouts`. In other words, the context inside `{{ define "main" }}` in each of these five layout templates is also the current page.

## Methods

Anything called after a `.` is a method. It's bound to whatever object the `.` represents as context, so the same method returns different results depending on the context.

```go-html-template {title="layouts/home.html"}
<h1>{{ .Site.Title }} / {{ .Title }}</h1>
```

`.Site.Title` first calls `.Site` to get the site object, then calls `.Title` on that object.

Store the `about` page as a variable, then call its `.Title` method:

```go-html-template {title="layouts/home.html"}
{{ $about := .Site.GetPage "/about" }}
{{ $about.Title }}
```

## Switching Context

```go-html-template {title="layouts/home.html"}
<h1>{{ .Title }}</h1>

{{ range slice "Apple" "Banana" }}
  {{ . }}<br>
{{ end }}

{{ with "Orange" }}
  {{ . }} / {{ $.Title }}
{{ end }}
```

```html
<h1>My Site Title</h1>
Apple<br>
Banana<br>
Orange / My Site Title
```

Inside `range` and `with`, `.` switches to the current element or value. `$.` always refers to the outermost context of the current template.

## Pipes

Without a pipe:

```go-html-template {title="layouts/home.html"}
{{ strings.ToLower "Hugo" }}
{{ mul 6 (add 2 5) }}
```

With a pipe, the value on the left passes to the right as the last argument:

```go-html-template {title="layouts/home.html"}
{{ "Hugo" | strings.ToLower }}
{{ 5 | add 2 | mul 6 }}
```

Both forms produce the same result:

```text
hugo
42
```

## Comments

Go template comments don't appear in the output:

```go-html-template {title="layouts/home.html"}
{{/* This won't be output */}}
```

HTML comments are output as-is in the final HTML:

```go-html-template {title="layouts/home.html"}
<!-- This will be output to the HTML -->
```

## Trimming Whitespace

```go-html-template {title="layouts/home.html"}
Start
{{ if true }}
  true
{{ end }}
End
```

This renders as:

```html
Start

  true

End
```

Use `{{-  -}}`, or `{{- /*  */ -}}` for comments, to trim whitespace across lines:

```go-html-template {title="layouts/home.html"}
Start
{{- if true -}}
  {{- print " %s " "true" -}}
{{- end -}}
End
```

This renders as:

```html
Start true End
```

## Lifecycle

A variable's lifecycle is scoped to the current template, not the entire current page. If you declare a variable inside a context block, it's destroyed once that block ends.

Incorrect:

```go-html-template {title="layouts/home.html"}
{{ with "foo" }}
  {{ $x := 1 }}
{{ end }}

{{ $x }}
```

Correct:

```go-html-template {title="layouts/home.html"}
{{ $x := 0 }}
{{ with "foo" }}
  {{ $x = 1 }}
{{ end }}

{{ $x }}
```
