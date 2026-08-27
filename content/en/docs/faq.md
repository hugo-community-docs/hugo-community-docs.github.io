---
title: FAQ
description: 'Practical answers to problems that come up while building a Hugo site, gathered from real troubleshooting experiences.'
---

## Configuration Merging

Hugo merges different configuration keys using different rules: no merging, shallow merging, and deep merging. See [Merge configuration settings](https://gohugo.io/configuration/introduction/#merge-configuration-settings).

Because of the UFS mechanism, your final configuration is built by layering settings on top of each other. Run `hugo config` to check the merged result.

## Environment Variables

You can use environment variables to temporarily override settings from the command line without changing any files, for example `HUGO_IGNOREFILES="['content/foo','content/bar']"`. See [Environment variables](https://gohugo.io/configuration/introduction/#environment-variables) for details.

Environment variables can also point to a different Hugo configuration directory. See the official [configuration tutorial](https://gohugo.io/configuration/introduction/#example).

## Debugging Variables

These are the only ways to do it. There is no other method.

1. `{{ $var }}`
2. `{{ debug.Dump $var }}`
3. `{{ highlight (jsonify (dict "indent" "  ") $var) "json" }}`
4. `{{ site.Store }}` + `{{ site.Get }}`
5. `{{ printf "type: %T, val: %s" $var $var }}`
6. `{{ warnf "%s $var" }}`
7. Any of the above combined with `console.log` printed in the browser

Also see the [debug functions](https://gohugo.io/functions/debug/) and [templates.Current](https://gohugo.io/troubleshooting/inspection/).

## Live Reload Not Updating Automatically

In some cases, such as when a template only references data indirectly through a partial, Hugo's live reload won't detect the change automatically. If this happens, add the following line at the top of `baseof.html` to force the update:

```go-html-template {title="layouts/baseof.html"}
{{ $noop := partial "..." }}
```

## .Page.Store.Get Returns No Value

`.Page.Store` is order-dependent. Within the same HTML page's template rendering, `.Get` returns nothing if `.Page.Store.Set` has not run yet.

If your `.Store.Set` sits *inside a shortcode*, this is the one case where the noop trick helps: add `{{ $noop := .Content }}` earlier in the template to force the page content, including its shortcodes, to render early. This also triggers `.Store.Set` along with it.

`.Page.Content` is cached per HTML page, so this operation has no side effects and is safe to use.

## How Shortcodes Work

Shortcodes exist so you do not have to write HTML by hand. Here is how they work.

- Standard notation `{{</*  */>}}` renders before the rest of the Markdown. It gets replaced with a placeholder, and the Markdown containing that placeholder is then sent to Goldmark for rendering. After rendering, each placeholder is swapped back for the shortcode's already-rendered output, and that output is not processed by Goldmark again.
- Markdown notation `{{%/*  */%}}` also renders before the rest of the Markdown, but its rendered output is inserted back into the Markdown *before* that Markdown is sent to Goldmark, so it goes through Goldmark along with the rest of the page. This is typically used when the shortcode content needs to merge with the page content, such as page-level features like a table of contents or footnotes.

## Nested Shortcode Render Order

Nested shortcodes always render the inner one before the outer one. The outer shortcode has no knowledge that the inner one exists, while the inner one can access the outer one's information through `.Parent`.

## Nested Shortcode Output Gets Corrupted

This happens because Markdown is sensitive to blank lines and whitespace, combined with using the wrong shortcode notation.

The root cause is blank lines, whitespace, along with the Markdown rule that four spaces of indentation get rendered as a code block.

The fix is to trim all whitespace so both the inner and outer shortcodes are treated as HTML, not parsed as Markdown.

## Footnotes/ToC in Nested Shortcodes

As mentioned in [How Shortcodes Work](#how-shortcodes-work), features like a table of contents need Markdown notation. So which layer should use it, the inner or the outer? And which one should use `.Page.RenderString`?

hugo-community-docs recommends Markdown notation for the outer shortcode and standard notation for the inner one, with the outer shortcode not using `.Page.RenderString`. The reasoning: the inner shortcode renders to HTML first and gets placed into the outer one. The outer shortcode, along with that inner content, then gets placed back into the Markdown document and sent to Goldmark for a second pass. At that point, any headings get picked up into the page's overall table of contents.

## How templates.Defer Works

`templates.Defer` exists to push content that cannot be resolved in time until after everything else has rendered and the file has already been written, then writes to the file a second time. This means `templates.Defer` writes to the same file twice, which comes at a performance cost.

A real-world use case is shown in the [official `templates.Defer` example](https://gohugo.io/functions/templates/defer/): TailwindCSS does not know the full set of classes in use until rendering is complete, so deferring until everything has rendered is exactly the right moment to use it.

## How partialCached Works

Hugo is fast enough that performance is rarely a concern, and [`partialCached`](https://gohugo.io/functions/partials/includecached/) is close to the only remaining way to squeeze out further gains.

It works through an LRU cache that is independent per [site](concept/sites-matrix.md). If no variant is specified, the cache key is the partial's name. Otherwise, the cache key is the partial's name plus its variants, and you can pass zero or more variants.

As of v0.165.0, `partialCached`'s LRU size is set to 1000. This is an internal implementation detail, not a public guarantee, and it can change at any time.

## How Related Content Works{#related-article}

Hugo's related content feature depends on exactly three things.

1. The page's taxonomies
2. The page's headings, if [fragments](https://gohugo.io/content-management/related-content/#index-content-headings) is enabled
3. [The page's other inherent attributes, which you cannot control](https://github.com/gohugoio/hugo/blob/26f31ff6ce6c69f663b4ea1e62cae95cd6ab7b6d/resources/page/page.go#L264)

The system only uses these signals to do exact string matching across pages, discarding anything below a threshold and filtering out tags that appear too frequently. In practice, this means your tags need to be tuned carefully: not too many or too scattered, but also not so overlapping that everything looks the same.

## Building a Proper UID

A UID is typically used so JavaScript can target a specific node, such as JS paired with a shortcode. A simple `{{ time.Now.Unix }}` works, but it means the output HTML changes on every deploy even when the content has not changed. Beyond making diffs harder to debug, the bigger issue is that most deployment platforms compare the current and previous deploy and only redeploy the files that changed, so this wastes both bandwidth and CI time.

hugo-community-docs recommends using `.Store.Set` and `.Store.Get` to maintain an incrementing counter, optionally combined with a slice as an additional hash source. This gives you a stable source for the hash and guarantees identical output across builds.
