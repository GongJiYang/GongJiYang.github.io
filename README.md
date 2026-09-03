# GongJiYang.github.io

个人博客源码，网站地址为
[gongjiyang.github.io](https://gongjiyang.github.io)。站点生成器和设计基于
[matklad/matklad.github.io](https://github.com/matklad/matklad.github.io)，并增加了
Markdown、标签分类、Typora 写作和自动发布流程。

## 日常写作

### 新建文章

在 Typora 中按 `⌥⌘N`，或选择
`Typora → 服务 → 新建博客文章`。依次输入标题和标签；多个标签可以用中文或英文逗号分隔，
标签也可以留空。

快捷操作会调用 `tools/new-post.js`，在 `content/posts` 中创建并打开文章：

```markdown
---
tags: systems, learning
---

# Post title

第一段正文会作为首页和订阅源中的摘要。
```

文件名格式为
`YYYY-MM-DD-pinyin-slug.md`。中文标题会转换为拼音，过长的名称会截断；
如果当天已有同名文章，则自动追加 `-2`、`-3`。普通的 `⌘N`
仍可用于新建非博客文档。

源文件可以是 `.md` 或上游兼容的 `.dj` 文件。Front Matter
中的标签既可以写在一行：

```yaml
tags: Language, Learning
```

也可以写成列表：

```yaml
tags:
  - Language
  - Learning
```

### 插入图片

Typora 已设置为使用相对路径，并把粘贴的本地图片复制到 `content/assets`。文章中的
`../assets/image.png` 会在构建时转换为网站路径 `/assets/image.png`。

### 保存和上传

Typora 使用 macOS 原生自动保存。LaunchAgent `com.gongjiyang.blog-autopublish`
每分钟检查一次 `content/posts` 和 `content/assets`：

1. 只要任一文件在最近十分钟内修改过，就继续等待。
2. 连续十分钟没有修改后，运行 `deno task build`。
3. 构建成功才会提交文章和图片，随后执行 `git pull --rebase` 和 `git push`。
4. GitHub Actions 再次构建并部署 GitHub Pages。

因此文章通常在最后一次保存后的 **11～13 分钟**上线。继续编辑会重新计算十分钟。
构建失败时不会提交或推送。

## 安全删除文章

不要直接在 Typora 或 Finder 中删除已发布的文章，也不要直接删除 `content/assets`
中的图片。直接删除会被自动发布程序拒绝，其他尚未发布的文章和图片也会
暂停上传，防止误删立即同步到网站。

误删时，从 macOS 废纸篓恢复到原来的 `content/posts` 或 `content/assets`
目录即可。

确实需要删除文章时，在该文章的 Front Matter 中加入：

```yaml
---
tags: Language
delete: true
---
```

保存后等待十分钟。自动发布程序会先构建网站；构建成功后才删除该源文件、提交删除并推送。
本地构建和预览会忽略带有 `delete: true`
的文章。文章引用过的图片不会自动删除，以免影响其他文章。

## 本地使用

需要 Deno 2、Git，以及已经配置好 GitHub 写入权限的 `origin` 远端。Typora
快捷操作和 LaunchAgent 仅用于 macOS；站点构建本身可在其他系统运行。

```console
# 构建到 out/www
deno task build

# 监听源码并在浏览器中预览；需要本机可用的 live-server
deno task serve

# 立即执行一次自动发布检查
deno task autopublish
```

## LaunchAgent

发布脚本 `tools/autopublish.ts` 和安装器 `tools/install-autopublish.ts`
均保存在仓库中。 实际的
`~/Library/LaunchAgents/com.gongjiyang.blog-autopublish.plist` 包含当前用户、
Deno 和仓库的绝对路径，因此由安装器在本机生成，不直接提交机器专用副本。

安装或更新 LaunchAgent：

```console
deno task install-autopublish
```

查看运行状态和日志：

```console
launchctl print gui/$(id -u)/com.gongjiyang.blog-autopublish
tail -f ~/Library/Logs/gongjiyang-blog-autopublish.log
```

安装器会卸载旧配置、根据当前目录和 Deno 路径重新生成 plist，然后启动新配置。

## 部署

`.github/workflows/ci.yml` 在 `main`
分支有新提交时运行，也会每天定时运行一次。工作流 使用 Deno 构建 `out/www`，上传
GitHub Pages artifact，并由 `actions/deploy-pages` 发布。

主要目录：

```text
content/posts/    文章源文件
content/assets/   文章图片
content/css/      网站样式
src/              站点生成器
tools/            新文章、自动发布及安装脚本
out/www/          本地构建结果，不提交 Git
```
