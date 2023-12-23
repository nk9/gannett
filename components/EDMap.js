import { useState, useCallback, useRef } from "react";

import Map, { Popup, Source, Layer, ScaleControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import bbox from '@turf/bbox';

export default function EDMap({ layerData, setMapViewport }) {
    const layers = {
        ed_interactive: {
            interactive: true,
            style: {
                'id': 'ed_interactive',
                'type': 'fill',
                'paint': {
                    'fill-opacity': 0
                }
            }
        },
        ed_boundaries: {
            interactive: false,
            style: {
                'id': 'ed_boundaries',
                'type': 'line',
                'paint': {
                    'line-color': "#009",
                    'line-opacity': 0.7
                }
            }
        },
        ed_names: {
            interactive: false,
            style: {
                'id': 'ed_names',
                'type': 'symbol',
                'layout': {
                    'text-field': ["get", "district"]
                }
            }
        }
    }

    var edLayers = [];
    var interactiveLayerIds = [];
    for (const [layerID, { layer, interactive, style }] of Object.entries(layers)) {
        edLayers.push(
            <Layer key={layerID} {...style} />
        )
        if (interactive) {
            interactiveLayerIds.push(layerID);
        }
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
    })

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
            cursor={cursor}
        >
            <Source key="hi" type="geojson" data={layerData}>
                {layerData && edLayers}
            </Source>

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
