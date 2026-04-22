ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN password_salt TEXT;
ALTER TABLE users ADD COLUMN password_iterations INTEGER;
ALTER TABLE users ADD COLUMN password_updated_at TEXT;

CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
