create table "public"."metro_year_road_map" (
    "id" bigint generated by default as identity not null,
    "metro_id" bigint,
    "road_census_year_id" bigint,
    "target_year" smallint
);


alter table "public"."metro_year_road_map" enable row level security;

CREATE UNIQUE INDEX metro_year_road_map_pkey ON public.metro_year_road_map USING btree (id);

CREATE UNIQUE INDEX metro_year_road_map_unique_key ON public.metro_year_road_map USING btree (metro_id, road_census_year_id, target_year);

alter table "public"."metro_year_road_map" add constraint "metro_year_road_map_pkey" PRIMARY KEY using index "metro_year_road_map_pkey";

alter table "public"."metro_year_road_map" add constraint "metro_year_road_map_metro_id_fkey" FOREIGN KEY (metro_id) REFERENCES metros(id) not valid;

alter table "public"."metro_year_road_map" validate constraint "metro_year_road_map_metro_id_fkey";

alter table "public"."metro_year_road_map" add constraint "metro_year_road_map_road_census_year_id_fkey" FOREIGN KEY (road_census_year_id) REFERENCES census_years(id) not valid;

alter table "public"."metro_year_road_map" validate constraint "metro_year_road_map_road_census_year_id_fkey";

alter table "public"."metro_year_road_map" add constraint "metro_year_road_map_unique_key" UNIQUE using index "metro_year_road_map_unique_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_roads_for_year(_year integer, query text)
 RETURNS TABLE(road_id integer, road_name text, metro_id integer, metro_name text, state text, county text, point geometry)
 LANGUAGE sql
AS $function$
SELECT
  r.id, r.name, m.id, m.name, m.state, m.county, ST_PointOnSurface(r.geom::geometry)
FROM (
  SELECT DISTINCT census_year_id, id
  FROM roads
  WHERE census_year_id IN (SELECT road_census_year_id FROM metro_year_road_map WHERE target_year = _year)
) AS unique_roads
JOIN roads AS r ON r.id = unique_roads.id
JOIN census_years AS y ON y.id = unique_roads.census_year_id
JOIN metros AS m ON m.id = r.metro_id

WHERE to_tsquery(query) @@ to_tsvector(r.name || ' ' || m.name || ' ' || m.state)
ORDER BY r.name
LIMIT 10
$function$
;

grant delete on table "public"."metro_year_road_map" to "anon";

grant insert on table "public"."metro_year_road_map" to "anon";

grant references on table "public"."metro_year_road_map" to "anon";

grant select on table "public"."metro_year_road_map" to "anon";

grant trigger on table "public"."metro_year_road_map" to "anon";

grant truncate on table "public"."metro_year_road_map" to "anon";

grant update on table "public"."metro_year_road_map" to "anon";

grant delete on table "public"."metro_year_road_map" to "authenticated";

grant insert on table "public"."metro_year_road_map" to "authenticated";

grant references on table "public"."metro_year_road_map" to "authenticated";

grant select on table "public"."metro_year_road_map" to "authenticated";

grant trigger on table "public"."metro_year_road_map" to "authenticated";

grant truncate on table "public"."metro_year_road_map" to "authenticated";

grant update on table "public"."metro_year_road_map" to "authenticated";

grant delete on table "public"."metro_year_road_map" to "service_role";

grant insert on table "public"."metro_year_road_map" to "service_role";

grant references on table "public"."metro_year_road_map" to "service_role";

grant select on table "public"."metro_year_road_map" to "service_role";

grant trigger on table "public"."metro_year_road_map" to "service_role";

grant truncate on table "public"."metro_year_road_map" to "service_role";

grant update on table "public"."metro_year_road_map" to "service_role";

create policy "Enable read access for all users"
on "public"."metro_year_road_map"
as permissive
for select
to public
using (true);



