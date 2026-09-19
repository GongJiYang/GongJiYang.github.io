---
tags: AIGC
---

# AI Video Generation

##  白模

讨论方向:

- 找一个极简、轻量的开源方案来替代 Blender，并考虑把建模能力直接做进 pi（终端 coding agent），让整条链路更轻。
- 能不能结合CozyClay至pi,从而使不会建模的人使用?

“白模生产 AI 视频减少抽卡”本质上不是白模让模型变聪明，而是用低成本、低语义歧义的结构条件，缩小生成结果的随机搜索空间。

白模通常提供：

- 空间结构：物体在哪里、大小比例、前后关系；
 - 镜头信息：相机位置、焦距、运动轨迹、景别；
 - 动作信息：人物或物体的姿态、位移、节奏；
 - 构图信息：主体在画面中的位置和运动方向；
 - 遮挡关系：哪些物体挡住哪些物体；
 - 时序信息：每一帧的几何变化。

因此它主要减少以下几类失败：

 - 人物位置每次变化；
 - 镜头运动不一致；
 - 物体数量、比例、朝向漂移；
 - 动作节奏不稳定；
 - 多个镜头之间无法衔接；
 - 复杂提示词互相冲突。

 但它不能保证：

 - 角色身份完全不变；
 - 手指、脸、文字不变形；
 - 材质和细节每次一致；
 - 模型不产生额外物体；
 - 长视频没有累计漂移。

 所以更准确的说法是：白模减少了构图、空间和运动层面的抽卡，不会消除生成模型本身的随机性。

所以为什么白模特别有效?

生成模型通常需要同时推断四层信息

  1. 内容是什么；
  2. 物体在哪里；
  3. 物体怎么运动；
  4. 画面应该长什么样。

纯文字提示只对第 1 层约束较强，对其余几层约束很弱。白模则直接锁定了第 2、3 层，并部分锁定第 4 层的构图。  

了解了大致原理我们从一些文章和实战中继续挖掘一下:

level 1: https://cozyclay.org/greybox-to-video/以及https://cozyclay.org/ai-camera-control/:

这两篇博客分别讲解了白模/灰盒是什么、为什么有效、哪些模型真正支持白模参考、完整工作流和为什么提示词控不住运镜，以及如何用白模彻底解决.

当前的视频模型可以接受两种视觉输入，除了文本之外：第一种是帧图像（图像转视频），某些模型还支持参考片段（视频转视频或基于参考片段的生成）。这两种输入都是像素级别的通道。模型不会将它们解析为“距离 0.6 米的摄像机”；而是直接进行匹配。纯灰色的渲染效果能够呈现出画面的构图、遮挡关系以及摄像机的运动情况，无需其他元素来辅助描述。因此，最终呈现出来的效果只是保留了镜头本身，而忽略了其他细节，只呈现了表面信息。

CozyClay 是一款开源的预可视化工具，运行在 Chromium 浏览器上。它的核心功能包括：区块处理、摄像头操作、数据导出以及生成可视化结果。主页上的练习区通过七步操作，展示了在同一个街区内的摄像头捕捉到的场景。而 `npx cozyclay --scene city-block` 则可以在你的设备上打开该数据集进行查看。

https://github.com/NomaDamas/CozyClay,没想到我思考的实现刚有雏形,就已经被人做出来开源了,使用使用 Three.js 和 React Three Fiber 构建,不过讨论的范围还有结合pi agent与使用的简易性问题,不过至少是比belnder要简易很多,所以一切就在使用完CozyClay再下定论了.

还有一个有意思的点,这篇文章找到了支持白模的模型并会持续更新,目前只有Seedance 2.5、Kling、Veo.

主流托管 API（Seedance、Kling、Veo 3.1、Runway Act-Two、MiniMax）都没有文档说明支持深度或姿态控制视频。它们接收的是首帧图，部分模型还接收一段普通 RGB 灰模参考视频。所以渲染器首要输出应该是**平涂 RGB 的灰模静帧和短片**，深度图只在走开源 ControlNet 类模型时才需要。

不管怎么说这个项目非常酷,我会进一步了解,也许会单独写一篇文章.

level 2 :  Micheal Lanham 的 Seedance 系列



参考:

**CozyClay《Greybox to AI video — block it grey, then generate》**

- 链接：https://cozyclay.org/greybox-to-video/
- 内容：系统讲解什么是greybox/white-model、如何用简单方块做预演、哪些模型真正支持白模参考（Seedance 2.5最强）、完整block-then-generate循环。文字+案例极佳，强烈建议先看这篇建立正确认知。

**PixelArtistry《New GPT-6 Astra Takes Over 3D + Blender》**

- 链接：https://www.youtube.com/watch?v=I9Oc5AwAxBw
- 内容：用GPT-6 Astra + Higgsfield MCP控制Blender做完整场景建模、角色、动画，最后用Seedance 2.5出视频。测试了多个案例，含成本和时间拆解。

**Veteran AI《Master Precise AI Video Control: Mesh to Motion + LTX 2.3》**

- 链接：https://www.youtube.com/watch?v=w9EslLID3-o
- 内容：用Mesh to Motion生成动作驱动视频，再接入LTX 2.3，实现精准对齐。适合想要更高控制精度的人。

**NVIDIA官方《RTX AI Video Generation Guide》**（本地免费方案）

- 链接：https://www.nvidia.com/en-us/geforce/news/rtx-ai-video-generation-guide/
- 内容：Blender + ComfyUI + LTX 2.3本地工作流，用3D白模引导生成，最后RTX超分到4K。完全本地、零生成费用。
