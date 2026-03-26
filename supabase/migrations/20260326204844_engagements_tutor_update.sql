
  create policy "Users can update their engagements"
  on "public"."engagements"
  as permissive
  for update
  to public
using (((auth.uid() = student_id) OR (auth.uid() = tutor_id)));



