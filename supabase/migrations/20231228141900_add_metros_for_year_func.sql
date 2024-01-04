drop function if exists "public"."districts_in_view"(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.metros_for_year(_year integer)
 RETURNS TABLE(metro_id integer, metro_name text, state text, county text, geom text, nara_ed_maps_link text, ancestry_ed_maps_link text)
 LANGUAGE sql
AS $function$
select
  m.id, m.name, m.state, m.county, ST_AsGeoJSON(m.geom), my.nara_ed_maps_link, my.ancestry_ed_maps_link
from public.metro_year_info as my
  left join census_years as y on y.id = my.census_year_id
  left join metros as m on m.id = my.metro_id
where y.year = _year
$function$
;

CREATE OR REPLACE FUNCTION public.years_in_view(min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(metro_id integer, metro_name text, year integer, nara_ed_maps_link text, ancestry_ed_maps_link text)
 LANGUAGE sql
AS $function$
select
  m.id, m.name, y.year, my.nara_ed_maps_link, my.ancestry_ed_maps_link
from public.metro_year_info as my
  left join census_years as y on y.id = my.census_year_id
  left join metros as m on m.id = my.metro_id
where (my.bbox && ST_MakeBox2D(
    ST_Point(min_long, min_lat),
    ST_Point(max_long, max_lat)
  ):: geometry(Polygon, 4326)
)
$function$
;

CREATE OR REPLACE FUNCTION public.districts_in_view(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(id integer, metro_id integer, metro_code text, metro_name text, district_name text, year integer, geom text)
 LANGUAGE sql
AS $function$
select
  d.id, m.id, my.metro_code, m.name, d.name, y.year, ST_AsGeoJSON(d.geom) as geom
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


