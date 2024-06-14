/* 
 * This is a simple migration to create a tasks table,
 * based on an example provided by the Electric documentation.
 * 
 * Note that Electric has supports a limited subset of Postgres features,
 * e.g. it does not support DEFAULT values, VARCHAR with length, etc.
 */

CREATE TYPE task_status AS ENUM ('to_do', 'in_progress', 'completed');

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- "Electrify" the tasks table (enables local SQLite)
ALTER TABLE tasks ENABLE ELECTRIC;
