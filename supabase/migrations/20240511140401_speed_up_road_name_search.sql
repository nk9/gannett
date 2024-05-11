set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_roads_for_year(_year integer, query text)
 RETURNS TABLE(road_id integer, road_name text, metro_id integer, metro_name text, state text, county text, point geometry)
 LANGUAGE sql
AS $function$
SELECT
  matched_roads.road_id, matched_roads.road_name, matched_roads.metro_id, matched_roads.metro_name, matched_roads.state, my.county, ST_PointOnSurface(matched_roads.geom::geometry)
FROM (
  SELECT DISTINCT r.census_year_id, r.id AS road_id, r.name AS road_name, m.id AS metro_id, m.name AS metro_name, m.state, r.geom
  FROM roads AS r
  JOIN metros AS m ON m.id = r.metro_id
  WHERE census_year_id IN (SELECT road_census_year_id FROM metro_year_road_map WHERE target_year = _year)
    AND to_tsquery(query) @@ to_tsvector(r.name || ' ' || m.name || ' ' || m.state) -- 'bro:* & fo:*'
) AS matched_roads
JOIN metro_year_info AS my ON my.metro_id = matched_roads.metro_id AND my.census_year_id = matched_roads.census_year_id
ORDER BY matched_roads.road_name
LIMIT 10
$function$
;


