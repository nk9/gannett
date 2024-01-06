import create from 'zustand';
import { initialViewState, zoomDuration } from "@/constants";

// From https://stackoverflow.com/a/75403388/1749551
// export function useMulti(useFunc, ...items) {
//     return items.reduce((carry, item) => ({
//         ...carry,
//         [item]: useFunc(state => state[item]),
//     }), {})
// }

const useMapState = (prop) => useMapStore(state => state[prop])


const useMapStore = create((set, get) => ({
    mapRef: null,
    setMapRef: (ref) => set({ mapRef: ref }),
    year: "1940",
    setYear: (year) => set({ year: year }),
    setMapView: (view) => {
        const newView = { ...initialViewState, ...view };
        const mapRef = get().mapRef;
        if (mapRef) {
            mapRef?.flyTo({
                center: newView.center,
                duration: zoomDuration,
                zoom: newView.zoom
            })
        }
    },
    isInInitialViewState: () => {
        const mapRef = get().mapRef;
        if (mapRef) {
            const center = mapRef.getCenter();
            const zoom = mapRef.getZoom();

            if (Math.round(center.lng) == initialViewState.center[0] &&
                Math.round(center.lat) == initialViewState.center[1] &&
                zoom == initialViewState.zoom) {
                return true
            }

        }
        return false
    },
    markerCoords: null,
    setMarkerCoords: (coords) => set({ markerCoords: coords }),
    zoom: () => {
        const mapRef = get().mapRef;
        if (mapRef) {
            return mapRef.getZoom();
        }
        return null
    },
    selectedDistrict: {},
    setSelectedDistrict: (newDistrict) => set({ selectedDistrict: newDistrict }),
    searchInputValue: '',
    setSearchInputValue: (newValue) => set({searchInputValue: newValue}),
    searchValue: null,
    setSearchValue: (newValue) => set({searchValue: newValue}),
    clearSearch: () => {
        set({
            searchValue: null,
            searchInputValue: ''
        })
    }
}));

export default useMapState;
