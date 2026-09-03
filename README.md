# GongJiYang.github.io

Site generator and design follow [matklad/matklad.github.io](https://github.com/matklad/matklad.github.io). The only site feature added here is tag classification.

## Write with Typora

Create posts in `content/posts` with the filename `YYYY-MM-DD-slug.md`. Each post starts with optional tag metadata and one level-one heading:

```markdown
---
tags: systems, learning
---

# Post title

First paragraph used as the feed summary.
```

The source remains a normal `.md` file for Typora. The generator accepts both `.md` and upstream `.dj` sources. Images pasted by Typora go to `content/assets`; `../assets/image.png` is rewritten to `/assets/image.png` while rendering.

Typora is configured globally with macOS native autosave enabled, relative image paths enabled, local-image copying enabled, and `../assets` as the image destination. Open `~/GongJiYang.github.io/content/posts` in Typora, save a correctly named `.md` file, and write normally.

A macOS LaunchAgent (`com.gongjiyang.blog-autopublish`) runs `tools/autopublish.ts` after the writing tree has been idle for ten minutes. It validates the build, commits post and image changes, rebases on `origin/main`, and pushes. GitHub Actions builds and deploys the site. Build failures are logged without committing or pushing to `~/Library/Logs/gongjiyang-blog-autopublish.log`.

Local commands remain available:

```console
deno task build
deno task serve
```
