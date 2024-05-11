set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.years_in_view(min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(metro_id integer, metro_name text, year integer)
 LANGUAGE sql
AS $function$
SELECT
  my.metro_id, my.name, my.year
FROM
  public.metro_years AS my
WHERE
  (my.bbox && ST_MakeBox2D(
    ST_Point(min_long, min_lat),
    ST_Point(max_long, max_lat)
  ):: geometry(Polygon, 4326)
)
$function$
;


