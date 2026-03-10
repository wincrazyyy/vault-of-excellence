alter table "public"."tutors" add column "is_admin" boolean default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.prevent_sensitive_updates()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
   v_is_admin boolean;
begin
   select is_admin into v_is_admin from public.tutors where id = auth.uid();

   if new.id <> old.id then raise exception 'Critical Error: Cannot change user ID.'; end if;

   if coalesce(v_is_admin, false) = false and auth.role() <> 'service_role' and current_user <> 'postgres' then
       if new.is_admin <> old.is_admin then raise exception 'Security Violation: You cannot make yourself an admin.'; end if;
       if new.is_verified <> old.is_verified then raise exception 'Security Violation: You are not authorized to verify accounts.'; end if;
       if new.rating_avg <> old.rating_avg then raise exception 'Security Violation: You cannot modify average ratings manually.'; end if;
       if new.rating_count <> old.rating_count then raise exception 'Security Violation: You cannot modify rating counts manually.'; end if;
       if new.return_rate <> old.return_rate then raise exception 'Security Violation: You cannot modify return rate manually.'; end if;
   end if;
   return new;
end;
$function$
;


  create policy "Admins update all applications"
  on "public"."tutor_applications"
  as permissive
  for update
  to public
using ((( SELECT tutors.is_admin
   FROM public.tutors
  WHERE (tutors.id = auth.uid())) = true));



  create policy "Admins view all applications"
  on "public"."tutor_applications"
  as permissive
  for select
  to public
using ((( SELECT tutors.is_admin
   FROM public.tutors
  WHERE (tutors.id = auth.uid())) = true));



  create policy "Admins update all tutors"
  on "public"."tutors"
  as permissive
  for update
  to public
using ((( SELECT tutors_1.is_admin
   FROM public.tutors tutors_1
  WHERE (tutors_1.id = auth.uid())) = true));



