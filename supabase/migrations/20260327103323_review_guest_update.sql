drop policy "Reviews public" on "public"."reviews";


  create policy "Anyone can insert guest reviews"
  on "public"."reviews"
  as permissive
  for insert
  to public
with check (((student_id IS NULL) AND (is_legacy = false) AND (is_visible = false)));



  create policy "Visible reviews are public, tutors see all"
  on "public"."reviews"
  as permissive
  for select
  to public
using (((is_visible = true) OR (auth.uid() = tutor_id)));



