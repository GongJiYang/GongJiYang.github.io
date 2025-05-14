import { mkdir, rm, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { watch as fsWatch } from "fs";
import os from "os";
import fspromise from "fs/promises";
import { HtmlString } from "./templates.ts";
import * as blogroll from "./blogroll.ts";
import * as templates from "./templates.ts";
import * as djot from "./djot.ts";
import { WebSocketServer } from "ws";

let wss: WebSocketServer | undefined;

async function main() {
  // 定义命令行数据
  const params = {
    blogroll: false,
    update: false,
    spell: false,
    profile: false,
    filter: "",
  }
  // 用户提供的命令行参数
  const args = process.argv.slice(2);
  const subcommand = args[0]; 2
  // 创建md文件
  if (subcommand === "touch") {
    const slug = args[1];
    const lang = args[2] === "zh" ? "zh" : "en"; // 默认英文
    const date = new Date().toISOString().split("T")[0];
    const filePath = `./content/posts/${date}-${slug}.${lang}.dj`;
    console.log(`Creating ${filePath}`);
    await fspromise.writeFile(filePath, "#\n", { flag: 'a' });
    return;
  }
  // 解析命令行参数，并将其存储在 params 对象中
  let i = 3; //change-1
  for (; i < process.argv.length; i++) {
    switch (process.argv[i]) {
      case "--update": {
        params.update = true;
        break;
      }
      case "--spell": {
        params.spell = true;
        break;
      }
      case "--profile": {
        params.profile = true;
        break;
      }
      case "--filter": {
        params.filter = process.argv[i + 1] ?? "";
        i++;
        break;
      }
      case "--blogroll": {
        params.blogroll = true;
        break;
      }
      case "--help": {
        console.log("Usage: node script.js [options]");
        console.log("--update      Enable update mode");
        console.log("--spell       Enable spell checking");
        console.log("--filter      Set a filter value");
        console.log("--blogroll    Enable blogroll");
        process.exit(0);
      }//change-2
      default:
        fatal(`unexpected argument: ${process.argv[i]}`);
    }
  }
  // 根据 subcommand 来决定执行哪一个函数
  if (subcommand === "build") {
    await build(params);
  } else if (subcommand === "watch") {
    await watch(params);
  } else {
    fatal("subcommand required");
  }
}

function fatal(message: string) {
  console.error(message);
  process.exit(1);
}

async function watch(params: { filter: string }) {
  // 默认处于等待状态
  // 手动 signal.resolve() 时，触发 build()
  // 每次 build() 结束后，重新等待下一个 signal.resolve()
  let signal = Promise.withResolvers();
  (async () => {
    let build_id = 0; //记录重构次数
    while (await signal.promise) {
      signal = Promise.withResolvers();
      console.log(`rebuild #${build_id}`);
      build_id += 1;
      await build({
        blogroll: true,
        update: true,
        spell: false,
        profile: false,
        filter: params.filter,
      });
    }
  })();

  signal.resolve(true);

  // 确保 signal.resolve(true) 只在最后一次调用后的 16ms 执行
  // 如果 16ms 内有新的调用，就会取消前一个调用，重新计时。
  const rebuild_debounced = debounce(
    () => signal.resolve(true),
    16,
  );

  // 监听 ./content
  fsWatch("./content", { recursive: true }, (eventType, filename) => {
    console.log(`File event: ${eventType} on ${filename}`);
    if (!filename) return;
    if (eventType === "rename" || eventType === "change") {
      rebuild_debounced(); // 触发防抖构建，防止短时间内重复触发 rebuild()
    }
  });

  //启动 websocket 服务器
  if (!wss) {
    wss = new WebSocketServer({ port: 35729 });
    console.log("WebSocket server started on ws://localhost:35729");
  }

  (async () => {
    let build_id = 0;
    while (await signal.promise) {
      signal = Promise.withResolvers();
      console.log(`rebuild #${build_id}`);
      build_id += 1;
      await build({
        blogroll: false,
        update: true,
        spell: false,
        profile: false,
        filter: params.filter,
      });
      // 构建完成后通知所有客户端刷新
      wss?.clients.forEach(ws => ws.send("reload"));
    }
  })();

}

function debounce(fn: () => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return () => { //给fn传参数
    clearTimeout(timer); //每次调用 debounce() 返回的函数时，都清除上一次 setTimeout
    timer = setTimeout(fn, delay);
  };
}

// 记录博客构建过程中的各个阶段耗时
class Ctx {
  constructor(
    //读取文件的时间
    public read_ms: number = 0,
    //解析 Markdown 或其他格式的时间
    public parse_ms: number = 0,
    //渲染 HTML 的时间
    public render_ms: number = 0,
    //收集和处理所有文章的时间
    public collect_ms: number = 0,
    //整个构建过程的总耗时
    public total_ms: number = 0,
  ) { }
}

async function build(params: {
  blogroll: boolean;
  update: boolean;
  spell: boolean;
  profile: boolean;
  filter: string;
}) {
  const t = performance.now();
  const ctx = new Ctx();

  // 创建 out/res 目录（如果 update 模式）
  if (params.update) {
    if (existsSync("./out/www")) {
      await rm("./out/www", { recursive: true, force: true }); // 删除旧目录
    }
    await mkdir("./out/www", { recursive: true }); // 重新创建
  }
  if (params.update) {
    try {
      // 删除旧目录
      await fspromise.rmdir("./out/res", { recursive: true });
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).code !== "ENOENT") {
        // 只有在错误是一个 Error 且 code 不是 "ENOENT" 时抛出
        throw err;
      }
    }

    // 重新创建目录
    await fspromise.mkdir("./out/res", { recursive: true });
  }

  // 获取所有文章，并应用过滤条件
  const posts = await collect_posts(ctx, params.filter);
  // 支持多语言
  for (const lang of ["en", "zh"] as const) {
    const prefix = lang === "en" ? "" : "/CN";
    const langPosts = posts.filter(post => post.lang === lang);

    // 首页和 feed
    await update_file(`out/www${prefix}/index.html`, templates.post_list(langPosts, lang).value);
    await update_file(`out/www${prefix}/feed.xml`, templates.feed(langPosts).value);

    // 文章页
    for (const post of langPosts) {
      await update_file(
        `out/www${prefix}${post.path}`,
        templates.post(post, params.spell, lang).value,
      );
    }

    // Blogroll
    if (params.blogroll) {
      try {
        const blogroll_posts = await blogroll.blogroll();
        console.log("blogroll_posts.length =", blogroll_posts.length);
        await update_file(
          `out/www${prefix}/blogroll.html`,
          templates.blogroll_list(blogroll_posts).value,
        );
        console.log(`Generated out/www${prefix}/blogroll.html`);
      } catch (err) {
        console.error("Failed to generate blogroll.html:", err);
      }
    }

    // 静态页面
    const pages = ["about"];
    for (const page of pages) {
      const text = await readFile(`content/${page}.dj`, 'utf-8');
      const ast = await djot.parse(text);
      const html = djot.render(ast, {});
      await update_file(`out/www${prefix}/${page}.html`, templates.page(page, html, lang).value);
    }
  }
  // 复制静态资源
  const paths = [
    "favicon.svg",
    "favicon.png",
    "css/*",
    "assets/*",
    "assets/resilient-parsing/*",
  ];

  for (const path of paths) {
    await update_path(path);
  }

  // 记录构建时间
  ctx.total_ms = performance.now() - t;
  console.log(`${ctx.total_ms}ms`);
  if (params.profile) console.log(JSON.stringify(ctx));

}

// 原子性更新
async function update_file(filePath: string, content: Uint8Array | string) {
  if (!content) return;

  // 确保目标目录存在
  await fspromise.mkdir(path.dirname(filePath), { recursive: true });

  // 创建临时文件
  const tempDir = await fspromise.mkdtemp(path.join(os.tmpdir(), "bun-temp-"));
  const tempFile = path.join(tempDir, "tempfile");

  // 写入内容
  if (content instanceof Uint8Array) {
    await fspromise.writeFile(tempFile, content);
  } else {
    await fspromise.writeFile(tempFile, content, "utf-8");
  }

  // 原子性重命名
  await fspromise.rename(tempFile, filePath);
}

//递归地更新路径 有问题
async function update_path(filePath: string) {
  if (filePath.endsWith("*")) {
    const dir = filePath.replace("*", ""); // 获取目录路径
    const futs: Promise<void>[] = [];

    try {
      // 读取目录内容，并获取文件类型信息
      const entries = await fspromise.readdir(`content/${dir}`, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile()) {
          // 是文件，则递归调用 update_path
          futs.push(update_path(`${dir}/${entry.name}`));
        }
      }

      // 并行处理所有文件
      await Promise.all(futs);
    } catch (error) {
      console.error(`Error reading directory: ${dir}`, error);
    }
  } else {
    try {
      // 读取文件内容
      const content = await fspromise.readFile(`content/${filePath}`);
      await update_file(`out/www/${filePath}`, content);
    } catch (error) {
      console.error(`Error processing file: ${filePath}`, error);
    }
  }
}

export type Post = {
  year: number;
  month: number;
  day: number;
  slug: string;
  date: Date;
  title: string;
  path: string;
  src: string;
  content: HtmlString;
  summary: string;
  lang: "en" | "zh";
};

// 递归读取目录中的所有文件 有问题
async function walk(dir: string): Promise<string[]> {
  let files: string[] = [];
  const entries = await fspromise.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await walk(fullPath)); // 递归目录
    } else {
      files.push(fullPath); // 添加文件
    }
  }
  return files;
}

// 在 Bun 环境下实现 collect_posts 有问题
async function collect_posts(ctx: Ctx, filter: string): Promise<Post[]> {
  const start = performance.now();
  const posts = [];
  // 递归获取 `content/posts` 目录下的所有文件
  const files = await walk("./content/posts/");

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    if (!fileName.endsWith(".dj")) continue;
    if (filter && !fileName.includes(filter)) continue;

    // 支持 xxxx-xx-xx-slug.zh.dj 和 xxxx-xx-xx-slug.en.dj
    const match = fileName.match(/^(\d\d\d\d)-(\d\d)-(\d\d)-(.*?)(?:\.(zh|en))?\.dj$/);
    if (!match) continue;

    const [, y, m, d, slug, langSuffix] = match;
    const lang = langSuffix === "zh" ? "zh" : "en";
    const [year, month, day] = [y, m, d].map((it) => parseInt(it, 10));
    const date = new Date(Date.UTC(year, month - 1, day));

    let t = performance.now();
    const text = await fspromise.readFile(filePath, "utf-8");
    ctx.read_ms += performance.now() - t;

    t = performance.now();
    const ast = djot.parse(text);
    ctx.parse_ms += performance.now() - t;

    t = performance.now();
    const render_ctx = { date, summary: undefined, title: undefined };
    const html = djot.render(ast, render_ctx);
    ctx.render_ms += performance.now() - t;

    posts.push({
      year,
      month,
      day,
      slug,
      date,
      title: render_ctx.title!,
      content: html,
      summary: render_ctx.summary!,
      path: `/${y}/${m}/${d}/${slug}.html`,
      src: `/content/posts/${y}-${m}-${d}-${slug}${lang === "zh" ? ".zh" : ""}.dj`,
      lang: lang as "zh" | "en", // 新增
    });
  }

  // 按路径排序（倒序）
  posts.sort((l, r) => (l.path < r.path ? 1 : -1));
  ctx.collect_ms = performance.now() - start;
  return posts;
}

if (import.meta.main) await main();