# GongJiYang.github.io

Site generator and design follow
[matklad/matklad.github.io](https://github.com/matklad/matklad.github.io). The
only site feature added here is tag classification.

## Write with Typora

Press `⌥⌘N` in Typora, or choose `Typora → Services → 新建博客文章`. Enter the
title and optional comma-separated tags. The Quick Action creates and opens a
post named `YYYY-MM-DD-pinyin-slug.md`, truncates long slugs, and appends `-2`,
`-3`, and so on when needed. It generates:

```markdown
---
tags: systems, learning
---

# Post title

First paragraph used as the feed summary.
```

The source remains a normal `.md` file for Typora. The generator accepts both
`.md` and upstream `.dj` sources. Images pasted by Typora go to
`content/assets`; `../assets/image.png` is rewritten to `/assets/image.png`
while rendering.

Typora is configured globally with macOS native autosave enabled, relative image
paths enabled, local-image copying enabled, and `../assets` as the image
destination. The Quick Action runs `tools/new-post.js`; standard `⌘N` remains
available for ordinary non-blog documents.

A macOS LaunchAgent (`com.gongjiyang.blog-autopublish`) runs
`tools/autopublish.ts` after the writing tree has been idle for ten minutes. It
validates the build, commits post and image changes, rebases on `origin/main`,
and pushes. GitHub Actions builds and deploys the site. Build failures are
logged without committing or pushing to
`~/Library/Logs/gongjiyang-blog-autopublish.log`.

Local commands remain available:

```console
deno task build
deno task serve
```
