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
const changed_paths = records
  .filter((record) => record.length > 3 && record[2] === " ")
  .map((record) => record.slice(3));
if (changed_paths.length === 0) Deno.exit(0);

const now = Date.now();
for (const path of changed_paths) {
  try {
    const stat = await Deno.stat(`${root}/${path}`);
    if (stat.mtime && now - stat.mtime.getTime() < IDLE_MS) {
      console.log(`Waiting for ten idle minutes: ${path}`);
      Deno.exit(0);
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
}

console.log(`Publishing ${changed_paths.length} Typora change(s)`);
await run(Deno.execPath(), ["task", "build"]);
await run("git", ["add", "--", "content/posts", "content/assets"]);

const staged = await git_output(["diff", "--cached", "--quiet"]);
if (staged.code === 0) Deno.exit(0);
if (staged.code !== 1) Deno.exit(staged.code);

const date = new Date().toISOString().slice(0, 10);
await run("git", ["commit", "-m", `publish: Typora changes ${date}`]);
await run("git", ["pull", "--rebase", "origin", "main"]);
await run("git", ["push", "origin", "main"]);
console.log("Published Typora changes");
