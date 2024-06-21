set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_districts_for_year(_year integer, query text)
 RETURNS TABLE(district_id integer, metro_id integer, name text, metro_name text, county text, state text, point geometry)
 LANGUAGE sql
AS $function$
SELECT DISTINCT d.id, my.metro_id, my.county_code || '-' || d.name, my.name, my.county, my.state, ST_PointOnSurface(d.geom::geometry)
FROM districts as d
JOIN metro_years AS my ON my.census_year_id = d.census_year_id AND my.metro_id = d.metro_id
WHERE d.census_year_id IN (SELECT id FROM census_years WHERE year = _year)
AND (my.county_code || '-' || d.name) LIKE query
LIMIT 5;
$function$
;


