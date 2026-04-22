PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS lead_activity_logs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  lead_id TEXT NOT NULL,
  actor_user_id TEXT,
  actor_name TEXT,
  actor_email TEXT,
  action TEXT NOT NULL,
  changed_fields_json TEXT NOT NULL,
  previous_values_json TEXT NOT NULL,
  current_values_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_activity_logs_workspace_id ON lead_activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_lead_activity_logs_lead_id ON lead_activity_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activity_logs_created_at ON lead_activity_logs(created_at);
