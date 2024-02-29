alter table "public"."census_years" drop column "ancestry_ed_url";

alter table "public"."census_years" drop column "familysearch_ed_url";

alter table "public"."metro_year_info" drop column "ancestry_ed_maps_link";

alter table "public"."metro_year_info" drop column "nara_ed_maps_link";

create or replace view "public"."metro_years" as  SELECT cy.year,
    m.state,
    my.county_code,
    my.county,
    m.name,
    m.geom,
    m.utp_code,
    cy.id AS census_year_id,
    m.id AS metro_id,
    my.id AS metro_year_id
   FROM ((metro_year_info my
     JOIN metros m ON ((my.metro_id = m.id)))
     JOIN census_years cy ON ((cy.id = my.census_year_id)));



