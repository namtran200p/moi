-- ============================================================
-- PORTFOLIO MANAGER SPA v3.1
-- Asset-Only Ledger
-- Shared Workspace
-- Supabase PostgreSQL
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

do $$
begin
  create type asset_category as enum (
    'DCDS',
    'ETF',
    'Stock',
    'Crypto',
    'Bank'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type stock_account as enum (
    'VPS',
    'SSI'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type transaction_type as enum (
    'BUY',
    'SELL',
    'CASH_DIVIDEND',
    'STOCK_DIVIDEND',
    'DEPOSIT',
    'WITHDRAWAL',
    'BANK_DEPOSIT',
    'BANK_CLOSE'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type tplus_lot_status as enum (
    'OPEN',
    'PARTIAL_COMPLETED',
    'COMPLETED'
  );
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- WORKSPACE
-- ============================================================

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),

  name text not null default 'Portfolio Workspace',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================

create table if not exists workspace_members (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references workspaces(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  unique(workspace_id, user_id)
);

create index if not exists idx_workspace_members_user
  on workspace_members(user_id);

create index if not exists idx_workspace_members_workspace
  on workspace_members(workspace_id);

-- ============================================================
-- HELPER FUNCTION
-- ============================================================

create or replace function public.is_workspace_member(
  target_workspace_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;

-- ============================================================
-- PORTFOLIO ASSETS
-- ============================================================

create table if not exists portfolio_assets (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references workspaces(id)
    on delete cascade,

  category asset_category not null,

  code text not null,

  name text,

  account stock_account,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint portfolio_assets_code_not_empty
    check (length(trim(code)) > 0)
);

create index if not exists idx_portfolio_assets_workspace
  on portfolio_assets(workspace_id);

create index if not exists idx_portfolio_assets_category
  on portfolio_assets(workspace_id, category);

create unique index if not exists uq_portfolio_asset_identity
  on portfolio_assets(
    workspace_id,
    category,
    code,
    coalesce(account::text, '')
  );

-- ============================================================
-- PORTFOLIO TRANSACTIONS
-- ============================================================

create table if not exists portfolio_transactions (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references workspaces(id)
    on delete cascade,

  asset_id uuid
    references portfolio_assets(id)
    on delete set null,

  transaction_type transaction_type not null,

  transaction_date date not null,

  category asset_category,

  code text,

  account stock_account,

  quantity numeric(30,10),

  price numeric(30,10),

  price_usd numeric(30,10),

  purchase_amount numeric(30,10),

  ccq_price numeric(30,10),

  ccq_quantity numeric(30,10),

  bank_name text,

  principal_vnd numeric(30,4),

  interest_rate_percent numeric(12,6),

  term_months integer,

  start_date date,

  maturity_date date,

  auto_rollover boolean,

  actual_received_interest numeric(30,4),

  currency text,

  original_amount numeric(30,10),

  amount_vnd numeric(30,4),

  locked_vnd_rate numeric(30,10),

  fee_rate numeric(12,6) not null default 0,

  tax_rate numeric(12,6) not null default 0,

  is_trade_tplus boolean not null default false,

  tplus_lot_id uuid,

  note text,

  deleted_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint transaction_fee_nonnegative
    check (fee_rate >= 0),

  constraint transaction_tax_nonnegative
    check (tax_rate >= 0),

  constraint transaction_quantity_positive
    check (
      quantity is null
      or quantity > 0
    ),

  constraint transaction_price_positive
    check (
      price is null
      or price > 0
    ),

  constraint transaction_price_usd_positive
    check (
      price_usd is null
      or price_usd > 0
    )
);

create index if not exists idx_transactions_workspace
  on portfolio_transactions(workspace_id);

create index if not exists idx_transactions_date
  on portfolio_transactions(
    workspace_id,
    transaction_date,
    created_at
  );

create index if not exists idx_transactions_asset
  on portfolio_transactions(asset_id);

create index if not exists idx_transactions_tplus
  on portfolio_transactions(
    workspace_id,
    tplus_lot_id
  );

create index if not exists idx_transactions_active
  on portfolio_transactions(workspace_id)
  where deleted_at is null;

-- ============================================================
-- T+ LOTS
-- ============================================================

create table if not exists tplus_lots (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references workspaces(id)
    on delete cascade,

  asset_id uuid
    references portfolio_assets(id)
    on delete cascade,

  code text not null,

  category asset_category not null,

  account stock_account,

  buy_transaction_id uuid
    references portfolio_transactions(id)
    on delete set null,

  buy_date date not null,

  buy_quantity numeric(30,10) not null,

  buy_price numeric(30,10) not null,

  open_quantity numeric(30,10) not null,

  sell_quantity numeric(30,10) not null default 0,

  sell_price numeric(30,10),

  fees numeric(30,4) not null default 0,

  tax numeric(30,4) not null default 0,

  gross_profit numeric(30,4) not null default 0,

  net_profit numeric(30,4) not null default 0,

  status tplus_lot_status not null default 'OPEN',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint tplus_buy_quantity_positive
    check (buy_quantity > 0),

  constraint tplus_open_quantity_nonnegative
    check (open_quantity >= 0),

  constraint tplus_sell_quantity_nonnegative
    check (sell_quantity >= 0),

  constraint tplus_sell_not_exceed_buy
    check (sell_quantity <= buy_quantity)
);

create index if not exists idx_tplus_lots_workspace
  on tplus_lots(workspace_id);

create index if not exists idx_tplus_lots_asset
  on tplus_lots(asset_id);

create index if not exists idx_tplus_lots_open
  on tplus_lots(workspace_id, code, account)
  where status <> 'COMPLETED';

-- ============================================================
-- BANK DEPOSITS
-- ============================================================

create table if not exists bank_deposits (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references workspaces(id)
    on delete cascade,

  bank_name text not null,

  principal_vnd numeric(30,4) not null,

  interest_rate_percent numeric(12,6) not null,

  term_months integer not null,

  start_date date not null,

  maturity_date date not null,

  auto_rollover boolean not null default false,

  renewal_count integer not null default 0,

  active boolean not null default true,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint bank_principal_positive
    check (principal_vnd > 0),

  constraint bank_interest_nonnegative
    check (interest_rate_percent >= 0),

  constraint bank_term_positive
    check (term_months > 0),

  constraint bank_dates_valid
    check (maturity_date > start_date),

  constraint bank_renewal_nonnegative
    check (renewal_count >= 0)
);

create index if not exists idx_bank_deposits_workspace
  on bank_deposits(workspace_id);

create index if not exists idx_bank_deposits_maturity
  on bank_deposits(
    workspace_id,
    maturity_date
  )
  where active = true;

-- ============================================================
-- BANK MATURITY HISTORY
-- ============================================================

create table if not exists bank_maturity_history (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references workspaces(id)
    on delete cascade,

  bank_deposit_id uuid
    references bank_deposits(id)
    on delete cascade,

  bank_name text not null,

  maturity_date date not null,

  principal_recovered numeric(30,4) not null default 0,

  actual_received_interest numeric(30,4) not null default 0,

  interest_rate_percent numeric(12,6),

  term_months integer,

  start_date date,

  rollover boolean not null default false,

  created_at timestamptz not null default now()
);

create index if not exists idx_bank_history_workspace
  on bank_maturity_history(workspace_id);

create index if not exists idx_bank_history_deposit
  on bank_maturity_history(bank_deposit_id);

-- ============================================================
-- FEE / TAX SETTINGS
-- ============================================================

create table if not exists fee_tax_settings (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null unique
    references workspaces(id)
    on delete cascade,

  buy_fee_percent numeric(12,6) not null default 0,

  sell_fee_percent numeric(12,6) not null default 0,

  sell_tax_percent numeric(12,6) not null default 0,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint settings_buy_fee_nonnegative
    check (buy_fee_percent >= 0),

  constraint settings_sell_fee_nonnegative
    check (sell_fee_percent >= 0),

  constraint settings_sell_tax_nonnegative
    check (sell_tax_percent >= 0)
);

-- ============================================================
-- MARKET PRICES
-- ============================================================

create table if not exists market_prices (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references workspaces(id)
    on delete cascade,

  category asset_category not null,

  code text not null,

  price numeric(30,10) not null,

  currency text not null default 'VND',

  source text,

  fetched_at timestamptz not null default now(),

  constraint market_price_positive
    check (price >= 0)
);

create index if not exists idx_market_prices_workspace
  on market_prices(workspace_id);

create unique index if not exists uq_market_price_asset
  on market_prices(
    workspace_id,
    category,
    code
  );

-- ============================================================
-- EXCHANGE RATES
-- ============================================================

create table if not exists exchange_rates (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid
    references workspaces(id)
    on delete cascade,

  base_currency text not null default 'USD',

  quote_currency text not null default 'VND',

  rate numeric(30,10) not null,

  source text,

  fetched_at timestamptz not null default now(),

  constraint exchange_rate_positive
    check (rate > 0)
);

create index if not exists idx_exchange_rates_latest
  on exchange_rates(
    base_currency,
    quote_currency,
    fetched_at desc
  );

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_workspaces_updated_at
  on workspaces;

create trigger trg_workspaces_updated_at
before update on workspaces
for each row
execute function public.set_updated_at();

drop trigger if exists trg_assets_updated_at
  on portfolio_assets;

create trigger trg_assets_updated_at
before update on portfolio_assets
for each row
execute function public.set_updated_at();

drop trigger if exists trg_transactions_updated_at
  on portfolio_transactions;

create trigger trg_transactions_updated_at
before update on portfolio_transactions
for each row
execute function public.set_updated_at();

drop trigger if exists trg_tplus_lots_updated_at
  on tplus_lots;

create trigger trg_tplus_lots_updated_at
before update on tplus_lots
for each row
execute function public.set_updated_at();

drop trigger if exists trg_bank_deposits_updated_at
  on bank_deposits;

create trigger trg_bank_deposits_updated_at
before update on bank_deposits
for each row
execute function public.set_updated_at();

drop trigger if exists trg_fee_tax_updated_at
  on fee_tax_settings;

create trigger trg_fee_tax_updated_at
before update on fee_tax_settings
for each row
execute function public.set_updated_at();

-- ============================================================
-- RLS
-- ============================================================

alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table portfolio_assets enable row level security;
alter table portfolio_transactions enable row level security;
alter table tplus_lots enable row level security;
alter table bank_deposits enable row level security;
alter table bank_maturity_history enable row level security;
alter table fee_tax_settings enable row level security;
alter table market_prices enable row level security;
alter table exchange_rates enable row level security;

-- ============================================================
-- WORKSPACES POLICIES
-- ============================================================

drop policy if exists workspace_select
on workspaces;

create policy workspace_select
on workspaces
for select
to authenticated
using (
  public.is_workspace_member(id)
);

drop policy if exists workspace_update
on workspaces;

create policy workspace_update
on workspaces
for update
to authenticated
using (
  public.is_workspace_member(id)
)
with check (
  public.is_workspace_member(id)
);

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================

drop policy if exists workspace_members_select
on workspace_members;

create policy workspace_members_select
on workspace_members
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_workspace_member(workspace_id)
);

drop policy if exists workspace_members_insert
on workspace_members;

create policy workspace_members_insert
on workspace_members
for insert
to authenticated
with check (
  public.is_workspace_member(workspace_id)
);

drop policy if exists workspace_members_delete
on workspace_members;

create policy workspace_members_delete
on workspace_members
for delete
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

-- ============================================================
-- PORTFOLIO ASSETS
-- ============================================================

drop policy if exists portfolio_assets_all
on portfolio_assets;

create policy portfolio_assets_all
on portfolio_assets
for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================

drop policy if exists portfolio_transactions_all
on portfolio_transactions;

create policy portfolio_transactions_all
on portfolio_transactions
for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

-- ============================================================
-- T+ LOTS
-- ============================================================

drop policy if exists tplus_lots_all
on tplus_lots;

create policy tplus_lots_all
on tplus_lots
for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

-- ============================================================
-- BANK
-- ============================================================

drop policy if exists bank_deposits_all
on bank_deposits;

create policy bank_deposits_all
on bank_deposits
for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

drop policy if exists bank_history_all
on bank_maturity_history;

create policy bank_history_all
on bank_maturity_history
for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

-- ============================================================
-- SETTINGS
-- ============================================================

drop policy if exists fee_tax_settings_all
on fee_tax_settings;

create policy fee_tax_settings_all
on fee_tax_settings
for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

-- ============================================================
-- MARKET PRICES
-- ============================================================

drop policy if exists market_prices_all
on market_prices;

create policy market_prices_all
on market_prices
for all
to authenticated
using (
  public.is_workspace_member(workspace_id)
)
with check (
  public.is_workspace_member(workspace_id)
);

-- ============================================================
-- EXCHANGE RATES
-- ============================================================

drop policy if exists exchange_rates_all
on exchange_rates;

create policy exchange_rates_all
on exchange_rates
for all
to authenticated
using (
  workspace_id is null
  or public.is_workspace_member(workspace_id)
)
with check (
  workspace_id is null
  or public.is_workspace_member(workspace_id)
);

-- ============================================================
-- REALTIME
-- ============================================================

do $$
begin
  alter publication supabase_realtime
    add table portfolio_transactions;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime
    add table portfolio_assets;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime
    add table tplus_lots;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime
    add table bank_deposits;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime
    add table fee_tax_settings;
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- IMPORTANT:
-- NO SEED DATA
-- NO FAKE PORTFOLIO
-- NO FAKE TRANSACTIONS
-- ============================================================