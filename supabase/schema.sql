-- VANTOR identity + workspace foundation
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'VANTOR Workspace',
  slug text unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name') on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.create_default_workspace()
returns trigger language plpgsql security definer set search_path = public as $$
declare new_workspace uuid;
begin
  insert into public.workspaces (name, created_by) values ('VANTOR Workspace', new.id) returning id into new_workspace;
  insert into public.workspace_members (workspace_id, user_id, role) values (new_workspace, new.id, 'owner');
  return new;
end;
$$;

drop trigger if exists on_auth_user_workspace_created on auth.users;
create trigger on_auth_user_workspace_created after insert on auth.users for each row execute procedure public.create_default_workspace();

create policy "users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "members can read workspaces" on public.workspaces for select using (exists (select 1 from public.workspace_members wm where wm.workspace_id = id and wm.user_id = auth.uid()));
create policy "members can read membership" on public.workspace_members for select using (user_id = auth.uid() or exists (select 1 from public.workspace_members wm where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')));


-- GitHub App connection metadata. OAuth tokens are never stored; installation tokens are minted server-side and short-lived.
alter table public.profiles add column if not exists github_installation_id bigint;
alter table public.profiles add column if not exists github_login text;
alter table public.profiles add column if not exists github_avatar_url text;
alter table public.profiles add column if not exists github_connected_at timestamptz;
