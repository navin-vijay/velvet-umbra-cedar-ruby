create table if not exists perfume_ingredients (
  path text primary key check (path like '/data/%.html'),
  name text not null,
  prefix text not null default '',
  url text not null,
  cas text not null default '',
  uses text not null default '',
  kind text not null default '',
  letter text not null check (letter in ('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'jk', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'wx', 'y', 'z')),
  title text,
  synonym text,
  category text,
  detail_sections jsonb,
  detail_status text not null default 'pending' check (detail_status in ('pending', 'complete', 'failed')),
  detail_error text,
  listing_extracted_at timestamptz not null default now(),
  detail_extracted_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists perfume_ingredients_letter_path_idx
  on perfume_ingredients (letter, path);
create index if not exists perfume_ingredients_detail_status_idx
  on perfume_ingredients (detail_status);

create table if not exists perfume_listing_pages (
  letter text primary key check (letter in ('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'jk', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'wx', 'y', 'z')),
  source_url text not null,
  page_links jsonb not null default '[]'::jsonb,
  extracted_at timestamptz not null default now()
);
