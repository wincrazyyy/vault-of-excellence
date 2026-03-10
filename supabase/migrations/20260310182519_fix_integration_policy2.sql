drop policy "Tutors can update own integrations" on "public"."tutor_integrations";


  create policy "Tutors manage own integrations"
  on "public"."tutor_integrations"
  as permissive
  for all
  to public
using ((auth.uid() = tutor_id));



