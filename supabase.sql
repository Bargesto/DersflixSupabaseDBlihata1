-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  username text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Videos table
create table public.videos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  video_url text not null,
  platform text not null check (platform in ('youtube', 'vimeo', 'dailymotion', 'embed')),
  video_id text not null,
  class text not null,
  subject text not null,
  user_id uuid references public.users(id) on delete cascade not null,
  watched boolean default false,
  favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Todos table (for video notes)
create table public.todos (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references public.videos(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Site settings table
create table public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  site_name text not null default 'DERSFLIX',
  theme_color text not null default '#DC2626',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security Policies

-- Enable RLS
alter table public.users enable row level security;
alter table public.videos enable row level security;
alter table public.todos enable row level security;
alter table public.site_settings enable row level security;

-- Users policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

-- Videos policies
create policy "Videos are viewable by owner"
  on public.videos for select
  using (auth.uid() = user_id);

create policy "Videos are insertable by owner"
  on public.videos for insert
  with check (auth.uid() = user_id);

create policy "Videos are updatable by owner"
  on public.videos for update
  using (auth.uid() = user_id);

create policy "Videos are deletable by owner"
  on public.videos for delete
  using (auth.uid() = user_id);

-- Todos policies
create policy "Todos are viewable by video owner"
  on public.todos for select
  using (
    exists (
      select 1 from public.videos
      where videos.id = todos.video_id
      and videos.user_id = auth.uid()
    )
  );

create policy "Todos are insertable by video owner"
  on public.todos for insert
  with check (
    exists (
      select 1 from public.videos
      where videos.id = todos.video_id
      and videos.user_id = auth.uid()
    )
  );

create policy "Todos are updatable by video owner"
  on public.todos for update
  using (
    exists (
      select 1 from public.videos
      where videos.id = todos.video_id
      and videos.user_id = auth.uid()
    )
  );

create policy "Todos are deletable by video owner"
  on public.todos for delete
  using (
    exists (
      select 1 from public.videos
      where videos.id = todos.video_id
      and videos.user_id = auth.uid()
    )
  );

-- Site settings policies
create policy "Site settings are viewable by all authenticated users"
  on public.site_settings for select
  using (auth.role() = 'authenticated');

-- Insert initial site settings
insert into public.site_settings (site_name, theme_color)
values ('DERSFLIX', '#DC2626');