CREATE INDEX districts_geo_index ON public.districts USING gist (geom);


