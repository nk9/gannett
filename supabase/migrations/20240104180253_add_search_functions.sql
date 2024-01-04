set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_districts_for_year(_year integer, query text)
 RETURNS TABLE(district_id integer, metro_id integer, name text, metro_name text, county text, state text, point geometry)
 LANGUAGE sql
AS $function$
SELECT DISTINCT d.id, m.id, my.metro_code || '-' || d.name, m.name, m.county, m.state, ST_PointOnSurface(d.geom::geometry)

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
  r.id, r.name, m.id, m.name, m.state, m.county, ST_PointOnSurface(r.geom::geometry)
FROM (
  SELECT DISTINCT census_year_id, id
  FROM roads
  WHERE census_year_id IN (SELECT id FROM census_years WHERE year = _year)
) AS unique_roads
JOIN roads AS r ON r.id = unique_roads.id
JOIN census_years AS y ON y.id = unique_roads.census_year_id
JOIN metros AS m ON m.id = r.metro_id

WHERE to_tsquery(query) @@ to_tsvector(r.name || ' ' || m.name || ' ' || m.state)
ORDER BY r.name
LIMIT 10
$function$
;


