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
let devServer: Bun.Server | undefined;

const OUT_ROOT = path.resolve("./out/www");

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
  let signal = Promise.withResolvers<boolean>();
  let building = false;
  let pendingBuild = false;

  const triggerRebuild = () => {
    if (building) {
      pendingBuild = true;
      return;
    }
    signal.resolve(true);
  };

  const rebuild_debounced = debounce(triggerRebuild, 16);

  fsWatch("./content", { recursive: true }, (eventType, filename) => {
    console.log(`File event: ${eventType} on ${filename}`);
    if (!filename) return;
    if (eventType === "rename" || eventType === "change") {
      rebuild_debounced();
    }
  });

  const useWsReload = process.env.LIVE_RELOAD_WS === "1";
  if (useWsReload && !wss) {
    wss = new WebSocketServer({ port: 35729 });
    wss.on("error", (error) => {
      console.warn("WebSocket server unavailable on port 35729, continuing without live reload:", error);
      wss = undefined;
    });
    console.log("WebSocket server started on ws://localhost:35729");
  }

  startDevServer();
  signal.resolve(true);

  let build_id = 0;
  while (await signal.promise) {
    signal = Promise.withResolvers<boolean>();
    building = true;
    console.log(`rebuild #${build_id}`);
    build_id += 1;
    await build({
      blogroll: true,
      update: true,
      spell: false,
      profile: false,
      filter: params.filter,
    });
    building = false;
    if (wss) wss.clients.forEach(ws => ws.send("reload"));

    if (pendingBuild) {
      pendingBuild = false;
      signal.resolve(true);
    }
  }
}

function debounce(fn: () => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

function staticCandidates(pathname: string): string[] {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return [];
  }

  if (decoded === "/") return ["index.html"];

  const cleaned = decoded.replace(/^\/+/, "");
  const candidates = new Set<string>();

  if (decoded.endsWith("/")) {
    candidates.add(path.join(cleaned, "index.html"));
  } else {
    candidates.add(cleaned);
    if (!path.extname(cleaned)) {
      candidates.add(path.join(cleaned, "index.html"));
      candidates.add(`${cleaned}.html`);
    }
  }

  return [...candidates].map((candidate) => path.normalize(candidate));
}

async function serveStatic(pathname: string, method: string): Promise<Response> {
  const candidates = staticCandidates(pathname);
  for (const candidate of candidates) {
    const fullPath = path.resolve(OUT_ROOT, candidate);
    const insideOut = fullPath === OUT_ROOT || fullPath.startsWith(`${OUT_ROOT}${path.sep}`);
    if (!insideOut) continue;

    try {
      const stat = await fspromise.stat(fullPath);
      if (!stat.isFile()) continue;
      const body = method === "HEAD" ? null : Bun.file(fullPath);
      return new Response(body, {
        status: 200,
      });
    } catch {
      continue;
    }
  }

  return new Response("Not Found", { status: 404 });
}

function startDevServer() {
  if (devServer) return;

  const envPort = Number(process.env.PORT ?? "3030");
  const port = Number.isFinite(envPort) && envPort > 0 ? envPort : 3030;

  devServer = Bun.serve({
    hostname: "127.0.0.1",
    port,
    fetch: async (request) => {
      const { pathname } = new URL(request.url);

      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      return serveStatic(pathname, request.method);
    },
  });

  console.log(`Dev server started at http://${devServer.hostname}:${devServer.port}`);
  console.log("Set PORT=xxxx to override default 3030 if needed.");
  console.log("Set LIVE_RELOAD_WS=1 to enable ws://localhost:35729 reload channel.");
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
          templates.blogroll_list(blogroll_posts, lang).value,
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

    // 在线写作页面
    await update_file(`out/www${prefix}/write/index.html`, templates.write_page(lang).value);
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
  tags: string[];
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

function post_source(source: string): { body: string; tags: string[] } {
  const metadata = source.match(/^---\r?\ntags:\s*([^\r\n]+)\r?\n---\r?\n?/);
  if (!metadata) return { body: source, tags: [] };
  const tags = [...new Set(metadata[1].split(",").map(tag => tag.trim()).filter(Boolean))];
  return { body: source.slice(metadata[0].length), tags };
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
    const source = post_source(text);
    ctx.read_ms += performance.now() - t;

    t = performance.now();
    const ast = djot.parse(source.body);
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
      tags: source.tags,
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