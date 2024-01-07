drop function if exists "public"."roads_in_view"(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.roads_in_view(_year integer, min_long double precision, min_lat double precision, max_long double precision, max_lat double precision)
 RETURNS TABLE(id integer, name text, city text, year integer, geom text)
 LANGUAGE sql
AS $function$
SELECT
  r.id, r.name, m.name, cy.year, ST_AsGeoJSON(r.geom) as geom
FROM public.roads AS r
  JOIN metros AS m ON m.id = r.metro_id
  JOIN metro_year_road_map AS myr ON m.id = myr.metro_id AND myr.target_year = _year
  JOIN census_years AS cy ON cy.id = myr.road_census_year_id
WHERE r.geom && ST_SetSRID(
  ST_MakeBox2D(
    ST_Point(min_long, min_lat),
    ST_Point(max_long, max_lat)
  ),
  4326
)
$function$
;


