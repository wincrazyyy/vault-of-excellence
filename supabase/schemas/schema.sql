-- ==========================================
-- CLEANUP
-- ==========================================
drop trigger if exists check_tutor_updates on public.tutors;
drop trigger if exists check_sensitive_updates on public.tutors;
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_review_changed on public.reviews;

drop function if exists public.handle_new_user();
drop function if exists public.prevent_sensitive_updates();
drop function if exists public.claim_tutor_xp(uuid, text, integer) cascade;
drop function if exists public.calculate_bayesian_rating() cascade;

drop table if exists public.tutor_quests cascade;
drop table if exists public.quests cascade;
drop table if exists public.reviews cascade;
drop table if exists public.engagements cascade;
drop table if exists public.tutor_progression cascade;
drop table if exists public.student_progression cascade;
drop table if exists public.students cascade;
drop table if exists public.tutors cascade;
drop table if exists public.levels cascade;

-- ==========================================
-- CORE TABLES
-- ==========================================

create table public.levels (
  level integer primary key,
  xp_required integer not null
);

create table public.tutors (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamptz default now() not null,
  firstname text default 'New',
  lastname text default 'Tutor',
  image_url text,
  hourly_rate integer default 0,
  title text,
  subtitle text,
  badge_text text,
  show_rating boolean default true,
  show_return_rate boolean default true,
  rating_avg numeric(3, 2) default 0.0,
  rating_count integer default 0,
  return_rate numeric(5, 2) default 0.0, 
  sections jsonb default '[]'::jsonb,
  tags text[] default '{}'::text[],
  is_verified boolean default false,
  is_public boolean default false
);

alter table public.tutors add constraint max_tags_limit check (array_length(tags, 1) is null or array_length(tags, 1) <= 10);

create table public.students (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamptz default now() not null,
  firstname text default 'New',
  lastname text default 'Student',
  image_url text,
  school_name text
);

create table public.tutor_progression (
  tutor_id uuid references public.tutors(id) on delete cascade primary key,
  level integer default 0 references public.levels(level),
  current_xp integer default 0
);

create table public.student_progression (
  student_id uuid references public.students(id) on delete cascade primary key,
  level integer default 0 references public.levels(level),
  current_xp integer default 0
);

create table public.engagements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade, -- NULLABLE for guests
  tutor_id uuid references public.tutors(id) on delete cascade,
  guest_name text,
  guest_email text,
  initial_message text,
  status text default 'pending' check (status in ('pending', 'active', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  unique(student_id, tutor_id)
);
create unique index unique_guest_tutor on public.engagements (guest_email, tutor_id) where guest_email is not null;

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid references public.tutors(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  guest_firstname text,
  guest_lastname text,
  guest_school_name text,
  guest_image_url text,
  rating integer check (rating >= 1 and rating <= 5), -- NULLABLE for legacy
  comment text,
  is_legacy boolean default false,
  is_visible boolean default true,
  created_at timestamptz default now()
);

create table public.quests (
  id text primary key,
  target_role text not null check (target_role in ('tutor', 'student')),
  label text not null,
  description text,
  xp_reward integer not null,
  requirements jsonb default '{}'::jsonb,
  category text default 'general',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.tutor_quests (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid references public.tutors(id) on delete cascade,
  quest_id text references public.quests(id) on delete cascade not null, 
  claimed_at timestamptz default now(),
  xp_gained integer not null,
  unique(tutor_id, quest_id)
);

-- ==========================================
-- SECURITY (RLS)
-- ==========================================
alter table public.levels enable row level security;
alter table public.tutors enable row level security;
alter table public.students enable row level security;
alter table public.tutor_progression enable row level security;
alter table public.student_progression enable row level security;
alter table public.engagements enable row level security;
alter table public.reviews enable row level security;
alter table public.quests enable row level security;
alter table public.tutor_quests enable row level security;

create policy "Levels are public" on public.levels for select using (true);
create policy "Public tutors viewable" on public.tutors for select using (true);
create policy "Tutors update own" on public.tutors for update using (auth.uid() = id);
create policy "Students view own" on public.students for select using (auth.uid() = id);
create policy "Students update own" on public.students for update using (auth.uid() = id);
create policy "Tutor Progression public" on public.tutor_progression for select using (true);
create policy "Student Progression public" on public.student_progression for select using (true);
create policy "User engagements" on public.engagements for select using (auth.uid() = student_id or auth.uid() = tutor_id);
create policy "Reviews public" on public.reviews for select using (true);
create policy "Students write reviews" on public.reviews for insert with check ( auth.uid() = student_id and is_legacy = false );
create policy "Tutors write legacy reviews" on public.reviews for insert with check ( auth.uid() = tutor_id and is_legacy = true and student_id is null );
create policy "Tutors toggle review visibility" on public.reviews for update using ( auth.uid() = tutor_id );
create policy "Quests are public" on public.quests for select using (true);
create policy "Tutors view own quests" on public.tutor_quests for select using (auth.uid() = tutor_id);

-- ==========================================
-- AUTOMATION & FUNCTIONS
-- ==========================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  fname text; lname text; user_role text;
begin
  fname := coalesce(new.raw_user_meta_data->>'first_name', 'New');
  lname := coalesce(new.raw_user_meta_data->>'last_name', 'User');
  user_role := coalesce(new.raw_user_meta_data->>'role', 'tutor');

  if user_role = 'student' then
      insert into public.students (id, firstname, lastname) values (new.id, fname, lname);
      insert into public.student_progression (student_id, level, current_xp) values (new.id, 0, 0); 
  else 
      insert into public.tutors (id, firstname, lastname, sections) values (new.id, fname, lname, '[{"id": "section-1", "modules": [{"id": "module-1", "type": "rte", "content": {"doc": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "About Me"}]}, {"type": "paragraph", "content": [{"type": "text", "text": "Tell us something about yourself..."}]}]}}}]}]'::jsonb);
      insert into public.tutor_progression (tutor_id, level, current_xp) values (new.id, 0, 0);
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.prevent_sensitive_updates()
returns trigger language plpgsql as $$
begin
   if new.id <> old.id then raise exception 'Critical Error: Cannot change user ID.'; end if;
   if auth.role() <> 'service_role' and current_user <> 'postgres' then
       if new.is_verified <> old.is_verified then raise exception 'Security Violation: You are not authorized to verify accounts.'; end if;
       if new.rating_avg <> old.rating_avg then raise exception 'Security Violation: You cannot modify average ratings manually.'; end if;
       if new.rating_count <> old.rating_count then raise exception 'Security Violation: You cannot modify rating counts manually.'; end if;
       if new.return_rate <> old.return_rate then raise exception 'Security Violation: You cannot modify return rate manually.'; end if;
   end if;
   return new;
end;
$$;
create trigger check_tutor_updates before update on public.tutors for each row execute procedure public.prevent_sensitive_updates();

create or replace function public.claim_tutor_xp(p_tutor_id uuid, p_quest_id text, p_xp_points integer)
returns void language plpgsql security definer as $$
declare
  v_current_level int; v_current_xp int; v_xp_needed int;
begin
  insert into public.tutor_quests (tutor_id, quest_id, xp_gained) values (p_tutor_id, p_quest_id, p_xp_points);
  update public.tutor_progression set current_xp = current_xp + p_xp_points where tutor_id = p_tutor_id returning level, current_xp into v_current_level, v_current_xp;
  loop
    select xp_required into v_xp_needed from public.levels where level = v_current_level + 1;
    exit when v_xp_needed is null or v_current_xp < v_xp_needed;
    v_current_xp := v_current_xp - v_xp_needed; 
    v_current_level := v_current_level + 1;
    update public.tutor_progression set level = v_current_level, current_xp = v_current_xp where tutor_id = p_tutor_id;
  end loop;
end;
$$;

create or replace function public.calculate_bayesian_rating()
returns trigger language plpgsql security definer as $$
declare
  v_tutor_id uuid; v_real_count int; v_real_sum int; v_bayesian_avg numeric(3,2);
  v_prior_count constant int := 3; v_prior_sum constant numeric := 12.0; 
begin
  if TG_OP = 'DELETE' then v_tutor_id := old.tutor_id; else v_tutor_id := new.tutor_id; end if;

  select count(*), coalesce(sum(rating), 0) into v_real_count, v_real_sum
  from public.reviews
  where tutor_id = v_tutor_id and is_visible = true and is_legacy = false;

  if v_real_count = 0 then v_bayesian_avg := 0.0;
  else v_bayesian_avg := (v_prior_sum + v_real_sum) / (v_prior_count + v_real_count); end if;

  update public.tutors set rating_count = v_real_count, rating_avg = v_bayesian_avg where id = v_tutor_id;
  return null;
end;
$$;
create trigger on_review_changed after insert or update or delete on public.reviews for each row execute procedure public.calculate_bayesian_rating();

-- ==========================================
-- SEEDS & STORAGE
-- ==========================================
insert into public.levels (level, xp_required) values
(0, 0), (1, 100), (2, 300), (3, 600), (4, 1000), (5, 1500), (6, 2200), (7, 3000), (8, 4000), (9, 5500), (10, 7500)
on conflict (level) do update set xp_required = excluded.xp_required;

insert into public.quests (id, target_role, label, description, xp_reward, category, requirements) values 
  ('profile_essentials', 'tutor', 'Profile Essentials', 'Set your title, hourly rate, and add at least 1 tag', 100, 'onboarding', '{"rules": [{"field": "title", "operator": "truthy"}, {"field": "hourly_rate", "operator": "gt", "value": 0}, {"field": "tags", "operator": "has_length", "value": 1}]}'),
  ('profile_header', 'tutor', 'Profile Header', 'Add a profile image, subtitle, and badge text', 100, 'onboarding', '{"rules": [{"field": "image_url", "operator": "truthy"}, {"field": "subtitle", "operator": "truthy"}, {"field": "badge_text", "operator": "truthy"}]}'),
  ('profile_extras', 'tutor', 'Profile Extras', 'Add at least 3 tags and 2 content sections', 200, 'onboarding', '{"rules": [{"field": "tags", "operator": "has_length", "value": 3}, {"field": "sections", "operator": "has_length", "value": 2}]}'),
  ('verified', 'tutor', 'Verified Tutor', 'Get your account officially verified', 200, 'milestone', '{"rules": [{"field": "is_verified", "operator": "eq", "value": true}]}'),
  ('first_review', 'tutor', 'First Review', 'Create a legacy review or get a normal review', 300, 'milestone', '{"rules": [{"field": "rating_count", "operator": "gte", "value": 1}]}')
on conflict (id) do update set target_role = excluded.target_role, label = excluded.label, description = excluded.description, xp_reward = excluded.xp_reward, category = excluded.category, requirements = excluded.requirements;

-- Run this part ONLY if 'tutors' bucket doesn't exist yet, otherwise it will error online.
-- insert into storage.buckets (id, name, public) values ('tutors', 'tutors', true);
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'tutors' );
-- create policy "Authenticated Uploads" on storage.objects for insert with check ( bucket_id = 'tutors' and auth.role() = 'authenticated' );
-- create policy "Owner Update" on storage.objects for update using ( bucket_id = 'tutors' and auth.uid() = owner );