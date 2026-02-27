
  create policy "Tutors delete legacy reviews"
  on "public"."reviews"
  as permissive
  for delete
  to public
using (((auth.uid() = tutor_id) AND (is_legacy = true)));



