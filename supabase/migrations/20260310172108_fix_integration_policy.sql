drop policy "Tutors can update own integrations" on "public"."tutor_integrations";


  create policy "Tutors can update own integrations"
  on "public"."tutor_integrations"
  as permissive
  for select
  to public
using ((auth.uid() = tutor_id));



