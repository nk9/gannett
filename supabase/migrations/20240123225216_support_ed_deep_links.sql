drop function if exists "public"."districts_in_view"(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.lookup_district(_year integer, _state text, _county_code text, _district_name text)
 RETURNS TABLE(county text, metro_id bigint, metro_name text, district_id integer, district_name text, point geometry)
 LANGUAGE sql
AS $function$
SELECT m.county, m.id, m.name, d.id, d.name, ST_PointOnSurface(d.geom::geometry)

FROM districts AS d
JOIN census_years AS cy ON cy.id = d.census_year_id
JOIN metros AS m ON m.id = d.metro_id
JOIN metro_year_info AS my ON my.metro_id = m.id AND my.census_year_id = cy.id

WHERE _year = cy.year AND _state = m.state AND _county_code::integer = my.metro_code AND _district_name = d.name
LIMIT 10;
$function$
;

CREATE OR REPLACE FUNCTION public.districts_in_view(_year integer, min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(id integer, metro_id integer, metro_code text, metro_name text, district_name text, state text, year integer, geom text)
 LANGUAGE sql
AS $function$
select
  d.id, m.id, my.metro_code, m.name, d.name, m.state, y.year, ST_AsGeoJSON(d.geom) as geom
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


