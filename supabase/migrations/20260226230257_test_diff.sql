create extension if not exists "pg_net" with schema "extensions";

alter table "public"."engagements" alter column "status" set default 'pending'::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_bayesian_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.claim_tutor_xp(p_tutor_id uuid, p_quest_id text, p_xp_points integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_sensitive_updates()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;


