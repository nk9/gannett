import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { createClient } from '@supabase/supabase-js'

import EDMap from 'components/EDMap';
import YearsPicker from 'components/YearsPicker';

export default function Index() {
    // On first render, router.query is empty.
    const router = useRouter();
    const { year: queryYear } = router.query;
    var [year, setYear] = useState();

    useEffect(() => {
        router.isReady && setYear(queryYear || "1940");
    }, [queryYear, router.isReady]);

    console.log(router.query)

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    var [layerData, setLayerData] = useState({});
    var [mapViewport, setMapViewport] = useState({
        min_lat: 40.34839,
        min_long: -79.99880,
        max_lat: 40.47536,
        max_long: -79.90963
    })

    useEffect(() => {
        async function fetchData() {
            if (year) {
                let args = { _year: year, ...mapViewport };
                console.log("args:", args)
                let { data, error } = await supabase.rpc('districts_in_view', args);
                console.log("supabase fetch response:", data, error)

                if (data) {
                    setLayerData({
                        type: "FeatureCollection",
                        features: data.map((f) => ({
                            type: "Feature",
                            properties: {
                                district: f.district_name,
                                city: f.city_name,
                                year: f.year
                            },
                            geometry: JSON.parse(f.geom)
                        }))
                    });
                    console.log(layerData)
                }
            }
        }
        fetchData();
    }, [mapViewport, year, queryYear]);
 
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 12 }}>
                <YearsPicker year={year} setYear={setYear} />
                <EDMap layerData={layerData} setMapViewport={setMapViewport} />
            </Box>
        </Container>
    );
}
