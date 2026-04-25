# LeadCue PRD / Launch 验收缺口清单

更新时间：2026-04-25

## 1. 判断口径

本清单同时参考以下文档：

- `PRD-AI-Website-Prospecting-Assistant.md`
- `COMMERCIAL_LAUNCH_PLAN.md`
- `qa/release-smoke-checklist.md`
- 当前仓库代码实现

说明：

- 以“商业上线验收”为主，不以“demo 可演示”为标准。
- 优先区分 `P0 阻断`、`P1 可延期`、`已完成`。
- 文档和代码有少量偏差时，以“代码真实状态 + Launch Plan 验收口径”综合判断。

---

## 2. 总结结论

当前项目已经具备以下主线能力：

- Landing / Signup / Login / Reset Password
- Google OAuth + Email Password Auth
- Workspace / ICP / Leads / Billing / Analytics / Account 基础后台
- Scan API、Credits enforcement、Lead 保存、CSV 导出
- 多语言公共页、SEO 页面、工具页、用例页

但按商业上线验收标准，当前还不能判定为“完全通过”。

当前最主要的阻断项集中在：

- Chrome extension 商业流未闭环
- Stripe 生产验收未闭环
- 法律与商店资产未闭环
- 生产运维验收未闭环
- 若严格按 PRD 原文，部分产品项仍是“部分建设”

---

## 3. P0 阻断项

以下项目建议视为上线前必须关闭：

### 3.1 Chrome extension 商业流未完成

PRD / Launch 期望：

- extension 有真实登录态
- 展示当前 workspace / plan / credits
- 未登录时显示 login / start free
- credits 不足时显示 upgrade CTA
- 通过真实账户调用 scan API
- 支持 save prospect、copy first line、copy email、open dashboard

当前状态：

- extension 仍直接使用 demo workspace header：`X-Workspace-Id: ws_demo`
- 未看到真实 session / account 状态接入
- 未看到 workspace / plan / credits 面板
- 未看到 credits exhausted 升级分支
- 未看到 copy email 明确入口

结论：

- `P0 阻断`

### 3.2 Stripe 生产闭环未完成

当前已有：

- `POST /api/billing/checkout`
- `POST /api/billing/portal`
- `POST /api/stripe/webhook`

但仍缺：

- 生产 `STRIPE_SECRET_KEY`、price IDs、webhook secret 配置确认
- checkout -> webhook -> subscription active 的端到端验证
- portal 升级 / 取消 / 返回产品页的手工验收

结论：

- 代码 skeleton 已有
- 商业上线验收仍按 `P0 阻断` 处理

### 3.3 法律页 / Trust / Store 资产未闭环

当前已有：

- `/privacy`
- `/terms`
- `/support`
- `LeadCue-Chrome-Web-Store-Listing.md` 文案草案

当前缺口：

- `/security` 页面未看到落地
- `/chrome-extension` 页面未看到落地
- Chrome Web Store checklist 仍有未完成项：
  - logo / icon 整理
  - 5 screenshots
  - promo video
  - single purpose statement
  - permission justifications
  - reviewer test account

结论：

- `P0 阻断`

### 3.4 生产运维验收未闭环

Launch Plan 明确要求：

- staging / prod secrets
- DB migrations
- error logging
- request IDs
- API rate limit
- backup / export policy
- smoke tests
- rollback checklist

当前状态：

- 有部署总结文档，但仍需要补齐生产 secrets 与真实配置
- 未看到 request ID、rate limit、rollback checklist 的明确实现
- 未看到覆盖 signup / scan / billing webhook 的 E2E smoke
- 现有 `qa:smoke` 更偏静态 public page / build artifact 检查

结论：

- `P0 阻断`

### 3.5 AppSumo redeem 流未建设

当前已有：

- 数据表 `appsumo_licenses`

当前缺口：

- 未看到 `/redeem` 页面
- 未看到 `/api/redeem/appsumo`
- 未看到 redeem 成功后 plan / credits 更新闭环

结论：

- 如果按 PRD / 架构文档口径上线，建议视为 `P0 阻断`
- 如果本次发布明确不做 AppSumo，可在范围文档里显式降级为后续版本

---

## 4. P1 可延期项

这些项目不一定阻断首发，但需要明确是“故意延期”，不能默认为已完成。

### 4.1 ICP 表单未达到 PRD 完整字段

PRD 字段：

- Service Type
- Target Industry
- Target Company Size
- Target Country
- Offer Description
- Tone
- Avoided Industries

当前 Web 端已暴露：

- Service Type
- Tone
- Target Industries
- Target Countries
- Offer Description
- First Prospect URL

当前缺：

- Target Company Size
- Avoided Industries

说明：

- 类型和数据库已预留相关字段，但 UI 未完整暴露

### 4.2 Deep scan 更像计费开关，不是完整多页面抓取

当前已有：

- `deepScan` UI 开关
- deep scan credits 计费逻辑

当前缺：

- 自动抓取同域 `about / contact / pricing / blog / careers`
- 使用队列执行深扫任务
- 深扫结果和基础 scan 的能力差异验证

说明：

- PRD 在不同章节对该项有轻微口径差异
- 若按 PRD 7.1 “MVP 必做”严格执行，它应算未完成
- 若按 Launch Plan 首轮商业上线口径，可降为 `P1`

### 4.3 Pricing / Blog / Chrome Extension 公共页形态未完全对齐 PRD

当前已有：

- 首页 pricing section
- guides / use cases / tools / integrations 内容页

当前缺口：

- 未看到独立 `/pricing` 页面
- 未看到独立 `/chrome-extension` 页面
- 未看到统一 `/blog` 索引页

说明：

- 这些内容部分被 SEO guides / product tools 替代
- 从“内容覆盖”看是部分满足
- 从“页面结构对齐 PRD”看仍属未完全建设

### 4.4 导出体系未升级到正式产品形态

当前已有：

- `/api/exports`
- CSV 实时导出
- Leads 页批量导出
- Prospect Card 导出字段选择

当前缺口：

- Export History 页面
- R2 持久化导出文件
- 导出记录追踪与下载回放

### 4.5 `/app` 仍保留 sample / demo fallback

当前状态：

- 已能接真实 workspace / leads / scans / analytics
- 仍保留 sample workspace / demo preview 降级路径

说明：

- 如果产品策略允许“未登录 demo 预览”，可保留
- 如果商业验收要求 `/app` 仅表现为真实产品后台，需要进一步收口

---

## 5. 已完成项

以下能力按当前代码状态可视为已完成或基本完成：

### 5.1 商业入口与注册登录

- Landing 已是商业 CTA，不再是 waitlist 语义
- `/signup` 商业 onboarding 已落地
- `/login` / forgot password / reset password 已落地
- Google OAuth 已有 redirect flow
- Email password auth 已落地

### 5.2 Workspace / Dashboard / Leads 主链路

- `/app`
- `/app/leads`
- `/app/settings/icp`
- `/app/billing`
- `/app/analytics`
- `/app/account`

并且已有：

- workspace plan / credits / saved leads / scan history
- leads 搜索、排序、筛选、批量导出
- Prospect Card 详情、copy、导出字段、pipeline context、activity log

### 5.3 Scan / Lead / Credits 基础产品能力

- `/api/scans`
- `/api/leads`
- `/api/credits`
- scan 前 credits 检查
- scan 成功后 credits 扣减
- lead 持久化
- CSV 导出

### 5.4 多语言与 SEO 内容体系

- 多语言公共页
- 用例页
- guides / templates / integrations 页面
- sitemap / robots / prerender / public route smoke
- `/app` 主要界面国际化已基本闭环

---

## 6. 验收标准

### 6.1 文档级验收标准

以 `COMMERCIAL_LAUNCH_PLAN.md` 为主：

- 官网 CTA 商业化
- `/signup` 可完成注册
- `/app` 展示真实 workspace / plan / credits / prospects
- API 数据模型完整
- scan 前检查 credits
- scan 后扣 credits 并记 ledger
- Free plan 20 scans / month
- Stripe Checkout / Webhook / Customer Portal
- extension 登录并调用真实 scan API
- CSV export
- Privacy / Terms / Security / Support
- Chrome Store listing / privacy disclosures / permission justifications
- staging / prod secrets / DB migrations / error logging / smoke tests

### 6.2 当前建议的“可通过验收”最低标准

建议以下全部通过后，再判定为上线可验收：

- 关闭所有 `P0 阻断项`
- 完成手工 smoke：
  - public pages
  - signup / login / reset password
  - `/app` scan -> save -> export
  - billing checkout / portal / webhook
  - analytics 事件上报
  - extension 登录 -> scan -> open dashboard
- 跑通构建：
  - `npm run build`
  - `npm run typecheck`
  - `apps/web` 构建后的 smoke

### 6.3 可以接受延期的范围

若要尽快首发，建议只把以下项列为可延期：

- ICP 表单补全 `targetCompanySize / avoidedIndustries`
- 独立 `/pricing` / `/blog` / `/chrome-extension` 页面形态优化
- Export History / R2 导出升级
- Deep scan 队列化

前提：

- 必须明确写进后续版本计划
- 不得影响首发用户的主链路体验

---

## 7. 推荐推进顺序

1. 先收掉 extension 商业流
2. 补齐 Stripe 生产配置并跑通 webhook 验收
3. 补 `/security`、`/chrome-extension`、Store assets
4. 补生产运维项与手工 smoke
5. 再决定 AppSumo redeem 是本次上线还是明确延期

---

## 8. 最终判断

当前状态适合描述为：

- `核心产品主线已成型`
- `可以继续做内部演示或灰度验证`
- `还不建议直接判定为商业上线验收通过`

如果只按“可 demo / 可访问 / 可扫描”标准，项目已经很接近完成。

如果按“商业上线 Definition of Done”标准，仍需关闭本清单中的 `P0 阻断项`。
