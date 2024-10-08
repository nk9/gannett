import { initialViewState, zoomDuration } from "@/constants";
import { create } from 'zustand';

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
        console.log("Setting map view", view);
        const newView = {
            ...initialViewState,
            ...view,
            // longitude: view.center[0],
            // latitude: view.center[1]
        };
        console.log("New map view to set:", newView);
        const mapRef = get().mapRef;
        if (mapRef) {
            let dest = {
                center: newView.center,
                duration: zoomDuration,
                zoom: newView.zoom
            };
            console.log("Flying to:", dest)
            mapRef?.flyTo(dest)
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
    currentZoomLevel: () => {
        const mapRef = get().mapRef;
        if (mapRef) {
            return mapRef.getZoom();
        }
        return null
    },
    selectedDistrict: {},
    setSelectedDistrict: (newDistrict) => set({ selectedDistrict: newDistrict }),
    selectedDistrictResources: [],
    setSelectedDistrictResources: (newResources) => set({ selectedDistrictResources: newResources }),
    searchInputValue: '',
    setSearchInputValue: (newValue) => set({ searchInputValue: newValue }),
    searchValue: null,
    setSearchValue: (newValue) => set({ searchValue: newValue }),
    clearSearch: () => {
        set({
            searchValue: null,
            searchInputValue: ''
        })
    },
    mapOptions: [],
    setMapOptions: (newValue) => set({ mapOptions: newValue })
}));

export default useMapState;
