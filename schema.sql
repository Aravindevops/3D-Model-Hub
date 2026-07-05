-- Create the 'models' table
create table public.models (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  glb_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.models enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
  on public.models
  for select
  to public
  using (true);

-- Create policy to allow authenticated users to insert (if you want to restrict uploads later)
-- For now, to allow the admin dashboard to work without auth:
create policy "Allow public inserts (for demo purposes)"
  on public.models
  for insert
  to public
  with check (true);
  
-- Create policy to allow public updates to edit title/description
create policy "Allow public updates (for demo purposes)"
  on public.models
  for update
  to public
  using (true)
  with check (true);
  
-- Create policy to allow public deletes
create policy "Allow public deletes (for demo purposes)"
  on public.models
  for delete
  to public
  using (true);
  
-- Note: In a production app, you should set up Supabase Auth and restrict the insert/update/delete policies.

-- Create a storage bucket named 'models'
insert into storage.buckets (id, name, public) values ('models', 'models', true);

-- Allow public read access to the 'models' bucket
create policy "Public read access to models bucket"
  on storage.objects
  for select
  to public
  using (bucket_id = 'models');

-- Allow public uploads to the 'models' bucket
create policy "Public upload access to models bucket"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'models');

-- Allow public deletes from the 'models' bucket
create policy "Public delete access to models bucket"
  on storage.objects
  for delete
  to public
  using (bucket_id = 'models');
