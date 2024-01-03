import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Button } from '@mui/material';

import EDMap from 'components/EDMap';
import YearsPicker from 'components/YearsPicker';
import InfoPanel from 'components/InfoPanel';
import { zoomThreshold } from "@/constants";
import { supabase } from '@/supabase';

import useMapStore from '/stores/mapStore';

const all_years = [1880, 1900, 1910, 1920, 1930, 1940]

export default function Index() {
    // On first render, router.query is empty.
    const router = useRouter();
    const { year: queryYear } = router.query;
    var [zoom, setZoom] = useState();
    var [allYears, setAllYears] = useState({});

    useEffect(() => {
        router.isReady && setYear(queryYear || "1940");
    }, [queryYear, router.isReady]);

    // Map state
    const localUse = (prop) => useMapStore(state => state[prop])
    const isInInitialViewState = localUse('isInInitialViewState')
    const mapRef = localUse('mapRef')
    const resetMap = localUse('resetMap')
    const setMarkerCoords = localUse('setMarkerCoords')
    const selectedDistrict = localUse('selectedDistrict')
    const setSelectedDistrict = localUse('setSelectedDistrict')
    const year = localUse('year')
    const setYear = localUse('setYear')

    var [metros, setMetros] = useState({});
    var [metroInfo, setMetroInfo] = useState({});
    var [districts, setDistricts] = useState({});
    var [roads, setRoads] = useState({});
    var [mapViewport, setMapViewport] = useState({
        min_lat: 40.34839,
        min_long: -79.99880,
        max_lat: 40.47536,
        max_long: -79.90963
    })

    const [resetButtonDisabled, setResetButtonDisabled] = useState(false)
    useEffect(() => {
        setResetButtonDisabled(isInInitialViewState())
    }, [mapViewport, mapRef])

    
    const [districtName, setDistrictName] = useState("Select a point")
    
    useEffect(() => {
        async function fetchData() {
            var tasks = [
                async () => {
                    let { data: year_data, error } = await supabase.rpc('years_in_view', mapViewport)
                    // console.log("years_in_view response:", year_data, error)

                    if (year_data) {
                        const available_years = new Set(year_data.map(item => item.year));
                        setAllYears(all_years.reduce((result, year) => {
                            result[year] = available_years.has(year)
                            return result
                        }, {}))
                        // console.log("allYears:", allYears)
                    }
                }]

            if (year && zoom >= zoomThreshold) {
                let args = { _year: parseInt(year), ...mapViewport };

                tasks.push(
                    async () => {
                        let { data: district_data, error } = await supabase.rpc('districts_in_view', args);
                        // console.log("districts_in_view response:", district_data, error)

                        if (district_data) {
                            setDistricts({
                                type: "FeatureCollection",
                                features: district_data.map((f) => ({
                                    type: "Feature",
                                    properties: {
                                        metro_id: f.metro_id,
                                        district: f.district_name,
                                        metro_code: f.metro_code,
                                        metro: f.metro_name,
                                        year: f.year
                                    },
                                    geometry: JSON.parse(f.geom)
                                }))
                            });
                            // console.log(districts)
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
                    // },
                )
            }
            await Promise.all(tasks.map(p => p()))
        }
        fetchData();
    }, [mapViewport, year, queryYear, zoom]);

    // Only load when the year changes
    useEffect(() => {
        async function fetchMetroData() {
            const parsedYear = parseInt(year)

            if (parsedYear) {
                let args = { _year: parsedYear };
                // console.log("calling metros_for_year", args)
                let { data: metros_data, error } = await supabase.rpc('metros_for_year', args);
                // console.log("metros_for_year response:", metros_data, error)

                if (metros_data) {
                    const metros_for_year = {
                        type: "FeatureCollection",
                        features: metros_data.map((f) => ({
                            type: "Feature",
                            properties: {
                                metro: f.metro_name,
                                state: f.state,
                            },
                            geometry: JSON.parse(f.geom)
                        }))
                    }
                    console.log(metros_for_year)
                    setMetros(metros_for_year);

                    var metro_info = metros_data.reduce((result, dict) => {
                        result[dict.metro_id] = {
                            nara_ed_maps_link: dict.nara_ed_maps_link,
                            ancestry_ed_maps_link: dict.ancestry_ed_maps_link,
                            state: dict.state,
                            county: dict.county
                        }
                        return result
                    }, {})
                    setMetroInfo(metro_info);
                }
            }
        }
        fetchMetroData();
    }, [year])

    const clickResetMap = () => {
        setMarkerCoords(null);
        setSelectedDistrict({});
        resetMap();
    }

    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid xs={2}>
                    <InfoPanel metroInfo={metroInfo} districtDict={selectedDistrict} />
                </Grid>
                <Grid xs={10}>
                    <div style={{ position: "sticky" }}>
                        <YearsPicker allYears={allYears} year={year} setYear={setYear} />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ position: "absolute", bottom: 18 }}
                            onClick={clickResetMap}
                            disabled={resetButtonDisabled}>Reset</Button>
                    </div>
                    <EDMap
                        metros={metros}
                        districts={districts}
                        roads={roads}
                        setMapViewport={setMapViewport}
                        setZoom={setZoom} />
                </Grid>
            </Grid>
        </Container>
    );
}
