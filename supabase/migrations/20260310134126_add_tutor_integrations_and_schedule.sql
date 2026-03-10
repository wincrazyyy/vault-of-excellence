
  create table "public"."tutor_availability" (
    "id" uuid not null default gen_random_uuid(),
    "tutor_id" uuid not null,
    "day_of_week" integer not null,
    "start_time" time without time zone not null,
    "end_time" time without time zone not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."tutor_availability" enable row level security;


  create table "public"."tutor_integrations" (
    "tutor_id" uuid not null,
    "google_refresh_token" text,
    "google_access_token" text,
    "google_calendar_id" text,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."tutor_integrations" enable row level security;

CREATE UNIQUE INDEX tutor_availability_pkey ON public.tutor_availability USING btree (id);

CREATE UNIQUE INDEX tutor_integrations_pkey ON public.tutor_integrations USING btree (tutor_id);

alter table "public"."tutor_availability" add constraint "tutor_availability_pkey" PRIMARY KEY using index "tutor_availability_pkey";

alter table "public"."tutor_integrations" add constraint "tutor_integrations_pkey" PRIMARY KEY using index "tutor_integrations_pkey";

alter table "public"."tutor_availability" add constraint "tutor_availability_check" CHECK ((start_time < end_time)) not valid;

alter table "public"."tutor_availability" validate constraint "tutor_availability_check";

alter table "public"."tutor_availability" add constraint "tutor_availability_day_of_week_check" CHECK (((day_of_week >= 0) AND (day_of_week <= 6))) not valid;

alter table "public"."tutor_availability" validate constraint "tutor_availability_day_of_week_check";

alter table "public"."tutor_availability" add constraint "tutor_availability_tutor_id_fkey" FOREIGN KEY (tutor_id) REFERENCES public.tutors(id) ON DELETE CASCADE not valid;

alter table "public"."tutor_availability" validate constraint "tutor_availability_tutor_id_fkey";

alter table "public"."tutor_integrations" add constraint "tutor_integrations_tutor_id_fkey" FOREIGN KEY (tutor_id) REFERENCES public.tutors(id) ON DELETE CASCADE not valid;

alter table "public"."tutor_integrations" validate constraint "tutor_integrations_tutor_id_fkey";

set check_function_bodies = off;

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
      insert into public.tutor_integrations (tutor_id) values (new.id);
  end if;
  return new;
end;
$function$
;

grant delete on table "public"."tutor_availability" to "anon";

grant insert on table "public"."tutor_availability" to "anon";

grant references on table "public"."tutor_availability" to "anon";

grant select on table "public"."tutor_availability" to "anon";

grant trigger on table "public"."tutor_availability" to "anon";

grant truncate on table "public"."tutor_availability" to "anon";

grant update on table "public"."tutor_availability" to "anon";

grant delete on table "public"."tutor_availability" to "authenticated";

grant insert on table "public"."tutor_availability" to "authenticated";

grant references on table "public"."tutor_availability" to "authenticated";

grant select on table "public"."tutor_availability" to "authenticated";

grant trigger on table "public"."tutor_availability" to "authenticated";

grant truncate on table "public"."tutor_availability" to "authenticated";

grant update on table "public"."tutor_availability" to "authenticated";

grant delete on table "public"."tutor_availability" to "service_role";

grant insert on table "public"."tutor_availability" to "service_role";

grant references on table "public"."tutor_availability" to "service_role";

grant select on table "public"."tutor_availability" to "service_role";

grant trigger on table "public"."tutor_availability" to "service_role";

grant truncate on table "public"."tutor_availability" to "service_role";

grant update on table "public"."tutor_availability" to "service_role";

grant delete on table "public"."tutor_integrations" to "anon";

grant insert on table "public"."tutor_integrations" to "anon";

grant references on table "public"."tutor_integrations" to "anon";

grant select on table "public"."tutor_integrations" to "anon";

grant trigger on table "public"."tutor_integrations" to "anon";

grant truncate on table "public"."tutor_integrations" to "anon";

grant update on table "public"."tutor_integrations" to "anon";

grant delete on table "public"."tutor_integrations" to "authenticated";

grant insert on table "public"."tutor_integrations" to "authenticated";

grant references on table "public"."tutor_integrations" to "authenticated";

grant select on table "public"."tutor_integrations" to "authenticated";

grant trigger on table "public"."tutor_integrations" to "authenticated";

grant truncate on table "public"."tutor_integrations" to "authenticated";

grant update on table "public"."tutor_integrations" to "authenticated";

grant delete on table "public"."tutor_integrations" to "service_role";

grant insert on table "public"."tutor_integrations" to "service_role";

grant references on table "public"."tutor_integrations" to "service_role";

grant select on table "public"."tutor_integrations" to "service_role";

grant trigger on table "public"."tutor_integrations" to "service_role";

grant truncate on table "public"."tutor_integrations" to "service_role";

grant update on table "public"."tutor_integrations" to "service_role";


  create policy "Availability is public"
  on "public"."tutor_availability"
  as permissive
  for select
  to public
using (true);



  create policy "Tutors manage own availability"
  on "public"."tutor_availability"
  as permissive
  for all
  to public
using ((auth.uid() = tutor_id));



  create policy "Tutors can update own integrations"
  on "public"."tutor_integrations"
  as permissive
  for update
  to public
using ((auth.uid() = tutor_id));



