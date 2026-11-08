alter table perfume_ingredients
  add column if not exists detail_attempts integer not null default 0,
  add column if not exists detail_retry_at timestamptz;

update perfume_ingredients
set detail_attempts = 1
where detail_status = 'failed' and detail_attempts = 0;

create index if not exists perfume_ingredients_detail_retry_idx
  on perfume_ingredients (detail_status, detail_retry_at, letter, path);
