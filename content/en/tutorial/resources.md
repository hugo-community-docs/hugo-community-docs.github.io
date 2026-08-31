---
title: 'Resource Processing'
slug: resources
weight: 300
---

`resource.Resource` objects handle Hugo's resource processing.

## Creation

You can create `resource.Resource` objects in several ways. As global functions, you have:

- [resources.Get](https://gohugo.io/functions/resources/get/)
- [resources.GetMatch](https://gohugo.io/functions/resources/getmatch/)
- [resources.Match](https://gohugo.io/functions/resources/match/)
- [resources.ByType](https://gohugo.io/functions/resources/bytype/)

These four methods retrieve resources from the `assets` directory. To retrieve resources from the current page bundle, use `.Resources.Get`, `.Resources.GetMatch`, and similar methods instead.

Beyond internal resources, Hugo can also fetch external resources during the build with [resources.GetRemote](https://gohugo.io/functions/resources/getremote/), or convert a variable into a resource with [resources.FromString](https://gohugo.io/functions/resources/fromstring/).

## Usage

Hugo does not automatically publish a `resource.Resource` object after creation. To publish it, call `.RelPermalink` and `.Publish` manually.

Here's an image example:

```go-html-template
{{ with resources.Get "/img/foo.jpg" }}
  <img src={{ .RelPermalink }}>
{{ end }}
```

Here's a JS/CSS example:

```go-html-template
{{ with resources.Get "js/main.js" }}
  <script type="module" src="{{ .RelPermalink }}"></script>
{{ end }}

{{ with resources.Get "css/main.css" }}
  <link rel="stylesheet" href="{{ .RelPermalink }}">
{{ end -}}
```

Here's a font example:

```go-html-template
{{ range resources.Match "font/**" }}
	{{ .Publish }}
{{ end }}
```

Here's a variable example:

```go-html-template
{{ $text := "console.log('Hello!');" }}
{{ $r := resources.FromString "generated.js" $text | fingerprint }}
<script src="{{ $r.RelPermalink }}" integrity="{{ $r.Data.Integrity }}"></script>
```

Use the `with` syntax to avoid errors from calling `.RelPermalink` on `nil` when a file doesn't exist. If you want an explicit error instead, skip the `with` syntax.

You can also print resource content directly with the [`.Content`](https://gohugo.io/methods/resource/content/) method.

## Copying

`.RelPermalink` and `.Publish` only output to Hugo's default path. To customize the output path, use the [`resources.Copy`](https://gohugo.io/functions/resources/copy/) function. This function operates entirely in memory and doesn't publish the file until you call `.RelPermalink` or `.Publish`.

## Methods and Functions

Methods belong to an object, while functions don't. See [Methods/Resource](https://gohugo.io/methods/resource/) for the methods built into `resource.Resource` objects. Functions you can use with `resource.Resource` objects include:

- Image-specific: [Functions/Images](https://gohugo.io/functions/images/)
- JS-specific: [Functions/js](https://gohugo.io/functions/js/)
- CSS-specific: [Functions/css](https://gohugo.io/functions/css/)
- Type checking: [Functions/reflect](https://gohugo.io/functions/reflect/)

## js.Build and css.Build

[esbuild](https://github.com/evanw/esbuild) powers these two features, giving you a more modern way to process resources. You get support for imports between files, automatic imports of node_modules packages, and passing variables from templates into JS/CSS.

The official documentation already covers this well, so this guide won't repeat it here.

- [js.Build](https://gohugo.io/functions/js/build/)
- [css.Build](https://gohugo.io/functions/css/build/)

## Merging Resources

[resources.Concat](https://gohugo.io/functions/resources/concat/) merges resources. For JS/CSS files, use `js.Build` / `css.Build` directly instead, you don't need this function for those cases.

## Rendering Resources as Templates

[resources.ExecuteAsTemplate](https://gohugo.io/functions/resources/executeastemplate/) parses and executes resource content as a Go template, then returns the result as a new resource. This lets files that the template engine normally skips, like CSS and JS, use `{{ }}` syntax to access variables.

**Syntax**

```text
resources.ExecuteAsTemplate TARGETPATH CONTEXT RESOURCE
```

TARGETPATH is the output path. CONTEXT determines what `.` refers to inside the template. RESOURCE is the source resource.

Here's a CSS example:

```go-html-template {title="assets/css/theme.css"}
:root {
  --accent-color: {{ site.Params.accentColor | default "red" }};
}
```

```go-html-template
{{ with resources.Get "css/theme.css" }}
  {{ with resources.ExecuteAsTemplate "css/theme.css" $ . }}
    <link rel="stylesheet" href="{{ .RelPermalink }}">
  {{ end }}
{{ end }}
```

Here, `$` refers to the current page, and the file outputs to `public/css/theme.css`.

You can also combine `resources.FromString` and `resources.ExecuteAsTemplate`: first convert a string into a resource, then execute it as a template.

```go-html-template
{{ $tmpl := `:root { --accent-color: {{ site.Params.accentColor | default "red" }}; }` }}
{{ $r := resources.FromString "inline.css" $tmpl }}
{{ $r = resources.ExecuteAsTemplate "inline.css" . $r }}
{{ $r.Publish }}
```

The file outputs to `public/inline.css`.

Or reverse the order: extract the content first, then manipulate it as a string.

```go-html-template
{{ $r := resources.Get "css/theme.css" }}
{{ $r = resources.ExecuteAsTemplate "path" . $r }}
{{ $s := $r.Content }}

{{/* You can now perform string operations on $s */}}
{{ $s = replace $s "accent-color" "brand-color" -}}

{{ $final := resources.FromString "css/theme.css" $s | minify }}
{{ $final.Publish }}
```

The file outputs to `public/css/theme.min.css`.

## Key Functions

- Minify resources: [resources.Minify](https://gohugo.io/functions/resources/minify/)
- Compute fingerprints: [resources.Fingerprint](https://gohugo.io/functions/resources/fingerprint/)
- try-except syntax: [try](https://gohugo.io/functions/go-template/try/)

## Caching

Hugo caches resources to avoid redundant computation. Within a single build, Hugo caches results in memory, so subsequent calls reuse them without recomputing. Across multiple builds, Hugo caches results to disk, so later builds skip recomputation unless you use the `--ignoreCache` flag.

## Review

Before wrapping up, here's a review of the key points.

**Getting resources**: Use `resources.Get`, `resources.GetMatch`, `resources.Match`, and `resources.ByType` for internal resources. Use the `.Resources` family of methods for page bundle resources instead. Use `resources.GetRemote` for external resources and `resources.FromString` to convert a string into a resource.

**Using resources**: Hugo doesn't automatically publish a resource after creation, you need to call `.RelPermalink` or `.Publish` to output it. The `with` syntax helps you avoid errors from calling a method on `nil` when a resource doesn't exist. `.Content` lets you access resource content directly.

**Copying resources**: Hugo determines the default output path. To customize the path, use `resources.Copy`, which also delays publishing until you call `.RelPermalink` or `.Publish`.

**Methods and functions**: Methods bind to the `resource.Resource` object, functions don't depend on the object. Images, JS, and CSS each have their own function sets, and the `reflect` family of functions checks variable types.

**Resource processing**: `js.Build` and `css.Build` run on esbuild and support imports between files, automatic node_modules loading, and template variable injection. `resources.ExecuteAsTemplate` parses and executes resource content as a template. `resources.Minify` compresses resources, and `resources.Fingerprint` computes fingerprints. `try` provides try-except syntax for error handling.

**Caching**: Hugo caches within a single build in memory and across builds on disk. Builds skip recomputation unless you use the `--ignoreCache` flag.

## Documentation References

Here are all the resources related to Hugo's official documentation on resource processing:

- https://gohugo.io/hugo-pipes/
- https://gohugo.io/functions/resources/
- https://gohugo.io/functions/images/
- https://gohugo.io/methods/resource/
- https://gohugo.io/functions/reflect/
