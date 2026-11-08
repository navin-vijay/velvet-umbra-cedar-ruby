create table if not exists perfume_excel_checkpoint (
  id smallint primary key default 1 check (id = 1),
  completed_count integer not null default 0,
  workbook_base64 text,
  updated_at timestamptz not null default now(),
  last_error text
);
