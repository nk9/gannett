import { useContext } from "react";

import Map, { Popup, Source, Layer, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function EDMap({ layerData, setMapViewport }) {
    const layers = {
        eds: {
            style: {
                'id': 'eds',
                'type': 'fill',
                'paint': {
                    'fill-color': '#009',
                    'fill-opacity': 0.2
                }
            }
        }
    }

    const edSource = (
        <Source key="hi" type="geojson" data={layerData}>
            <Layer {...layers.eds.style} />
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
            mapStyle="mapbox://styles/mapbox/light-v9"
            styleDiffing
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        >
            {layerData && edSource}

            <ScaleControl />
        </Map>
    )
}
