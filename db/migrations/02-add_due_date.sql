ALTER TABLE tasks ADD COLUMN due_date TIMESTAMPTZ;

-- "Electrify" the tasks table (enables local SQLite)
ALTER TABLE tasks ENABLE ELECTRIC;
