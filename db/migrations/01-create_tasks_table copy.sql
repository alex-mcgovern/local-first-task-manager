/* 
 * This is a simple migration to create a tasks table,
 * based on an example provided by the Electric documentation.
 * 
 * Note that Electric has supports a limited subset of Postgres features,
 * e.g. it does not support DEFAULT values, VARCHAR with length, etc.
 */

-- Create the new task_priority ENUM type
CREATE TYPE task_priority AS ENUM ('p0', 'p1', 'p2', 'p3');

CREATE TYPE task_status AS ENUM ('to_do', 'in_progress', 'completed');

-- Re-create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ,
  priority task_priority NOT NULL
);

-- "Electrify" the tasks table (enables local SQLite)
ALTER TABLE tasks ENABLE ELECTRIC;