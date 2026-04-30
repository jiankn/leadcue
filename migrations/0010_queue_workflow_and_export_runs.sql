CREATE TABLE queue_items (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  lead_id TEXT,
  last_scan_id TEXT,
  domain TEXT NOT NULL,
  website_url TEXT NOT NULL,
  company_name TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  note TEXT,
  research_status TEXT NOT NULL DEFAULT 'queued',
  handoff_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (last_scan_id) REFERENCES scans(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_queue_items_workspace_domain ON queue_items(workspace_id, domain);
CREATE INDEX idx_queue_items_workspace_research_status ON queue_items(workspace_id, research_status);
CREATE INDEX idx_queue_items_workspace_handoff_status ON queue_items(workspace_id, handoff_status);
CREATE INDEX idx_queue_items_lead_id ON queue_items(lead_id);
CREATE INDEX idx_queue_items_created_at ON queue_items(created_at);

INSERT INTO queue_items (
  id,
  workspace_id,
  lead_id,
  last_scan_id,
  domain,
  website_url,
  company_name,
  source,
  note,
  research_status,
  handoff_status,
  created_at,
  updated_at
)
SELECT
  'queue_' || lower(hex(randomblob(16))),
  leads.workspace_id,
  leads.id,
  (
    SELECT scans.id
    FROM scans
    WHERE scans.workspace_id = leads.workspace_id
      AND scans.lead_id = leads.id
    ORDER BY COALESCE(scans.completed_at, scans.created_at) DESC
    LIMIT 1
  ) AS last_scan_id,
  leads.domain,
  leads.website_url,
  leads.company_name,
  'workspace',
  COALESCE(leads.pipeline_notes, ''),
  CASE
    WHEN leads.pipeline_stage = 'archived' THEN 'archived'
    WHEN leads.pipeline_stage IN ('qualified', 'outreach_queued', 'contacted', 'won') THEN 'qualified'
    ELSE 'reviewing'
  END,
  CASE
    WHEN leads.pipeline_stage = 'outreach_queued' THEN 'outreach_queued'
    WHEN leads.pipeline_stage = 'contacted' THEN 'contacted'
    WHEN leads.pipeline_stage = 'won' THEN 'won'
    ELSE 'pending'
  END,
  leads.created_at,
  leads.updated_at
FROM leads;

ALTER TABLE exports ADD COLUMN preset TEXT NOT NULL DEFAULT 'crm';
ALTER TABLE exports ADD COLUMN crm_mode TEXT NOT NULL DEFAULT 'hubspot';
ALTER TABLE exports ADD COLUMN export_scope TEXT NOT NULL DEFAULT 'all_qualified';
ALTER TABLE exports ADD COLUMN lead_ids_json TEXT;
ALTER TABLE exports ADD COLUMN created_by_user_id TEXT;
ALTER TABLE exports ADD COLUMN file_name TEXT;
ALTER TABLE exports ADD COLUMN updated_at TEXT;

CREATE INDEX idx_exports_workspace_status ON exports(workspace_id, status);
CREATE INDEX idx_exports_created_at ON exports(created_at);
