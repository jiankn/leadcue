ALTER TABLE leads ADD COLUMN owner TEXT;
ALTER TABLE leads ADD COLUMN pipeline_stage TEXT NOT NULL DEFAULT 'researching';
ALTER TABLE leads ADD COLUMN pipeline_notes TEXT;
ALTER TABLE leads ADD COLUMN pipeline_updated_at TEXT;
