drop function if exists "public"."districts_in_view"(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision);

alter table "public"."metro_year_info" drop column "num";

alter table "public"."metro_year_info" add column "ancestry_ed_maps_link" text;

alter table "public"."metro_year_info" add column "bbox" geography(Polygon,4326);

alter table "public"."metro_year_info" add column "metro_code" smallint;

alter table "public"."metro_year_info" add column "nara_ed_maps_link" text;

CREATE UNIQUE INDEX metro_year_info_census_year_metro_key ON public.metro_year_info USING btree (census_year_id, metro_id);

alter table "public"."metro_year_info" add constraint "metro_year_info_census_year_metro_key" UNIQUE using index "metro_year_info_census_year_metro_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.districts_in_view(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(id integer, district_code text, district_name text, city_name text, year integer, geom text)
 LANGUAGE sql
AS $function$
select
  d.id, my.metro_code, d.name, m.name, y.year, ST_AsGeoJSON(d.geom) as geom
from public.districts as d
  left join census_years as y on y.id = d.census_year_id
  left join metros as m on m.id = d.metro_id
  left join metro_year_info as my on my.metro_id = m.id and my.census_year_id = y.id
where y.year = _year AND (d.geom && ST_SetSRID(
  ST_MakeBox2D(
    ST_Point(min_long, min_lat),
    ST_Point(max_long, max_lat)
  ),
  4326
))
$function$
;


