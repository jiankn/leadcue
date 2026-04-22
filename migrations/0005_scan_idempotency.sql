CREATE TABLE scan_idempotency_keys (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  status_code INTEGER,
  response_json TEXT,
  scan_id TEXT,
  lead_id TEXT,
  credits_charged INTEGER NOT NULL DEFAULT 0,
  error_reason TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  UNIQUE(workspace_id, idempotency_key)
);

CREATE INDEX idx_scan_idempotency_workspace_id ON scan_idempotency_keys(workspace_id);
CREATE INDEX idx_scan_idempotency_created_at ON scan_idempotency_keys(created_at);
