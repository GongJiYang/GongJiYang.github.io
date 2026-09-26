---
tags: Talk with AI
---

# 生存指南

2025–2026 年最适合"AI 生成为主、经验不深"的人去接的单，集中在两类：一是**给中小企业搭 AI 自动化/聊天机器人/语音接待**（n8n、Make、Vapi 这类工具拼装），二是**AI 视频/营销内容生产**。

企业最愿意花钱的是看得见、马上能用的 AI 应用。

## 二、推荐方向（按"适合度"排序）

### 第一梯队：最推荐

**1. AI 业务自动化（n8n / Make / Zapier + LLM API）**

- 典型单子：线索抓取后自动写外联邮件、表单进 CRM、发票和文档自动处理、内容发布流水线、客服工单分流。
- 为什么适合你：节点式拼装，AI 写 JS/Python 小段代码、写提示词就够用，不需要架构能力。
- 单价：Upwork 上 n8n 专家 2026 年收费约 $40–100/小时，价差主要看有没有 AI Agent 和 API 集成经验。
- 值得学的商业模式：成熟的 n8n 服务商通常收一次搭建费，再加月度维护费（托管、监控、第三方 API 变动时修复）。维护费是稳定收入的关键。

**2. AI 客服/知识库聊天机器人（WhatsApp、网站、Slack）**

- 典型单子：给诊所、律所、电商、房产中介做 FAQ 机器人、预约机器人、基于文档的问答。
- 分层很明显：Upwork 上初级"平台配置"类约 $25–60/小时，中级 RAG 和集成类 $50–90，资深 LLM 工程师 $90–150+；市场中位数约 $45/小时，因为大部分单子只是简单的机器人搭建。你的目标是前两层，别碰"修 RAG 质量、做评测"这类单。

**3. AI 语音接待 / 电话 Agent（Vapi、Retell 等）**

- 典型单子：给中小企业做 AI 前台，接入日历、短信通知和邮件。
- 竞争比聊天机器人少，而且客户（牙医、装修、餐厅）按"少漏接一个电话值多少钱"来算账，更容易接受按项目报价。

**4. AI 视频 / UGC 广告 / 无脸 YouTube 内容**

- 增速最高的方向，而且几乎全靠 AI 工具链（脚本→配音→数字人或生成视频→剪辑）。
- 缺点是单价偏低、竞争者大多是非程序员。你的优势在于能写脚本做**批量化生产流水线**，可以卖"每月 30 条广告素材"这种包月服务，而不是按条卖。

### 第二梯队：可以做，但更卷

**5. MVP / 内部工具 / 落地页（用 Claude Code、Cursor 等 vibe coding）**

- 需求真实（Claude Code 专家需求那 938% 主要就是这类），但要控制范围：只接**小型、边界清楚**的单，比如管理后台、落地页、Chrome 插件、简单 SaaS 原型、Shopify/WordPress 定制。
- 普通 Web 开发价格被压得很低：Upwork 上 Web 开发者中位数约 $30/小时（常见区间 $15–50）。

**6. 数据抓取 + 表格/报表自动化**

- 爬取公开数据、清洗、生成 Google Sheets 报表。AI 写爬虫很擅长，单子量稳定，但单价一般。

### 建议避开

- **"Vibe coding 清理"单**：看起来是 AI 时代的新机会，报价也高（每小时 $100–300），但需要真正的软件工程深度，不是初级岗位。用 AI 去修 AI 写的烂代码，很容易越修越糟，而且承担生产事故责任。
- **Toptal**：筛选包括英语沟通、限时算法测试、现场技术面试和测试项目，录取率不到 3%。按你的情况基本不现实，先别考虑。
- **高端 AI Agent 开发**：多 Agent 编排这类工作在 2026 年是 $180–300/小时的细分市场，但这正是你想避开的架构型工作。
- **AI 数据标注**：增长很快，但这类平台的核心价值就是人工判断，用 AI 代答通常违反条款，会被封号。

## 三、收入预期参考

| 方向                 | 新手可接受的定价              | 做出口碑后          | 竞争程度           |
| -------------------- | ----------------------------- | ------------------- | ------------------ |
| n8n/Make 自动化      | $25–40/小时或 $300–1,500/项目 | $50–100/小时 + 月费 | 中（在升温）       |
| 聊天机器人（配置类） | $25–45/小时                   | $50–90/小时         | 高                 |
| AI 语音接待          | $500–2,000/项目               | + 月度维护          | 中低               |
| AI 视频/UGC          | $20–50/条或包月               | 包月 $1,000+        | 高（非技术人员多） |
| 小型 Web/MVP         | $15–35/小时                   | $40–60/小时         | 非常高             |

新手期的整体区间可以参考：应用型 AI 技能的新人通常从 $25–60/小时起步，技术和咨询型从 $50–100 起步。

还有一个现实问题：地区定价差异。同样能做 RAG、Agent、n8n 的开发者，外包地区的价格可以低到 $15–25/小时，所以大量同行在跟你拼价格，靠低价是赢不了的。

## 四、哪些最适合用 AI 快速交付

适合 AI 快速交付的单子有这些共同特征：

- **边界清楚**：输入和输出明确（"表单提交后发邮件并写入 Airtable"）。
- **有现成工具兜底**：n8n、Vapi、Voiceflow、Shopify 这类平台本身就处理了稳定性和托管。
- **验收靠演示**：客户看视频或亲手试用就能确认效果，不需要代码评审。
- **可以模板化**：做完一个"牙科诊所 AI 前台"，下一个诊所改 20% 就能交付。模板化是你用 AI 提效后真正赚到钱的地方。

需要谨慎的单子：客户有现成的大代码库、要求"高并发/性能优化"、涉及支付或医疗数据合规、或者需求描述很模糊。

## 五、风险与平台建议

**Upwork**

- 抽成：2025 年 5 月 1 日起，原来固定 10% 的服务费改成按合同浮动 0–15%，大多数合同实际在 10% 左右。
- 投标成本：额外的 Connects 每个 $0.15，多数投标需要 6–16 个。按 10% 中标率算，新手获客成本不低，所以要精准投标，别海投。
- 封号风险：账号被限制会让之前投入的 Connects 和平台积累全部归零。一定要用真实身份，账号不要多人共用，交付物要确实可用。
- 正面信号：活跃客户数同比降 4%，但单客户支出创新高 $5,230，平均时薪合同达 100 小时。客户在变少但变大，更适合走专业细分路线，而不是低价通吃。

**Fiverr**：更适合把服务做成标准化"套餐"（例如"n8n 线索自动化，3 天交付"）。标题直接用买家在搜的词：n8n automation、AI voice agent、Claude Code、AI UGC ads。

**跨平台共性风险**

1. **交付后维护**：AI 工作流会因为第三方 API 变化而坏掉。合同里写清楚维护范围和费用，这本身就是利润来源。
2. **能力被戳穿**：客户在面试中问技术细节、或交付后要求改动时，完全不懂代码会很被动。建议至少读懂 AI 生成的代码、能自己调试常见错误。
3. **API 成本和 Key 管理**：让客户用自己的 OpenAI/Anthropic 账号和 Key，避免你垫付调用费或承担数据泄露责任。
4. **AI 生成内容的版权和肖像**：AI 视频、UGC 广告不要用真人名人、品牌 logo 或来历不明的素材。
5. **收款**：国内收款一般走 Payoneer 或直接提现到银行卡，要留意提现费和汇损，并按规定申报收入（这部分请以当地规定为准，我不是税务顾问）。

## 六、建议的起步路径

1. **选一个组合深挖**：比如"n8n + AI 语音接待，专做美国本地服务业（诊所、装修、律所）"。细分越窄，越好写提案、越容易复用模板。
2. **先做 3 个作品集 Demo**：录 2 分钟演示视频，说明"帮客户省了多少时间或多接了多少单"。客户买的是结果，不是技术。
3. **低价拿前 5 个好评**，然后逐步涨价，并推出月度维护套餐。
4. **边做边补基础**：HTTP/API、JSON、Webhook、基础 JavaScript/Python、调试。这些学起来不难，但决定你能不能从 $30/小时走到 $70/小时。

如果你愿意，我可以帮你把某个具体方向（比如"n8n 自动化接单"）展开成一份作品集清单和提案模板。

Sources:

- [Upwork In-Demand Skills 2026 新闻稿](https://investors.upwork.com/news-releases/news-release-details/upworks-demand-skills-2026-demand-top-ai-skills-more-doubles-ai)
- [Upwork: High-Demand Careers in 2026](https://www.upwork.com/resources/in-demand-jobs-and-skills)
- [Fiverr: Claude Code 专家需求增长 938%（2026 Business Trends Index）](https://www.fiverr.com/news/business-trends-index-ai-2026)
- [Upwork: n8n Experts 雇佣页](https://www.upwork.com/hire/n8n-experts/)
- [Ciphernutz: n8n Expert Cost 2026](https://ciphernutz.com/blog/hire-n8n-expert-cost-pricing-guide)
- [Metageeks: Chatbot Developer Cost 2026](https://www.metageeks.tech/insights/chatbot-developer-cost)
- [Index.dev: Freelance Developer Rates 2026](https://www.index.dev/blog/freelance-developer-rates)
- [GigRadar: Upwork Hourly Rate 2026](https://gigradar.io/blog/upwork-hourly-rate)
- [GigRadar: Upwork Fees 2026](https://gigradar.io/blog/upwork-fees)
- [Upwork: Is Upwork Free To Join](https://www.upwork.com/resources/is-upwork-free)
- [Vortenza: Upwork Fees 2026](https://www.vortenza.com/guides/upwork-fees-2026)
- [Metana: What is vibe coding cleanup](https://metana.io/blog/what-is-vibe-coding-cleanup/)
- [BeingGuru: Vibe Coding Cleanup Specialist](https://beingguru.com/vibe-coding-cleanup-specialist-the-freelance-niche-ai-created/)
- [Gaper: Toptal Review 2026](https://gaper.io/toptal-review)
- [Adsnipper: Cost to Hire an AI Developer 2026](https://adsnipper.com/blog/cost-to-hire-ai-developer/)
- [YoungUrbanProject: In-Demand AI Skills 2026](https://www.youngurbanproject.com/in-demand-ai-skills/)
