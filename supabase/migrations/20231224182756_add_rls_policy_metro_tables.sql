create policy "Enable read access for all users"
on "public"."metro_nums"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."metros"
as permissive
for select
to public
using (true);



