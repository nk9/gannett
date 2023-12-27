import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import { createClient } from '@supabase/supabase-js'

import EDMap from 'components/EDMap';
import YearsPicker from 'components/YearsPicker';
import InfoPanel from 'components/InfoPanel';
import District from '@/District';

const all_years = [1880, 1900, 1910, 1920, 1930, 1940]

export default function Index() {
    // On first render, router.query is empty.
    const router = useRouter();
    const { year: queryYear } = router.query;
    var [year, setYear] = useState();
    var [allYears, setAllYears] = useState({});

    useEffect(() => {
        router.isReady && setYear(queryYear || "1940");
    }, [queryYear, router.isReady]);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    var [districts, setDistricts] = useState({});
    var [roads, setRoads] = useState({});
    var [mapViewport, setMapViewport] = useState({
        min_lat: 40.34839,
        min_long: -79.99880,
        max_lat: 40.47536,
        max_long: -79.90963
    })
    
    const [districtName, setDistrictName] = useState("Select a point")
    const [selectedDistrict, setSelectedDistrict] = useState(new District())
    
    useEffect(() => {
        async function fetchData() {
            var tasks = [
                async () => {
                    let { data: year_data, error } = await supabase.rpc('years_in_view', mapViewport)
                    console.log("years_in_view response:", year_data, error)

                    if (year_data) {
                        const available_years = new Set(year_data.map(item => item.year));
                        setAllYears(all_years.reduce((result, year) => {
                            result[year] = available_years.has(year)
                            return result
                        }, {}))
                        console.log("allYears:", allYears)
                    }
                }]

            if (year) {
                let args = { _year: parseInt(year), ...mapViewport };

                tasks.push(
                    async () => {
                        console.log("calling districts_ with args", args)
                        let { data: district_data, error } = await supabase.rpc('districts_in_view', args);
                        console.log("districts_in_view response:", district_data, error)

                        if (district_data) {
                            setDistricts({
                                type: "FeatureCollection",
                                features: district_data.map((f) => ({
                                    type: "Feature",
                                    properties: {
                                        district: f.district_name,
                                        city: f.city_name,
                                        year: f.year
                                    },
                                    geometry: JSON.parse(f.geom)
                                }))
                            });
                            console.log(districts)
                        }
                    },
                    // async () => {
                    //     let { data: roads_data, error } = await supabase.rpc('roads_in_view', args);
                    //     console.log("roads_in_view response:", roads_data, error)

                    //     if (roads_data) {
                    //         setRoads({
                    //             type: "FeatureCollection",
                    //             features: roads_data.map((f) => ({
                    //                 type: "Feature",
                    //                 properties: {
                    //                     name: f.name,
                    //                     city: f.city,
                    //                     year: f.year
                    //                 },
                    //                 geometry: JSON.parse(f.geom)
                    //             }))
                    //         });
                    //     }
                    // }
                )
                await Promise.all(tasks.map(p => p()))
            }
        }
        fetchData();
    }, [mapViewport, year, queryYear]);

 
    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid xs={2}>
                    <InfoPanel district={selectedDistrict} />
                </Grid>
                <Grid xs={10}>
                    <YearsPicker allYears={allYears} year={year} setYear={setYear} />
                    <EDMap
                        districts={districts}
                        roads={roads}
                        setMapViewport={setMapViewport}
                        setSelectedDistrict={setSelectedDistrict} />
                </Grid>
            </Grid>
        </Container>
    );
}
