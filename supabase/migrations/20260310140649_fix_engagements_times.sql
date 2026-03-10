alter table "public"."engagements" add column "scheduled_end" timestamp with time zone;

alter table "public"."engagements" add column "scheduled_start" timestamp with time zone;

alter table "public"."engagements" add constraint "engagements_check" CHECK ((scheduled_start < scheduled_end)) not valid;

alter table "public"."engagements" validate constraint "engagements_check";


