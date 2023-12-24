import { useState, useCallback, useRef, useEffect } from "react";

import Map, { Popup, Source, Layer, ScaleControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, multiPolygon } from "@turf/helpers"
import District from '/src/District';


export default function EDMap({ districts, roads, setMapViewport, setSelectedDistrict }) {
    const ed_color = "#009";
    const road_color = "#f00";

    const layers = [
        {
            id: 'roads',
            data: roads,
            source_layers: [
                {
                    interactive: false,
                    style: {
                        id: 'roads',
                        type: 'line',
                        paint: {
                            'line-color': road_color,
                            'line-opacity': 1
                        }
                    }
                },
                // {
                //     interactive: false,
                //     style: {
                //         id: 'road_names',
                //         type: 'symbol',
                //         layout: {
                //             'text-field': ["get", "name"],
                //             'symbole-placement': "line"
                //         }
                //     }
                // }
            ]
        },
        {
            id: 'districts',
            data: districts,
            source_layers: [
                {
                    interactive: true,
                    style: {
                        id: 'ed_interactive',
                        type: 'fill',
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
                        layout: {
                            'text-field': ["get", "district"]
                        },
                        paint: {
                            'text-color': ed_color
                        }
                    }
                },
            ]
        }
    ]

    var sources = [];
    var interactiveLayerIds = [];
    for (const { id: source_id, data, source_layers } of layers) {
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

    const onClick = (event) => {
        console.log("event", event)
        const feature = event.features[0];
        if (feature) {

            // calculate the bounding box of the feature
            // const [minLng, minLat, maxLng, maxLat] = bbox(feature);

            // mapRef.current.fitBounds(
            //     [
            //         [minLng, minLat],
            //         [maxLng, maxLat]
            //     ],
            //     { padding: 40, duration: 1000 }
            // );
        }

        setMarkerCoords({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat
        })
    };

    const onViewportChange = (event) => {
        const bounds = mapRef.current.getBounds();
        setMapViewport({
            min_lat: bounds._ne.lat,
            min_long: bounds._ne.lng,
            max_lat: bounds._sw.lat,
            max_long: bounds._sw.lng
        });
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
                    setSelectedDistrict(
                        new District(feat.properties,
                            [markerCoords.latitude, markerCoords.longitude])
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
