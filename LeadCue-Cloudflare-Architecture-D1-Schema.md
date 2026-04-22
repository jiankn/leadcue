# LeadCue Cloudflare Architecture & D1 Schema

版本：v1.0  
项目：LeadCue  
域名：LeadCue.app  
技术方向：Cloudflare-first MVP  

---

## 1. 架构结论

LeadCue 第一版建议使用：

> Hono + React/Vite + Cloudflare Workers + D1 + R2 + KV + Queues + AI Gateway + Google OAuth

目标：

- 成本低
- 运维轻
- 适合 Chrome 插件 API
- 适合 AppSumo 早期用户
- 方便用 Cloudflare 全球边缘网络服务海外用户

不建议 MVP 使用 Supabase / Vercel / Firebase 作为主架构。

---

## 2. Monorepo 结构

```text
leadcue/
  apps/
    web/                 # 官网 + Dashboard，React/Vite
    api/                 # Cloudflare Workers API，Hono
    extension/           # Chrome Extension MV3 + Side Panel
  packages/
    shared/              # shared types, schemas, constants
    prompts/             # AI prompt templates
  migrations/
    0001_initial.sql
  docs/
    prd.md
```

也可以 MVP 阶段合并 `web` 和 `api`，用一个 Worker 同时托管静态资源和 API。

---

## 3. Cloudflare 产品分工

| 模块 | Cloudflare 产品 | 用途 |
|---|---|---|
| 官网与 Dashboard | Workers Static Assets 或 Pages | Landing page、SEO 页面、Dashboard |
| API | Workers + Hono | 插件接口、OAuth、billing webhook、lead API |
| 数据库 | D1 | 用户、工作区、leads、scans、credits、licenses |
| 文件存储 | R2 | CSV 导出、报告快照、可选截图、AI 原始响应归档 |
| 缓存 | KV | feature flags、pricing config、rate limit config、短缓存 |
| 异步任务 | Queues | deep scan、AI retry、bulk scan、export job |
| AI 代理 | AI Gateway | AI 调用日志、缓存、限流、成本观察 |
| 防刷 | Turnstile | waitlist、免费工具、注册保护 |
| 限流/并发 | Durable Objects，可后置 | workspace-level rate limit、bulk job state |

---

## 4. 核心数据流

### 4.1 Website Scan

```text
Chrome Extension
  -> collect current page HTML/text/links/meta
  -> POST /api/scans
  -> Workers validates session and credits
  -> D1 creates scan
  -> Worker extracts emails/social/contact links
  -> Worker calls AI via AI Gateway
  -> D1 creates/updates lead
  -> D1 creates credit transaction
  -> API returns Prospect Card
```

### 4.2 Deep Scan

```text
Chrome Extension
  -> POST /api/scans/deep
  -> D1 creates scan with pending status
  -> Queue message created
  -> Queue consumer fetches about/contact/pricing/blog/careers pages
  -> AI analysis
  -> D1 updates lead and scan
  -> optional R2 saves raw snapshot
```

### 4.3 CSV Export

```text
Dashboard
  -> POST /api/exports
  -> Queue creates export job
  -> Worker reads selected leads
  -> CSV saved to R2
  -> D1 stores export record
  -> User downloads signed URL
```

---

## 5. API 路由设计

### 5.1 Public

| Method | Route | 用途 |
|---|---|---|
| GET | `/` | 官网首页 |
| GET | `/pricing` | 定价页 |
| GET | `/chrome-extension` | 插件页 |
| GET | `/tools/cold-email-first-line-generator` | 免费工具 |
| GET | `/tools/website-lead-extractor` | 免费工具 |
| GET | `/sitemap.xml` | sitemap |
| GET | `/robots.txt` | robots |

### 5.2 Auth

| Method | Route | 用途 |
|---|---|---|
| GET | `/auth/google/start` | 启动 Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| POST | `/auth/logout` | 退出登录 |
| GET | `/api/me` | 当前用户 |
| GET | `/auth/extension-success` | 插件登录成功页 |

### 5.3 App

| Method | Route | 用途 |
|---|---|---|
| GET | `/app` | Dashboard |
| GET | `/app/leads` | Leads list |
| GET | `/app/leads/:id` | Lead detail |
| GET | `/app/settings/icp` | ICP settings |
| GET | `/app/billing` | Billing |
| GET | `/app/redeem` | AppSumo redeem |

### 5.4 API

| Method | Route | 用途 |
|---|---|---|
| POST | `/api/scans` | 创建 basic scan |
| POST | `/api/scans/deep` | 创建 deep scan |
| GET | `/api/scans/:id` | 获取 scan 状态 |
| GET | `/api/leads` | lead 列表 |
| GET | `/api/leads/:id` | lead 详情 |
| PATCH | `/api/leads/:id` | 更新 lead |
| DELETE | `/api/leads/:id` | 删除 lead |
| POST | `/api/leads/:id/copy-event` | 记录 copy opener 事件 |
| POST | `/api/exports` | 创建 CSV export |
| GET | `/api/exports/:id` | 获取 export |
| GET | `/api/icp-profile` | 获取 ICP |
| PUT | `/api/icp-profile` | 更新 ICP |
| GET | `/api/credits` | credits 使用情况 |
| POST | `/api/redeem/appsumo` | 兑换 AppSumo license |
| POST | `/api/billing/webhook` | 支付 webhook |

---

## 6. D1 Schema

以下 SQL 可作为 `migrations/0001_initial.sql` 初版。

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  google_sub TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'google',
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX idx_auth_sessions_expires_at ON auth_sessions(expires_at);

CREATE TABLE oauth_states (
  id TEXT PRIMARY KEY,
  state TEXT NOT NULL UNIQUE,
  code_verifier_hash TEXT NOT NULL,
  redirect_uri TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_oauth_states_expires_at ON oauth_states(expires_at);

CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  monthly_credit_limit INTEGER NOT NULL DEFAULT 20,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_workspaces_owner_user_id ON workspaces(owner_user_id);

CREATE TABLE workspace_members (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);

CREATE TABLE icp_profiles (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL UNIQUE,
  service_type TEXT NOT NULL DEFAULT 'web_design',
  target_industries TEXT,
  target_countries TEXT,
  target_company_size TEXT,
  offer_description TEXT,
  tone TEXT NOT NULL DEFAULT 'professional',
  avoided_industries TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  company_name TEXT,
  domain TEXT NOT NULL,
  website_url TEXT NOT NULL,
  industry TEXT,
  summary TEXT,
  fit_score INTEGER,
  fit_reason TEXT,
  contact_points_json TEXT,
  opportunity_signals_json TEXT,
  outreach_angles_json TEXT,
  first_lines_json TEXT,
  short_email TEXT,
  source_notes_json TEXT,
  confidence_score REAL,
  status TEXT NOT NULL DEFAULT 'saved',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_leads_workspace_id ON leads(workspace_id);
CREATE INDEX idx_leads_domain ON leads(domain);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_fit_score ON leads(fit_score);
CREATE UNIQUE INDEX idx_leads_workspace_domain ON leads(workspace_id, domain);

CREATE TABLE scans (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  lead_id TEXT,
  url TEXT NOT NULL,
  scan_type TEXT NOT NULL DEFAULT 'basic',
  status TEXT NOT NULL DEFAULT 'pending',
  credits_used INTEGER NOT NULL DEFAULT 0,
  raw_extracted_text_hash TEXT,
  r2_snapshot_key TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX idx_scans_workspace_id ON scans(workspace_id);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_scans_created_at ON scans(created_at);

CREATE TABLE credit_transactions (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT,
  scan_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE SET NULL
);

CREATE INDEX idx_credit_transactions_workspace_id ON credit_transactions(workspace_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at);

CREATE TABLE appsumo_licenses (
  id TEXT PRIMARY KEY,
  license_key_hash TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL,
  redeemed_by_workspace_id TEXT,
  status TEXT NOT NULL DEFAULT 'unredeemed',
  redeemed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (redeemed_by_workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL
);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TEXT,
  current_period_end TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_subscriptions_workspace_id ON subscriptions(workspace_id);
CREATE INDEX idx_subscriptions_provider_subscription_id ON subscriptions(provider_subscription_id);

CREATE TABLE exports (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  r2_key TEXT,
  lead_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_exports_workspace_id ON exports(workspace_id);

CREATE TABLE waitlist_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  agency_type TEXT,
  website_url TEXT,
  source TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usage_events (
  id TEXT PRIMARY KEY,
  workspace_id TEXT,
  user_id TEXT,
  event_name TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_usage_events_workspace_id ON usage_events(workspace_id);
CREATE INDEX idx_usage_events_event_name ON usage_events(event_name);
CREATE INDEX idx_usage_events_created_at ON usage_events(created_at);
```

---

## 7. Credits 设计

### 7.1 Plan Limits

| Plan | Monthly Credits |
|---|---:|
| Free | 20 |
| Starter | 300 |
| Pro | 1,500 |
| Agency | 5,000 |
| AppSumo Tier 1 | 500 |
| AppSumo Tier 2 | 2,000 |
| AppSumo Tier 3 | 5,000 |

### 7.2 消耗规则

| Action | Credits |
|---|---:|
| Basic website scan | 1 |
| Deep website scan | 3 |
| Regenerate first lines | 1 |
| CSV export | 0 |
| Save lead | 0 |

### 7.3 月度重置

MVP 简化方案：

- `credit_transactions` 记录每次扣减
- 每次请求时按当月 `created_at` 汇总使用量
- 用户量变大后再做 monthly usage summary 表

后续优化表：

```sql
CREATE TABLE monthly_credit_usage (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  month TEXT NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT,
  UNIQUE(workspace_id, month)
);
```

---

## 8. Google OAuth 实现要点

### 8.1 Required Environment Variables

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://leadcue.app/auth/google/callback
SESSION_SECRET=
APP_URL=https://leadcue.app
```

注意：实际域名应统一小写为 `https://leadcue.app`。

### 8.2 Cookie

建议：

```text
Set-Cookie: leadcue_session=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000
```

规则：

- session token 明文只存在 cookie
- D1 保存 token hash
- session 过期时间建议 30 天
- logout 删除 session 行并清 cookie

### 8.3 Chrome Extension 登录

推荐方案：

1. 插件打开 `https://leadcue.app/auth/google/start?source=extension`
2. 用户完成 Google OAuth
3. 登录成功后显示 `/auth/extension-success`
4. 插件调用 `/api/me` 检查登录状态
5. 如果无法共享 cookie，则后续增加短期 extension token

---

## 9. R2 存储结构

建议 bucket：

```text
leadcue-production
```

Key 设计：

```text
snapshots/{workspace_id}/{scan_id}.json
exports/{workspace_id}/{export_id}.csv
reports/{workspace_id}/{lead_id}.json
screenshots/{workspace_id}/{scan_id}.png
```

MVP 建议只启用：

- exports
- optional snapshots

先不做 screenshots。

---

## 10. KV 设计

KV 不做主数据库，只存轻配置。

Namespace：

```text
LEADCUE_CONFIG
```

Keys：

```text
pricing:v1
feature_flags:v1
rate_limits:v1
app_config:v1
```

注意：

- KV 免费写入额度较低
- 不要把 leads、scans、sessions 放 KV

---

## 11. Queues 设计

Queues 用于不适合同步完成的任务。

Queue:

```text
leadcue-jobs
```

Message 类型：

```json
{
  "type": "deep_scan",
  "scanId": "scan_xxx",
  "workspaceId": "ws_xxx"
}
```

```json
{
  "type": "csv_export",
  "exportId": "export_xxx",
  "workspaceId": "ws_xxx"
}
```

---

## 12. AI Gateway

AI 调用统一经过 AI Gateway。

用途：

- 观察每个 workspace 的 AI 消耗
- 缓存相同请求，降低成本
- 做 rate limit
- 调试 prompt 质量

建议 metadata：

```json
{
  "workspace_id": "ws_xxx",
  "scan_id": "scan_xxx",
  "feature": "prospect_card",
  "plan": "starter"
}
```

---

## 13. Prompt 输入结构

```json
{
  "icp": {
    "serviceType": "web_design",
    "offer": "We help B2B SaaS companies improve website conversion",
    "targetIndustries": ["B2B SaaS"],
    "tone": "professional"
  },
  "website": {
    "url": "https://example.com",
    "title": "...",
    "metaDescription": "...",
    "homepageText": "...",
    "links": ["..."],
    "contactPoints": ["..."],
    "pages": [
      {
        "url": "https://example.com/blog",
        "type": "blog",
        "text": "..."
      }
    ]
  }
}
```

Output schema:

```json
{
  "companyName": "string",
  "industry": "string | unknown",
  "summary": "string",
  "fitScore": 0,
  "fitReason": "string",
  "opportunitySignals": [
    {
      "signal": "string",
      "reason": "string",
      "source": "homepage"
    }
  ],
  "outreachAngles": ["string"],
  "firstLines": ["string"],
  "shortEmail": "string",
  "confidenceScore": 0.8
}
```

---

## 14. Wrangler Bindings 示例

`wrangler.toml` 示例：

```toml
name = "leadcue"
main = "src/index.ts"
compatibility_date = "2026-04-19"

[[d1_databases]]
binding = "DB"
database_name = "leadcue"
database_id = "replace-with-database-id"

[[r2_buckets]]
binding = "R2"
bucket_name = "leadcue-production"

[[kv_namespaces]]
binding = "CONFIG"
id = "replace-with-kv-id"

[[queues.producers]]
binding = "JOBS"
queue = "leadcue-jobs"

[[queues.consumers]]
queue = "leadcue-jobs"

[vars]
APP_URL = "https://leadcue.app"
```

Secrets:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
SESSION_SECRET
AI_PROVIDER_API_KEY
STRIPE_WEBHOOK_SECRET
```

---

## 15. MVP 开发顺序

1. D1 schema + migrations
2. Google OAuth
3. Workspace auto-create
4. ICP settings
5. Chrome extension basic page extraction
6. POST `/api/scans`
7. AI Prospect Card generation
8. Lead save/list/detail
9. Credits
10. CSV export
11. Landing page + waitlist
12. Chrome Web Store draft

---

## 16. 技术风险

### 16.1 D1 容量

D1 免费版适合 MVP，但不要存大量原始网页文本。大文本放 R2。

### 16.2 Worker 请求时间

Basic scan 可以同步返回。Deep scan 建议走 Queue。

### 16.3 Chrome 权限审核

插件权限尽量少：

- activeTab
- scripting
- storage
- sidePanel

避免一开始申请 `<all_urls>` 后台静默权限。

### 16.4 OAuth in Extension

如果 cookie 共享不稳定，增加 one-time extension token：

```text
Web creates one-time token after OAuth
Extension reads token from success page URL hash
Extension exchanges token for API session
```

---

## 17. 结论

Cloudflare-first 架构足够支撑 LeadCue MVP。

优先级：

1. Workers + D1 跑通登录和 lead 保存
2. Chrome 插件跑通网站分析
3. R2 用于导出和快照
4. Queues 用于 deep scan
5. AI Gateway 用于成本观察

不要过度工程化。

第一目标是验证：

> 用户是否愿意保存 Prospect Card，并复制 opener 去做 outbound。
