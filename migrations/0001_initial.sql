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
