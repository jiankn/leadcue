# PRD: LeadCue - Website-First Outbound Research Workspace for Agencies

版本：v1.1  
日期：2026-04-19  
项目名称：LeadCue  
项目代号：leadcue  
计划域名：LeadCue.app  
产品形态：Chrome 插件 + Web SaaS 官网/后台  
目标市场：海外市场，优先 AppSumo / Chrome Web Store / SEO / LinkedIn 冷启动

---

## 1. 产品结论

本项目建议做。

但不要做成第 100 个 B2B Email Finder，也不要正面竞争 Apollo、Hunter、Snov、Lusha、SalesQL、Wiza、Clay。

产品应定位为：

> LeadCue: The website research layer between finding an account and starting outreach.

一句话描述：

> LeadCue turns company websites into qualified outreach opportunities with fit scoring, visible website evidence, and outreach-ready context.

中文解释：

> LeadCue 帮 SEO / Web Design / Marketing agency 在发现网站之后，快速判断这个客户值不值得联系、为什么值得联系、以及外拓时第一句话应该怎么开口。

核心产品价值不是“找到邮箱”，而是：

> 找到联系这个潜在客户的理由。

---

## 2. 产品定位

### 2.1 我们是什么

LeadCue 是一个面向小型海外 agency 和 B2B founder 的 Chrome 插件 + Web SaaS 研究工作台。

用户可通过两种入口进入 LeadCue：

- 在 Chrome 浏览单个公司网站时即时分析
- 在 Web 后台导入一批域名并进入 review queue 逐站筛选

用户打开潜在客户的网站，点击 Chrome 插件，即可生成一张 Prospect Card，内容包括：

- 公司是做什么的
- 是否符合用户的 ICP
- 网站有哪些可作为销售切入点的问题
- 可用联系方式和 contact page
- 3 个 outreach angles
- 3 条 cold email first lines
- 1 封短开发信
- 来源页面证据
- 保存和导出 CSV

### 2.2 我们不是什么

第一版明确不做：

- 不做 B2B 联系人数据库
- 不做 LinkedIn scraper
- 不做手机号数据库
- 不做自动群发邮件
- 不做 CRM 大而全系统
- 不做 Apollo / Hunter / Clay alternative
- 不承诺 verified emails
- 不承诺无限 AI credits

### 2.3 定位关键词

主定位：

- Website-first outbound research
- Website research layer for agencies
- Qualified outreach workflow

辅助定位：

- Prospect Research Chrome Extension
- Batch website review queue
- Outreach context workspace
- Website audit outreach workflow

---

## 3. 目标用户

### 3.1 第一优先用户

#### Small SEO Agency Founder

画像：

- 1-20 人团队
- 面向海外客户销售 SEO retainer
- 常用 cold email / LinkedIn / referral 找客户
- 客单价通常为 $500-$5,000/月
- 创始人或销售负责人直接决策

痛点：

- 每天要找很多潜在客户网站
- 需要判断网站 SEO 是否有问题
- 需要写有针对性的 cold email
- Apollo / Hunter 只给邮箱，不给销售切入点
- 不想买 Clay 这种复杂昂贵工具

#### Small Web Design / Redesign Agency Founder

画像：

- 做网站设计、改版、落地页、转化优化
- 客单价通常为 $2,000-$20,000/项目
- 经常需要找网站老旧、CTA 差、移动端差、加载慢的公司
- 需要快速生成 mini audit 和开发信理由

痛点：

- 找到一个网站后，需要人工判断问题
- 每封开发信都要个性化，耗时
- 泛模板邮件回复率低
- 不缺公司名单，缺“为什么现在联系它”的理由

### 3.2 第二优先用户

#### Marketing / Growth Agency Founder

适合场景：

- conversion optimization
- landing page optimization
- lead generation service
- B2B content marketing

不优先打泛 social media agency 或 brand agency，因为痛点不够集中。

#### Early-stage B2B SaaS Founder

适合场景：

- 创始人自己做 outbound
- 没有 SDR 团队
- 需要低成本研究潜在客户
- 不想上复杂销售系统

### 3.3 暂不服务用户

第一版不优先服务：

- 企业级 SDR 团队
- 招聘团队
- 大型 RevOps 团队
- 大规模数据采集团队
- 需要批量 LinkedIn 抓取的用户

---

## 4. 用户核心痛点

### 4.1 用户不是缺 lead，而是缺开口理由

竞品通常解决：

- 找邮箱
- 找电话
- 找联系人
- 导出名单
- 发 sequence

但用户真正卡住的是：

- 这个公司是不是我的潜在客户？
- 它网站上有什么明显问题？
- 我为什么现在联系它？
- 第一句话怎么写才不像群发？
- 我能不能快速生成一个可用的 prospect note？

核心用户语言：

> I do not need more leads. I need a reason to contact them.

### 4.2 当前工作流很碎

用户不用本产品时，一般流程是：

1. 在 Google / LinkedIn / Clutch / directories 找公司
2. 打开公司网站
3. 人工看 homepage / about / pricing / blog / contact
4. 用 Apollo / Hunter / Snov 找邮箱
5. 把信息复制到 Google Sheet
6. 去 ChatGPT 写 cold email opener
7. 去 Instantly / Smartlead / Lemlist 发邮件

问题：

- 工具太多
- 复制粘贴太多
- 研究一个网站耗时 5-15 分钟
- 最后写出来的邮件仍然像模板

---

## 5. 竞品洞察与差异化

### 5.1 竞品共同锋芒

Apollo、Hunter、Snov、Lusha、SalesQL、Wiza、Clay 的强项集中在：

- 联系人数据库
- email / phone enrichment
- LinkedIn workflow
- list building
- email verification
- outreach automation
- CRM / GTM workflow

### 5.2 竞品不足

从目标用户视角看，竞品常见不足：

- 数据会过期
- email credits 贵
- 结果不一定准确
- 功能复杂，学习成本高
- 给了联系人，但没有告诉用户如何开口
- 个性化邮件质量泛
- 不适合小 agency 快速做网站级 prospect research
- Clay 很强但贵且复杂，小团队用起来压力大

### 5.3 我们的避锋芒策略

不和竞品抢：

- 数据库规模
- LinkedIn 批量抓取
- 电话数据
- 企业级 CRM
- 发信自动化

我们只抢一个高价值前置步骤：

> Website research before outreach.

差异化定位：

> Apollo gives contacts. Hunter gives emails. Clay gives complex workflows. We give agencies a clear reason to contact a company from its website.

---

## 6. 核心使用场景

### 6.1 场景 A：Web design agency 找改版客户

用户发现一个公司网站：

- 设计老旧
- CTA 不清晰
- 手机端体验差
- 页面速度慢
- 没有案例页

用户点击插件，产品生成：

- 网站问题摘要
- 改版销售切入点
- cold email first line
- 短邮件模板

目标：

让用户能在 1 分钟内决定是否联系，并复制一段可用开场白。

### 6.2 场景 B：SEO agency 找 SEO 客户

产品检测：

- title/meta 太泛
- blog 长期未更新
- 缺少 service pages
- 缺少 local SEO 页面
- 页面结构弱
- contact page 难找

输出：

- SEO opportunity signals
- 适合切入的 SEO 服务
- 开发信第一句话

### 6.3 场景 C：B2B founder 做 outbound

创始人打开潜在客户网站，想知道：

- 对方是否符合目标客户画像
- 对方可能有什么需求
- 如何写第一封邮件

产品输出：

- ICP fit score
- buying signals
- first lines
- short email

---

## 7. MVP 范围

### 7.1 MVP 必做

Chrome 插件：

- 当前网站分析
- 读取当前页面文本、title、meta、链接
- 自动发现 about / contact / pricing / blog / careers 页面
- 提取邮箱、电话、社媒链接、contact page
- 生成 Prospect Card
- 复制 opener
- 保存 lead
- 打开 Web 后台

Web SaaS：

- 官网 landing page
- Google OAuth 注册 / 登录
- ICP 设置
- Lead list
- Lead detail
- Prospect Card 保存
- CSV 导出
- Credits usage
- Pricing 页面
- AppSumo license redeem 预留

AI 能力：

- 公司摘要
- ICP fit score
- Opportunity signals
- Outreach angles
- Cold email first lines
- Short email
- Source-backed notes

### 7.2 MVP 不做

第一版不做：

- 自动群发邮件
- 邮箱验证
- Apollo / Hunter / Snov API 集成
- CRM 双向同步
- LinkedIn 批量抓取
- 团队权限
- 多语言
- browser automation 大规模爬虫
- 复杂报告 PDF

---

## 8. 用户流程

### 8.1 新用户流程

1. 用户访问官网
2. 看到 60 秒 demo
3. 使用 Google OAuth 注册 / 登录
4. 安装 Chrome 插件
5. 填写 Agency Mode 设置：
   - 服务类型
   - 目标客户
   - 目标行业
   - 地区
   - 语气偏好
6. 打开一个潜在客户网站
7. 点击 Analyze Website
8. 获得 Prospect Card
9. 保存 lead
10. 复制 opener 或导出 CSV

### 8.2 老用户流程

1. 用户日常浏览潜在客户网站
2. 点插件分析
3. 判断 fit score 和 opportunity signals
4. 保存高质量 prospect
5. 批量导出到 outreach 工具

---

## 9. Prospect Card 设计

Prospect Card 是产品核心。

### 9.1 字段结构

| 字段 | 说明 |
|---|---|
| Company Name | 公司名称 |
| Website | 网站域名 |
| Industry | 行业，AI 推断，低置信度时标 unknown |
| Company Summary | 公司做什么 |
| ICP Fit Score | 0-100 分 |
| Fit Reason | 为什么匹配或不匹配 |
| Contact Points | email、phone、contact page、social links |
| Opportunity Signals | 网站上发现的销售机会 |
| Outreach Angles | 可用于开发信的切入角度 |
| First Lines | 3 条 cold email first lines |
| Short Email | 1 封短开发信 |
| Source Notes | 每个判断来自哪个页面 |
| Confidence | AI 置信度 |
| Saved Status | 是否保存 |
| Export Status | 是否导出 |

### 9.2 Prospect Card 输出示例

```text
Company: Acme Dental Group
Website: acmedental.example
ICP Fit Score: 82/100

Summary:
Acme Dental Group is a local dental clinic offering cosmetic and family dentistry services.

Opportunity Signals:
1. Homepage CTA is below the fold. Source: homepage
2. Blog has not been updated since 2022. Source: /blog
3. No visible patient financing page. Source: navigation scan

Outreach Angle:
Position the service as a conversion-focused website refresh to increase appointment bookings.

First Line:
I noticed your site has strong patient review signals, but the appointment CTA is buried below the fold on the homepage.

Short Email:
Hi Sarah,
I noticed your site has strong patient review signals, but the appointment CTA is buried below the fold. We help local clinics turn more website visitors into booked appointments with clearer landing pages and faster mobile UX.
Worth sending over a few quick ideas?
```

---

## 10. Opportunity Signals

第一版优先检测以下信号。

### 10.1 Web Design Signals

- 首页 above the fold 没有明确 CTA
- 网站视觉明显老旧
- 移动端布局差
- 页面加载慢
- 导航混乱
- 没有案例页
- 没有 testimonials
- 联系入口不明显
- 多个 CTA 冲突

### 10.2 SEO Signals

- title 太泛
- meta description 缺失或太弱
- H1 不清晰
- blog 长期未更新
- 缺少 service pages
- 缺少 location pages
- 页面内容薄
- 站内结构弱

### 10.3 Marketing Signals

- 没有 lead magnet
- 没有 pricing 或 package 信息
- 没有 case studies
- landing page 文案弱
- 产品价值主张不清晰
- 没有 newsletter / demo / booking 入口

### 10.4 Buying / Timing Signals

- careers 页面招聘 marketing / sales / growth 相关岗位
- blog 最近发布新品或扩张内容
- 网站出现 new location / new product / funding / hiring 信号
- pricing 页面更新痕迹

### 10.5 重要规则

所有 signals 必须尽量附来源：

- Source: homepage
- Source: /blog
- Source: /pricing
- Source: /careers
- Source: meta title

如果没有证据，不输出确定性结论。

---

## 11. AI 输出规则

### 11.1 基本原则

AI 输出必须：

- 简短
- 具体
- 基于网页证据
- 不编造
- 不夸张
- 不使用垃圾邮件腔
- 不用过度奉承

### 11.2 禁止表达

避免：

- I hope this email finds you well
- I was impressed by your amazing company
- We help businesses like yours grow 10x
- I came across your website and wanted to reach out
- generic compliments

### 11.3 First Line 标准

好的 first line 应满足：

- 来自真实网页观察
- 可以在 1 句话内说清
- 不尴尬
- 不像批量模板
- 能自然引出用户的服务

示例：

```text
I noticed your homepage explains the service well, but the booking CTA only appears after two scrolls on mobile.
```

### 11.4 Short Email 标准

- 默认不超过 120 词
- 结构为：
  - 个性化观察
  - 问题/机会
  - 简短价值主张
  - 低压力 CTA
- 语气：professional, casual, direct

---

## 12. Chrome 插件需求

### 12.1 插件入口

建议使用 Manifest V3 + Side Panel。

插件主要界面：

- Analyze Website
- Prospect Card Preview
- Copy First Line
- Save Lead
- Open Dashboard

### 12.2 权限原则

权限最小化：

- 仅在用户点击 Analyze 时读取当前页面
- 不后台静默抓取
- 不默认读取所有 tabs
- 不采集无关浏览历史

### 12.3 插件功能

P0：

- 读取当前 URL、title、meta、body text
- 提取页面链接
- 提取 email / phone / social links
- 发送分析请求到后端
- 展示 Prospect Card
- 复制 opener
- 保存 lead

P1：

- 自动抓取同域名 about/contact/pricing/blog/careers 页面
- 分析 loading speed 简单指标
- 提示 credits usage
- 重新生成 opener

P2：

- 批量 URL 分析
- 导出到 Smartlead / Instantly
- screenshot capture

---

## 13. Web SaaS 需求

### 13.1 官网

页面：

- Home
- Pricing
- Chrome Extension
- Use Cases
- Blog
- Free Tools
- Login / Signup

首页核心信息：

- 一句话定位
- 60 秒 demo
- 目标用户：SEO & Web Design Agencies
- 产品流程：Visit site → Analyze → Get prospect card → Outreach
- Pricing
- FAQ

### 13.2 Web 后台

P0 页面：

- Dashboard
- Leads
- Lead Detail
- ICP Settings
- Credits Usage
- Billing
- AppSumo Redeem

P1 页面：

- Export History
- Workspace Settings
- Templates

### 13.3 ICP Settings

字段：

- Service Type: SEO / Web Design / Marketing / Custom
- Target Industry
- Target Company Size
- Target Country
- Offer Description
- Tone: direct / casual / professional
- Avoided Industries

这些设置会影响：

- fit score
- opportunity signals 权重
- outreach angle
- first line
- short email

---

## 14. 数据结构

### 14.1 users

- id
- email
- name
- google_sub
- avatar_url
- auth_provider
- last_login_at
- created_at

### 14.2 auth_sessions

- id
- user_id
- session_token_hash
- expires_at
- created_at
- last_seen_at

### 14.3 oauth_states

- id
- state
- code_verifier_hash
- redirect_uri
- expires_at
- created_at

### 14.4 workspaces

- id
- owner_user_id
- name
- plan
- monthly_credit_limit
- created_at

### 14.5 icp_profiles

- id
- workspace_id
- service_type
- target_industries
- target_countries
- offer_description
- tone
- created_at
- updated_at

### 14.6 leads

- id
- workspace_id
- company_name
- domain
- website_url
- industry
- summary
- fit_score
- fit_reason
- contact_points_json
- opportunity_signals_json
- outreach_angles_json
- first_lines_json
- short_email
- source_notes_json
- confidence_score
- created_at
- updated_at

### 14.7 scans

- id
- workspace_id
- lead_id
- url
- status
- credits_used
- raw_extracted_text_hash
- error_message
- created_at

### 14.8 credit_transactions

- id
- workspace_id
- type
- amount
- reason
- scan_id
- created_at

### 14.9 appsumo_licenses

- id
- license_key
- tier
- redeemed_by_workspace_id
- status
- redeemed_at
- created_at

---

## 15. 定价与 Credits

### 15.1 官网订阅

建议：

| Plan | Price | Limits |
|---|---:|---|
| Free | $0 | 20 scans/month |
| Starter | $29/month | 300 scans/month, 1 workspace |
| Pro | $69/month | 1,500 scans/month, 3 workspaces |
| Agency | $149/month | 5,000 scans/month, team seats |

### 15.2 AppSumo LTD

建议：

| Tier | Price | Limits |
|---|---:|---|
| Tier 1 | $69 lifetime | 500 scans/month |
| Tier 2 | $149 lifetime | 2,000 scans/month |
| Tier 3 | $299 lifetime | 5,000 scans/month |

原则：

- 不提供 unlimited AI credits
- 不承诺终身无限成本功能
- AppSumo 用户可升级 tier
- 明确 monthly reset

### 15.3 Credits 消耗

初版建议：

- Basic website scan: 1 credit
- Deep scan with multiple pages: 3 credits
- Regenerate first lines: 1 credit
- Export CSV: 不消耗 credits

---

## 16. 增长与推广

### 16.1 冷启动策略

核心打法：

> 先人工/半自动送 Prospect Reports，再引导安装插件。

步骤：

1. 找 SEO / Web Design agency founder
2. 根据他们的服务找到 10 个潜在客户网站
3. 为每个网站生成：
   - problem found
   - outreach angle
   - first line
4. 私信对方：

```text
Hey [Name], I saw you run [Agency].

I put together 10 potential clients that may be a fit for your SEO/web design service.

For each one, I included:
- website issue
- why it may be a good prospect
- a personalized cold email opener

Want me to send it over?
```

5. 对方回复后发报告
6. 顺带说：

```text
I am building a Chrome extension that generates this kind of prospect card from any company website.
Want early access?
```

### 16.2 冷启动指标

前 14 天：

- 私信 200 个 agency founder
- 回复率目标：> 10%
- 要报告人数：> 20
- 愿意试用人数：> 5
- 愿意付费人数：> 2

低于标准：

- 回复率 < 5%：话术或人群错误
- 要报告人数 < 10：价值表达弱
- 试用人数 < 3：产品结果不够强

### 16.3 Chrome Web Store

Listing 标题建议：

```text
AI Sales Research Assistant & Website Prospecting Tool
```

关键词：

- sales prospecting Chrome extension
- AI sales research assistant
- website lead extractor
- prospect research tool
- cold email opener generator
- SEO agency prospecting
- web design lead generation

### 16.4 SEO 策略

第一批 SEO 页面：

- /
- /chrome-extension/b2b-prospecting
- /tools/cold-email-first-line-generator
- /tools/personalized-cold-email-opener-generator
- /tools/website-lead-extractor
- /tools/website-audit-cold-email-generator
- /use-cases/seo-agency-prospecting
- /use-cases/web-design-lead-generation
- /use-cases/marketing-agency-prospecting
- /blog/how-to-research-prospects-before-cold-email
- /blog/how-seo-agencies-can-find-clients-from-bad-websites
- /blog/cold-email-first-line-examples
- /blog/website-audit-cold-email-template
- /compare/apollo-vs-website-prospecting
- /compare/hunter-alternative-for-agencies

### 16.5 关键词优先级

优先做低中难度长尾词：

| Keyword | Intent | Priority |
|---|---|---|
| AI sales research assistant | 高 | P0 |
| prospect research chrome extension | 高 | P0 |
| website prospecting tool | 高 | P0 |
| cold email first line generator | 高 | P0 |
| website lead extractor | 高 | P0 |
| SEO agency prospecting tool | 高 | P0 |
| web design lead generation tool | 高 | P0 |
| website audit cold email generator | 高 | P0 |
| personalized cold email opener generator | 高 | P1 |
| sales prospecting chrome extension | 高 | P1 |

暂不主攻：

- b2b lead generation software
- email finder
- b2b email finder
- linkedin email finder
- sales intelligence software
- apollo alternative

---

## 17. 成功指标

### 17.1 产品指标

核心指标：

- Chrome installs
- install-to-first-scan rate
- scan-to-save rate
- save-to-export rate
- copy first line rate
- weekly scans per active user
- free-to-paid conversion
- churn
- refund rate

最关键指标：

> Scan-to-save rate

如果用户分析网站后不保存 Prospect Card，说明结果没有价值。

### 17.2 阶段目标

| 时间 | 目标 |
|---|---:|
| 第 14 天 | 200 次私信，20 人要报告，5 人试用 |
| 第 30 天 | 100 beta users，500 Chrome installs |
| 第 60 天 | 10-30 paid users，$300-$1,000 MRR |
| 第 90 天 | $500-$1,500 MRR，准备 AppSumo |
| 第 6 个月 | SEO 月访问 1k-5k，MRR $3k+ |

### 17.3 放弃 / 转向标准

建议硬标准：

- 14 天冷启动回复率 < 5%：换话术或人群
- 30 天无人愿意持续试用：产品价值弱
- 60 天没有 10 个付费用户：重做定位或功能
- 90 天 MRR < $500 且没有强留存：考虑 pivot
- 6 个月 SEO 无 1k organic visits：SEO 策略重做

---

## 18. 合规与隐私

### 18.1 Chrome 权限原则

- 只在用户主动点击时分析当前网站
- 不后台静默抓取
- 不采集用户浏览历史
- 不出售用户数据
- 不采集私人手机号数据库
- 不自动发送邮件

### 18.2 隐私政策必须说明

- 插件读取当前网页内容的目的
- 分析结果如何保存
- 是否调用 AI API
- 是否保存原始网页内容
- 用户如何删除数据
- 不销售用户数据

### 18.3 AI 风险控制

- 不确定时输出 unknown
- 不编造联系方式
- 不编造融资、招聘、增长等事实
- 所有重要判断尽量附 source

---

## 19. 技术建议：Cloudflare-first 架构

### 19.1 技术栈

建议采用 Cloudflare-first 技术栈，降低 MVP 成本和运维复杂度。

核心选择：

- Web：Cloudflare Workers + Static Assets，或 Pages + Pages Functions
- API：Cloudflare Workers
- DB：Cloudflare D1
- Object Storage：Cloudflare R2
- Cache / lightweight config：Cloudflare KV
- Queue：Cloudflare Queues
- AI proxy / logs / rate limit：Cloudflare AI Gateway
- AI model：OpenAI / Anthropic / Gemini / Workers AI
- Chrome Extension：Manifest V3 + Side Panel
- Auth：Google OAuth + Workers session cookie + D1 session storage
- Payment：Stripe / Lemon Squeezy / Paddle
- Email：SMTP
- Bot protection：Cloudflare Turnstile

不建议第一版使用 Supabase / Vercel 作为主架构，除非后续明确需要 Postgres 生态、复杂 SQL、Realtime 或更成熟的 Auth 后台。第一版登录方式固定为 Google OAuth，不做邮箱密码登录。

### 19.2 系统结构

```text
Chrome Extension
  -> extract current website data
  -> send to API

Cloudflare Workers API
  -> normalize page content
  -> run rule-based extraction
  -> call AI analysis
  -> save scan and lead to D1
  -> store large raw snapshots / exports in R2
  -> cache common config in KV
  -> async heavy jobs via Queues

Web Dashboard
  -> manage leads
  -> manage ICP
  -> export CSV
  -> billing and credits
```

### 19.3 分析策略

建议采用：

- 规则提取：email、phone、links、title、meta、H1
- 页面发现：about/contact/pricing/blog/careers
- AI 分析：summary、fit score、signals、opener
- source mapping：每个结论尽量绑定页面来源

### 19.4 Cloudflare 产品分工

| 模块 | 使用产品 | 用途 |
|---|---|---|
| 官网静态页面 | Workers Static Assets / Pages | Landing page、SEO 页面、免费工具页 |
| API 后端 | Workers | 插件 API、Dashboard API、billing webhook |
| 主数据库 | D1 | users、workspaces、leads、scans、credits、licenses |
| 文件存储 | R2 | CSV 导出、报告快照、可选网页截图 |
| 高频缓存 | KV | pricing config、feature flags、rate limit 配置、临时会话缓存 |
| 登录认证 | Google OAuth + D1 | 用户登录、session、OAuth state |
| 异步任务 | Queues | deep scan、AI 分析重试、批量 URL 分析 |
| 单用户/工作区限流 | Durable Objects，可后置 | 实时限流、并发控制、批量任务状态 |
| AI 观测 | AI Gateway | AI 调用日志、缓存、限流、成本观察 |
| 免费防刷 | Turnstile | 注册、免费工具页、防止 credits 被刷 |

### 19.5 D1 数据建模建议

D1 适合 MVP 的结构化数据：

- users
- workspaces
- icp_profiles
- leads
- scans
- credit_transactions
- appsumo_licenses
- subscriptions
- api_usage_logs

注意：

- D1 免费计划适合 MVP，但单库大小和查询子请求有限制。
- Prospect Card 的结构化字段放 D1。
- 原始网页文本、完整 AI 输入输出、CSV 文件不要长期塞 D1，建议放 R2。
- 需要给 leads.domain、workspace_id、created_at、fit_score 建索引，避免行扫描浪费 rows read。

### 19.6 免费额度风险

Cloudflare 免费额度对 MVP 足够，但不是所有东西都“无限免费”。

需要重点控制：

- Workers Free 每天请求数限制
- D1 免费计划的数据库大小、rows read / rows written
- R2 免费存储和操作次数
- KV 免费写入次数较少，不适合当主数据库
- Workers AI 免费额度有限，正式商业化后仍要按 credits 控制 AI 成本

因此产品计费必须保留 monthly credits，不提供 unlimited scans。

### 19.7 推荐 MVP 部署方案

第一版建议：

```text
monorepo
  apps/web          -> Cloudflare Workers / Pages web app
  apps/extension    -> Chrome extension MV3
  packages/shared   -> shared types, prompt schemas, validators
  migrations        -> D1 migrations
```

框架选择：

- 如果追求简单：Hono + React / Vite + Cloudflare Workers
- 如果需要全栈路由：Astro + Cloudflare adapter 或 Remix + Cloudflare
- 如果坚持 Next.js：可用 OpenNext for Cloudflare，但 MVP 复杂度略高

优先建议：

> Hono + React/Vite + D1 + R2 + KV

理由：

- 更贴近 Cloudflare Workers
- 部署简单
- API 和 Web 可控
- 适合 Chrome 插件后端
- 不容易被 Next.js 运行时兼容问题拖慢

### 19.8 Google OAuth 认证方案

第一版认证固定使用 Google OAuth，原因：

- 海外用户接受度高
- agency / founder 用户通常有 Google Workspace 或 Gmail
- 降低邮箱密码、找回密码、验证码等开发成本
- 对 Chrome 插件用户体验更顺

推荐流程：

```text
Web / Extension
  -> 点击 Continue with Google
  -> Workers 生成 OAuth state 和 PKCE verifier
  -> 跳转 Google OAuth
  -> Google callback 到 Workers
  -> Workers 校验 state
  -> 交换 access token / id token
  -> 校验 id token
  -> upsert users
  -> 创建 auth_sessions
  -> 设置 HttpOnly Secure SameSite cookie
  -> 返回 dashboard 或 extension success page
```

实现原则：

- D1 保存 users、auth_sessions、oauth_states
- session cookie 必须 HttpOnly、Secure、SameSite=Lax
- oauth_states 设置短过期时间，例如 10 分钟
- session_token 只保存 hash，不保存明文
- Chrome 插件调用 API 时走同域 cookie 或短期 extension token
- 用户注销时删除 session
- 不自建密码登录
- 不做邮箱验证码登录

Chrome 插件登录建议：

1. 插件里点击 Sign in with Google
2. 打开 Web 登录页
3. Web 完成 OAuth 后跳转 extension success 页面
4. 插件通过 API 检查当前 session
5. 成功后允许 Analyze Website

AppSumo license 兑换流程：

1. 先 Google 登录
2. 进入 `/redeem`
3. 输入 AppSumo license key
4. 绑定到当前 workspace

---

## 20. Roadmap

### 20.1 V1: MVP

周期：2-4 周

功能：

- Chrome 插件分析当前网站
- Prospect Card
- ICP settings
- Save leads
- CSV export
- credits
- Free / paid plans

目标：

- 验证用户是否愿意保存和复制 opener

### 20.2 V2: Agency Workflow

周期：第 2-3 个月

功能：

- Agency-specific audit templates
- Better SEO / redesign signals
- Bulk URL scan
- Export to Smartlead / Instantly CSV format
- AppSumo license redeem
- 5-10 个 use case SEO 页面

目标：

- 让 agency 能把它用于日常 outbound

### 20.3 V3: Scale

周期：第 4-6 个月

功能：

- Email verification integration
- CRM / Zapier / webhook
- Team workspace
- Advanced scoring
- Prospect report PDF
- AppSumo launch

目标：

- 扩大收入和渠道

---

## 21. 14 天执行计划

### Day 1-2

- 定产品名
- 写 landing page 文案
- 做 demo mockup
- 确定 ICP settings 字段

### Day 3-5

- 开发 Chrome 插件基础版
- 实现当前页面读取
- 实现 email / link / meta 提取

### Day 6-8

- 开发 Web 登录和后台
- Leads list
- Lead detail
- ICP settings

### Day 9-10

- 接 AI 分析
- 生成 Prospect Card
- 生成 first lines 和 short email

### Day 11

- 加 credits
- 加 CSV export
- 加基础 pricing

### Day 12

- 做 Chrome Web Store listing 草稿
- 写 privacy policy
- 录 60 秒 demo

### Day 13-14

- 找 50 个 agency founder 冷启动
- 送 prospect reports
- 收集反馈

---

## 22. 最终判断

本项目值得做。

但成败关键不是 AI，也不是邮箱提取，而是：

> 用户打开一个公司网站，点击插件后，是否能得到一张可以直接用于开发客户的 Prospect Card。

第一版必须围绕这个瞬间打磨：

- 这个客户值不值得联系
- 它网站有什么问题
- 这个问题怎么变成销售切入点
- 第一句话怎么写

只要这个结果足够具体，SEO / Web Design agency founder 就有付费理由。

最终产品方向：

> A lightweight AI website prospecting tool that helps agencies find reasons to contact potential clients.
