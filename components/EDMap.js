import { useState, useCallback, useRef, useEffect } from "react";

import Map, { Popup, Source, Layer, ScaleControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, multiPolygon } from "@turf/helpers"
import { zoomThreshold } from "@/constants";


export default function EDMap({ metros, districts, roads, setMapViewport, setSelectedDistrict, setZoom }) {
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
                            'fill-opacity': 0
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
                },
            ]
        },
        {
            id: 'metros',
            data: metros,
            source_layers: [
                {
                    interactive: false,
                    style: {
                        id: 'metros',
                        type: 'circle',
                        maxzoom: zoomThreshold,
                        paint: {
                            'circle-radius': 60,
                            'circle-color': 'rgba(55,148,179,1)'
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
                            'text-field': ["get", "metro"]
                        },
                        paint: {
                            'text-color': 'orange'
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
            console.log(source_id, data)
            sources.push(
                <Source key={source_id} type="geojson" data={data}>
                    {children}
                </Source>
            )
        }
    }

    const onClick = (event) => {
        setMarkerCoords({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat
        })
    };

    const onViewportChange = (event) => {
        console.log("onViewportChange")
        const bounds = mapRef.current.getBounds();
        setMapViewport({
            min_lat: bounds._ne.lat,
            min_long: bounds._ne.lng,
            max_lat: bounds._sw.lat,
            max_long: bounds._sw.lng
        });
        setZoom(event.viewState.zoom);
    }

    const mapRef = useRef();
    const [cursor, setCursor] = useState('auto');
    const onMouseEnter = useCallback(() => setCursor('pointer'), []);
    const onMouseLeave = useCallback(() => setCursor('auto'), []);

    const initialViewState = {
        longitude: -79.94880,
        latitude: 40.44839,
        zoom: 15.5
    }

    const [markerCoords, setMarkerCoords] = useState({
        longitude: initialViewState.longitude,
        latitude: initialViewState.latitude
    });

    useEffect(() => {
        if (districts?.features) {
            const markerPoint = point([markerCoords.longitude, markerCoords.latitude])
            
            for (const feat of districts.features) {
                if (booleanPointInPolygon(markerPoint, feat.geometry)) {
                    setSelectedDistrict({
                        props: feat.properties,
                        coordinates: [markerCoords.latitude, markerCoords.longitude]
                    }
                    )
                }
            }
        }
    }, [markerCoords, districts])


    return (
        <Map
            ref={mapRef}
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
            
            <Marker
                longitude={markerCoords.longitude}
                latitude={markerCoords.latitude}
                anchor="bottom"
                offset={[0, 0]}
            />

            <ScaleControl />
        </Map>
    )
}
