---
title: 'Basic Syntax'
slug: basic-syntax
weight: 200
---

## Arithmetic and Comparison

Hugo doesn't support symbols like `+` or `<`. You need to use function calls for these operations.

```go-html-template
{{ add 1 1 }}
{{ sub 2 1 }}
{{ mul 2 2 }}
{{ div 4 2 }}
{{ eq 1 1 }}
{{ ne 1 2 }}
{{ lt 1 2 }}
{{ le 2 2 }}
{{ gt 3 2 }}
{{ ge 2 2 }}
```

```text
2
1
4
2
true
true
true
true
true
true
```

## if / else if / else

The basic if-else syntax. `false`, an empty string, `0`, `nil`, an empty slice, and an empty dict are all falsy values.

```go-html-template {title="layouts/home.html"}
{{ $x := 7 }}
{{ if eq $x 6 }}
  eq 6
{{ else if eq $x 7 }}
  eq 7
{{ else }}
  ...
{{ end }}
```

```html
eq 7
```

## with / else with

`if` only evaluates a condition without changing the context. `with` does both: it evaluates the condition and switches the context to that value.

```go-html-template {title="layouts/home.html"}
{{ $v1 := "" }}
{{ $v2 := "Orange" }}
{{ with $v1 }}
  {{ . }}
{{ else with $v2 }}
  {{ . }}
{{ else }}
  Neither
{{ end }}
```

```html
Orange
```

## and / or / not

Logical operators.

```go-html-template
{{ and true false }}
{{ or true false }}
{{ not false }}
```

```text
false
true
true
```

## range

`range` works like a for loop. Hugo only has for loops, not while loops.

```go-html-template {title="layouts/home.html"}
{{ range slice "Apple" "Banana" "Orange" }}
  {{ . }}<br>
{{ end }}
```

```html
Apple<br>
Banana<br>
Orange<br>
```

You can also include an index:

```go-html-template {title="layouts/home.html"}
{{ range $idx, $val := slice "Apple" "Banana" "Orange" }}
  {{ $idx }}: {{ $val }}<br>
{{ end }}
```

```html
0: Apple<br>
1: Banana<br>
2: Orange<br>
```

## break / continue

`continue` skips the current iteration. `break` ends the loop entirely.

```go-html-template {title="layouts/home.html"}
{{ range slice "Apple" "Banana" "Orange" }}
  {{ if eq . "Banana" }}
    {{ continue }}
  {{ end }}
  {{ if eq . "Orange" }}
    {{ break }}
  {{ end }}
  {{ . }}
{{ end }}
```

```html
Apple
```

## slice

A slice is a list. Use `index` to retrieve an element and `len` to get its length.

```go-html-template
{{ $s := slice 1 2 3 4 5 6 7 8 9 10 }}
{{ index $s 0 }}
{{ len $s }}
```

```text
1
10
```

To grab a range, use `first` and `after` together:

```go-html-template
{{ $s | first 5 | after 2 }}
```

```text
[3 4 5]
```

## seq

Creates a list. `seq N` produces integers from `1` to `N`. `seq A B` produces integers from `A` to `B`.

```go-html-template
{{ range seq 3 }}{{ . }}{{ end }}
{{ range seq 2 5 }}{{ . }}{{ end }}
```

```text
123
2345
```

## dict

A `dict` (map) holds key-value pairs. You can access a key with dot notation, which works the same as `index`.

```go-html-template
{{ $person := dict "name" "John" "age" 20 }}
{{ index $person "name" }}
{{ $person.name }}
```

```text
John
John
```

Accessing a key that doesn't exist won't throw an error.

## cast

Type conversion.

```go-html-template
{{ $s := "42" }}
{{ $n := cast.ToInt $s }}
{{ add $n 8 }}
```

```text
50
```

`add "42" 8` throws a type error, because `add` requires both operands to be numbers. You need to convert the string with `cast.ToInt` first.

## partial and return

`partial` calls a template file.

**Syntax**

```text
{{ partial LAYOUT CONTEXT }}
```

**Description**

A partial is a standalone template file. When you call a template (LAYOUT) with the `partial` function, CONTEXT becomes the `.` inside that file.

```go-html-template {title="layouts/_partials/price-tag.html"}
{{ if lt . 100 }}
  <span>On sale</span>
{{ else }}
  <span>Regular price</span>
{{ end }}
```

```go-html-template
{{ partial "price-tag.html" 80 }}
```

```html
<span>On sale</span>
```

If a template doesn't include `return`, Hugo renders it as HTML. If it does, Hugo returns that value instead:

```go-html-template {title="layouts/_partials/is-cheap.html"}
{{ return lt . 100 }}
```

```go-html-template
{{ $cheap := partial "is-cheap.html" 80 }}
{{ print $cheap }}
```

```html
true
```

Before [v0.166.0](https://github.com/gohugoio/hugo/releases/tag/v0.166.0), a partial only supported a single `return`.

**Passing Multiple Values**

`partial` only accepts a single CONTEXT argument. If you need to pass both a weight and a city, wrap them into one value with `dict`:

```go-html-template {title="layouts/_partials/shipping-note.html"}
{{ if ge .weight 5 }}
  {{ .city }}: extra shipping fee applies
{{ else }}
  {{ .city }}: standard shipping fee
{{ end }}
```

```go-html-template
{{ partial "shipping-note.html" (dict "weight" 6 "city" "TX") }}
```

```html
TX: extra shipping fee applies
```

`.weight` and `.city` correspond to the keys you passed in the `dict` call.

**Inline Definitions**

Use `define` to write a partial directly inside the template that calls it:

```go-html-template
{{ partial "inline" 21 }}

{{ define "_partials/inline/double" }}
  {{ mul . 2 }}
{{ end }}
```

```text
42
```

Hugo scans all available templates before rendering, so inline definitions have no ordering requirements. An inline-defined template can be called from anywhere on the site.

## Passing Values Between Templates

Templates can only pass values to each other through the CONTEXT you pass in `{{ partial "foo.html" CONTEXT }}`, or by using [`.Store`](#store): set a value with `.Store.Set` and retrieve it with `.Store.Get`.

## partialCached

`partialCached` calls a template and caches its output.

**Syntax**

```text
{{ partialCached LAYOUT CONTEXT [KEY1 KEY2 KEY3 ...] }}
```

**Description**

When a LAYOUT produces repeated output and rendering it has become a performance bottleneck, use `partialCached` instead of `partial` to cache the output and avoid recomputing it.

KEY1, KEY2, KEY3, and so on are optional additional cache keys. They let the same LAYOUT produce multiple cached results depending on conditions. These extra keys don't participate in the template's own computation. They're only used to distinguish cached results, and you can supply zero or more of them.

If you don't specify any additional cache keys, the cache key defaults to the LAYOUT itself (that is, the partial's name).

> [!WARNING] Parallel Rendering
> Hugo renders multiple pages in parallel. The first time a given cache key is called, Hugo hasn't finished storing that key yet, so other pages rendering in parallel before that point will each render the same template independently. Once the cache key is stored, subsequent calls use the cached result directly.

> [!INFO]
> Each site's cache is independent.

## .Store

Everything covered so far has been a function. `.Store` is a method instead, and methods are bound to an object, which is why you see a `.` in front of it.

`.Store` stores content on a target object, letting you pass values between templates. You can call `.Store` on any of these objects:

| Scope           | Usage                                               |
|------------------|------------------------------------------------------|
| Entire site build | [hugo.Store][hugo.Store]                            |
| Current site[^1]  | [SITE.Store][SITE.Store]                            |
| Current page      | [PAGE.Store][PAGE.Store]                            |
| Shortcode         | [SHORTCODE.Store][SHORTCODE.Store]                  |
| Local variable     | [collections.NewScratch][collections.NewScratch]    |

[^1]: See [Sites Matrix](../docs/concept/sites-matrix.md) for what "current site" means.

[hugo.Store]: https://gohugo.io/functions/hugo/store/
[SITE.Store]: https://gohugo.io/methods/site/store/
[PAGE.Store]: https://gohugo.io/methods/page/store/
[SHORTCODE.Store]: https://gohugo.io/methods/shortcode/store/
[collections.NewScratch]: https://gohugo.io/functions/collections/newscratch/

`.Store` is order-dependent. If you call `.Get` before ever calling `.Store`, `.Get` returns nothing.

Content stored in `.Store` persists for the entire build process. It doesn't get cleaned up just because the current page finishes rendering.

`.Store` exposes many methods you can call. The methods are the same regardless of which object `.Store` is bound to.

**Example: Page Initialization**

If a page requires elaborate initialization and the result needs to be shared across multiple templates, you can run that initialization at the top of `baseof.html` and store the result with `.Page.Store`. Every partial can then retrieve it through `.Store`.

{{% tabs %}}
  {{< tab label="Called from baseof.html" >}}

```go-html-template {title="layouts/baseof.html"}
<!doctype html>
{{- partial "init.html" . -}}
<html>
  ...
</html>
```

  {{< /tab >}}

  {{< tab label="Initialized in init.html" >}}

```go-html-template {title="layouts/_partials/init.html"}
{{- with resource.Get "..." -}}
  {{- ... -}}
  {{- .Page.Store.Set "key" ... -}}
{{- end -}}
```

  {{< /tab >}}

  {{< tab label="Used in later templates" >}}

```go-html-template {title="layouts/_partials/foo.html"}
{{ with .Page.Store.Get "key" }}
  {{ ... }}
{{ end }}
```

```go-html-template {title="layouts/_partials/bar.html"}
{{ with .Page.Store.Get "key" }}
  {{ ... }}
{{ end }}
```

  {{< /tab >}}
{{% /tabs %}}

**Example: Call Counting**

Track how many times a shortcode was called on the same page.

```go-html-template {title="layouts/_shortcodes/figure.html"}
{{ $count := .Page.Store.Get "imageCounter" | default 0 }}
{{ $count = add $count 1 }}
{{ .Page.Store.Set "imageCounter" $count }}
<figure id="img-{{ $count }}">
  <img src="{{ .Get "src" }}" alt="{{ .Get "alt" }}">
</figure>
```

If you only need to check whether a shortcode was called, without counting, use the [`.Page.HasShortcode`](https://gohugo.io/methods/page/hasshortcode/#article) method instead. Unlike `.Store`, this method has no ordering requirement, because Hugo scans the Markdown document ahead of time. That means you can call `.Page.HasShortcode` before the shortcode is actually rendered.

**Example: Resource Loading**

A common pattern is calling `.Page.Store.Set` to record that a feature was used on a page, then using `.Page.Store.Get` **afterward** to run the corresponding logic. A classic example is [Mermaid diagrams](https://gohugo.io/content-management/diagrams/#mermaid-diagrams) in the official documentation.
