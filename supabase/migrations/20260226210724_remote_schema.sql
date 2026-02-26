


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calculate_bayesian_rating"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_tutor_id uuid;
  v_real_count int;
  v_real_sum int;
  v_bayesian_avg numeric(3,2);
  
  v_prior_count constant int := 3;
  v_prior_sum constant numeric := 12.0; 
begin
  if TG_OP = 'DELETE' then
    v_tutor_id := old.tutor_id;
  else
    v_tutor_id := new.tutor_id;
  end if;

  select count(*), coalesce(sum(rating), 0)
  into v_real_count, v_real_sum
  from public.reviews
  where tutor_id = v_tutor_id
  and is_visible = true;

  if v_real_count = 0 then
    v_bayesian_avg := 0.0;
  else
    v_bayesian_avg := (v_prior_sum + v_real_sum) / (v_prior_count + v_real_count);
  end if;

  update public.tutors
  set rating_count = v_real_count,
      rating_avg = v_bayesian_avg
  where id = v_tutor_id;

  return null;
end;
$$;


ALTER FUNCTION "public"."calculate_bayesian_rating"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."claim_tutor_xp"("p_tutor_id" "uuid", "p_quest_id" "text", "p_xp_points" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_current_level int;
  v_current_xp int;
  v_xp_needed int;
begin
  insert into public.tutor_quests (tutor_id, quest_id, xp_gained)
  values (p_tutor_id, p_quest_id, p_xp_points);

  update public.tutor_progression
  set current_xp = current_xp + p_xp_points
  where tutor_id = p_tutor_id
  returning level, current_xp into v_current_level, v_current_xp;

  loop
    select xp_required into v_xp_needed 
    from public.levels 
    where level = v_current_level + 1;

    exit when v_xp_needed is null or v_current_xp < v_xp_needed;

    v_current_xp := v_current_xp - v_xp_needed; 
    v_current_level := v_current_level + 1;

    update public.tutor_progression
    set level = v_current_level,
        current_xp = v_current_xp
    where tutor_id = p_tutor_id;
  end loop;
end;
$$;


ALTER FUNCTION "public"."claim_tutor_xp"("p_tutor_id" "uuid", "p_quest_id" "text", "p_xp_points" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  fname text;
  lname text;
  user_role text;
begin
  fname := coalesce(new.raw_user_meta_data->>'first_name', 'New');
  lname := coalesce(new.raw_user_meta_data->>'last_name', 'User');
  user_role := coalesce(new.raw_user_meta_data->>'role', 'tutor');

  if user_role = 'student' then
      insert into public.students (id, firstname, lastname)
      values (new.id, fname, lname);
      
      insert into public.student_progression (student_id, level, current_xp)
      values (new.id, 0, 0); 
      
  else 
      insert into public.tutors (id, firstname, lastname, sections)
      values (
        new.id,
        fname,
        lname,
        '[
          {
            "id": "section-1",
            "modules": [
              {
                "id": "module-1",
                "type": "rte",
                "content": {
                  "doc": {
                    "type": "doc",
                    "content": [
                      { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "About Me" }] },
                      { "type": "paragraph", "content": [{ "type": "text", "text": "Tell us something about yourself..." }] }
                    ]
                  }
                }
              }
            ]
          }
        ]'::jsonb
      );

      insert into public.tutor_progression (tutor_id, level, current_xp)
      values (new.id, 0, 0);
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prevent_sensitive_updates"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
   if new.id <> old.id then
       raise exception 'Critical Error: Cannot change user ID.';
   end if;

   if auth.role() <> 'service_role' and current_user <> 'postgres' then
       if new.is_verified <> old.is_verified then
           raise exception 'Security Violation: You are not authorized to verify accounts.';
       end if;
       if new.rating_avg <> old.rating_avg then
           raise exception 'Security Violation: You cannot modify average ratings manually.';
       end if;
       if new.rating_count <> old.rating_count then
           raise exception 'Security Violation: You cannot modify rating counts manually.';
       end if;
       if new.return_rate <> old.return_rate then
           raise exception 'Security Violation: You cannot modify return rate manually.';
       end if;
   end if;

   return new;
end;
$$;


ALTER FUNCTION "public"."prevent_sensitive_updates"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."engagements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid",
    "tutor_id" "uuid",
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "engagements_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."engagements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."levels" (
    "level" integer NOT NULL,
    "xp_required" integer NOT NULL
);


ALTER TABLE "public"."levels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quests" (
    "id" "text" NOT NULL,
    "target_role" "text" NOT NULL,
    "label" "text" NOT NULL,
    "description" "text",
    "xp_reward" integer NOT NULL,
    "requirements" "jsonb" DEFAULT '{}'::"jsonb",
    "category" "text" DEFAULT 'general'::"text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "quests_target_role_check" CHECK (("target_role" = ANY (ARRAY['tutor'::"text", 'student'::"text"])))
);


ALTER TABLE "public"."quests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tutor_id" "uuid",
    "student_id" "uuid",
    "guest_firstname" "text",
    "guest_lastname" "text",
    "guest_school_name" "text",
    "guest_image_url" "text",
    "rating" integer NOT NULL,
    "comment" "text",
    "is_legacy" boolean DEFAULT false,
    "is_visible" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_progression" (
    "student_id" "uuid" NOT NULL,
    "level" integer DEFAULT 0,
    "current_xp" integer DEFAULT 0
);


ALTER TABLE "public"."student_progression" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "firstname" "text" DEFAULT 'New'::"text",
    "lastname" "text" DEFAULT 'Student'::"text",
    "image_url" "text",
    "school_name" "text"
);


ALTER TABLE "public"."students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tutor_progression" (
    "tutor_id" "uuid" NOT NULL,
    "level" integer DEFAULT 0,
    "current_xp" integer DEFAULT 0
);


ALTER TABLE "public"."tutor_progression" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tutor_quests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tutor_id" "uuid",
    "quest_id" "text" NOT NULL,
    "claimed_at" timestamp with time zone DEFAULT "now"(),
    "xp_gained" integer NOT NULL
);


ALTER TABLE "public"."tutor_quests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tutors" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "firstname" "text" DEFAULT 'New'::"text",
    "lastname" "text" DEFAULT 'Tutor'::"text",
    "image_url" "text",
    "hourly_rate" integer DEFAULT 0,
    "title" "text",
    "subtitle" "text",
    "badge_text" "text",
    "show_rating" boolean DEFAULT true,
    "show_return_rate" boolean DEFAULT true,
    "rating_avg" numeric(3,2) DEFAULT 0.0,
    "rating_count" integer DEFAULT 0,
    "return_rate" numeric(5,2) DEFAULT 0.0,
    "sections" "jsonb" DEFAULT '[]'::"jsonb",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "is_verified" boolean DEFAULT false,
    "is_public" boolean DEFAULT false,
    CONSTRAINT "max_tags_limit" CHECK ((("array_length"("tags", 1) IS NULL) OR ("array_length"("tags", 1) <= 10)))
);


ALTER TABLE "public"."tutors" OWNER TO "postgres";


ALTER TABLE ONLY "public"."engagements"
    ADD CONSTRAINT "engagements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."engagements"
    ADD CONSTRAINT "engagements_student_id_tutor_id_key" UNIQUE ("student_id", "tutor_id");



ALTER TABLE ONLY "public"."levels"
    ADD CONSTRAINT "levels_pkey" PRIMARY KEY ("level");



ALTER TABLE ONLY "public"."quests"
    ADD CONSTRAINT "quests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_progression"
    ADD CONSTRAINT "student_progression_pkey" PRIMARY KEY ("student_id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tutor_progression"
    ADD CONSTRAINT "tutor_progression_pkey" PRIMARY KEY ("tutor_id");



ALTER TABLE ONLY "public"."tutor_quests"
    ADD CONSTRAINT "tutor_quests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tutor_quests"
    ADD CONSTRAINT "tutor_quests_tutor_id_quest_id_key" UNIQUE ("tutor_id", "quest_id");



ALTER TABLE ONLY "public"."tutors"
    ADD CONSTRAINT "tutors_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "check_tutor_updates" BEFORE UPDATE ON "public"."tutors" FOR EACH ROW EXECUTE FUNCTION "public"."prevent_sensitive_updates"();



CREATE OR REPLACE TRIGGER "on_review_changed" AFTER INSERT OR DELETE OR UPDATE ON "public"."reviews" FOR EACH ROW EXECUTE FUNCTION "public"."calculate_bayesian_rating"();



ALTER TABLE ONLY "public"."engagements"
    ADD CONSTRAINT "engagements_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."engagements"
    ADD CONSTRAINT "engagements_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_progression"
    ADD CONSTRAINT "student_progression_level_fkey" FOREIGN KEY ("level") REFERENCES "public"."levels"("level");



ALTER TABLE ONLY "public"."student_progression"
    ADD CONSTRAINT "student_progression_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tutor_progression"
    ADD CONSTRAINT "tutor_progression_level_fkey" FOREIGN KEY ("level") REFERENCES "public"."levels"("level");



ALTER TABLE ONLY "public"."tutor_progression"
    ADD CONSTRAINT "tutor_progression_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tutor_quests"
    ADD CONSTRAINT "tutor_quests_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tutor_quests"
    ADD CONSTRAINT "tutor_quests_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tutors"
    ADD CONSTRAINT "tutors_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Levels are public" ON "public"."levels" FOR SELECT USING (true);



CREATE POLICY "Public tutors viewable" ON "public"."tutors" FOR SELECT USING (true);



CREATE POLICY "Quests are public" ON "public"."quests" FOR SELECT USING (true);



CREATE POLICY "Reviews public" ON "public"."reviews" FOR SELECT USING (true);



CREATE POLICY "Student Progression public" ON "public"."student_progression" FOR SELECT USING (true);



CREATE POLICY "Students update own" ON "public"."students" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Students view own" ON "public"."students" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Students write reviews" ON "public"."reviews" FOR INSERT WITH CHECK ((("auth"."uid"() = "student_id") AND ("is_legacy" = false)));



CREATE POLICY "Tutor Progression public" ON "public"."tutor_progression" FOR SELECT USING (true);



CREATE POLICY "Tutors toggle review visibility" ON "public"."reviews" FOR UPDATE USING (("auth"."uid"() = "tutor_id"));



CREATE POLICY "Tutors update own" ON "public"."tutors" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Tutors view own quests" ON "public"."tutor_quests" FOR SELECT USING (("auth"."uid"() = "tutor_id"));



CREATE POLICY "Tutors write legacy reviews" ON "public"."reviews" FOR INSERT WITH CHECK ((("auth"."uid"() = "tutor_id") AND ("is_legacy" = true) AND ("student_id" IS NULL)));



CREATE POLICY "User engagements" ON "public"."engagements" FOR SELECT USING ((("auth"."uid"() = "student_id") OR ("auth"."uid"() = "tutor_id")));



ALTER TABLE "public"."engagements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."levels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."student_progression" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tutor_progression" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tutor_quests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tutors" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."calculate_bayesian_rating"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_bayesian_rating"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_bayesian_rating"() TO "service_role";



GRANT ALL ON FUNCTION "public"."claim_tutor_xp"("p_tutor_id" "uuid", "p_quest_id" "text", "p_xp_points" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."claim_tutor_xp"("p_tutor_id" "uuid", "p_quest_id" "text", "p_xp_points" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."claim_tutor_xp"("p_tutor_id" "uuid", "p_quest_id" "text", "p_xp_points" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_sensitive_updates"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_sensitive_updates"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_sensitive_updates"() TO "service_role";


















GRANT ALL ON TABLE "public"."engagements" TO "anon";
GRANT ALL ON TABLE "public"."engagements" TO "authenticated";
GRANT ALL ON TABLE "public"."engagements" TO "service_role";



GRANT ALL ON TABLE "public"."levels" TO "anon";
GRANT ALL ON TABLE "public"."levels" TO "authenticated";
GRANT ALL ON TABLE "public"."levels" TO "service_role";



GRANT ALL ON TABLE "public"."quests" TO "anon";
GRANT ALL ON TABLE "public"."quests" TO "authenticated";
GRANT ALL ON TABLE "public"."quests" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."student_progression" TO "anon";
GRANT ALL ON TABLE "public"."student_progression" TO "authenticated";
GRANT ALL ON TABLE "public"."student_progression" TO "service_role";



GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";



GRANT ALL ON TABLE "public"."tutor_progression" TO "anon";
GRANT ALL ON TABLE "public"."tutor_progression" TO "authenticated";
GRANT ALL ON TABLE "public"."tutor_progression" TO "service_role";



GRANT ALL ON TABLE "public"."tutor_quests" TO "anon";
GRANT ALL ON TABLE "public"."tutor_quests" TO "authenticated";
GRANT ALL ON TABLE "public"."tutor_quests" TO "service_role";



GRANT ALL ON TABLE "public"."tutors" TO "anon";
GRANT ALL ON TABLE "public"."tutors" TO "authenticated";
GRANT ALL ON TABLE "public"."tutors" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Authenticated Uploads"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'tutors'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Owner Update"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'tutors'::text) AND (auth.uid() = owner)));



  create policy "Public Access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'tutors'::text));



