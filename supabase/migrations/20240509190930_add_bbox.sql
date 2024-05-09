drop function if exists "public"."metros_for_year"(_year integer);

drop function if exists "public"."years_in_view"(min_lat double precision, min_long double precision, max_lat double precision, max_long double precision);

alter table "public"."metro_year_info" add column "bbox" geography(Polygon,4326);

set check_function_bodies = off;

create or replace view "public"."metro_years" as  SELECT cy.year,
    m.state,
    my.county_code,
    my.county,
    m.name,
    m.geom,
    m.utp_code,
    cy.id AS census_year_id,
    m.id AS metro_id,
    my.id AS metro_year_id,
    my.bbox
   FROM ((metro_year_info my
     JOIN metros m ON ((my.metro_id = m.id)))
     JOIN census_years cy ON ((cy.id = my.census_year_id)));


CREATE OR REPLACE FUNCTION public.metros_for_year(_year integer)
 RETURNS TABLE(metro_id integer, metro_name text, state text, county text, county_code text, geom text)
 LANGUAGE sql
AS $function$
SELECT
  my.metro_id, my.name, my.state, my.county, my.county_code, ST_AsGeoJSON(my.geom)
FROM
  public.metro_years AS my
WHERE
  my.year = _year
$function$
;

CREATE OR REPLACE FUNCTION public.years_in_view(min_lat double precision, min_long double precision, max_lat double precision, max_long double precision)
 RETURNS TABLE(metro_id integer, metro_name text, year integer)
 LANGUAGE sql
AS $function$
SELECT
  my.metro_id, my.name, my.year
FROM
  public.metro_years AS my
WHERE
  (my.geom && ST_MakeBox2D(
    ST_Point(min_long, min_lat),
    ST_Point(max_long, max_lat)
  ):: geometry(Polygon, 4326)
)
$function$
;


