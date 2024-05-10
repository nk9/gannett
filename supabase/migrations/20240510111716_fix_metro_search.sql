set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_metros_for_year(_year integer, query text)
 RETURNS TABLE(metro_id integer, name text, state text, county text, geom geometry)
 LANGUAGE sql
AS $function$
SELECT DISTINCT metro_id AS id, name, state, county, geom
FROM metro_years
WHERE year = _year AND name ILIKE query
LIMIT 5;
$function$
;


