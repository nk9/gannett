set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.metros_for_year(_year integer)
 RETURNS TABLE(metro_id integer, metro_name text, state text, county text, geom text, nara_ed_maps_link text, ancestry_ed_maps_link text)
 LANGUAGE sql
AS $function$
select
  m.id, m.name, m.state, m.county, ST_AsGeoJSON(ST_Centroid(my.bbox)), my.nara_ed_maps_link, my.ancestry_ed_maps_link
from public.metro_year_info as my
  left join census_years as y on y.id = my.census_year_id
  left join metros as m on m.id = my.metro_id
where y.year = _year
$function$
;


