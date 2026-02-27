alter table "public"."tutors" add column "total_reviews" integer default 0;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_bayesian_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_tutor_id uuid; v_real_count int; v_real_sum int; v_total_count int; v_bayesian_avg numeric(3,2);
  v_prior_count constant int := 3; v_prior_sum constant numeric := 12.0; 
begin
  if TG_OP = 'DELETE' then v_tutor_id := old.tutor_id; else v_tutor_id := new.tutor_id; end if;

  select count(*), coalesce(sum(rating), 0) into v_real_count, v_real_sum
  from public.reviews
  where tutor_id = v_tutor_id and is_visible = true and is_legacy = false;

  select count(*) into v_total_count
  from public.reviews
  where tutor_id = v_tutor_id;

  if v_real_count = 0 then v_bayesian_avg := 0.0;
  else v_bayesian_avg := (v_prior_sum + v_real_sum) / (v_prior_count + v_real_count); end if;

  update public.tutors 
  set rating_count = v_real_count, 
      rating_avg = v_bayesian_avg,
      total_reviews = v_total_count
  where id = v_tutor_id;
  
  return null;
end;
$function$
;


