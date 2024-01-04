alter table "public"."districts" alter column "name" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.districts_in_view(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(id integer, district_name text, city_name text, year integer, geom text)
 LANGUAGE sql
AS $function$
select
  d.id, d.name, m.name, y.year, ST_AsGeoJSON(d.geom) as geom
from public.districts as d
  left join census_years as y on y.id = d.census_year_id
  left join metros as m on m.id = d.metro_id
where y.year = _year AND (d.geom && ST_SetSRID(
  ST_MakeBox2D(
    ST_Point(min_long, min_lat),
    ST_Point(max_long, max_lat)
  ),
  4326
))
$function$
;

CREATE OR REPLACE FUNCTION public.metros_by_state(_state text)
 RETURNS TABLE(id bigint, name text, state text, county text, geom text)
 LANGUAGE sql
AS $function$
  SELECT id, name, state, county, ST_AsGeoJSON(geom) FROM metros WHERE state = _state ORDER BY name;
$function$
;


