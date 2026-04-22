# LeadCue Commercial Launch Plan

版本：v1.0  
日期：2026-04-20  
目标：把 LeadCue 从 waitlist/MVP 阶段推进到可注册、可付费、可安装、可扫描、可保存、可导出的商业 SaaS 产品。

## 1. 商业版目标

商业版第一阶段不再把用户导向 waitlist，而是直接提供可使用的产品闭环：

1. 用户访问官网，选择 `Start free` 或付费 plan。
2. 用户注册账户并创建 agency workspace。
3. 用户完成 onboarding，设置 agency focus、offer、ICP 和第一个测试网站。
4. 用户安装 Chrome extension 并登录。
5. 用户在任意公司网站点击 Analyze。
6. 后端生成 Prospect Card。
7. 用户保存 prospect、复制 first line、导出 CSV。
8. 付费用户通过 Stripe 管理订阅和发票。
9. 系统按 plan 执行月度 scan credits 和用量限制。

第一版商业闭环：

```text
Website -> Prospect Card -> Save -> Export -> Credits -> Billing
```

## 2. 不做范围

第一版商业上线不做这些，避免产品失焦：

- 不做 LinkedIn scraping。
- 不做联系人数据库。
- 不做自动群发邮件。
- 不做 CRM 大而全系统。
- 不做复杂 team permissions。
- 不做多语言。
- 不承诺 unlimited AI credits。
- 不接太多第三方 outreach integrations。
- 不把 Chrome extension 做成后台自动采集器。

## 3. 上线 Definition of Done

满足以下条件才算可商业上线：

- 官网 CTA 是 `Start free`、`Subscribe`、`Get started`，没有 waitlist/early access 语义。
- `/signup` 可完成商业注册表单。
- `/app` 可展示真实用户 workspace、plan、credits、saved prospects。
- API 有用户、组织、订阅、credits、scan、prospect 的基础数据模型。
- 每次 scan 前检查 credits。
- 每次成功 scan 后扣减 credits 并写入 ledger。
- Free plan 可用 20 scans/month。
- Stripe Checkout 可创建订阅。
- Stripe webhook 可同步 subscription 状态。
- Stripe Customer Portal 可管理订阅。
- Chrome extension 可登录账户并调用真实 scan API。
- CSV export 可导出 saved prospects。
- 有 Privacy Policy、Terms、Security、Support 页面。
- Chrome Web Store listing、privacy disclosures、permission justifications 准备完成。
- 生产环境有 staging/prod secrets、DB migrations、error logging、smoke tests。

## 4. 阶段拆解

### Phase 1: Commercial Entry

目标：把官网和前端入口从 waitlist 改成商业产品入口。

任务：

- 删除 waitlist/early access 语言。
- 顶部 CTA 改为 `Start free`。
- Hero CTA 改为 `Start free` 和 `View sample card`。
- Pricing CTA：
  - Free: `Start free`
  - Starter/Pro/Agency: `Subscribe`
- 新增 `/signup` 页面。
- 新增 signup/onboarding 表单：
  - work email
  - agency focus
  - agency website
  - offer description
  - target industries
  - first prospect website
  - selected plan
- 新增商业转化 section：`Start scanning today`。

验收：

- 页面不再出现 waitlist/early access 文案。
- 用户能从 landing、pricing、topbar 进入 `/signup`。
- `/signup?plan=pro` 能显示所选 plan。
- mobile/desktop 截图无布局溢出。

### Phase 2: Auth, Workspace, Credits Schema

目标：在现有 D1 schema 基础上补齐并硬化商业 SaaS 后端模型。

现有表继续使用：

- `users`
- `auth_sessions`
- `oauth_states`
- `workspaces`
- `workspace_members`
- `icp_profiles`
- `subscriptions`
- `credit_transactions`
- `scans`
- `leads`

新增或补齐：

- `signup_intents`
- `billing_events`

核心规则：

- 一个 user 默认创建一个 workspace。
- workspace 绑定 subscription。
- plan 决定 monthly scan credits。
- credit transactions 是用量真相来源。
- scans/leads 用于查询、报表和导出。

验收：

- migration 可重复应用到 D1。
- API 能创建 signup intent。
- plan/credits 常量前后端一致。

### Phase 3: Stripe Billing

目标：实现可收费订阅。

任务：

- 创建 Stripe products/prices。
- API endpoint:
  - `POST /api/billing/checkout`
  - `POST /api/billing/portal`
  - `POST /api/stripe/webhook`
- webhook 处理：
  - checkout completed
  - subscription created/updated/deleted
  - invoice paid/payment failed
- webhook idempotency。
- plan status 同步到 subscription 表。

验收：

- Free 用户可直接进产品。
- Paid 用户可进入 Stripe Checkout。
- webhook 可把用户 plan 改为 active。
- Customer Portal 可取消或升级订阅。

### Phase 4: Production Scan API

目标：让 scan pipeline 成为真实产品能力。

Endpoint：

- `POST /api/scans`
- `GET /api/scans/:id`
- `POST /api/prospects/:id/save`
- `GET /api/prospects`
- `GET /api/exports/csv`

流程：

1. 校验用户/session。
2. 校验 organization subscription。
3. 校验 credits。
4. 清洗 page snapshot。
5. 生成 Prospect Card。
6. 保存 scan 和 prospect。
7. 扣 credits。
8. 返回结果。

错误状态：

- `unauthorized`
- `subscription_inactive`
- `insufficient_credits`
- `invalid_url`
- `scan_failed`
- `unsupported_page`

验收：

- Free plan 可 scan。
- credits 不足会阻止 scan。
- scan 成功后 dashboard 能看到记录。
- CSV export 可用。

### Phase 5: Dashboard Commercial App

目标：把 `/app` 从 demo dashboard 改成真实工作台。

页面：

- `/app`
  - plan status
  - credits used
  - recent scans
  - saved prospects
- `/app/prospects`
  - search
  - filters
  - fit score
  - export selected
- `/app/prospects/:id`
  - Prospect Card detail
  - evidence
  - first lines
  - short email
  - copy actions
- `/app/settings`
  - ICP
  - agency offer
  - export preferences
- `/app/billing`
  - current plan
  - manage subscription
  - invoice portal

验收：

- 无 demo-only 数据假象。
- 空状态清晰。
- upgrade CTA 出现在 credits/plan 限制处。

### Phase 6: Chrome Extension Commercial Flow

目标：让 extension 直接服务付费用户。

任务：

- 登录状态。
- 当前 workspace/plan/credits 显示。
- Analyze active website。
- 展示 Prospect Card。
- Save prospect。
- Copy first line。
- Copy email。
- Open in dashboard。
- Credits exhausted 时显示 upgrade CTA。

Chrome Store 合规：

- 尽量使用 `activeTab`。
- 不后台抓取。
- 不收集浏览历史。
- 不主打 email scraping。
- 准备 reviewer test account。

验收：

- extension 能对真实 API 完成 scan。
- 未登录用户看到 login/start free。
- credits 不足时流程清晰。

### Phase 7: Legal, Trust, Store Assets

目标：上线销售前补齐信任和审核资产。

页面：

- `/privacy`
- `/terms`
- `/security`
- `/support`
- `/chrome-extension`

Store assets：

- 5 张截图。
- Promo video script。
- Permission justification。
- Privacy disclosures。
- Single purpose statement。
- Support email。

验收：

- Chrome Web Store listing 文案与官网一致。
- 隐私政策明确说明 active user-triggered analysis。
- 不出现 misleading unlimited claims。

### Phase 8: Production Ops

目标：线上稳定运行和可回滚。

任务：

- staging/prod environment。
- Cloudflare Workers deploy。
- D1 migrations。
- production secrets。
- error logging。
- request IDs。
- API rate limit。
- backup/export policy。
- smoke tests。
- visual screenshots。
- rollback checklist。

验收：

- 新版本可部署到 staging。
- smoke tests 覆盖 signup、scan、billing webhook。
- production deploy 有回滚路径。

## 5. 推荐实施顺序

第一轮直接开干顺序：

1. Phase 1: Commercial Entry。
2. Phase 2: Auth/Workspace/Credits schema。
3. Phase 3: Stripe Billing skeleton。
4. Phase 4: Scan API credits enforcement。
5. Phase 5: Dashboard real data。
6. Phase 6: Extension commercial flow。
7. Phase 7: Legal and Chrome Store assets。
8. Phase 8: Production deploy.

## 6. 当前 Sprint

当前立即执行：

- [x] 删除 waitlist/early access 入口。
- [x] 新增 `/signup` commercial onboarding 页面。
- [x] Pricing CTA 连接到 `/signup?plan=<plan>`.
- [x] Landing 最后一屏改成 `Start scanning today`.
- [x] Signup 创建真实 user/workspace/subscription/ICP 初始状态。
- [x] 新增 Stripe Checkout / Customer Portal / webhook skeleton。
- [x] Scan API 增加 subscription/credits enforcement。
- [x] Dashboard 接入 workspace、plan、credits、leads API。
- [x] Signup 创建 HttpOnly session，`/app` 不再依赖 localStorage workspace id。
- [x] 新增 `/api/auth/me` 和 `/api/auth/logout`。
- [x] 新增 Google OAuth redirect flow，老用户直接登录，新用户自动创建 workspace。
- [x] Google OAuth 使用 state + PKCE + server-side code exchange。
- [x] D1 migrations_dir 指向根目录 migrations 并完成本地迁移验证。
- [x] 截图检查 desktop/mobile。
- [x] 类型检查和生产构建。
- [ ] 配置生产 Stripe secret 和真实 price IDs。
- [ ] 配置 Google OAuth production client id / secret / redirect URI。
- [x] 接入正式 auth/session。
- [ ] Extension 登录与真实 scan API 联调。

## 7. Launch Checklist

- [x] Landing 商业入口完成。
- [x] Signup/onboarding 完成。
- [x] Auth/session 完成。
- [x] Google OAuth 登录入口完成。
- [x] Workspace 创建完成。
- [x] Plans/credits schema 完成。
- [ ] Stripe Checkout 完成。
- [ ] Stripe webhook 完成。
- [ ] Customer Portal 完成。
- [x] Scan API 完成。
- [x] Credits enforcement 完成。
- [x] Prospects dashboard 完成。
- [x] CSV export 完成。
- [ ] Chrome extension login 完成。
- [ ] Chrome extension analyze/save 完成。
- [ ] Legal pages 完成。
- [ ] Chrome Store listing/assets 完成。
- [ ] Production deployment 完成。
- [ ] Monitoring/smoke tests 完成。
