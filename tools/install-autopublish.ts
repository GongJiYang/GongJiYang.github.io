const label = "com.gongjiyang.blog-autopublish";
const home = Deno.env.get("HOME");
if (!home) throw new Error("HOME is not set");

const root = await Deno.realPath(new URL("..", import.meta.url));
const plist_path = `${home}/Library/LaunchAgents/${label}.plist`;
const log_path = `${home}/Library/Logs/gongjiyang-blog-autopublish.log`;
const decoder = new TextDecoder();

function xml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function run(program: string, args: string[]): Promise<void> {
  const output = await new Deno.Command(program, {
    args,
    stdout: "inherit",
    stderr: "inherit",
  }).output();
  if (!output.success) {
    throw new Error(`${program} ${args.join(" ")} exited with ${output.code}`);
  }
}

const uid_output = await new Deno.Command("id", {
  args: ["-u"],
  stdout: "piped",
}).output();
if (!uid_output.success) {
  throw new Error("Unable to determine the current user ID");
}
const domain = `gui/${decoder.decode(uid_output.stdout).trim()}`;
let deno = Deno.execPath();
for (const candidate of ["/opt/homebrew/bin/deno", "/usr/local/bin/deno"]) {
  try {
    if (await Deno.realPath(candidate) === deno) {
      deno = candidate;
      break;
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
}
const path = `${
  deno.slice(0, deno.lastIndexOf("/"))
}:/usr/local/bin:/usr/bin:/bin`;

const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${label}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${xml(deno)}</string>
    <string>run</string>
    <string>-A</string>
    <string>${xml(`${root}/tools/autopublish.ts`)}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${xml(root)}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>${xml(path)}</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>StartInterval</key>
  <integer>60</integer>
  <key>ProcessType</key>
  <string>Background</string>
  <key>StandardOutPath</key>
  <string>${xml(log_path)}</string>
  <key>StandardErrorPath</key>
  <string>${xml(log_path)}</string>
</dict>
</plist>
`;

await Deno.mkdir(`${home}/Library/LaunchAgents`, { recursive: true });
await Deno.mkdir(`${home}/Library/Logs`, { recursive: true });
await Deno.writeTextFile(plist_path, plist);
await new Deno.Command("launchctl", {
  args: ["bootout", domain, plist_path],
  stdout: "null",
  stderr: "null",
}).output();
await run("launchctl", ["bootstrap", domain, plist_path]);
await run("launchctl", ["kickstart", "-k", `${domain}/${label}`]);
console.log(`Installed and started ${label}`);
console.log(`Log: ${log_path}`);
