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
import { zoomThreshold, zoomLevel } from "@/constants";
import { supabase } from '@/supabase';

import useMapState from '/stores/mapStore';

const all_years = [1880, 1900, 1910, 1920, 1930, 1940]

export default function Index() {
    // On first render, router.query is empty.
    const router = useRouter();
    const { year: queryYear, state: queryState, ed: queryED, metro: queryMetro } = router.query;
    var [allYears, setAllYears] = useState({});

    // Map state
    const isInInitialViewState = useMapState('isInInitialViewState')
    const mapRef = useMapState('mapRef')
    const setMapView = useMapState('setMapView')
    const setMarkerCoords = useMapState('setMarkerCoords')
    const selectedDistrict = useMapState('selectedDistrict')
    const setSelectedDistrict = useMapState('setSelectedDistrict')
    const setSelectedDistrictResources = useMapState('setSelectedDistrictResources')
    const year = useMapState('year')
    const setYear = useMapState('setYear')
    const clearSearch = useMapState('clearSearch')
    const currentZoomLevel = useMapState('currentZoomLevel')

    var [metros, setMetros] = useState({});
    var [metroInfo, setMetroInfo] = useState({});
    var [districts, setDistricts] = useState({});
    var [roads, setRoads] = useState({});
    var [mapViewport, setMapViewport] = useState({})

    const [resetButtonDisabled, setResetButtonDisabled] = useState(false)
    useEffect(() => {
        setResetButtonDisabled(isInInitialViewState())
    }, [mapViewport, mapRef])

    
    useEffect(() => {
        if (router.isReady) {
            setYear(queryYear || "1940");
            
            if (queryYear && queryState && queryED) {
                async function fetchDistrict() {
                    let components = queryED.split("-")
                    if (components.length == 2) {
                        let args = {
                            _year: parseInt(queryYear),
                            _state: queryState,
                            _county_code: components[0],
                            _district_name: components[1]
                        };
                        let { data, error } = await supabase.rpc('lookup_district', args);

                        if (!error && data[0]) {
                            let dist = data[0];
                            setMarkerCoords({
                                longitude: dist.point.coordinates[0],
                                latitude: dist.point.coordinates[1]
                            })
                            setMapView({
                                center: dist.point.coordinates,
                                zoom: zoomLevel.district
                            })
                        }
                    }

                    // We don't want the state and ED to stick around after load, or they
                    // will cause all sorts of UX weirdness and corner cases. So remove
                    // them from the URL's query params.
                    const { state, ed, ...routerQuery } = router.query
                    router.replace({ query: { ...routerQuery } });
                }
                fetchDistrict();
            }
            else if (queryYear && queryState && queryMetro) {
                async function fetchMetro() {
                    let { data, error } = await supabase.from('metro_year_info')
                        .select('census_years!inner (year), metros!inner (name, state, geom)')
                        .eq('census_years.year', parseInt(queryYear))
                        .eq('metros.state', queryState)
                        .eq('metros.name', queryMetro);

                    if (!error && data.length) {
                        let metro = data[0];
                        setMapView({
                            center: metro.metros.geom.coordinates,
                            zoom: zoomLevel.metro
                        })
                    }

                    // As above, remove the query components to avoid UX problems.
                    const { state, metro, ...routerQuery } = router.query
                    router.replace({ query: { ...routerQuery } });
                }
                fetchMetro();
            }
        }
    }, [queryYear, queryED, queryState, queryMetro, router.isReady]);

    useEffect(() => {
        async function fetchData() {
            var tasks = [
                async () => {
                    if (Object.keys(mapViewport).length == 4) {
                        let { data: year_data, error } = await supabase.rpc('years_in_view', mapViewport)
                        console.log("years_in_view response:", year_data, error)
                    
                        if (year_data) {
                            const available_years = new Set(year_data.map(item => item.year));
                            setAllYears(all_years.reduce((result, year) => {
                                result[year] = available_years.has(year)
                                return result
                            }, {}))
                            // console.log("allYears:", allYears)
                        }
                    }
                }]

            if (year && currentZoomLevel() >= zoomThreshold) {
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
                                        district_id: f.id,
                                        district: f.district_name,
                                        metro_code: f.metro_code,
                                        metro: f.metro_name,
                                        state: f.state,
                                        year: f.year
                                    },
                                    geometry: JSON.parse(f.geom)
                                }))
                            });
                            // console.log(districts)
                        }
                    },
                    async () => {
                        let { data: roads_data, error } = await supabase.rpc('roads_in_view', args);
                        // console.log("roads_in_view response:", roads_data, error)

                        if (roads_data) {
                            setRoads({
                                type: "FeatureCollection",
                                features: roads_data.map((f) => ({
                                    type: "Feature",
                                    properties: {
                                        name: f.name,
                                        city: f.city,
                                        year: f.year
                                    },
                                    geometry: JSON.parse(f.geom)
                                }))
                            });
                        }
                    },
                )
            }
            await Promise.all(tasks.map(p => p()))
        }
        fetchData();
    }, [mapViewport, year, queryYear, currentZoomLevel]);

    // Only when the selected ED changes
    useEffect(() => {
        async function fetchResources() {
            if (selectedDistrict && selectedDistrict.props) {
                let { data, error } = await supabase.from('district_resources')
                    .select()
                    .eq('district_id', selectedDistrict.props.district_id);

    
                if (!error) {
                    setSelectedDistrictResources(data);
                } else {
                    console.log("Error fetching district resources:", error);
                    setSelectedDistrictResources([]);
                }
            }
        }
        fetchResources();
    }, [selectedDistrict])

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
        setMapView({});
        clearSearch();
    }

    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid xs={2}>
                    <InfoPanel metroInfo={metroInfo} />
                </Grid>
                <Grid xs={10}>
                    <div style={{ height: 60, position: "sticky" }}>
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
                        setMapViewport={setMapViewport} />
                </Grid>
            </Grid>
        </Container>
    );
}
