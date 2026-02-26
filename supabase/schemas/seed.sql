-- ==========================================
-- SEEDS & CONFIGURATION DATA
-- ==========================================

-- LEVELS
insert into public.levels (level, xp_required) values
(0, 0), 
(1, 100), 
(2, 300), 
(3, 600), 
(4, 1000), 
(5, 1500), 
(6, 2200), 
(7, 3000), 
(8, 4000), 
(9, 5500), 
(10, 7500)
on conflict (level) do update set xp_required = excluded.xp_required;

-- QUESTS
insert into public.quests (id, target_role, label, description, xp_reward, category, requirements) values 
  ('profile_essentials', 'tutor', 'Profile Essentials', 'Set your title, hourly rate, and add at least 1 tag', 100, 'onboarding', '{"rules": [{"field": "title", "operator": "truthy"}, {"field": "hourly_rate", "operator": "gt", "value": 0}, {"field": "tags", "operator": "has_length", "value": 1}]}'),
  ('profile_header', 'tutor', 'Profile Header', 'Add a profile image, subtitle, and badge text', 100, 'onboarding', '{"rules": [{"field": "image_url", "operator": "truthy"}, {"field": "subtitle", "operator": "truthy"}, {"field": "badge_text", "operator": "truthy"}]}'),
  ('profile_extras', 'tutor', 'Profile Extras', 'Add at least 3 tags and 2 content sections', 200, 'onboarding', '{"rules": [{"field": "tags", "operator": "has_length", "value": 3}, {"field": "sections", "operator": "has_length", "value": 2}]}'),
  ('verified', 'tutor', 'Verified Tutor', 'Get your account officially verified', 200, 'milestone', '{"rules": [{"field": "is_verified", "operator": "eq", "value": true}]}'),
  ('first_review', 'tutor', 'First Review', 'Create a legacy review or get a normal review', 300, 'milestone', '{"rules": [{"field": "rating_count", "operator": "gte", "value": 1}]}')
on conflict (id) do update set target_role = excluded.target_role, label = excluded.label, description = excluded.description, xp_reward = excluded.xp_reward, category = excluded.category, requirements = excluded.requirements;

-- STORAGE BUCKETS
-- Run this part ONLY if 'tutors' bucket doesn't exist yet, otherwise it will error online.
-- insert into storage.buckets (id, name, public) values ('tutors', 'tutors', true);
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'tutors' );
-- create policy "Authenticated Uploads" on storage.objects for insert with check ( bucket_id = 'tutors' and auth.role() = 'authenticated' );
-- create policy "Owner Update" on storage.objects for update using ( bucket_id = 'tutors' and auth.uid() = owner );