export interface Env {
  DB?: D1Database;
  R2?: R2Bucket;
  CONFIG?: KVNamespace;
  JOBS?: Queue;
  APP_URL?: string;
  AI_GATEWAY_URL?: string;
  AI_PROVIDER_API_KEY?: string;
  DEEPSEEK_API_KEY?: string;
  AI_MODEL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
  SESSION_SECRET?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  SUPPORT_EMAIL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_STARTER?: string;
  STRIPE_PRICE_PRO?: string;
  STRIPE_PRICE_AGENCY?: string;
  STRIPE_PORTAL_RETURN_URL?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  LEADCUE_TEST_MODE?: string;
}
