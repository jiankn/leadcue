# PRD: LeadCue - Personal AI Website Prospecting Tool

版本：v1.0
日期：2026-05-05
项目名称：LeadCue
产品形态：多语言 SEO 网站 + Web App + Chrome Extension
部署架构：Cloudflare-first
商业模式：个人订阅 + credits
目标市场：海外个人专业用户，SEO 为主要获客渠道

---

## 1. 产品结论

LeadCue 重新定位为：

> **An AI website prospecting tool for solo professionals.**

中文定义：

> **LeadCue 是给个人专业用户使用的 AI 网站潜客研究工具。它帮助用户从一个公司网站判断这个潜在客户是否值得跟进、为什么值得跟进，以及应该如何自然开口。**

本版本从零开始定义产品，不做团队协作产品，不做 CRM，不做联系人数据库，不做自动群发邮件平台。

LeadCue 的核心价值不是“帮用户找到更多名单”，而是：

> **把一个网站转化成一个可判断、可跟进、可复制、可导出的 Prospect Card。**

产品第一性原理：

1. 用户看到一个网站时，最想快速知道：这个客户值不值得联系。
2. 如果值得联系，用户需要知道：为什么值得联系。
3. 最后用户需要一个可执行动作：复制第一句话、保存、导出、继续跟进。
4. SEO 获客阶段必须避开大词红海，主攻网站研究、个人获客、web design leads、consultant prospecting、cold email personalization from website 等窄切口。
5. 产品必须控制复杂度，个人用户付费能力有限，不能提前堆团队、权限、CRM、复杂集成。

---

## 2. 新产品定位

### 2.1 一句话定位

英文：

> **LeadCue helps solo professionals turn company websites into qualified prospects with AI research, fit scoring, opportunity signals, and ready-to-send outreach.**

中文：

> **LeadCue 帮助个人专业用户把公司网站变成值得跟进的潜在客户：自动研究网站、判断匹配度、发现机会信号，并生成可直接使用的外联内容。**

### 2.2 产品类别

LeadCue 不进入泛 AI lead generation 大赛，而是定义为：

> **AI Website Prospecting Tool**

辅助表达：

- Website prospecting tool
- AI prospect research tool
- Website research for cold email
- Prospecting tool for freelancers
- Prospecting tool for consultants
- Web design lead research tool

### 2.3 我们是什么

LeadCue 是一个个人版 AI prospecting assistant，帮助用户完成以下工作：

1. 输入或打开一个公司网站。
2. AI 分析网站内容、页面结构、信号和公开联系路径。
3. 根据用户的 Prospecting Profile 判断匹配度。
4. 生成 Prospect Card。
5. 输出：推荐动作、fit score、opportunity signals、风险、first line、short email、source-backed notes。
6. 用户保存、复制、导出，用于自己的外联流程。

### 2.4 我们不是什么

第一版明确不做：

- 不做团队协作工具。
- 不做成员管理。
- 不做 seat-based pricing。
- 不做团队权限。
- 不做 team workspace。
- 不做复杂 CRM。
- 不做自动群发邮件。
- 不做联系人数据库。
- 不做 verified email 承诺。
- 不做 LinkedIn scraper。
- 不做大规模网页爬虫。
- 不做 Apollo、Clay、Hunter、Instantly、Smartlead 的正面替代品。

内部可以保留 account / tenant 数据隔离概念，但产品界面和文案不使用团队协作叙事。

---

## 3. 目标用户

### 3.1 P0 用户：个人专业用户

LeadCue 第一阶段只服务个人专业用户，不服务团队。

#### 用户 A：Web Design Freelancer / Solo Website Consultant

画像：

- 一个人接网站设计、改版、落地页优化项目。
- 主要客户来自 cold email、LinkedIn、Google、目录站、本地商家搜索。
- 客单价约 $1,000-$10,000。
- 不想买复杂销售软件。
- 需要快速判断哪些网站可能有改版机会。

核心痛点：

- 手动看网站很耗时。
- 很难快速判断这个网站是否值得联系。
- 不知道怎么写第一句话才不像群发。
- 想找到网站上的具体问题作为开口理由。

LeadCue 提供的价值：

- 找到网站改版、CTA、移动端、信任元素、内容结构等机会信号。
- 生成自然的 first line。
- 生成一封低压、具体、不冒犯的短邮件。
- 帮用户保存值得跟进的网站。

#### 用户 B：Independent SEO / Marketing Consultant

画像：

- 一个人提供 SEO、内容、转化优化、B2B marketing 服务。
- 需要持续找潜在客户。
- 熟悉网站问题，但人工检查每个网站成本高。
- 愿意为节省研究时间和提升外联质量付费。

核心痛点：

- 需要判断网站是否有 SEO / content / conversion 机会。
- 手动打开 homepage、blog、service pages、contact page 很慢。
- 写个性化外联时缺少具体证据。
- 不想维护复杂 CRM，只想保存和导出优质潜客。

LeadCue 提供的价值：

- 自动总结网站定位和机会信号。
- 识别薄内容、弱 CTA、缺少服务页、长期未更新等线索。
- 输出 source-backed notes，帮助用户更可信地开口。

#### 用户 C：Solo Founder / Individual Sales Operator

画像：

- 创始人或个人销售自己做 outbound。
- 没有 SDR 团队。
- 已经有一批网站名单或从 Google/目录站发现目标网站。
- 需要快速筛选和生成外联素材。

核心痛点：

- 没时间逐个研究网站。
- 不想把所有名单都放进 CRM。
- 只想知道哪些值得优先跟进。
- 需要更自然的 cold email opener。

LeadCue 提供的价值：

- 快速做网站级研究。
- 按 fit score 和 opportunity signals 排序。
- 保存优先跟进对象。
- 导出到现有销售工具。

### 3.2 不优先服务的用户

第一版不优先服务：

- 企业 SDR 团队。
- 多人销售团队。
- 需要权限和审批的组织。
- 招聘团队。
- 需要大量联系人数据库的用户。
- 需要自动 sequence 的冷邮件团队。
- 需要 CRM 深度管理的 RevOps 用户。

---

## 4. 用户 Job To Be Done

核心 JTBD：

> 当我发现一个公司网站时，我想快速知道它是否值得联系、为什么值得联系，以及我该怎么自然开口，这样我不用花 10 分钟手动研究每个网站，也不会发出模板化的冷邮件。

拆解为 4 个用户问题：

1. **Should I follow up?**
   这个网站背后的公司值不值得联系？

2. **Why this prospect?**
   网站上有什么具体证据说明它可能有需求？

3. **What should I say?**
   第一封邮件应该如何自然开口？

4. **What should I do next?**
   保存、复制、导出、标记状态，进入自己的外联流程。

---

## 5. SEO 定位与关键词策略

### 5.1 SEO 总原则

LeadCue 主要靠 SEO 获客，因此产品定位和网站结构必须从关键词开始设计。

SEO 策略不是去抢最大搜索量，而是抢高意图、可排名、可转化的细分词。

不主攻：

- AI lead generation
- sales prospecting tool
- lead generation software
- B2B lead generation tool
- cold email software
- AI cold email generator

原因：

- 竞争极高。
- 搜索结果被 Apollo、ZoomInfo、Clay、HubSpot、Instantly、Smartlead、Copy.ai 等强品牌占据。
- 用户期待联系人数据库、邮件发送、CRM、团队功能，与 LeadCue 当前差异化不匹配。

主攻：

- AI website prospecting tool
- website prospecting tool
- AI prospect research tool
- prospecting tool for freelancers
- prospecting tool for consultants
- find web design leads
- find businesses that need website redesign
- cold email personalization from website
- cold email first line from website

### 5.2 首页主关键词

首页主关键词：

> **AI website prospecting tool**

首页副关键词：

- website prospecting tool
- AI prospect research tool
- website research for cold email
- prospecting tool for solo professionals

首页 title 建议：

```text
AI Website Prospecting Tool for Solo Professionals | LeadCue
```

首页 H1：

```text
Turn websites into qualified prospects with AI
```

首页 meta description：

```text
LeadCue helps solo professionals research company websites, score prospect fit, find opportunity signals, and write natural cold email openers before outreach.
```

### 5.3 关键词分层

#### P0 主打关键词

| 关键词 | 意图 | 页面 | 竞争判断 |
|---|---|---|---|
| AI website prospecting tool | 找 AI 网站潜客工具 | Home | 中低 |
| website prospecting tool | 找网站获客工具 | Home / Feature | 中低 |
| AI prospect research tool | 找 AI 潜客研究工具 | Feature | 中高 |
| website prospect research tool | 找网站研究工具 | Feature | 中低 |
| prospecting tool for freelancers | freelancer 找客户工具 | Use case | 中低 |
| prospecting tool for consultants | consultant 找客户工具 | Use case | 中 |

#### P1 中等竞争关键词

| 关键词 | 意图 | 页面 |
|---|---|---|
| cold email personalization from website | 从网站生成个性化邮件 | Feature / Tool |
| cold email first line generator | 生成第一句话 | Free Tool |
| web design lead generation tool | web designer 找客户 | Use case |
| find web design leads | 找网站设计客户 | Resource / Use case |
| find businesses that need website redesign | 找需要改版的网站 | Resource |
| website audit outreach email template | 模板搜索 | Template |
| AI website research for cold email | 销售研究 + 邮件 | Feature |

#### P2 长尾关键词

| 关键词 | 页面类型 |
|---|---|
| AI prospecting tool for freelancers | Use case |
| client prospecting tool for freelancers | Use case |
| lead generation tool for independent consultants | Use case |
| how to find consulting clients with website research | Blog |
| how to find clients as a freelancer with cold email | Blog |
| how to find businesses with outdated websites | Blog |
| website redesign cold email template | Template |
| cold email template for website redesign services | Template |
| cold email first line from website | Free Tool |
| personalized cold email based on company website | Feature |
| how to personalize cold emails using a website | Blog |
| website signals for sales prospecting | Blog |
| how to qualify leads from a website | Blog |

### 5.4 SEO 页面架构

第一批英文页面：

```text
/
/pricing
/features/ai-prospect-research
/features/website-research-for-cold-email
/features/opportunity-signals
/features/fit-score
/use-cases/freelancers
/use-cases/consultants
/use-cases/web-design-leads
/tools/cold-email-first-line-generator
/tools/website-opportunity-finder
/resources/find-web-design-leads
/resources/find-businesses-that-need-website-redesign
/templates/website-audit-outreach-email
/templates/website-redesign-cold-email
/blog/how-to-qualify-leads-from-a-website
/blog/how-to-personalize-cold-email-using-a-website
```

页面优先级：

1. Home
2. Pricing
3. AI Prospect Research feature page
4. Freelancer use case
5. Consultant use case
6. Web Design Leads use case
7. Cold Email First Line Generator free tool
8. Website Research for Cold Email feature page
9. Find Businesses That Need Website Redesign resource page
10. Website Audit Outreach Email Template page

### 5.5 SEO 内容原则

所有 SEO 页面必须满足：

- 不是薄内容翻译页。
- 每页只打一个主搜索意图。
- 首屏明确说明 LeadCue 能解决什么问题。
- 页面中必须展示 Prospect Card 示例。
- 每页必须有清晰 CTA：Analyze a website / Start free / Generate a prospect card。
- 所有功能页要和产品真实能力一致，不能承诺 verified emails、自动发送、无限扫描。
- 模板页和工具页要引导用户生成完整 Prospect Card，而不是只停留在免费文本生成。

---

## 6. 多语言网站策略

### 6.1 多语言目标

LeadCue 要做多语言网站，但不把多语言当作简单机器翻译。

目标：

- 用英语建立主站 SEO 权重。
- 用欧洲语言覆盖 freelancer、consultant、web designer 的商业搜索需求。
- 用亚洲语言提供产品理解和品牌覆盖，但前期不把全部 SEO 资源平均摊开。

### 6.2 支持语言

第一版支持：

| Locale | 语言 | URL 前缀 | 优先级 |
|---|---|---|---|
| en | English | `/` | P0 |
| de | Deutsch | `/de/` | P1 |
| fr | Français | `/fr/` | P1 |
| nl | Nederlands | `/nl/` | P1 |
| ja | 日本語 | `/ja/` | P2 |
| ko | 한국어 | `/ko/` | P2 |
| zh | 简体中文 | `/zh/` | P2 |

### 6.3 多语言 SEO 优先级

#### P0：英文完整站

英文必须覆盖所有核心页面：

- Home
- Pricing
- Features
- Use Cases
- Tools
- Resources
- Templates
- Blog
- Legal

#### P1：德语、法语、荷兰语

优先本地化以下页面：

- Home
- Pricing
- Freelancer use case
- Consultant use case
- Web Design Leads use case
- Cold Email First Line Generator
- Website Research for Cold Email

理由：

- 欧洲存在大量个人顾问、自由职业者、小型 web/marketing 服务商。
- 德语、法语、荷兰语竞争相对英文低。
- 用户付费能力较好。

#### P2：日语、韩语、中文

优先本地化以下页面：

- Home
- Pricing
- AI Prospect Research feature
- Cold Email First Line Generator
- Help / onboarding content

不建议前期为这些语言大量生产长尾 SEO 内容，除非看到 Search Console 数据有明显机会。

### 6.4 URL 与 hreflang 规则

多语言 URL：

```text
/                         English home
/de/                      German home
/fr/                      French home
/nl/                      Dutch home
/ja/                      Japanese home
/ko/                      Korean home
/zh/                      Simplified Chinese home
/de/use-cases/freelancers
/fr/use-cases/freelancers
```

SEO 要求：

- 每个 locale 页面有自引用 canonical。
- 每组翻译页面使用 hreflang。
- 设置 `x-default` 指向英文首页或无 locale 首页。
- sitemap 必须包含 locale URLs。
- 未完成本地化的页面不要生成空壳翻译页。
- 不同语言页面可以本地化示例、行业和 CTA，而不是逐字翻译。

---

## 7. 核心产品范围

### 7.1 P0 功能

P0 必须形成完整闭环：

```text
SEO landing page / free tool
  -> signup
  -> set Prospecting Profile
  -> analyze website
  -> Prospect Card
  -> save / copy / export
  -> credits usage
  -> upgrade
```

P0 功能清单：

1. 多语言官网基础页。
2. Pricing 页面。
3. 免费工具页：Cold Email First Line Generator。
4. 用户注册 / 登录。
5. Personal Dashboard。
6. Prospecting Profile。
7. Website Scan。
8. Prospect Card。
9. Saved Prospects。
10. Personal Follow-up Status。
11. Copy First Line / Copy Short Email。
12. CSV Export。
13. Credits usage。
14. Billing / subscription。
15. Basic analytics events。

### 7.2 P1 功能

1. Chrome Extension Side Panel。
2. Batch URL import。
3. Website Opportunity Finder 免费工具。
4. Export presets for Instantly / Smartlead / CSV。
5. Regenerate first line。
6. Deep scan：about / contact / pricing / blog / careers。
7. Multi-language app UI 完整覆盖。
8. Search Console 驱动的 SEO 页面扩展。

### 7.3 P2 功能

1. Lightweight webhook。
2. Zapier / Make integration。
3. Browser extension history sync。
4. AI prompt customization。
5. Advanced scoring rules。
6. PDF prospect brief。
7. CRM one-way export。

### 7.4 明确不做

1. 不做团队成员邀请。
2. 不做 team roles。
3. 不做 owner assignment。
4. 不做团队活动流。
5. 不做复杂 deal pipeline。
6. 不做 email sequence builder。
7. 不做自动发信。
8. 不做联系人数据库。
9. 不做 verified contact enrichment。
10. 不做 LinkedIn scraping。

---

## 8. 核心用户流程

### 8.1 SEO 新用户流程

1. 用户通过 Google 搜索进入某个 SEO 页面，例如 `AI website prospecting tool` 或 `cold email first line from website`。
2. 页面展示 LeadCue 如何从一个网站生成 Prospect Card。
3. 用户输入一个网站 URL，使用免费分析或进入 signup。
4. 系统要求登录或在有限额度内预览结果。
5. 用户生成第一张 Prospect Card。
6. 用户复制 first line 或 short email。
7. 用户保存 prospect。
8. 系统展示剩余 credits 和升级 CTA。

### 8.2 Web App 核心流程

```text
Login
  -> Dashboard
  -> Analyze website
  -> Prospect Card
  -> Save
  -> Copy outreach
  -> Export CSV
```

### 8.3 Chrome Extension 流程

```text
Open a company website
  -> Click LeadCue extension
  -> Analyze this website
  -> See compact Prospect Card
  -> Copy first line / save
  -> Open full card in Web App
```

Chrome Extension 是 P1，但产品叙事中可以作为重要入口。

### 8.4 Batch Import 流程

Batch Import 是 P1，不进入首发必须闭环。

```text
Paste domains / upload CSV
  -> normalize domains
  -> remove duplicates
  -> estimate credits
  -> scan queue
  -> review cards
  -> save / export selected
```

---

## 9. Prospecting Profile

Prospecting Profile 用于替代旧的团队/agency profile。它是个人用户的获客偏好。

字段：

| 字段 | 说明 |
|---|---|
| Offer Type | 用户提供的服务类型，例如 web design、SEO、consulting、B2B SaaS |
| Offer Description | 用户如何帮助客户 |
| Ideal Customer | 用户想服务的客户类型 |
| Target Industries | 目标行业 |
| Target Countries | 目标国家/地区 |
| Company Size | 目标公司规模 |
| Opportunity Focus | 关注 redesign、SEO、conversion、content、growth、sales ops 等 |
| Outreach Tone | direct、casual、professional、friendly |
| Avoided Industries | 不想接触的行业 |
| Language Preference | 生成输出使用的语言 |

影响：

- fit score
- opportunity signals 权重
- outreach angle
- first line
- short email
- risk / confidence

---

## 10. Prospect Card 需求

Prospect Card 是产品核心资产。

### 10.1 首屏必须回答的问题

1. 是否值得跟进？
2. 为什么值得或不值得？
3. 下一步应该做什么？

### 10.2 字段结构

| 字段 | 说明 |
|---|---|
| Company Name | 公司名称 |
| Domain | 网站域名 |
| Fit Score | 0-100 |
| Recommendation | Prioritize / Review / Skip |
| Decision Copy | 一句话解释推荐动作 |
| Confidence | 证据置信度 |
| Evidence Summary | 信号、来源、联系路径数量 |
| Main Risk | 主要复核缺口 |
| Industry | 行业，低置信度显示 needs review |
| Company Summary | 公司做什么 |
| Opportunity Signals | 网站上的机会信号 |
| Outreach Angles | 外联切入点 |
| First Lines | 2-3 条第一句话 |
| Short Email | 一封短邮件 |
| Contact Paths | email、contact page、social links，不承诺 verified |
| Source Notes | 判断来自哪些页面 |
| Personal Status | New / Worth following / Maybe / Contacted / Archived |
| Personal Notes | 用户自己的备注 |

### 10.3 UX 原则

- 首屏减法，只显示决策所需信息。
- 不把所有指标同时铺开。
- 指标解释默认折叠。
- 不显示 team owner、teammate、assignment。
- 导出和详细 source 放到次级区域。
- 移动端优先保持清楚，不堆小方块。

### 10.4 AI 输出规则

AI 输出必须：

- 简短。
- 具体。
- 基于网站证据。
- 不编造事实。
- 不编造联系方式。
- 不夸大结果。
- 不写垃圾邮件腔。
- 不提及内部扫描、AI、LeadCue、audit、crawler、extracted text。
- 不让收件人感觉被监控。
- 邮件语气低压、自然、像真人观察。

禁止 first line / short email 出现：

- “I scanned your website”
- “Our AI found”
- “LeadCue noticed”
- “audit”
- “crawler”
- “extracted text”
- “10x growth”
- “I hope this email finds you well”
- 空泛夸奖

---

## 11. 免费工具策略

免费工具用于 SEO 获客和注册转化，不是完整产品替代品。

### 11.1 P0 免费工具：Cold Email First Line Generator

目标关键词：

- cold email first line generator
- cold email first line from website
- AI cold email first line generator from website

输入：

- website URL
- user offer type，可选
- target tone，可选

输出：

- 1-3 条 first lines
- 一个简短网站观察
- CTA：生成完整 Prospect Card

限制：

- 未登录用户每日限制次数。
- 使用 Turnstile 防刷。
- 不展示完整 Prospect Card。
- 不承诺联系信息。

### 11.2 P1 免费工具：Website Opportunity Finder

目标关键词：

- website opportunity finder
- find website improvement opportunities
- AI tool to find website redesign opportunities

输出：

- 3 个机会信号
- fit preview
- CTA：Start free to save and export

### 11.3 P1 免费工具：Website Prospect Score Checker

目标关键词：

- website prospect score checker
- website prospect research tool
- qualify leads from website

输出：

- 简化 fit score
- 证据摘要
- CTA：生成完整 Prospect Card

---

## 12. 定价与商业模式

### 12.1 定价原则

LeadCue 面向个人专业用户，不能用团队 seat pricing。

定价原则：

- 免费层降低首次使用门槛。
- Pro 适合大多数个人专业用户。
- Power 适合高频 outbound 用户。
- credits 控制 AI 成本。
- 不提供 unlimited AI scans。
- 不按 seat 计费。
- 不做 team plan。

### 12.2 推荐套餐

| Plan | 月付价格 | 年付价格 | Credits | 适合用户 |
|---|---:|---:|---:|---|
| Free | $0 | $0 | 20 / month | 试用、偶尔研究 |
| Pro | $29 / month | $290 / year | 500 / month | freelancer、consultant、solo founder |
| Power | $79 / month | $790 / year | 2,000 / month | 高频 outbound 个人用户 |

### 12.3 套餐功能

#### Free

- 20 website scan credits / month
- Basic Prospect Card
- Limited saved prospects
- Copy first line
- Limited free tools usage
- No batch import

#### Pro

- 500 credits / month
- Full Prospect Card
- Saved prospects
- Copy first lines and short emails
- CSV export
- Prospecting Profile
- Chrome Extension access
- Basic export presets

#### Power

- 2,000 credits / month
- Everything in Pro
- Batch URL import
- Deep scan
- Advanced export presets
- Priority queue
- Higher free tool limits

### 12.4 Credit 消耗规则

| 动作 | Credits |
|---|---:|
| Basic website scan | 1 |
| Deep scan with multiple pages | 3 |
| Regenerate first lines | 1 |
| Regenerate short email | 1 |
| Batch scan | 按网站计费 |
| CSV export | 0 |
| Save prospect | 0 |

### 12.5 Credit Pack

可选补充包：

| Pack | Price | Credits |
|---|---:|---:|
| Small Pack | $9 | 100 |
| Growth Pack | $29 | 500 |
| Power Pack | $99 | 2,000 |

原则：

- Credit pack 不替代订阅。
- Free 用户可购买小包，但关键功能仍由订阅解锁。
- Credits 必须有滥用限制和公平使用条款。

---

## 13. Cloudflare-first 技术架构

### 13.1 架构目标

LeadCue 使用 Cloudflare-first 架构，目标：

- 低运维。
- 低成本。
- 全球边缘部署。
- 适合 SEO 静态页面。
- 适合 Chrome Extension API。
- 适合 D1 存储结构化 Prospect Card。
- 通过 Queues 支持异步扫描。
- 通过 AI Gateway 观察和控制 AI 成本。

### 13.2 推荐技术栈

| 模块 | 技术 |
|---|---|
| Public Website | React/Vite static pages 或 Astro-style prerendered pages on Cloudflare |
| Web App | React/Vite |
| API | Cloudflare Workers + Hono |
| Database | Cloudflare D1 |
| Object Storage | Cloudflare R2 |
| Cache / Config | Cloudflare KV |
| Async Jobs | Cloudflare Queues |
| AI Observability | Cloudflare AI Gateway |
| Bot Protection | Cloudflare Turnstile |
| Browser Extension | Chrome Extension MV3 Side Panel |
| Payments | Stripe 或 Lemon Squeezy |
| Auth | Email login + Google OAuth，session stored in D1 |

### 13.3 高层系统结构

```text
Public SEO Website
  -> localized static pages
  -> free tools
  -> signup CTA

Web App
  -> personal dashboard
  -> analyze website
  -> saved prospects
  -> billing

Chrome Extension
  -> read active tab only after user action
  -> send extracted page context to API
  -> show compact Prospect Card

Cloudflare Workers API
  -> auth/session
  -> scan orchestration
  -> credit check
  -> AI calls through AI Gateway
  -> save structured results to D1
  -> queue deep scan jobs

D1
  -> users
  -> personal_accounts
  -> prospecting_profiles
  -> prospects
  -> scans
  -> credit_transactions
  -> subscriptions
  -> exports

R2
  -> CSV export files
  -> optional scan snapshots
  -> optional AI debug archive with retention policy

Queues
  -> deep scan
  -> batch scan
  -> export generation
  -> AI retry
```

### 13.4 核心数据流：Website Scan

```text
User submits website URL
  -> Worker validates session
  -> Worker checks credits
  -> Worker normalizes URL/domain
  -> Worker fetches or receives page context
  -> Worker extracts title/meta/H1/links/contact paths
  -> Worker calls AI through AI Gateway
  -> Worker creates scan record
  -> Worker creates/updates prospect record
  -> Worker writes credit transaction
  -> API returns Prospect Card
```

### 13.5 核心数据流：Deep Scan

```text
User requests deep scan
  -> Worker checks plan and credits
  -> Worker creates scan job
  -> Queue fetches selected pages: about/contact/pricing/blog/careers
  -> Worker extracts structured evidence
  -> AI generates enriched Prospect Card
  -> D1 updates prospect
  -> optional R2 stores snapshot
```

### 13.6 核心数据流：Free Tool

```text
Anonymous user enters website URL
  -> Turnstile validation
  -> IP/session rate limit
  -> lightweight extraction
  -> limited AI call
  -> return partial output
  -> CTA to signup for full Prospect Card
```

---

## 14. 数据模型

产品对外是个人应用，内部数据也应避免团队化命名。

### 14.1 users

- id
- email
- name
- avatar_url
- auth_provider
- locale
- created_at
- last_login_at

### 14.2 personal_accounts

每个用户默认一个 personal account，用于订阅、credits、数据隔离。

- id
- user_id
- display_name
- plan
- monthly_credit_limit
- credits_reset_at
- created_at
- updated_at

### 14.3 prospecting_profiles

- id
- account_id
- offer_type
- offer_description
- ideal_customer
- target_industries_json
- target_countries_json
- company_size
- opportunity_focus_json
- outreach_tone
- avoided_industries_json
- output_language
- created_at
- updated_at

### 14.4 prospects

- id
- account_id
- company_name
- domain
- website_url
- industry
- summary
- fit_score
- recommendation
- fit_reason
- confidence_score
- main_risk
- evidence_summary
- opportunity_signals_json
- outreach_angles_json
- first_lines_json
- short_email
- contact_paths_json
- source_notes_json
- personal_status
- personal_notes
- saved_at
- exported_at
- created_at
- updated_at

### 14.5 scans

- id
- account_id
- prospect_id
- url
- domain
- scan_type
- status
- credits_used
- ai_model
- error_message
- raw_text_hash
- r2_snapshot_key
- created_at
- completed_at

### 14.6 credit_transactions

- id
- account_id
- type
- amount
- reason
- scan_id
- created_at

### 14.7 subscriptions

- id
- account_id
- provider
- provider_customer_id
- provider_subscription_id
- plan
- status
- current_period_start
- current_period_end
- created_at
- updated_at

### 14.8 exports

- id
- account_id
- status
- format
- lead_count
- r2_key
- created_at
- completed_at

### 14.9 usage_events

- id
- account_id
- user_id
- event_name
- metadata_json
- locale
- source_page
- created_at

### 14.10 localized_pages

可选，用于 SEO 内容管理。

- id
- slug
- locale
- page_type
- title
- description
- canonical_path
- published
- updated_at

---

## 15. API 需求

### 15.1 Public Routes

| Method | Route | 用途 |
|---|---|---|
| GET | `/` | 英文首页 |
| GET | `/:locale/` | 多语言首页 |
| GET | `/pricing` | 定价页 |
| GET | `/:locale/pricing` | 多语言定价页 |
| GET | `/features/:slug` | 功能页 |
| GET | `/use-cases/:slug` | Use case 页 |
| GET | `/tools/:slug` | 免费工具页 |
| GET | `/resources/:slug` | 资源页 |
| GET | `/templates/:slug` | 模板页 |
| GET | `/sitemap.xml` | Sitemap |
| GET | `/robots.txt` | Robots |

### 15.2 Auth Routes

| Method | Route | 用途 |
|---|---|---|
| POST | `/api/auth/email/register` | 邮箱注册 |
| POST | `/api/auth/email/login` | 邮箱登录 |
| GET | `/api/auth/google/start` | Google OAuth start |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| POST | `/api/auth/logout` | 登出 |
| GET | `/api/auth/me` | 当前用户 |

### 15.3 App Routes

| Method | Route | 用途 |
|---|---|---|
| GET | `/app` | Personal Dashboard |
| GET | `/app/prospects` | Saved Prospects |
| GET | `/app/prospects/:id` | Prospect Detail |
| GET | `/app/profile` | Prospecting Profile |
| GET | `/app/billing` | Billing |
| GET | `/app/exports` | Export History |

### 15.4 API Routes

| Method | Route | 用途 |
|---|---|---|
| POST | `/api/scans` | 创建 website scan |
| POST | `/api/scans/deep` | 创建 deep scan |
| GET | `/api/scans/:id` | 获取 scan 状态 |
| POST | `/api/tools/first-line` | 免费 first line 工具 |
| POST | `/api/tools/opportunity-finder` | 免费 opportunity finder |
| GET | `/api/prospects` | 获取 prospects |
| GET | `/api/prospects/:id` | 获取 prospect detail |
| PATCH | `/api/prospects/:id` | 更新个人状态/备注 |
| DELETE | `/api/prospects/:id` | 删除 prospect |
| POST | `/api/prospects/:id/copy-event` | 记录复制事件 |
| POST | `/api/exports` | 创建 CSV export |
| GET | `/api/exports/:id` | 获取 export |
| GET | `/api/profile` | 获取 Prospecting Profile |
| PUT | `/api/profile` | 更新 Prospecting Profile |
| GET | `/api/credits` | 获取 credits |
| POST | `/api/billing/checkout` | 创建 checkout |
| POST | `/api/billing/portal` | 创建 customer portal |
| POST | `/api/billing/webhook` | 支付 webhook |

---

## 16. 多语言 App 与内容系统需求

### 16.1 Public website localization

要求：

- Public SEO 页面必须支持 locale path。
- 每个页面有 locale-specific title、description、H1、FAQ。
- 支持 hreflang。
- 支持 localized sitemap。
- 支持页面级 robots 控制。
- 支持结构化数据：SoftwareApplication、FAQPage、BreadcrumbList、Article。

### 16.2 App localization

App 支持：

- English
- Simplified Chinese
- Japanese
- Korean
- German
- Dutch
- French

App 内部文案原则：

- 不出现 team、teammate、member、owner assignment。
- workspace 如果作为技术概念存在，不在 UI 中强调。
- 使用 personal、my prospects、prospecting profile、saved prospects、billing、credits。

### 16.3 SEO 内容生产原则

多语言内容不应该一次性铺满所有页面。

推荐流程：

1. 英文页先上线并观察 Search Console。
2. 选出有 impressions 的页面。
3. 对德语、法语、荷兰语做人工校订本地化。
4. 对日语、韩语、中文做核心页面本地化。
5. 只有当某语言有搜索信号时，再扩展资源页和博客页。

---

## 17. Analytics 与成功指标

### 17.1 SEO 指标

- Organic impressions
- Organic clicks
- CTR by query
- Average position by query
- Landing page signup conversion
- Free tool usage by organic visitors
- Free tool to signup conversion
- Locale page impressions
- Indexed pages count

### 17.2 Activation 指标

- Visitor to signup rate
- Signup to first scan rate
- First scan completion rate
- First scan to saved prospect rate
- First scan to copy first line rate
- First scan to export rate

### 17.3 Product value 指标

最关键指标：

> **Scan-to-save rate**

如果用户生成 Prospect Card 后不保存，说明判断价值不够。

其他指标：

- Copy first line rate
- Copy short email rate
- Export rate
- Average scans per active user
- Repeat scan within 7 days
- Saved prospects per active user

### 17.4 Revenue 指标

- Free to paid conversion
- MRR
- ARPU
- Credit pack revenue
- Churn
- Refund rate
- LTV
- Organic CAC

### 17.5 阶段目标

#### 30 天目标

- 英文首页 + pricing + 5 个 SEO 页面上线。
- 1 个免费工具上线。
- 100 个注册用户。
- 50 个用户完成 first scan。
- 10 个用户保存 prospect。
- 3 个真实付费用户。

#### 60 天目标

- 15-20 个 SEO 页面上线。
- 3 个 locale 的核心页面上线。
- 300-500 注册用户。
- 30-50 个 weekly active users。
- 10-20 个付费用户。
- MRR $300-$1,000。

#### 90 天目标

- 30+ SEO 页面上线。
- Search Console 出现稳定 impressions。
- 1,000+ organic clicks 累计。
- 30+ 付费用户。
- MRR $1,000+。

### 17.6 Go / No-Go 标准

继续投入条件：

- Signup to first scan > 40%。
- First scan to save > 20%。
- First scan to copy/export > 25%。
- 7-day repeat usage > 15%。
- Free to paid conversion > 3%。
- 4-6 周内至少 3-5 个非熟人付费用户。

停止或转向条件：

- 用户愿意试但不愿保存。
- 用户只把它当免费 first line generator。
- 60 天无真实付费。
- SEO 页面有流量但转化极低。
- AI 成本明显超过可承受毛利。

---

## 18. 合规、隐私与安全

### 18.1 Chrome Extension 隐私原则

- 只在用户主动点击 Analyze 时读取当前页面。
- 不后台静默抓取。
- 不采集无关浏览历史。
- 不读取所有 tabs。
- 不出售用户数据。
- 不自动发送邮件。

### 18.2 数据保存原则

- 保存结构化 Prospect Card。
- 原始网页文本默认短期保留或只保存 hash。
- 大型快照如需保存，放 R2 并设置 retention。
- 用户可以删除 prospects。
- 用户可以关闭账户并删除个人数据。

### 18.3 AI 安全规则

- 不编造联系信息。
- 不编造融资、招聘、收入、客户、增长等事实。
- 不确定时显示 needs review。
- 重要判断尽量附 source。
- 生成邮件不得虚构私人关系。
- 不生成欺骗性外联内容。

### 18.4 免费工具防滥用

- Turnstile。
- IP / session rate limit。
- 限制匿名 AI 调用。
- 异常请求进入 challenge。
- 记录 usage_events 用于成本监控。

---

## 19. Roadmap

### Phase 1：重定位与最小商业闭环

周期：2-3 周

目标：完成个人版定位和基本产品闭环。

范围：

- 新首页。
- 新 pricing。
- Personal Dashboard。
- Prospecting Profile。
- Website Scan。
- Prospect Card。
- Saved Prospects。
- Copy first line / short email。
- Credits usage。
- Billing 基础。

### Phase 2：SEO 起量

周期：第 3-6 周

目标：建立可索引、多语言基础 SEO 站点。

范围：

- 10 个英文 SEO 页面。
- Cold Email First Line Generator。
- Features / Use Cases / Templates 页面。
- Sitemap / hreflang / structured data。
- Search Console 监控。

### Phase 3：个人高频工作流

周期：第 2-3 个月

目标：让个人用户能持续使用。

范围：

- Chrome Extension。
- Batch URL import。
- Deep scan。
- Export presets。
- Regenerate outreach。
- Personal status 和 notes 优化。

### Phase 4：多语言扩展

周期：第 3-4 个月

目标：根据搜索数据扩展非英文市场。

范围：

- 德语、法语、荷兰语核心页面。
- 日语、韩语、中文核心产品页面。
- Locale sitemap。
- Localized SEO templates。

### Phase 5：收入优化

周期：第 4-6 个月

目标：提升免费到付费转化。

范围：

- Paywall experiments。
- Credit pack。
- Annual plan discount。
- Upgrade prompts after first value moment。
- Pricing page A/B。

---

## 20. 首批页面文案方向

### 20.1 Home Hero

H1：

```text
Turn websites into qualified prospects with AI
```

Subheading：

```text
LeadCue helps solo professionals research company websites, score prospect fit, find opportunity signals, and write natural outreach before sending a cold email.
```

CTA：

```text
Analyze a website
Start free
```

### 20.2 Pricing Positioning

```text
Simple pricing for solo professionals. No seats. No team plans. Just website research credits you can use when you need them.
```

### 20.3 Product Promise

```text
Before you send another cold email, know why this prospect is worth contacting.
```

### 20.4 Differentiation Copy

```text
LeadCue is not a contact database or email sender. It helps you understand the prospect before outreach, using the company website as evidence.
```

---

## 21. 风险与对策

### 风险 1：被认为只是 cold email generator

对策：

- 首页不要主打 email generator。
- 强调 website research、fit score、opportunity signals、source-backed notes。
- 免费工具引导完整 Prospect Card。

### 风险 2：SEO 流量慢

对策：

- 同时做免费工具页和长尾 use case 页。
- 优先做低竞争高意图词。
- 每页内置可交互 demo。
- 结合 Chrome Web Store 和社区分发。

### 风险 3：个人用户付费能力有限

对策：

- Pro 价格控制在 $29/月。
- 用 credits 控制成本。
- 用 Power plan 承接高频用户。
- 不做高成本企业功能。

### 风险 4：没有联系人数据库导致价值不足

对策：

- 不承诺联系人数据。
- 强调“联系理由”和“开口素材”。
- 提供 contact page / public email / social links 作为联系路径。
- 支持导出到用户已有工具。

### 风险 5：AI 输出泛化

对策：

- Prompt 强制基于网站证据。
- 限制空泛夸奖。
- 保留 source notes。
- 加入 confidence 和 needs review。
- 用户可 regenerate，但消耗 credits。

---

## 22. 最终产品判断

LeadCue 不应该做成团队销售平台，也不应该做成另一个泛 AI lead generation 工具。

LeadCue 最现实的机会是：

> **成为个人专业用户在外联之前使用的 AI 网站研究工具。**

它的商业价值来自：

- 节省手动研究网站时间。
- 帮用户判断潜客是否值得跟进。
- 给出具体、基于证据的联系理由。
- 生成自然、低压的 first line 和 short email。
- 通过 SEO 长尾获取低成本注册。
- 通过 credits 和个人订阅控制成本并变现。

最终方向：

> **LeadCue turns websites into qualified prospects for solo professionals.**

如果 4-6 周内无法验证用户愿意保存 Prospect Card、复制外联内容并付费，则应停止继续大规模投入或重新定位。
