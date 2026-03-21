import type { Post } from "./main.ts";
import * as blogroll from "./blogroll.ts";

type Language = "en" | "zh";

const site_url = "https://matklad.github.io";
// 中英切换
const LANG_KEY = 'site_language';
const navTexts: Record<Language, { about: string; blogroll: string; home: string; write: string; switchLang: string }> = {
  en: { home: "Home", about: "About", blogroll: "Blogroll", write: "Write", switchLang: "中" },
  zh: { home: "首页", about: "关于", blogroll: "博客列表", write: "写作", switchLang: "EN" },
};
export const base = (
  { content, src, title, path, description, extra_css, showLangSwitch = false, showEditLink = true }: {
    content: HtmlString;
    src: string;
    title: string;
    description: string;
    path: string;
    extra_css?: string;
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
  <link rel="canonical" href="${site_url}${path}">
  <link rel="alternate" type="application/rss+xml" title="Jay67" href="${site_url}/feed.xml">
  <style>
  @font-face {
    font-family: 'Open Sans'; src: url('/css/OpenSans-300-Normal.woff2') format('woff2');
    font-weight: 300; font-style: normal;
  }
  @font-face {
    font-family: 'JetBrains Mono'; src: url('/css/JetBrainsMono-400-Normal.woff2') format('woff2');
    font-weight: 400; font-style: normal;
  }
  @font-face {
    font-family: 'JetBrains Mono'; src: url('/css/JetBrainsMono-700-Normal.woff2') format('woff2');
    font-weight: 700; font-style: normal;
  }
  @font-face {
    font-family: 'EB Garamond'; src: url('/css/EBGaramond-400-Normal.woff2') format('woff2');
    font-weight: 400; font-style: normal;
  }
  @font-face {
    font-family: 'EB Garamond'; src: url('/css/EBGaramond-400-Italic.woff2') format('woff2');
    font-weight: 400; font-style: italic;
  }
  @font-face {
    font-family: 'EB Garamond'; src: url('/css/EBGaramond-700-Normal.woff2') format('woff2');
    font-weight: 700; font-style: normal;
  }
  @font-face {
    font-family: 'EB Garamond'; src: url('/css/EBGaramond-700-Italic.woff2') format('woff2');
    font-weight: 700; font-style: italic;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; margin-block-start: 0; margin-block-end: 0; }

  body {
    max-width: 80ch;
    padding: 2ch;
    margin-left: auto;
    margin-right: auto;
  }

  header { margin-bottom: 2rem; }
  header > nav { display: flex; column-gap: 2ch; align-items: baseline; flex-wrap: wrap; }
  header a { font-style: normal; color: rgba(0, 0, 0, .8); text-decoration: none; }
  header a:hover { color: rgba(0, 0, 0, .8); text-decoration: underline; }
  header .title { font-size: 1.25em; flex-grow: 2; }

  footer { margin-top: 2rem; }
  footer > p { display: flex; column-gap: 2ch; justify-content: center; flex-wrap: wrap; }
  footer a { color: rgba(0, 0, 0, .8); text-decoration: none; white-space: nowrap; }
  footer i { vertical-align: middle; color: rgba(0, 0, 0, .8) }

  </style>

  <link rel="stylesheet" href="/css/main.css">
  ${extra_css ? html`<link rel="stylesheet" href="/css/${extra_css}">` : ""}
</head>

<body>
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
      <a href="mailto:aleksey.kladov+blog@gmail.com">
        <svg class="icon"><use href="/assets/icons.svg#email"/></svg>
        Get in touch
      </a>
      <a href="https://github.com/matklad">
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

      if (savedLang !== pathLang) {
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
const blurb = "Yet another programming blog by Alex Kladov aka matklad.";

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
      description: "Write in live-render mode and publish via GitHub Issue.",
      postTitle: "Title",
      titlePlaceholder: "Post title",
      slug: "Slug",
      date: "Date",
      language: "Language",
      insertImage: "Insert image",
      publish: "Publish via GitHub Issue",
      fillAll: "Please fill title, slug, date and body.",
      badSlug: "Slug must contain only lowercase letters, numbers and '-'.",
      badDate: "Date must be in YYYY-MM-DD format.",
      publishConfirm: "Open GitHub Issue to publish this post?",
      intro: "Top area holds metadata; body area is live-render editor.",
      placeholder: "Start writing your Djot/Markdown post here...",
      imagePrompt: "Image path under /assets (example: /assets/demo.png):",
      fallbackNotice: "Live editor failed to load, switched to plain editor.",
      openingIssue: "Opening GitHub Issue...",
      issueOpened: "Issue form opened in a new tab.",
      issueOpenFailed: "Failed to open GitHub Issue.",
    },
    zh: {
      title: "写作",
      pageTitle: "在线写博客",
      description: "类似 Obsidian 的单栏实时渲染写作，完成后通过 GitHub Issue 发布。",
      postTitle: "标题",
      titlePlaceholder: "输入文章标题",
      slug: "Slug",
      date: "日期",
      language: "语言",
      insertImage: "插入图片",
      publish: "通过 GitHub Issue 发布",
      fillAll: "请填写标题、slug、日期和正文。",
      badSlug: "Slug 只能包含小写字母、数字和连字符。",
      badDate: "日期格式需为 YYYY-MM-DD。",
      publishConfirm: "确认打开 GitHub Issue 发布吗？",
      intro: "顶部是元信息，正文区是实时渲染编辑器。",
      placeholder: "在这里开始写 Djot/Markdown 正文...",
      imagePrompt: "输入 /assets 下的图片路径（例如：/assets/demo.png）：",
      fallbackNotice: "实时编辑器加载失败，已切换到纯文本编辑器。",
      openingIssue: "正在打开 GitHub Issue...",
      issueOpened: "已在新标签页打开 Issue 表单。",
      issueOpenFailed: "打开 GitHub Issue 失败。",
    },
  }[lang];

  const styles = html`<style>
    body {
      max-width: min(124ch, 96vw);
      padding: 1rem 1rem 2.25rem;
      background: #fafafa;
    }

    main { width: 100%; }

    .writer-head { margin-bottom: 1rem; }

    .writer-shell {
      display: grid;
      gap: .9rem;
      width: 100%;
    }

    .write-card {
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: .9rem 1rem;
      background: #fff;
    }

    .write-row {
      display: grid;
      gap: .35rem;
      margin-bottom: .7rem;
    }

    .write-row label {
      font-size: .9rem;
      color: #555;
      font-weight: 600;
    }

    .write-row input,
    .write-row select,
    .write-row button {
      font: inherit;
      padding: .58rem .66rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: #fff;
    }

    #post-title {
      font-size: 2.1rem;
      line-height: 1.25;
      font-weight: 700;
      border-color: #d8d8d8;
    }

    .meta-grid {
      display: grid;
      gap: .7rem;
      grid-template-columns: 1fr;
    }

    @media (min-width: 920px) {
      .meta-grid {
        grid-template-columns: 1.4fr .95fr .9fr;
      }
    }

    .write-actions { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: .2rem; }

    #write-status {
      min-height: 1.25em;
      margin-top: .35rem;
      color: #b00020;
    }

    #write-status.ok { color: #0b7a25; }

    .is-locked {
      background: #f3f3f3 !important;
      color: #666;
      cursor: not-allowed;
    }

    .writer-body-card {
      padding: 0;
      overflow: hidden;
      min-height: clamp(64vh, 78vh, 1400px);
    }

    #post-editor {
      min-height: clamp(64vh, 78vh, 1400px);
    }

    .toastui-editor-defaultUI {
      border: 0 !important;
      border-radius: 0 !important;
    }

    .toastui-editor-toolbar { border-bottom: 1px solid #eee !important; }

    .toastui-editor-md-container,
    .toastui-editor-md-preview {
      width: 100% !important;
      float: none !important;
    }

    .toastui-editor-md-preview {
      border-left: 0 !important;
      border-top: 1px solid #eee !important;
      min-height: 40vh;
    }

    .toastui-editor-contents,
    .toastui-editor-md-container .toastui-editor {
      font-family: "EB Garamond", Georgia, serif;
      font-size: 1.1rem;
      line-height: 1.75;
    }

    .toastui-editor-md-splitter {
      display: none !important;
    }
  </style>`;

  const content = html`
    ${styles}
    <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css">

    <article class="writer-head">
      <h1>${text.pageTitle}</h1>
      <p>${text.description}</p>
      <p class="meta">${text.intro}</p>
    </article>

    <section class="writer-shell">
      <section class="write-card writer-meta-card">
        <div class="write-row">
          <label for="post-title">${text.postTitle}</label>
          <input id="post-title" type="text" autocomplete="off" placeholder="${text.titlePlaceholder}">
        </div>

        <div class="meta-grid">
          <div class="write-row">
            <label for="post-slug">${text.slug}</label>
            <input id="post-slug" type="text" pattern="[a-z0-9-]+" autocomplete="off">
          </div>

          <div class="write-row">
            <label for="post-date">${text.date}</label>
            <input id="post-date" type="date">
          </div>

          <div class="write-row">
            <label for="post-lang">${text.language}</label>
            <select id="post-lang">
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>

        <div class="write-actions">
          <button id="insert-image" type="button">${text.insertImage}</button>
          <button id="publish-issue" type="button">${text.publish}</button>
        </div>
        <p id="write-status"></p>
      </section>

      <section class="write-card writer-body-card">
        <div id="post-editor"></div>
      </section>
    </section>

    <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
    <script>
      (() => {
        const titleEl = document.getElementById("post-title");
        const slugEl = document.getElementById("post-slug");
        const dateEl = document.getElementById("post-date");
        const langEl = document.getElementById("post-lang");
        const statusEl = document.getElementById("write-status");
        const imageBtn = document.getElementById("insert-image");
        const publishBtn = document.getElementById("publish-issue");
        const editorHost = document.getElementById("post-editor");

        if (!titleEl || !slugEl || !dateEl || !langEl || !statusEl || !imageBtn || !publishBtn || !editorHost) return;

        const TEXT = {
          fillAll: ${JSON.stringify(text.fillAll)},
          badSlug: ${JSON.stringify(text.badSlug)},
          badDate: ${JSON.stringify(text.badDate)},
          publishConfirm: ${JSON.stringify(text.publishConfirm)},
          imagePrompt: ${JSON.stringify(text.imagePrompt)},
          fallbackNotice: ${JSON.stringify(text.fallbackNotice)},
          openingIssue: ${JSON.stringify(text.openingIssue)},
          issueOpened: ${JSON.stringify(text.issueOpened)},
          issueOpenFailed: ${JSON.stringify(text.issueOpenFailed)},
          publishLabel: ${JSON.stringify(text.publish)},
        };

        const setStatus = (message, ok) => {
          statusEl.textContent = message;
          statusEl.className = ok ? "ok" : "";
        };

        const clearStatus = () => {
          statusEl.textContent = "";
          statusEl.className = "";
        };

        const slugify = (value) => value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\\s-]/g, "")
          .replace(/\\s+/g, "-")
          .replace(/-+/g, "-");

        let publishing = false;

        const buildIssueUrl = ({ title, slug, date, lang, body }) => {
          const issueTitlePrefix = lang === "zh" ? "[publish-zh]" : "[publish]";
          const issueTitle = issueTitlePrefix + " " + date + " " + slug + " " + title;
          const payload = {
            source: "write-page-v1",
            title,
            slug,
            date,
            lang,
            body,
          };
          const issueBody = [
            "<!-- blog-publish:v1 -->",
            JSON.stringify(payload, null, 2),
          ].join("\\n\\n");

          const params = new URLSearchParams({
            labels: "publish",
            title: issueTitle,
            body: issueBody,
          });

          return "https://github.com/GongJiYang/GongJiYang.github.io/issues/new?" + params.toString();
        };

        const bindActions = (getBody, insertText) => {
          titleEl.addEventListener("input", () => {
            clearStatus();
            if (!slugEl.dataset.touched) slugEl.value = slugify(titleEl.value);
          });

          slugEl.addEventListener("input", () => {
            slugEl.dataset.touched = "1";
            clearStatus();
          });

          dateEl.addEventListener("input", clearStatus);
          langEl.addEventListener("change", clearStatus);

          imageBtn.addEventListener("click", () => {
            const imagePath = window.prompt(TEXT.imagePrompt, "/assets/");
            if (!imagePath) return;
            insertText("\\n![image](" + imagePath + ")\\n");
          });

          publishBtn.addEventListener("click", async () => {
            const title = titleEl.value.trim();
            const slug = slugEl.value.trim();
            const date = dateEl.value;
            const lang = langEl.value;
            const body = getBody();

            if (!title || !slug || !date || !body) return setStatus(TEXT.fillAll, false);
            if (!/^[a-z0-9-]+$/.test(slug)) return setStatus(TEXT.badSlug, false);
            if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) return setStatus(TEXT.badDate, false);
            if (!window.confirm(TEXT.publishConfirm)) return;
            if (publishing) return;

            publishing = true;
            publishBtn.disabled = true;
            publishBtn.classList.add("is-locked");
            setStatus(TEXT.openingIssue, false);

            try {
              const issueUrl = buildIssueUrl({ title, slug, date, lang, body });
              const opened = window.open(issueUrl, "_blank", "noopener,noreferrer");
              if (!opened) {
                setStatus(TEXT.issueOpenFailed, false);
              } else {
                setStatus(TEXT.issueOpened, true);
              }
            } finally {
              publishing = false;
              publishBtn.disabled = false;
              publishBtn.classList.remove("is-locked");
            }
          });
        };

        const useFallbackEditor = () => {
          const fallback = document.createElement("textarea");
          fallback.id = "post-body-fallback";
          fallback.placeholder = ${JSON.stringify(text.placeholder)};
          fallback.style.width = "100%";
          fallback.style.minHeight = "78vh";
          fallback.style.border = "0";
          fallback.style.padding = "1.2rem 1.3rem";
          fallback.style.resize = "vertical";
          fallback.style.lineHeight = "1.75";
          fallback.style.fontSize = "1.1rem";
          fallback.style.fontFamily = "EB Garamond, Georgia, serif";
          fallback.style.outline = "none";
          editorHost.replaceChildren(fallback);

          const insertText = (snippet) => {
            const start = fallback.selectionStart ?? fallback.value.length;
            const end = fallback.selectionEnd ?? fallback.value.length;
            fallback.value = fallback.value.slice(0, start) + snippet + fallback.value.slice(end);
            const pos = start + snippet.length;
            fallback.selectionStart = pos;
            fallback.selectionEnd = pos;
            fallback.focus();
          };

          bindActions(() => fallback.value.trim(), insertText);
          setStatus(TEXT.fallbackNotice, false);
          fallback.focus();
        };

        dateEl.value = new Date().toISOString().slice(0, 10);
        langEl.value = ${JSON.stringify(lang)};
        publishBtn.textContent = TEXT.publishLabel;

        if (window.toastui && window.toastui.Editor) {
          const editor = new window.toastui.Editor({
            el: editorHost,
            initialEditType: "markdown",
            previewStyle: "vertical",
            hideModeSwitch: true,
            height: "78vh",
            placeholder: ${JSON.stringify(text.placeholder)},
            initialValue: "",
          });

          bindActions(
            () => editor.getMarkdown().trim(),
            (snippet) => editor.insertText(snippet),
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
  const list_items = posts.map((post) =>
    html`
  <li>
    <h2>${time(post.date, "meta")} <a href="${prefix}${post.path}">${post.title}</a></h2>
  </li>`
  );

  return base({
    path: prefix ? `${prefix}/` : "/",
    title: "Jay67",
    description: blurb,
    src: "/src/templates.ts",
    content: html`<ul class="post-list">${list_items}</ul>`,
    showLangSwitch: true,
  }, lang);
};

export function post(post: Post, spellcheck: boolean, lang: "en" | "zh"): HtmlString {
  const prefix = lang === "en" ? "" : "/CN";
  return base({
    src: post.src,
    title: post.title,
    description: post.summary,
    path: `${prefix}${post.path}`,
    content: html`
      <article ${spellcheck ? 'contentEditable="true"' : ""}>
        ${post.content}
      </article>
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
