const IDLE_MS = 10 * 60 * 1000;
const root = await Deno.realPath(new URL("..", import.meta.url));
const decoder = new TextDecoder();

async function run(
  program: string,
  args: string[],
  accepted = [0],
): Promise<Deno.CommandOutput> {
  const output = await new Deno.Command(program, {
    args,
    cwd: root,
    stdout: "inherit",
    stderr: "inherit",
  }).output();
  if (!accepted.includes(output.code)) {
    throw new Error(`${program} ${args.join(" ")} exited with ${output.code}`);
  }
  return output;
}

async function git_output(args: string[]): Promise<Deno.CommandOutput> {
  return await new Deno.Command("git", {
    args,
    cwd: root,
    stdout: "piped",
    stderr: "inherit",
  }).output();
}

const status = await git_output([
  "status",
  "--porcelain=v1",
  "-z",
  "--",
  "content/posts",
  "content/assets",
]);
if (!status.success) Deno.exit(status.code);

const records = decoder.decode(status.stdout).split("\0").filter(Boolean);
const changes = records
  .filter((record) => record.length > 3 && record[2] === " ")
  .map((record) => ({
    status: record.slice(0, 2),
    path: record.slice(3),
  }));
if (changes.length === 0) Deno.exit(0);

const deleted_paths = changes
  .filter((change) => change.status.includes("D"))
  .map((change) => change.path);
if (deleted_paths.length > 0) {
  console.error(
    "Refusing to publish files deleted directly. Restore every listed file. " +
      "For an intentional article deletion, restore the post first and add " +
      "`delete: true` to its front matter:\n" +
      deleted_paths.map((path) => `- ${path}`).join("\n"),
  );
  Deno.exit(1);
}

const changed_paths = changes.map((change) => change.path);
const now = Date.now();
for (const path of changed_paths) {
  const stat = await Deno.stat(`${root}/${path}`);
  if (stat.mtime && now - stat.mtime.getTime() < IDLE_MS) {
    console.log(`Waiting for ten idle minutes: ${path}`);
    Deno.exit(0);
  }
}

const marked_for_deletion = [];
for (const path of changed_paths) {
  if (!/^content\/posts\/.+\.(?:dj|md)$/.test(path)) continue;
  const source = await Deno.readTextFile(`${root}/${path}`);
  const frontmatter = source.match(
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
  );
  if (
    frontmatter?.[1].split(/\r?\n/).some(
      (line) => /^delete:\s*true\s*$/i.test(line),
    )
  ) {
    marked_for_deletion.push(path);
  }
}

console.log(`Publishing ${changed_paths.length} Typora change(s)`);
await run(Deno.execPath(), ["task", "build"]);
for (const path of marked_for_deletion) {
  await Deno.remove(`${root}/${path}`);
  console.log(`Deleting marked post: ${path}`);
}
await run("git", ["add", "--", "content/posts", "content/assets"]);

const staged = await git_output(["diff", "--cached", "--quiet"]);
if (staged.code === 0) Deno.exit(0);
if (staged.code !== 1) Deno.exit(staged.code);

const date = new Date().toISOString().slice(0, 10);
await run("git", ["commit", "-m", `publish: Typora changes ${date}`]);
await run("git", ["pull", "--rebase", "origin", "main"]);
await run("git", ["push", "origin", "main"]);
console.log("Published Typora changes");
