drop view if exists "public"."metro_years";

alter table "public"."metro_year_info" drop column "bbox";

alter table "public"."metro_year_info" drop column "metro_code";

alter table "public"."metros" drop column "county";

CREATE UNIQUE INDEX metros_utp_code_key ON public.metros USING btree (utp_code);

alter table "public"."metros" add constraint "metros_utp_code_key" UNIQUE using index "metros_utp_code_key";



