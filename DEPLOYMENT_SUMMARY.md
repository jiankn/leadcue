# LeadCue Cloudflare 部署总结

## 🎉 部署成功！

你的LeadCue应用已成功部署到Cloudflare平台。

### 部署的服务

#### 1. API (Cloudflare Workers)
- **URL**: https://leadcue-api.jiankn.workers.dev
- **状态**: ✅ 已部署
- **版本ID**: f9f9372a-2327-4afe-8ef5-ed556c2911dc

#### 2. Web应用 (Cloudflare Pages)
- **URL**: https://0ef9e26c.leadcue.pages.dev
- **生产分支**: master
- **状态**: ✅ 已部署

### 已创建的Cloudflare资源

#### D1数据库
- **名称**: leadcue
- **ID**: f00f46dc-d82d-4938-8598-bd3566e0cd85
- **区域**: WNAM
- **迁移状态**: ✅ 已应用8个迁移文件

#### KV命名空间
- **绑定名**: CONFIG
- **ID**: af3aca1e970f499b82d637ff711e2a32

#### R2存储桶
- **名称**: leadcue-production
- **存储类**: Standard

#### 队列
- **名称**: leadcue-jobs
- **状态**: 生产者已配置（消费者待实现）

## 下一步操作

### 1. 配置环境变量（必需）

在部署API之前，你需要设置以下环境变量。在`apps/api`目录下运行：

```bash
# 进入API目录
cd apps/api

# 设置Session密钥（生成随机字符串）
npx wrangler secret put SESSION_SECRET

# 设置Google OAuth
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET

# 设置Stripe
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET

# 设置邮件服务
npx wrangler secret put RESEND_API_KEY

# 设置DeepSeek（如果使用AI功能）
npx wrangler secret put DEEPSEEK_API_KEY
```

详细的环境变量配置说明请参考 `setup-secrets.md` 文件。

### 2. 更新wrangler.toml配置

编辑 `apps/api/wrangler.toml`，更新以下变量：

```toml
[vars]
APP_URL = "https://0ef9e26c.leadcue.pages.dev"  # 你的Pages URL
GOOGLE_REDIRECT_URI = "https://leadcue-api.jiankn.workers.dev/api/auth/google/callback"
STRIPE_PORTAL_RETURN_URL = "https://0ef9e26c.leadcue.pages.dev/app/billing"
```

### 3. 配置自定义域名（推荐）

#### 为Pages配置域名：
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Workers & Pages > leadcue
3. 点击 "Custom domains"
4. 添加你的域名（例如：leadcue.app）

#### 为Workers配置域名：
1. 进入 Workers & Pages > leadcue-api
2. 点击 "Settings" > "Triggers"
3. 添加自定义域名（例如：api.leadcue.app）

### 4. 更新Web应用的API地址

创建 `apps/web/.env.production` 文件：

```env
VITE_API_URL=https://leadcue-api.jiankn.workers.dev
```

然后重新构建和部署Web应用：

```bash
cd apps/web
npm run build
npx wrangler pages deploy dist --project-name=leadcue
```

### 5. 配置Google OAuth回调

在Google Cloud Console中：
1. 进入你的OAuth客户端配置
2. 添加授权重定向URI：
   ```
   https://leadcue-api.jiankn.workers.dev/api/auth/google/callback
   ```

### 6. 配置Stripe Webhook

在Stripe Dashboard中：
1. 进入 Developers > Webhooks
2. 添加端点：
   ```
   https://leadcue-api.jiankn.workers.dev/api/stripe/webhook
   ```
3. 选择要监听的事件
4. 复制Webhook签名密钥并设置为环境变量

## 测试部署

### 测试API健康检查：
```bash
curl https://leadcue-api.jiankn.workers.dev/api/health
```

### 测试Web应用：
在浏览器中访问：https://0ef9e26c.leadcue.pages.dev

## 监控和日志

### 查看Worker日志：
```bash
cd apps/api
npx wrangler tail
```

### 查看Pages部署日志：
访问 Cloudflare Dashboard > Workers & Pages > leadcue > Deployments

## 重新部署

### 部署API更新：
```bash
cd apps/api
npm run deploy
```

### 部署Web更新：
```bash
cd apps/web
npm run build
npx wrangler pages deploy dist --project-name=leadcue
```

## 成本估算

Cloudflare提供慷慨的免费额度：
- **Workers**: 100,000 请求/天
- **Pages**: 无限请求
- **D1**: 5GB存储，500万行读取/天
- **R2**: 10GB存储，100万次读取/月
- **KV**: 100,000次读取/天

对于大多数初创项目，免费额度已经足够使用。

## 故障排除

### 如果API返回错误：
1. 检查环境变量是否正确设置
2. 查看Worker日志：`npx wrangler tail`
3. 确认D1数据库迁移已应用

### 如果Web应用无法连接API：
1. 检查CORS配置
2. 确认API URL配置正确
3. 检查浏览器控制台错误

## 相关文档

- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
- [D1数据库文档](https://developers.cloudflare.com/d1/)
- [Wrangler CLI文档](https://developers.cloudflare.com/workers/wrangler/)

## 支持

如有问题，请查看：
- 项目README.md
- env.sample文件
- setup-secrets.md文件
