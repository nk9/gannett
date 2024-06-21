drop function if exists "public"."districts_in_view"(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.districts_in_view(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(id integer, metro_id integer, county text, metro_code text, metro_name text, district_name text, state text, year integer, geom text)
 LANGUAGE sql
AS $function$
select
  d.id, m.id, my.county, my.county_code, m.name, d.name, m.state, y.year, ST_AsGeoJSON(d.geom) as geom
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


