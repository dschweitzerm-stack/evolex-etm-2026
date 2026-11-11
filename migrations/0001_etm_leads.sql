CREATE TABLE IF NOT EXISTS etm_leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  challenge TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  consent_version TEXT NOT NULL,
  source TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_etm_leads_created ON etm_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_etm_leads_challenge ON etm_leads(challenge);
