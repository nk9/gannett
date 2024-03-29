create collation if not exists "public"."numeric" (provider = 'icu', locale = 'None');

drop function if exists "public"."metros_by_state"(_state text);

create table "public"."district_resources" (
    "id" integer generated by default as identity not null,
    "district_id" integer,
    "type" text,
    "name" text,
    "value" jsonb,
    "source" text
);


alter table "public"."district_resources" enable row level security;

alter table "public"."districts" alter column "name" set data type text collate "numeric" using "name"::text;

alter table "public"."metro_year_info" add column "county" text;

alter table "public"."metro_year_info" add column "county_code" smallint;

alter table "public"."metros" add column "utp_code" text;

CREATE UNIQUE INDEX district_resources_pkey ON public.district_resources USING btree (id);

alter table "public"."district_resources" add constraint "district_resources_pkey" PRIMARY KEY using index "district_resources_pkey";

alter table "public"."district_resources" add constraint "district_resources_district_id_fkey" FOREIGN KEY (district_id) REFERENCES districts(id) not valid;

alter table "public"."district_resources" validate constraint "district_resources_district_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.metros_for_year(_year integer)
 RETURNS TABLE(metro_id integer, metro_name text, state text, county text, geom text, nara_ed_maps_link text, ancestry_ed_maps_link text)
 LANGUAGE sql
AS $function$
select
  m.id, m.name, m.state, my.county, ST_AsGeoJSON(ST_Centroid(my.bbox)), my.nara_ed_maps_link, my.ancestry_ed_maps_link
from public.metro_year_info as my
  join census_years as y on y.id = my.census_year_id
  join metros as m on m.id = my.metro_id
where y.year = _year
$function$
;

CREATE OR REPLACE FUNCTION public.search_districts_for_year(_year integer, query text)
 RETURNS TABLE(district_id integer, metro_id integer, name text, metro_name text, county text, state text, point geometry)
 LANGUAGE sql
AS $function$
SELECT DISTINCT d.id, m.id, my.metro_code || '-' || d.name, m.name, my.county, m.state, ST_PointOnSurface(d.geom::geometry)

FROM districts as d
JOIN metros AS m ON d.metro_id = m.id
JOIN census_years AS y ON d.census_year_id = y.id
JOIN metro_year_info AS my ON m.id = my.metro_id AND y.id = my.census_year_id
WHERE d.census_year_id IN (SELECT id FROM census_years WHERE year = _year)
AND (my.metro_code || '-' || d.name) LIKE query
LIMIT 5;
$function$
;

CREATE OR REPLACE FUNCTION public.search_roads_for_year(_year integer, query text)
 RETURNS TABLE(road_id integer, road_name text, metro_id integer, metro_name text, state text, county text, point geometry)
 LANGUAGE sql
AS $function$
SELECT
  r.id, r.name, m.id, m.name, m.state, my.county, ST_PointOnSurface(r.geom::geometry)
FROM (
  SELECT DISTINCT census_year_id, id
  FROM roads
  WHERE census_year_id IN (SELECT road_census_year_id FROM metro_year_road_map WHERE target_year = _year)
) AS unique_roads
JOIN roads AS r ON r.id = unique_roads.id
JOIN census_years AS y ON y.id = unique_roads.census_year_id
JOIN metros AS m ON m.id = r.metro_id
JOIN metro_year_info AS my ON my.metro_id = r.metro_id AND my.census_year_id = unique_roads.census_year_id

WHERE to_tsquery(query) @@ to_tsvector(r.name || ' ' || m.name || ' ' || m.state)
ORDER BY r.name
LIMIT 10
$function$
;

grant delete on table "public"."district_resources" to "anon";

grant insert on table "public"."district_resources" to "anon";

grant references on table "public"."district_resources" to "anon";

grant select on table "public"."district_resources" to "anon";

grant trigger on table "public"."district_resources" to "anon";

grant truncate on table "public"."district_resources" to "anon";

grant update on table "public"."district_resources" to "anon";

grant delete on table "public"."district_resources" to "authenticated";

grant insert on table "public"."district_resources" to "authenticated";

grant references on table "public"."district_resources" to "authenticated";

grant select on table "public"."district_resources" to "authenticated";

grant trigger on table "public"."district_resources" to "authenticated";

grant truncate on table "public"."district_resources" to "authenticated";

grant update on table "public"."district_resources" to "authenticated";

grant delete on table "public"."district_resources" to "service_role";

grant insert on table "public"."district_resources" to "service_role";

grant references on table "public"."district_resources" to "service_role";

grant select on table "public"."district_resources" to "service_role";

grant trigger on table "public"."district_resources" to "service_role";

grant truncate on table "public"."district_resources" to "service_role";

grant update on table "public"."district_resources" to "service_role";

create policy "Enable read access for all users"
on "public"."district_resources"
as permissive
for select
to public
using (true);



