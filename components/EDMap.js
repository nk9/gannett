import { useContext } from "react";

import Map, { Popup, Source, Layer, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function EDMap({ layerData, setMapViewport }) {
    const layers = {
        ed_boundaries: {
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
            style: {
                'id': 'ed_names',
                'type': 'symbol',
                'layout': {
                    'text-field': ["get", "district"]
                }
            }
        }
    }

    const edSource = (
        <Source key="hi" type="geojson" data={layerData}>
            <Layer {...layers.ed_boundaries.style} />
            <Layer {...layers.ed_names.style} />
        </Source>
    );
    console.log("edSource:", layerData, edSource)

    return (
        <Map
            initialViewState={{
                longitude: -79.94880,
                latitude: 40.44839,
                zoom: 15.5
            }}
            style={{ width: "100%", height: 600 }}
            mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL}
            styleDiffing
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        >
            {layerData && edSource}

            <ScaleControl />
        </Map>
    )
}
