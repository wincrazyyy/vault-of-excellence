
  create table "public"."tutor_applications" (
    "id" uuid not null default gen_random_uuid(),
    "tutor_id" uuid not null,
    "firstname" text not null,
    "lastname" text not null,
    "gender" text,
    "phone" text,
    "email" text not null,
    "university" text,
    "major" text,
    "graduation_year" text,
    "teaching_experience_years" integer,
    "teaching_subject" text,
    "self_intro" text,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."tutor_applications" enable row level security;

CREATE UNIQUE INDEX tutor_applications_pkey ON public.tutor_applications USING btree (id);

CREATE UNIQUE INDEX unique_pending_tutor_app ON public.tutor_applications USING btree (tutor_id) WHERE (status = 'pending'::text);

alter table "public"."tutor_applications" add constraint "tutor_applications_pkey" PRIMARY KEY using index "tutor_applications_pkey";

alter table "public"."tutor_applications" add constraint "tutor_applications_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))) not valid;

alter table "public"."tutor_applications" validate constraint "tutor_applications_status_check";

alter table "public"."tutor_applications" add constraint "tutor_applications_tutor_id_fkey" FOREIGN KEY (tutor_id) REFERENCES public.tutors(id) ON DELETE CASCADE not valid;

alter table "public"."tutor_applications" validate constraint "tutor_applications_tutor_id_fkey";

grant delete on table "public"."tutor_applications" to "anon";

grant insert on table "public"."tutor_applications" to "anon";

grant references on table "public"."tutor_applications" to "anon";

grant select on table "public"."tutor_applications" to "anon";

grant trigger on table "public"."tutor_applications" to "anon";

grant truncate on table "public"."tutor_applications" to "anon";

grant update on table "public"."tutor_applications" to "anon";

grant delete on table "public"."tutor_applications" to "authenticated";

grant insert on table "public"."tutor_applications" to "authenticated";

grant references on table "public"."tutor_applications" to "authenticated";

grant select on table "public"."tutor_applications" to "authenticated";

grant trigger on table "public"."tutor_applications" to "authenticated";

grant truncate on table "public"."tutor_applications" to "authenticated";

grant update on table "public"."tutor_applications" to "authenticated";

grant delete on table "public"."tutor_applications" to "service_role";

grant insert on table "public"."tutor_applications" to "service_role";

grant references on table "public"."tutor_applications" to "service_role";

grant select on table "public"."tutor_applications" to "service_role";

grant trigger on table "public"."tutor_applications" to "service_role";

grant truncate on table "public"."tutor_applications" to "service_role";

grant update on table "public"."tutor_applications" to "service_role";


  create policy "Tutors insert own applications"
  on "public"."tutor_applications"
  as permissive
  for insert
  to public
with check ((auth.uid() = tutor_id));



  create policy "Tutors view own applications"
  on "public"."tutor_applications"
  as permissive
  for select
  to public
using ((auth.uid() = tutor_id));



