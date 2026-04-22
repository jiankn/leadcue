PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS signup_intents (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  workspace_id TEXT,
  email TEXT NOT NULL,
  plan_id TEXT NOT NULL DEFAULT 'free',
  agency_focus TEXT,
  agency_website TEXT,
  offer_description TEXT NOT NULL,
  target_industries TEXT,
  first_prospect_url TEXT,
  source TEXT NOT NULL DEFAULT 'commercial_signup',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_signup_intents_email ON signup_intents(email);
CREATE INDEX IF NOT EXISTS idx_signup_intents_workspace_id ON signup_intents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_signup_intents_plan_id ON signup_intents(plan_id);
CREATE INDEX IF NOT EXISTS idx_signup_intents_status ON signup_intents(status);
CREATE INDEX IF NOT EXISTS idx_signup_intents_created_at ON signup_intents(created_at);

CREATE TABLE IF NOT EXISTS billing_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  workspace_id TEXT,
  payload_json TEXT,
  processed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_billing_events_workspace_id ON billing_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_event_type ON billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_events_created_at ON billing_events(created_at);
