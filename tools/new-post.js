ObjC.import("Foundation");

const app = Application.currentApplication();
app.includeStandardAdditions = true;

const postsDirectory = "/Users/gjy/GongJiYang.github.io/content/posts";

function prompt(message, defaultAnswer, button) {
  return app.displayDialog(message, {
    withTitle: "新建博客文章",
    defaultAnswer,
    buttons: ["取消", button],
    defaultButton: button,
    cancelButton: "取消",
  }).textReturned;
}

function shellQuote(value) {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function isCanceled(error) {
  const message = error && error.message ? String(error.message) : "";
  return Number(error.number) === -128 ||
    /用户已取消|User cancel(?:ed|led)/i.test(`${String(error)} ${message}`);
}

function articleTitle() {
  while (true) {
    const title = prompt("文章标题", "", "下一步").trim();
    if (title) return title;
    app.displayAlert("标题不能为空");
  }
}

function slugify(title) {
  const value = $.NSString.stringWithString(title)
    .stringByApplyingTransformReverse("Any-Latin; Latin-ASCII", false);
  return ObjC.unwrap(value)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/g, "") || "post";
}

function localDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${
    pad(date.getDate())
  }`;
}

function availablePath(directory, stem) {
  const manager = $.NSFileManager.defaultManager;
  let suffix = 1;
  let path;
  do {
    path = `${directory}/${stem}${suffix === 1 ? "" : `-${suffix}`}.md`;
    suffix++;
  } while (manager.fileExistsAtPath(path));
  return path;
}

function createPost(title, tags, directory, shouldOpen) {
  const normalizedTags = tags
    .split(/[，,]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .join(", ");
  const stem = `${localDate(new Date())}-${slugify(title)}`;
  const path = availablePath(directory, stem);
  const content = `---\ntags: ${normalizedTags}\n---\n\n# ${title}\n\n`;
  const error = Ref();
  const written = $.NSString.stringWithString(content)
    .writeToFileAtomicallyEncodingError(
      path,
      true,
      $.NSUTF8StringEncoding,
      error,
    );
  if (!written) {
    throw new Error(
      `无法创建文章：${ObjC.unwrap(error[0].localizedDescription)}`,
    );
  }

  if (shouldOpen) {
    app.doShellScript(`/usr/bin/open -a Typora ${shellQuote(path)}`);
  }
  return path;
}

function run(argv) {
  try {
    const interactive = argv.length === 0;
    const title = interactive ? articleTitle() : argv[0].trim();
    if (!title) throw new Error("标题不能为空");
    const tags = interactive
      ? prompt("标签（多个标签用逗号分隔，可以留空）", "", "创建")
      : (argv[1] || "");
    const directory = argv[2] || postsDirectory;
    return createPost(title, tags, directory, interactive);
  } catch (error) {
    if (isCanceled(error)) return "";
    if (argv.length === 0) {
      app.displayAlert("创建失败", { message: String(error) });
    }
    throw error;
  }
}
