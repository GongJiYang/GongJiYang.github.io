import type { Post } from "./main.ts";
import * as blogroll from "./blogroll.ts";

type Language = "en" | "zh";

const site_url = "https://gongjiyang.github.io";
// 中英切换
const LANG_KEY = 'site_language';
const navTexts: Record<Language, { about: string; blogroll: string; home: string; write: string; switchLang: string }> = {
  en: { home: "Home", about: "About", blogroll: "Blogroll", write: "Write", switchLang: "中" },
  zh: { home: "首页", about: "关于", blogroll: "博客列表", write: "写作", switchLang: "EN" },
};
export const base = (
  { content, src, title, path, description, extra_css, body_class, showLangSwitch = false, showEditLink = true }: {
    content: HtmlString;
    src: string;
    title: string;
    description: string;
    path: string;
    extra_css?: string;
    body_class?: string;
    showLangSwitch?: boolean;
    showEditLink?: boolean;
  },
  lang: Language = "en"
): HtmlString =>
  html`
  <!DOCTYPE html>
<html lang='${lang === "en" ? "en-US" : "zh-CN"}'>
<head>
  <meta charset='utf-8'>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/css/EBGaramond-400-Normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/css/OpenSans-300-Normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="canonical" href="${site_url}${path}">
  <link rel="alternate" type="application/rss+xml" title="Jay67" href="${site_url}/feed.xml">
  <style>
  @font-face {
    font-family: 'Open Sans'; src: url('/css/OpenSans-300-Normal.woff2') format('woff2');
    font-weight: 300; font-style: normal;
    font-display: optional;
  }
  @font-face {
    font-family: 'JetBrains Mono'; src: url('/css/JetBrainsMono-400-Normal.woff2') format('woff2');
    font-weight: 400; font-style: normal;
    font-display: optional;
  }
  @font-face {
    font-family: 'JetBrains Mono'; src: url('/css/JetBrainsMono-700-Normal.woff2') format('woff2');
    font-weight: 700; font-style: normal;
    font-display: optional;
  }
  @font-face {
    font-family: 'EB Garamond'; src: url('/css/EBGaramond-400-Normal.woff2') format('woff2');
    font-weight: 400; font-style: normal;
    font-display: optional;
  }
  @font-face {
    font-family: 'EB Garamond'; src: url('/css/EBGaramond-400-Italic.woff2') format('woff2');
    font-weight: 400; font-style: italic;
    font-display: optional;
  }
  @font-face {
    font-family: 'EB Garamond'; src: url('/css/EBGaramond-700-Normal.woff2') format('woff2');
    font-weight: 700; font-style: normal;
    font-display: optional;
  }
  @font-face {
    font-family: 'EB Garamond'; src: url('/css/EBGaramond-700-Italic.woff2') format('woff2');
    font-weight: 700; font-style: italic;
    font-display: optional;
  }

  html { font-family: "EB Garamond", serif; font-size: 22px; line-height: 1.3em; }

  * { box-sizing: border-box; margin: 0; padding: 0; margin-block-start: 0; margin-block-end: 0; }

  body {
    max-width: 80ch;
    padding: 2ch;
    margin-left: auto;
    margin-right: auto;
  }

  header { margin-bottom: 2rem; }
  header > nav { display: flex; gap: .35rem 1.25ch; align-items: baseline; flex-wrap: wrap; }
  header a { font-style: normal; color: rgba(0, 0, 0, .8); text-decoration: none; }
  header a:hover { color: rgba(0, 0, 0, .8); text-decoration: underline; }
  header .title { font-size: 1.25em; margin-right: auto; }
  :focus-visible { outline: 2px solid #6c02c9; outline-offset: 3px; }

  footer { margin-top: 2rem; }
  footer > p { display: flex; column-gap: 2ch; justify-content: center; flex-wrap: wrap; }
  footer a { color: rgba(0, 0, 0, .8); text-decoration: none; white-space: nowrap; }
  footer i { vertical-align: middle; color: rgba(0, 0, 0, .8) }

  </style>

  <link rel="stylesheet" href="/css/main.css">
  ${extra_css ? html`<link rel="stylesheet" href="/css/${extra_css}">` : ""}
</head>

<body${body_class ? ` class="${body_class}"` : ""}>
  <header>
    <nav>
      <a class="title" href="${lang === "en" ? "/" : "/CN/"}">${navTexts[lang].home}</a>
      <a href="${lang === "en" ? "/about.html" : "/CN/about.html"}">${navTexts[lang].about}</a>
      <a href="${lang === "en" ? "/blogroll.html" : "/CN/blogroll.html"}">${navTexts[lang].blogroll}</a>
      <a href="${lang === "en" ? "/write/" : "/CN/write/"}">${navTexts[lang].write}</a>
      ${showLangSwitch ? html`
      <a id="lang-switch" href="${lang === 'en' ? '/CN' + path : path.replace(/^\/CN/, '') || '/'}" data-lang="${lang === "en" ? "zh" : "en"}">
        ${navTexts[lang].switchLang}
      </a>
      ` : ""}
    </nav>
  </header>

  <main>
  ${content}
  </main>

  <footer>
    <p>
      ${showEditLink ? html`
      <a href="https://github.com/GongJiYang/GongJiYang.github.io/edit/main${src}">
        <svg class="icon"><use href="/assets/icons.svg#edit"/></svg>
        Edit this post
      </a>
      ` : ""}
      <a href="/feed.xml">
        <svg class="icon"><use href="/assets/icons.svg#rss"/></svg>
        Subscribe
      </a>
      <a href="https://github.com/GongJiYang">
        <svg class="icon"><use href="/assets/icons.svg#github"/></svg>
          Jay67
      </a>
    </p>
  </footer>
</body>
<script>
  (function() {
      const LANG_KEY = '${LANG_KEY}';
      const switchEl = document.getElementById('lang-switch');
      if (switchEl instanceof HTMLAnchorElement) {
        switchEl.addEventListener('click', function() {
          const nextLang = switchEl.dataset.lang;
          if (nextLang === 'en' || nextLang === 'zh') {
            localStorage.setItem(LANG_KEY, nextLang);
          }
        });
      }

      const pathLang = location.pathname.startsWith('/CN') ? 'zh' : 'en';
      let savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang !== 'en' && savedLang !== 'zh') {
        savedLang = pathLang;
        localStorage.setItem(LANG_KEY, savedLang);
      }

      if (savedLang !== pathLang && switchEl instanceof HTMLAnchorElement) {
        if (savedLang === 'zh' && !location.pathname.startsWith('/CN')) {
          location.pathname = '/CN' + location.pathname;
        } else if (savedLang === 'en' && location.pathname.startsWith('/CN')) {
          location.pathname = location.pathname.replace(/^\\/CN/, '') || '/';
        }
      }
    })();
</script>
</html>
`;
const blurb = "Notes on software, tools, and things worth understanding.";

export function page(name: string, content: HtmlString, lang: "en" | "zh") {
  const prefix = lang === "en" ? "" : "/CN";
  return base({
    path: `${prefix}/${name}.html`,
    title: "Jay67",
    description: blurb,
    src: `/content/${name}.dj`,
    extra_css: name === "resume" ? "resume.css" : undefined,
    content,
  }, lang);
}

export const write_page = (lang: "en" | "zh"): HtmlString => {
  const text = {
    en: {
      title: "Write",
      pageTitle: "Write a post",
      description: "Focus here. Confirm once on GitHub; publishing after that is automatic.",
      postTitle: "Title",
      titlePlaceholder: "Untitled post",
      details: "Publishing details",
      slug: "Slug",
      slugPlaceholder: "untitled-post",
      tags: "Tags",
      tagsPlaceholder: "software, tools",
      date: "Date",
      language: "Language",
      newDraft: "New draft",
      insertImage: "Add image",
      publish: "Continue on GitHub",
      fillAll: "Add a title, slug, date, and some writing first.",
      badSlug: "Use letters, numbers, and single hyphens in the slug.",
      badDate: "Use a real date in YYYY-MM-DD format.",
      badTags: "Use up to 8 comma-separated tags; each may contain letters, numbers, spaces, underscores, or hyphens.",
      placeholder: "Start writing in Markdown…",
      fallbackNotice: "Live preview could not load. Plain-text editing is still available.",
      openingIssue: "Preparing GitHub…",
      issueOpened: "On GitHub, click “Submit new issue”. Publishing is automatic; there is no merge step.",
      issueCopied: "Your post was copied. Paste it into the GitHub description, then submit. Publishing is automatic.",
      issueOpenFailed: "The new tab was blocked. Allow pop-ups and try again.",
      issueCopyFailed: "This post is too long for a link and could not be copied. Allow clipboard access and try again.",
      wordUnit: "words",
      localDraft: "Autosaved in this browser",
      draftRestored: "Local draft restored",
      draftSaving: "Saving…",
      draftSaved: "Saved locally",
      resetConfirm: "Discard this local draft and start a new post?",
      imageUrl: "Image URL or /assets path",
      imageUrlPlaceholder: "https://… or /assets/image.jpg",
      imageAlt: "Description",
      imageAltPlaceholder: "What the image shows",
      imageInsert: "Insert",
      cancel: "Cancel",
      imageRequired: "Paste a public image URL or an existing /assets path.",
      imageHint: "For a local file, drag it into the GitHub description before you submit the issue.",
      shortcut: "⌘/Ctrl + Enter to continue",
    },
    zh: {
      title: "写作",
      pageTitle: "写一篇文章",
      description: "在这里专心写作；到 GitHub 确认一次，之后会自动发布。",
      postTitle: "标题",
      titlePlaceholder: "无标题文章",
      details: "发布信息",
      slug: "Slug",
      slugPlaceholder: "文章地址",
      tags: "标签",
      tagsPlaceholder: "软件, 工具",
      date: "日期",
      language: "语言",
      newDraft: "新建草稿",
      insertImage: "添加图片",
      publish: "前往 GitHub 确认",
      fillAll: "请先填写标题、slug、日期和正文。",
      badSlug: "Slug 只能使用文字、数字和单个连字符。",
      badDate: "请输入 YYYY-MM-DD 格式的真实日期。",
      badTags: "最多填写 8 个逗号分隔的标签；每个标签可使用文字、数字、空格、下划线或连字符。",
      placeholder: "开始用 Markdown 写作…",
      fallbackNotice: "实时预览加载失败，仍可继续纯文本写作。",
      openingIssue: "正在准备 GitHub…",
      issueOpened: "请在 GitHub 点击“Submit new issue”。之后会自动发布，不需要合并。",
      issueCopied: "文章已复制。请粘贴到 GitHub 的描述框并提交，之后会自动发布。",
      issueOpenFailed: "新标签页被拦截，请允许弹窗后重试。",
      issueCopyFailed: "文章过长，且无法复制。请允许剪贴板权限后重试。",
      wordUnit: "字词",
      localDraft: "已自动保存在此浏览器",
      draftRestored: "已恢复本地草稿",
      draftSaving: "正在保存…",
      draftSaved: "已保存到本地",
      resetConfirm: "丢弃当前本地草稿并新建文章？",
      imageUrl: "图片 URL 或 /assets 路径",
      imageUrlPlaceholder: "https://… 或 /assets/image.jpg",
      imageAlt: "图片说明",
      imageAltPlaceholder: "描述图片内容",
      imageInsert: "插入",
      cancel: "取消",
      imageRequired: "请粘贴公开图片 URL，或已有的 /assets 路径。",
      imageHint: "本地图片可在 GitHub 确认页直接拖入描述框，再提交 Issue。",
      shortcut: "⌘/Ctrl + Enter 前往确认",
    },
  }[lang];

  const styles = html`<style>
    body {
      width: 100%;
      max-width: 1160px;
      padding: 1rem clamp(1rem, 3vw, 2.5rem) 2rem;
      background: #fbfbfa;
    }

    main { width: 100%; min-width: 0; }

    .writer-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem 2rem;
      margin: 0 0 1.25rem;
    }

    .writer-head h1 {
      margin: 0 0 .35rem;
      font-size: clamp(1.7rem, 4vw, 2.3rem);
      letter-spacing: -.035em;
    }

    .writer-head p {
      margin: 0;
      color: #666;
      font-family: "Open Sans", sans-serif;
      font-size: .82rem;
      line-height: 1.5;
      text-align: left;
    }

    .writer-shortcut {
      flex: none;
      color: #8a8a8a !important;
      white-space: nowrap;
    }

    .writer-shell {
      width: 100%;
      min-width: 0;
      overflow: hidden;
      border: 1px solid #dededb;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 1px 0 rgba(0, 0, 0, .02);
    }

    .writer-meta {
      margin: 0;
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-bottom: 1px solid #e7e7e3;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .write-title input {
      display: block;
      width: 100%;
      padding: 0 0 .65rem;
      border: 0;
      border-bottom: 1px solid #e0e0dc;
      border-radius: 0;
      background: transparent;
      color: #222;
      font: 700 clamp(1.7rem, 4vw, 2.5rem)/1.15 "EB Garamond", Georgia, serif;
      text-overflow: ellipsis;
    }

    .write-title input::placeholder { color: #aaa; opacity: 1; }

    .publish-details {
      margin-top: .8rem;
      color: #666;
      font-family: "Open Sans", sans-serif;
      font-size: .7rem;
    }

    .publish-details summary {
      width: fit-content;
      cursor: pointer;
      color: #777;
      list-style-position: outside;
      user-select: none;
    }

    .publish-details summary:hover { color: #333; }

    .meta-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.2fr) minmax(9rem, .85fr) minmax(8rem, .65fr);
      gap: .7rem 1rem;
      margin-top: .85rem;
    }

    .write-field {
      display: grid;
      min-width: 0;
      gap: .3rem;
    }

    .write-field label {
      color: #777;
      font-family: "Open Sans", sans-serif;
      font-size: .68rem;
      font-weight: 400;
      letter-spacing: .035em;
    }

    .write-field input,
    .write-field select,
    .image-field input {
      min-width: 0;
      width: 100%;
      height: 2.45rem;
      padding: .48rem .62rem;
      border: 1px solid #d8d8d4;
      border-radius: 6px;
      background: #fff;
      color: #262626;
      font: 400 .82rem/1.2 "JetBrains Mono", monospace;
    }

    .write-title input:focus,
    .write-field input:focus,
    .write-field select:focus,
    .image-field input:focus {
      border-color: #6c02c9;
      outline: 0;
      box-shadow: 0 1px 0 #6c02c9;
    }

    .writer-body {
      min-width: 0;
      min-height: clamp(32rem, 68vh, 64rem);
      margin: 0;
      overflow: hidden;
    }

    #post-editor {
      width: 100%;
      min-width: 0;
      min-height: clamp(32rem, 68vh, 64rem);
    }

    .toastui-editor-defaultUI {
      width: 100% !important;
      min-width: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
    }

    .toastui-editor-toolbar {
      min-width: 0 !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      border-bottom: 1px solid #e7e7e3 !important;
      background: #fcfcfa !important;
      scrollbar-width: thin;
    }

    .toastui-editor-toolbar-group {
      display: inline-flex !important;
      float: none !important;
      white-space: nowrap;
    }

    .toastui-editor-main,
    .toastui-editor-main-container,
    .toastui-editor-md-container,
    .toastui-editor-md-preview {
      min-width: 0 !important;
    }

    .toastui-editor-md-container,
    .toastui-editor-md-preview {
      width: 100% !important;
      float: none !important;
    }

    .toastui-editor-md-preview {
      min-height: 24rem;
      border-top: 1px solid #ecece8 !important;
      border-left: 0 !important;
    }

    .toastui-editor-md-splitter { display: none !important; }

    .toastui-editor-contents,
    .toastui-editor-md-container .toastui-editor {
      font-family: "EB Garamond", Georgia, serif;
      font-size: 1.05rem;
      line-height: 1.7;
    }

    .toastui-editor-md-container .toastui-editor {
      padding: .75rem clamp(.9rem, 2vw, 1.5rem);
    }

    #post-body-fallback {
      display: block;
      width: 100%;
      min-height: clamp(32rem, 68vh, 64rem);
      padding: 1.25rem clamp(1rem, 3vw, 2rem);
      resize: vertical;
      border: 0;
      background: #fff;
      color: #222;
      outline: 0;
      font: 400 1.05rem/1.7 "EB Garamond", Georgia, serif;
    }

    .writer-footer {
      padding: .85rem clamp(1rem, 2.5vw, 1.5rem) 1rem;
      border-top: 1px solid #e7e7e3;
      background: #fcfcfa;
    }

    .writer-actions {
      display: flex;
      align-items: center;
      gap: .65rem;
    }

    .draft-meta {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: .45rem;
      margin-right: auto;
      color: #777;
      font-family: "Open Sans", sans-serif;
      font-size: .65rem;
      line-height: 1.35;
    }

    .draft-meta span + span::before {
      content: "·";
      margin-right: .45rem;
      color: #bbb;
    }

    .write-button {
      appearance: none;
      min-height: 2.35rem;
      padding: .48rem .85rem;
      border: 1px solid #cfcfca;
      border-radius: 999px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font: 400 .68rem/1 "Open Sans", sans-serif;
      white-space: nowrap;
    }

    .write-button:hover {
      border-color: #888;
      background: #f7f7f4;
    }

    .write-button.primary {
      border-color: #6c02c9;
      background: #6c02c9;
      color: #fff;
    }

    .write-button.primary:hover {
      border-color: #53009a;
      background: #53009a;
    }

    .write-button:disabled {
      cursor: wait;
      opacity: .55;
    }

    .image-panel {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) auto auto;
      gap: .65rem;
      align-items: end;
      margin-top: .85rem;
      padding-top: .85rem;
      border-top: 1px solid #e7e7e3;
    }

    .image-panel[hidden] { display: none; }

    .image-field {
      display: grid;
      min-width: 0;
      gap: .3rem;
    }

    .image-field label {
      color: #777;
      font-family: "Open Sans", sans-serif;
      font-size: .68rem;
    }

    .image-hint {
      grid-column: 1 / -1;
      margin: 0;
      color: #777;
      font-family: "Open Sans", sans-serif;
      font-size: .65rem;
      line-height: 1.45;
    }

    #write-status {
      min-height: 1.25em;
      margin: .65rem 0 0;
      color: #a3152a;
      font-family: "Open Sans", sans-serif;
      font-size: .68rem;
      text-align: right;
    }

    #write-status:empty { display: none; }
    #write-status.ok { color: #26713a; }

    @media (max-width: 700px) {
      body { padding: .8rem .8rem 1.5rem; }
      header { margin-bottom: 1.45rem; }
      header > nav { column-gap: 1ch; }
      .writer-head { align-items: start; }
      .writer-shortcut { display: none; }
      .meta-grid { grid-template-columns: 1fr 1fr; }
      .meta-grid .write-field:first-child { grid-column: 1 / -1; }
      .writer-actions { align-items: stretch; flex-wrap: wrap; }
      .draft-meta { flex-basis: 100%; order: 4; margin-top: .1rem; }
      .write-button { flex: 1; }
      .image-panel { grid-template-columns: 1fr 1fr; }
      .image-panel .image-field { grid-column: 1 / -1; }
      #write-status { text-align: left; }
      .writer-body,
      #post-editor,
      #post-body-fallback { min-height: 62vh; }
    }

    @media (max-width: 430px) {
      .writer-head h1 { font-size: 1.65rem; }
      .writer-head p { font-size: .75rem; }
      .writer-meta { padding: 1rem; }
      .write-title input { font-size: 1.65rem; }
      .meta-grid { grid-template-columns: 1fr; }
      .meta-grid .write-field:first-child { grid-column: auto; }
      .draft-meta { display: grid; gap: .1rem; }
      .draft-meta span + span::before { content: none; }
      .toastui-editor-toolbar { padding-left: 4px !important; }
    }
  </style>`;

  const content = html`
    ${styles}
    <link rel="stylesheet" href="https://uicdn.toast.com/editor/3.2.2/toastui-editor.min.css">

    <article class="writer-head">
      <div>
        <h1>${text.pageTitle}</h1>
        <p>${text.description}</p>
      </div>
      <p class="writer-shortcut">${text.shortcut}</p>
    </article>

    <section class="writer-shell">
      <section class="writer-meta" aria-label="${text.pageTitle}">
        <div class="write-title">
          <label class="sr-only" for="post-title">${text.postTitle}</label>
          <input id="post-title" type="text" autocomplete="off" placeholder="${text.titlePlaceholder}">
        </div>

        <details class="publish-details">
          <summary>${text.details}</summary>
          <div class="meta-grid">
            <div class="write-field">
              <label for="post-slug">${text.slug}</label>
              <input id="post-slug" type="text" autocomplete="off" placeholder="${text.slugPlaceholder}">
            </div>
            <div class="write-field">
              <label for="post-tags">${text.tags}</label>
              <input id="post-tags" type="text" autocomplete="off" placeholder="${text.tagsPlaceholder}">
            </div>


            <div class="write-field">
              <label for="post-date">${text.date}</label>
              <input id="post-date" type="date">
            </div>

            <div class="write-field">
              <label for="post-lang">${text.language}</label>
              <select id="post-lang">
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </details>
      </section>

      <section class="writer-body" aria-label="${text.placeholder}">
        <div id="post-editor"></div>
      </section>

      <footer class="writer-footer">
        <div class="writer-actions">
          <div class="draft-meta" aria-live="polite">
            <span id="word-count">0 ${text.wordUnit}</span>
            <span id="draft-state">${text.localDraft}</span>
          </div>
          <button class="write-button" id="new-draft" type="button">${text.newDraft}</button>
          <button class="write-button" id="insert-image" type="button" aria-expanded="false" aria-controls="image-panel">${text.insertImage}</button>
          <button class="write-button primary" id="publish-issue" type="button">${text.publish}</button>
        </div>

        <form class="image-panel" id="image-panel" hidden>
          <div class="image-field">
            <label for="image-url">${text.imageUrl}</label>
            <input id="image-url" type="text" inputmode="url" autocomplete="url" placeholder="${text.imageUrlPlaceholder}">
          </div>
          <div class="image-field">
            <label for="image-alt">${text.imageAlt}</label>
            <input id="image-alt" type="text" autocomplete="off" placeholder="${text.imageAltPlaceholder}">
          </div>
          <button class="write-button" id="cancel-image" type="button">${text.cancel}</button>
          <button class="write-button primary" type="submit">${text.imageInsert}</button>
          <p class="image-hint">${text.imageHint}</p>
        </form>

        <p id="write-status" role="status" aria-live="polite"></p>
      </footer>
    </section>

    <script src="https://uicdn.toast.com/editor/3.2.2/toastui-editor-all.min.js"></script>
    <script>
      (() => {
        const titleEl = document.getElementById("post-title");
        const slugEl = document.getElementById("post-slug");
        const tagsEl = document.getElementById("post-tags");
        const dateEl = document.getElementById("post-date");
        const langEl = document.getElementById("post-lang");
        const statusEl = document.getElementById("write-status");
        const wordCountEl = document.getElementById("word-count");
        const draftStateEl = document.getElementById("draft-state");
        const newDraftBtn = document.getElementById("new-draft");
        const imageBtn = document.getElementById("insert-image");
        const imagePanel = document.getElementById("image-panel");
        const imageUrlEl = document.getElementById("image-url");
        const imageAltEl = document.getElementById("image-alt");
        const cancelImageBtn = document.getElementById("cancel-image");
        const publishBtn = document.getElementById("publish-issue");
        const editorHost = document.getElementById("post-editor");

        if (!titleEl || !slugEl || !tagsEl || !dateEl || !langEl || !statusEl || !wordCountEl || !draftStateEl || !newDraftBtn || !imageBtn || !imagePanel || !imageUrlEl || !imageAltEl || !cancelImageBtn || !publishBtn || !editorHost) return;

        const TEXT = {
          fillAll: ${JSON.stringify(text.fillAll)},
          badSlug: ${JSON.stringify(text.badSlug)},
          badTags: ${JSON.stringify(text.badTags)},
          badDate: ${JSON.stringify(text.badDate)},
          fallbackNotice: ${JSON.stringify(text.fallbackNotice)},
          openingIssue: ${JSON.stringify(text.openingIssue)},
          issueOpened: ${JSON.stringify(text.issueOpened)},
          issueCopied: ${JSON.stringify(text.issueCopied)},
          issueOpenFailed: ${JSON.stringify(text.issueOpenFailed)},
          issueCopyFailed: ${JSON.stringify(text.issueCopyFailed)},
          publishLabel: ${JSON.stringify(text.publish)},
          wordUnit: ${JSON.stringify(text.wordUnit)},
          localDraft: ${JSON.stringify(text.localDraft)},
          draftRestored: ${JSON.stringify(text.draftRestored)},
          draftSaving: ${JSON.stringify(text.draftSaving)},
          draftSaved: ${JSON.stringify(text.draftSaved)},
          resetConfirm: ${JSON.stringify(text.resetConfirm)},
          imageRequired: ${JSON.stringify(text.imageRequired)},
        };

        const PAGE_LANG = ${JSON.stringify(lang)};
        const DRAFT_KEY = "jay67-write-draft-v2:" + PAGE_LANG;
        const LEGACY_DRAFT_KEY = "jay67-write-draft-v1";

        const setStatus = (message, ok) => {
          statusEl.textContent = message;
          statusEl.className = ok ? "ok" : "";
        };

        const clearStatus = () => {
          statusEl.textContent = "";
          statusEl.className = "";
        };

        const slugify = (value) => value
          .normalize("NFKC")
          .toLocaleLowerCase()
          .trim()
          .replace(/[^\\p{L}\\p{N}\\s-]/gu, "")
          .replace(/\\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        const validSlug = (value) =>
          value.length <= 80 &&
          /^[\\p{L}\\p{N}]+(?:-[\\p{L}\\p{N}]+)*$/u.test(value);
        const parseTags = (value) =>
          [...new Set(value.split(",").map(tag => tag.trim()).filter(Boolean))];

        const validTags = (tags) =>
          tags.length <= 8 &&
          tags.every(tag => /^[\\p{L}\\p{N}][\\p{L}\\p{N} _-]{0,31}$/u.test(tag));


        const localDate = () => {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          return now.toISOString().slice(0, 10);
        };

        const validDate = (value) => {
          if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;
          const parsed = new Date(value + "T00:00:00Z");
          return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
        };

        let draft = {};
        let migratedLegacyDraft = false;
        try {
          const saved = localStorage.getItem(DRAFT_KEY);
          if (saved) {
            draft = JSON.parse(saved);
          } else {
            const legacy = JSON.parse(localStorage.getItem(LEGACY_DRAFT_KEY) || "{}");
            if (legacy.lang === PAGE_LANG) {
              draft = legacy;
              migratedLegacyDraft = true;
            }
          }
        } catch {
          draft = {};
        }

        titleEl.value = typeof draft.title === "string" ? draft.title : "";
        slugEl.value = typeof draft.slug === "string" ? draft.slug : "";
        tagsEl.value = typeof draft.tags === "string" ? draft.tags : "";
        dateEl.value = typeof draft.date === "string" && validDate(draft.date) ? draft.date : localDate();
        langEl.value = draft.lang === "en" || draft.lang === "zh" ? draft.lang : PAGE_LANG;
        const initialBody = typeof draft.body === "string" ? draft.body : "";
        const hasDraft = Boolean(titleEl.value || slugEl.value || tagsEl.value || initialBody);
        if (hasDraft) draftStateEl.textContent = TEXT.draftRestored;

        let slugTouched = Boolean(slugEl.value);
        let publishing = false;

        const buildIssue = ({ title, slug, tags, date, lang, body }) => {
          const issueTitlePrefix = lang === "zh" ? "[publish-zh]" : "[publish]";
          const issueTitle = issueTitlePrefix + " " + date + " " + slug + " " + title;
          const meta = {
            source: "write-page-v2",
            title,
            slug,
            date,
            tags,
            lang,
          };
          const issueBody = "<!-- blog-publish:v2 " + JSON.stringify(meta) + " -->\\n\\n" + body;
          const params = new URLSearchParams({ title: issueTitle, body: issueBody });
          const url = "https://github.com/GongJiYang/GongJiYang.github.io/issues/new?" + params.toString();
          return { issueTitle, issueBody, url };
        };

        const bindActions = (getBody, setBody, insertText, observeBody) => {
          let saveTimer;
          let lastSaved = "";

          const snapshot = () => JSON.stringify({
            title: titleEl.value,
            slug: slugEl.value,
            tags: tagsEl.value,
            date: dateEl.value,
            lang: langEl.value,
            body: getBody(),
          });

          const updateWordCount = () => {
            const readableBody = getBody()
              .replace(/!\\[[^\\]]*\\]\\([^)]*\\)/g, "")
              .replace(/\\[([^\\]]+)\\]\\([^)]*\\)/g, "$1")
              .replace(/https?:\\/\\/\\S+/g, "")
              .replace(/[\`#>*_~-]/g, " ");
            const words = readableBody.match(/[\\u3400-\\u9fff]|[\\p{L}\\p{N}]+/gu) || [];
            wordCountEl.textContent = words.length + " " + TEXT.wordUnit;
          };

          const saveDraft = () => {
            window.clearTimeout(saveTimer);
            const next = snapshot();
            if (next === lastSaved) return;
            try {
              localStorage.setItem(DRAFT_KEY, next);
              if (migratedLegacyDraft) {
                localStorage.removeItem(LEGACY_DRAFT_KEY);
                migratedLegacyDraft = false;
              }
              lastSaved = next;
              draftStateEl.textContent = TEXT.draftSaved;
            } catch {
              draftStateEl.textContent = TEXT.localDraft;
            }
          };

          const scheduleSave = () => {
            window.clearTimeout(saveTimer);
            draftStateEl.textContent = TEXT.draftSaving;
            saveTimer = window.setTimeout(saveDraft, 450);
          };

          const changed = () => {
            clearStatus();
            scheduleSave();
          };

          titleEl.addEventListener("input", () => {
            if (!slugTouched) slugEl.value = slugify(titleEl.value);
            changed();
          });

          slugEl.addEventListener("input", () => {
            slugTouched = Boolean(slugEl.value);
            changed();
          });
          tagsEl.addEventListener("input", changed);

          dateEl.addEventListener("input", changed);
          langEl.addEventListener("change", changed);

          observeBody(() => {
            clearStatus();
            updateWordCount();
            scheduleSave();
          });

          const closeImagePanel = () => {
            imagePanel.hidden = true;
            imageBtn.setAttribute("aria-expanded", "false");
          };

          imageBtn.addEventListener("click", () => {
            imagePanel.hidden = !imagePanel.hidden;
            imageBtn.setAttribute("aria-expanded", imagePanel.hidden ? "false" : "true");
            if (!imagePanel.hidden) imageUrlEl.focus();
          });

          cancelImageBtn.addEventListener("click", () => {
            closeImagePanel();
            clearStatus();
          });

          imagePanel.addEventListener("submit", (event) => {
            event.preventDefault();
            const url = imageUrlEl.value.trim();
            const alt = imageAltEl.value.trim().replace(/\\]/g, "\\\\]");
            if (!/^(https?:\\/\\/|\\/assets\\/)[^\\s]+$/i.test(url)) {
              setStatus(TEXT.imageRequired, false);
              imageUrlEl.focus();
              return;
            }
            const safeUrl = url.replace(/\\s/g, "%20").replace(/\\)/g, "\\\\)");
            insertText("\\n![" + alt + "](" + safeUrl + ")\\n");
            imageUrlEl.value = "";
            imageAltEl.value = "";
            closeImagePanel();
          });

          newDraftBtn.addEventListener("click", () => {
            const hasContent = Boolean(titleEl.value.trim() || tagsEl.value.trim() || getBody().trim());
            if (hasContent && !window.confirm(TEXT.resetConfirm)) return;
            window.clearTimeout(saveTimer);
            titleEl.value = "";
            slugEl.value = "";
            tagsEl.value = "";
            dateEl.value = localDate();
            langEl.value = PAGE_LANG;
            slugTouched = false;
            setBody("");
            localStorage.removeItem(DRAFT_KEY);
            localStorage.removeItem(LEGACY_DRAFT_KEY);
            lastSaved = "";
            updateWordCount();
            draftStateEl.textContent = TEXT.localDraft;
            clearStatus();
            closeImagePanel();
            titleEl.focus();
          });

          const publish = async () => {
            if (publishing) return;

            const title = titleEl.value.trim();
            const slug = slugEl.value.trim();
            const tags = parseTags(tagsEl.value);
            const date = dateEl.value;
            const selectedLang = langEl.value;
            const body = getBody().trim();

            if (!title || !slug || !date || !body) return setStatus(TEXT.fillAll, false);
            if (!validSlug(slug)) return setStatus(TEXT.badSlug, false);
            if (!validDate(date)) return setStatus(TEXT.badDate, false);
            if (!validTags(tags)) return setStatus(TEXT.badTags, false);

            publishing = true;
            publishBtn.disabled = true;
            setStatus(TEXT.openingIssue, false);
            saveDraft();

            const handoff = buildIssue({ title, slug, tags, date, lang: selectedLang, body });
            const opened = window.open("about:blank", "_blank");
            if (!opened) {
              publishing = false;
              publishBtn.disabled = false;
              setStatus(TEXT.issueOpenFailed, false);
              return;
            }
            opened.opener = null;

            try {
              let targetUrl = handoff.url;
              let copied = false;
              if (targetUrl.length > 7000) {
                try {
                  await navigator.clipboard.writeText(handoff.issueBody);
                  const pastePrompt = selectedLang === "zh"
                    ? "文章较长，正文已复制到剪贴板。\\n\\n请点击此描述框，按 ⌘/Ctrl+A 全选，再按 ⌘/Ctrl+V 粘贴正文；确认开头出现 blog-publish 标记后再提交。"
                    : "This post is too long to prefill. It is already on your clipboard.\\n\\nClick this description, press ⌘/Ctrl+A, then ⌘/Ctrl+V. Confirm that a blog-publish marker appears at the top before submitting.";
                  const params = new URLSearchParams({ title: handoff.issueTitle, body: pastePrompt });
                  copied = true;
                } catch {
                  opened.close();
                  setStatus(TEXT.issueCopyFailed, false);
                  return;
                }
              }
              opened.location.replace(targetUrl);
              setStatus(copied ? TEXT.issueCopied : TEXT.issueOpened, true);
            } finally {
              publishing = false;
              publishBtn.disabled = false;
            }
          };

          publishBtn.addEventListener("click", publish);
          document.addEventListener("keydown", (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              publish();
            }
            if (event.key === "Escape" && !imagePanel.hidden) closeImagePanel();
          });
          window.addEventListener("pagehide", saveDraft);

          updateWordCount();
          if (migratedLegacyDraft) {
            saveDraft();
          } else {
            lastSaved = snapshot();
          }
        };

        const useFallbackEditor = () => {
          const fallback = document.createElement("textarea");
          fallback.id = "post-body-fallback";
          fallback.placeholder = ${JSON.stringify(text.placeholder)};
          fallback.value = initialBody;
          editorHost.replaceChildren(fallback);

          const insertText = (snippet) => {
            const start = fallback.selectionStart ?? fallback.value.length;
            const end = fallback.selectionEnd ?? fallback.value.length;
            fallback.value = fallback.value.slice(0, start) + snippet + fallback.value.slice(end);
            const pos = start + snippet.length;
            fallback.selectionStart = pos;
            fallback.selectionEnd = pos;
            fallback.dispatchEvent(new Event("input"));
            fallback.focus();
          };

          bindActions(
            () => fallback.value,
            (value) => {
              fallback.value = value;
              fallback.dispatchEvent(new Event("input"));
            },
            insertText,
            (listener) => fallback.addEventListener("input", listener),
          );
          setStatus(TEXT.fallbackNotice, false);
          fallback.focus();
        };

        if (window.toastui && window.toastui.Editor) {
          const editor = new window.toastui.Editor({
            el: editorHost,
            initialEditType: "markdown",
            previewStyle: window.matchMedia("(max-width: 700px)").matches ? "tab" : "vertical",
            hideModeSwitch: true,
            height: "68vh",
            placeholder: ${JSON.stringify(text.placeholder)},
            initialValue: initialBody,
            toolbarItems: [
              ["heading", "bold", "italic"],
              ["quote", "ul", "ol", "task"],
              ["link"],
              ["code", "codeblock"],
            ],
          });

          bindActions(
            () => editor.getMarkdown(),
            (value) => editor.setMarkdown(value),
            (snippet) => editor.insertText(snippet),
            (listener) => editor.on("change", listener),
          );
          return;
        }

        useFallbackEditor();
      })();
    </script>
  `;

  return base({
    path: lang === "en" ? "/write/" : "/CN/write/",
    title: `${text.title} — Jay67`,
    description: text.description,
    src: "/src/templates.ts",
    content,
    showLangSwitch: true,
    showEditLink: false,
  }, lang);
};

export const post_list = (posts: Post[], lang: "en" | "zh"): HtmlString => {
  const prefix = lang === "en" ? "" : "/CN";
  const postItem = (post: Post) =>
    html`
  <li>
    <h2>${time(post.date, "meta")} <a href="${prefix}${post.path}">${post.title}</a></h2>
  </li>`;
  const listItems = posts.map(postItem);

  const postsByTag = new Map<string, Post[]>();
  for (const post of posts) {
    const tags = post.tags.length ? post.tags : [lang === "en" ? "Untagged" : "未分类"];
    for (const tag of tags) {
      const taggedPosts = postsByTag.get(tag) ?? [];
      taggedPosts.push(post);
      postsByTag.set(tag, taggedPosts);
    }
  }
  const tagGroups = [...postsByTag.entries()]
    .sort(([left], [right]) => left.localeCompare(right, lang))
    .map(([tag, taggedPosts]) =>
      html`
      <section class="tag-group" id="tag-${encodeURIComponent(tag)}">
        <h2>#${tag}</h2>
        <ul>
          ${taggedPosts.map(post => html`<li><a href="${prefix}${post.path}">${post.title}</a></li>`)}
        </ul>
      </section>`
    );

  return base({
    path: prefix ? `${prefix}/` : "/",
    title: "Jay67",
    description: blurb,
    src: "/src/templates.ts",
    body_class: "home-page",
    content: html`
      <ul class="post-list">${listItems}</ul>
      <section class="tag-index" aria-labelledby="tag-index-title">
        <h1 id="tag-index-title">${lang === "en" ? "Tags" : "标签"}</h1>
        <div class="tag-groups">${tagGroups}</div>
      </section>
    `,
    showLangSwitch: true,
  }, lang);
};

export function post(post: Post, spellcheck: boolean, lang: "en" | "zh"): HtmlString {
  const prefix = lang === "en" ? "" : "/CN";
  const postPath = `${prefix}${post.path}`;
  const labels = lang === "en"
    ? { close: "Close reference", loading: "Loading referenced article…" }
    : { close: "关闭引用文章", loading: "正在加载引用文章…" };
  return base({
    src: post.src,
    title: post.title,
    description: post.summary,
    path: postPath,
    body_class: "article-page",
    content: html`
      <div class="note-stack" data-note-stack>
        <article class="note-panel" data-note-url="${postPath}" ${spellcheck ? 'contentEditable="true"' : ""}>
          ${post.content}
        </article>
      </div>
      <script>
        (() => {
          const stack = document.querySelector("[data-note-stack]");
          if (!stack || !window.fetch || !window.DOMParser) return;

          const ARTICLE_PATH = /^\\/(?:CN\\/)?\\d{4}\\/\\d{2}\\/\\d{2}\\/[^/]+\\.html$/;
          const LABELS = ${JSON.stringify(labels)};
          const cache = new Map();
          const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          const panels = () => Array.from(stack.querySelectorAll(".note-panel"));
          const panelPaths = () => panels().map(panel => panel.dataset.noteUrl);

          const trimAfter = (index) => {
            panels().slice(index + 1).forEach(panel => panel.remove());
            document.body.classList.toggle("has-note-stack", panels().length > 1);
          };

          const scrollToPanel = (panel) => {
            stack.scrollTo({
              left: panel.offsetLeft - stack.offsetLeft,
              behavior: reducedMotion ? "auto" : "smooth",
            });
          };

          const loadNote = async (path) => {
            if (cache.has(path)) return cache.get(path);
            const response = await fetch(path, { headers: { Accept: "text/html" } });
            if (!response.ok) throw new Error("Could not load article");
            const page = new DOMParser().parseFromString(await response.text(), "text/html");
            const article = page.querySelector("main article");
            if (!article) throw new Error("Article content missing");

            for (const [selector, attribute] of [
              ["a[href]", "href"],
              ["img[src]", "src"],
              ["source[src]", "src"],
              ["video[poster]", "poster"],
            ]) {
              article.querySelectorAll(selector).forEach(element => {
                const value = element.getAttribute(attribute);
                if (value && !value.startsWith("data:")) {
                  element.setAttribute(attribute, new URL(value, response.url).href);
                }
              });
            }

            const note = { html: article.innerHTML, title: page.title };
            cache.set(path, note);
            return note;
          };

          const appendPanel = async (path, focusPanel = true) => {
            const panel = document.createElement("article");
            panel.className = "note-panel";
            panel.dataset.noteUrl = path;
            panel.tabIndex = -1;
            panel.setAttribute("aria-busy", "true");
            panel.innerHTML = '<p class="note-loading">' + LABELS.loading + "</p>";
            stack.append(panel);
            document.body.classList.add("has-note-stack");
            requestAnimationFrame(() => scrollToPanel(panel));

            try {
              const note = await loadNote(path);
              if (!panel.isConnected) return null;
              panel.setAttribute("aria-label", note.title);
              panel.removeAttribute("aria-busy");
              panel.innerHTML =
                '<nav class="note-panel-tools"><button class="note-panel-close" type="button" data-note-close aria-label="' +
                LABELS.close + '">×</button></nav>' + note.html;
              if (focusPanel) panel.focus({ preventScroll: true });
              return panel;
            } catch {
              panel.remove();
              window.location.assign(path);
              return null;
            }
          };

          stack.addEventListener("click", async (event) => {
            const closeButton = event.target.closest("[data-note-close]");
            if (closeButton) {
              const panel = closeButton.closest(".note-panel");
              const index = panels().indexOf(panel);
              if (index > 0) {
                trimAfter(index - 1);
                const previous = panels().at(-1);
                history.pushState({ noteStack: panelPaths() }, "", previous.dataset.noteUrl);
                scrollToPanel(previous);
                previous.focus({ preventScroll: true });
              }
              return;
            }

            const anchor = event.target.closest("a[href]");
            if (!anchor || event.defaultPrevented || event.button !== 0 ||
                event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
                (anchor.target && anchor.target !== "_self")) return;

            const target = new URL(anchor.href, window.location.href);
            if (target.origin !== window.location.origin || !ARTICLE_PATH.test(target.pathname)) return;

            const sourcePanel = anchor.closest(".note-panel");
            const sourceIndex = panels().indexOf(sourcePanel);
            if (sourceIndex < 0 || sourcePanel.dataset.noteUrl === target.pathname) return;
            event.preventDefault();
            trimAfter(sourceIndex);

            const existingIndex = panels().findIndex(panel => panel.dataset.noteUrl === target.pathname);
            if (existingIndex >= 0) {
              trimAfter(existingIndex);
              const existing = panels()[existingIndex];
              history.pushState({ noteStack: panelPaths() }, "", target.pathname);
              scrollToPanel(existing);
              existing.focus({ preventScroll: true });
              return;
            }

            const panel = await appendPanel(target.pathname);
            if (panel) history.pushState({ noteStack: panelPaths() }, "", target.pathname);
          });

          const restoreStack = async (paths) => {
            const current = panelPaths();
            let common = 0;
            while (common < current.length && common < paths.length && current[common] === paths[common]) common++;
            if (common === 0) {
              window.location.assign(paths.at(-1));
              return;
            }
            trimAfter(common - 1);
            for (const path of paths.slice(common)) {
              if (!await appendPanel(path, false)) return;
            }
            const activePanel = panels().at(-1);
            scrollToPanel(activePanel);
            activePanel.focus({ preventScroll: true });
          };

          history.replaceState({ noteStack: panelPaths() }, "", window.location.href);
          window.addEventListener("popstate", event => {
            if (Array.isArray(event.state?.noteStack) && event.state.noteStack.length) {
              restoreStack(event.state.noteStack);
            }
          });
        })();
      </script>
    `,
  }, lang);
}

export const blogroll_list = (posts: blogroll.FeedEntry[], lang: "en" | "zh"): HtmlString => {
  function domain(url: string): string {
    return new URL(url).host;
  }

  const list_items = posts.map((post) =>
    html`
            <li>
              <h2>
              <span class="meta">${time(post.date)}, ${domain(post.url)}</span>
                <a href="${post.url}">${post.title}</a>
              </h2>
            </li>`
  );

  const prefix = lang === "en" ? "" : "/CN";
  return base({
    path: `${prefix}/blogroll.html`,
    title: "Jay67",
    description: blurb,
    src: "/src/templates.ts",
    content: html`<ul class="post-list">${list_items}</ul>`,
  }, lang);
};

export function time(date: Date, cls?: string): HtmlString {
  const human = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const machine = yyyy_mm_dd(date);
  return html`<time ${cls ? `class="${cls}"` : ""
    } datetime="${machine}">${human}</time>`;
}

function yyyy_mm_dd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const redirect = (path: string): HtmlString => {
  return html`<!DOCTYPE html>
  <html lang="en-US">
    <meta charset="utf-8">
    <title>Redirecting&hellip;</title>
    <link rel="canonical" href="${path}">
    <script>location="${path}"</script>
    <meta http-equiv="refresh" content="0; url=${path}">
    <meta name="robots" content="noindex">
    <h1>Redirecting&hellip;</h1>
    <a href="${path}">Click here if you are not redirected.</a>
  </html>`;
}

export const feed = (posts: Post[]): HtmlString => {
  const entries = posts.slice(0, 10).map(feed_entry);

  return html`<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
  <link href="${site_url}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${site_url}" rel="alternate" type="text/html"/>
  <updated>${new Date().toISOString()}</updated>
  <id>${site_url}/feed.xml</id>
  <title type="html">Jay67</title>
  <subtitle>Yet another programming blog by Alex Kladov aka matklad.</subtitle>
  <author><name>Alex Kladov</name></author>
  ${entries}
  </feed>
  `;
};

export const feed_entry = (post: Post): HtmlString => {
  return html`
  <entry>
  <title type="text">${post.title}</title>
  <link href="${site_url}${post.path}" rel="alternate" type="text/html" title="${post.title}" />
  <published>${yyyy_mm_dd(post.date)}T00:00:00+00:00</published>
  <updated>${yyyy_mm_dd(post.date)}T00:00:00+00:00</updated>
  <id>${site_url}${post.path.replace(".html", "")}</id>
  <author><name>Alex Kladov</name></author>
  <summary type="html"><![CDATA[${post.summary}]]></summary>
  <content type="html" xml:base="${site_url}${post.path}"><![CDATA[${post.content}]]></content>
  </entry>
  `;
};

export function html(
  strings: ArrayLike<string>,
  ...values: any[]
): HtmlString {
  function content(value: any): string[] {
    if (value === undefined) return [];
    if (value instanceof HtmlString) return [value.value];
    if (Array.isArray(value)) return value.flatMap(content);
    return [escapeHtml(value)];
  }
  return new HtmlString(
    String.raw({ raw: strings }, ...values.map((it) => content(it).join(""))),
  );
}

export class HtmlString {
  constructor(public value: string) {
  }
  push(other: HtmlString) {
    this.value = `${this.value}\n${other.value}`;
  }
}

function escapeHtml(data: any): string {
  return `${data}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
