# Cloudflare环境变量设置指南

在部署之前，你需要设置以下环境变量（secrets）。请在命令行中运行以下命令：

## 必需的环境变量

```bash
# 1. Session密钥（生成一个32字符以上的随机字符串）
npx wrangler secret put SESSION_SECRET --env production

# 2. Google OAuth配置
npx wrangler secret put GOOGLE_CLIENT_ID --env production
npx wrangler secret put GOOGLE_CLIENT_SECRET --env production

# 3. Stripe配置
npx wrangler secret put STRIPE_SECRET_KEY --env production
npx wrangler secret put STRIPE_WEBHOOK_SECRET --env production

# 4. 邮件服务（SMTP）
npx wrangler secret put SMTP_HOST --env production
npx wrangler secret put SMTP_PORT --env production
npx wrangler secret put SMTP_USERNAME --env production
npx wrangler secret put SMTP_PASSWORD --env production

# 5. DeepSeek API Key（如果使用AI功能）
npx wrangler secret put DEEPSEEK_API_KEY --env production
```

## 可选的环境变量

这些可以在wrangler.toml的[vars]部分配置，或者作为secrets：

```bash
# CORS来源（多个域名用逗号分隔）
npx wrangler secret put CORS_ORIGINS --env production

# 支持邮箱
npx wrangler secret put SUPPORT_EMAIL --env production

# 发件人邮箱会自动使用 APP_URL 的域名后缀，例如 noreply@leadcue.app
```

## 注意事项

1. **SESSION_SECRET**: 必须是强随机字符串，可以使用以下命令生成：
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Google OAuth**: 需要在Google Cloud Console创建OAuth客户端
   - 回调URL格式: `https://your-api-domain.workers.dev/api/auth/google/callback`

3. **Stripe**: 使用生产环境的密钥（以`sk_live_`开头）

4. **SMTP**: 当前密码重置邮件通过 SMTP 发送，默认配置为 `mail.removexif.com:25`，用户名为 `removexif/jkn-mail-server`，密码必须通过 `SMTP_PASSWORD` secret 设置。发件人自动从 `APP_URL` 推导为 `noreply@[当前项目的域名]`。

5. **CORS_ORIGINS**: 应该包含你的前端域名，例如：
   ```
   https://leadcue.app,https://www.leadcue.app
   ```

## 验证设置

设置完成后，可以使用以下命令查看已设置的secrets：

```bash
npx wrangler secret list --env production
```
