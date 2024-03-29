create table "public"."metro_nums" (
    "id" bigint generated by default as identity not null,
    "census_year_id" bigint,
    "metro_id" bigint,
    "num" smallint
);


alter table "public"."metro_nums" enable row level security;

alter table "public"."roads" drop column "as_of_year";

alter table "public"."roads" add column "census_year_id" bigint not null;

alter table "public"."roads" alter column "geom" set data type geography(MultiLineString,4326) using "geom"::geography(MultiLineString,4326);

alter table "public"."roads" alter column "metro_id" set not null;

CREATE UNIQUE INDEX metro_num_pkey ON public.metro_nums USING btree (id);

alter table "public"."metro_nums" add constraint "metro_num_pkey" PRIMARY KEY using index "metro_num_pkey";

alter table "public"."metro_nums" add constraint "metro_nums_census_year_id_fkey" FOREIGN KEY (census_year_id) REFERENCES census_years(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."metro_nums" validate constraint "metro_nums_census_year_id_fkey";

alter table "public"."metro_nums" add constraint "metro_nums_metro_id_fkey" FOREIGN KEY (metro_id) REFERENCES metros(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."metro_nums" validate constraint "metro_nums_metro_id_fkey";

alter table "public"."roads" add constraint "roads_census_year_id_fkey" FOREIGN KEY (census_year_id) REFERENCES census_years(id) not valid;

alter table "public"."roads" validate constraint "roads_census_year_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.roads_in_view(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(id integer, name text, city text, year integer, geom text)
 LANGUAGE sql
AS $function$
select
  r.id, r.name, m.name, y.year, ST_AsGeoJSON(r.geom) as geom
from public.roads as r
  left join census_years as y on y.id = r.census_year_id
  left join metros as m on m.id = r.metro_id
where y.year = _year AND (r.geom && ST_SetSRID(
  ST_MakeBox2D(
    ST_Point(min_long, min_lat),
    ST_Point(max_long, max_lat)
  ),
  4326
))
$function$
;

grant delete on table "public"."metro_nums" to "anon";

grant insert on table "public"."metro_nums" to "anon";

grant references on table "public"."metro_nums" to "anon";

grant select on table "public"."metro_nums" to "anon";

grant trigger on table "public"."metro_nums" to "anon";

grant truncate on table "public"."metro_nums" to "anon";

grant update on table "public"."metro_nums" to "anon";

grant delete on table "public"."metro_nums" to "authenticated";

grant insert on table "public"."metro_nums" to "authenticated";

grant references on table "public"."metro_nums" to "authenticated";

grant select on table "public"."metro_nums" to "authenticated";

grant trigger on table "public"."metro_nums" to "authenticated";

grant truncate on table "public"."metro_nums" to "authenticated";

grant update on table "public"."metro_nums" to "authenticated";

grant delete on table "public"."metro_nums" to "service_role";

grant insert on table "public"."metro_nums" to "service_role";

grant references on table "public"."metro_nums" to "service_role";

grant select on table "public"."metro_nums" to "service_role";

grant trigger on table "public"."metro_nums" to "service_role";

grant truncate on table "public"."metro_nums" to "service_role";

grant update on table "public"."metro_nums" to "service_role";


