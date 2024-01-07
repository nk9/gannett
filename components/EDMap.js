import { useState, useCallback, useRef, useEffect } from "react";

import Map, { Popup, Source, Layer, ScaleControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, multiPolygon } from "@turf/helpers"
import { zoomThreshold, initialViewState, zoomDuration } from "@/constants";
import useMapState from '/stores/mapStore';
import SearchField from 'components/SearchField';
import MapControls from 'components/MapControls';
import Grid from '@mui/material/Grid'


export default function EDMap({ metros, districts, roads, setMapViewport, setZoom }) {
    const initialMapRef = useRef();

    const setMapRef = useMapState('setMapRef');
    const mapRef = useMapState('mapRef');
    const markerCoords = useMapState('markerCoords')
    const setMarkerCoords = useMapState('setMarkerCoords')
    const selectedDistrict = useMapState('selectedDistrict')
    const setSelectedDistrict = useMapState('setSelectedDistrict')

    useEffect(() => {
        // Set the initial map reference to the store when the component mounts
        setMapRef(initialMapRef.current);
    }, [setMapRef, initialMapRef.current]);

    const ed_color = "#009";
    const road_color = "#f00";

    const layers = [
        // {
        //     id: 'roads',
        //     data: roads,
        //     source_layers: [
        //         {
        //             interactive: false,
        //             style: {
        //                 id: 'roads',
        //                 type: 'line',
        //                 minzoom: zoomThreshold,
        //                 paint: {
        //                     'line-color': road_color,
        //                     'line-opacity': 1
        //                 }
        //             }
        //         },
        //         // {
        //         //     interactive: false,
        //         //     style: {
        //         //         id: 'road_names',
        //         //         type: 'symbol',
        //         //         minzoom: zoomThreshold,
        //         //         layout: {
        //         //             'text-field': ["get", "name"],
        //         //             'symbole-placement': "line"
        //         //         }
        //         //     }
        //         // }
        //     ]
        // },
        {
            id: 'districts',
            data: districts,
            source_layers: [
                {
                    interactive: true,
                    style: {
                        id: 'ed_interactive',
                        type: 'fill',
                        minzoom: zoomThreshold,
                        paint: {
                            'fill-color': '#009',
                            'fill-opacity': [
                                'case',
                                ['==', ['get', 'district'], selectedDistrict?.props?.district ?? "NO_ED_NAME"], // if case
                                0.2, // then do this
                                0] // else
                        }
                    }
                },
                {
                    interactive: false,
                    style: {
                        id: 'ed_boundaries',
                        type: 'line',
                        minzoom: zoomThreshold,
                        paint: {
                            'line-color': ed_color,
                            'line-opacity': 0.7,
                            'line-dasharray': [5, 5]
                        }
                    }
                },
                {
                    interactive: false,
                    style: {
                        id: 'ed_names',
                        type: 'symbol',
                        minzoom: zoomThreshold,
                        layout: {
                            'text-field': ["get", "district"]
                        },
                        paint: {
                            'text-color': ed_color
                        }
                    }
                }
            ]
        },
        {
            id: 'metros',
            data: metros,
            source_layers: [
                {
                    interactive: true,
                    style: {
                        id: 'metros',
                        type: 'circle',
                        maxzoom: zoomThreshold,
                        paint: {
                            'circle-radius': 7,
                            'circle-stroke-width': 2,
                            'circle-stroke-color': "#fff",
                            'circle-color': 'rgba(227, 6, 19, 1.0)'
                        },
                    }
                },
                {
                    interactive: false,
                    style: {
                        id: 'metro_names',
                        type: 'symbol',
                        maxzoom: zoomThreshold,
                        layout: {
                            'text-field': ["get", "metro"],
                            'text-offset': [0, 1]
                        },
                        paint: {
                            'text-color': 'black',
                            'text-halo-color': 'white',
                            'text-halo-width': 2,
                            'text-halo-blur': 1

                        }
                    }

                }
            ]
        }
    ]

    var sources = [];
    var interactiveLayerIds = [];
    for (const { id: source_id, data, source_layers } of layers) {
        if (data && (Object.keys(data).length >= 1)) {
            var children = [];
            for (const { interactive, style } of source_layers) {
                children.push(
                    <Layer key={style.id} {...style} />
                )
                if (interactive) {
                    interactiveLayerIds.push(style.id);
                }
            }
            sources.push(
                <Source key={source_id} type="geojson" data={data}>
                    {children}
                </Source>
            )
        }
    }

    const onClick = (e) => {
        // Zoom into a city if we click on one
        if (e.features && e.features.length && e.features[0].layer.id == 'metros') {
            var coords = e.features[0].geometry.coordinates;
            mapRef?.flyTo({
                center: [coords[0], coords[1]],
                duration: zoomDuration,
                zoom: zoomThreshold
            })
        }
        else {
            setMarkerCoords({
                longitude: e.lngLat.lng,
                latitude: e.lngLat.lat
            })
        }
    };

    const onViewportChange = (event) => {
        if (mapRef) {
            const bounds = mapRef.getBounds();
            setMapViewport({
                min_lat: bounds._ne.lat,
                min_long: bounds._ne.lng,
                max_lat: bounds._sw.lat,
                max_long: bounds._sw.lng
            });
            setZoom(event.viewState.zoom);
        }
    }

    const [cursor, setCursor] = useState('auto');
    const onMouseEnter = useCallback(() => setCursor('pointer'), []);
    const onMouseLeave = useCallback(() => setCursor('auto'), []);

    useEffect(() => {
        if (districts?.features && markerCoords) {
            const markerPoint = point([markerCoords.longitude, markerCoords.latitude])
            
            var newDistrict = {};
            for (const feat of districts.features) {
                if (booleanPointInPolygon(markerPoint, feat.geometry)) {
                    newDistrict = {
                        props: feat.properties,
                        coordinates: [markerCoords.latitude, markerCoords.longitude]
                    }
                    break;
                }
            }            
            setSelectedDistrict(newDistrict)
        }
    }, [markerCoords, districts])


    return (
        <Map
            ref={initialMapRef}
            initialViewState={initialViewState}
            style={{ width: "100%", height: 600 }}
            mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL}
            styleDiffing
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            interactiveLayerIds={interactiveLayerIds}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDragEnd={onViewportChange}
            onZoomEnd={onViewportChange}
            cursor={cursor}
        >
            {sources}
            
            {markerCoords && <Marker
                longitude={markerCoords.longitude}
                latitude={markerCoords.latitude}
                anchor="bottom"
                offset={[0, 0]}
            />}

            <ScaleControl />
            <Grid
                container
                style={{
                  padding: "15px",
                  width: "100%",
                  justifyContent: "space-between",
                }}>
                <Grid item>
                    <SearchField />
                </Grid>
                <Grid item>
                    <MapControls />
                </Grid>
        </Grid>
        </Map>
    )
}

 
	
	
 
 
 
