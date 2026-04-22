PRAGMA foreign_keys = ON;

ALTER TABLE oauth_states ADD COLUMN code_verifier TEXT;
ALTER TABLE oauth_states ADD COLUMN metadata_json TEXT;
