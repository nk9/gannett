import create from 'zustand';
import { initialViewState, zoomDuration } from "@/constants";

const useMapStore = create((set, get) => ({
    mapRef: null,
    setMapRef: (ref) => set({ mapRef: ref }),
    year: "1940",
    setYear: (year) => set({ year: year }),
    resetMap: () => {
        const mapRef = get().mapRef;
        if (mapRef) {
            mapRef?.flyTo({
                center: [initialViewState.longitude, initialViewState.latitude],
                duration: zoomDuration,
                zoom: initialViewState.zoom
            })
        }
    },
    isInInitialViewState: () => {
        const mapRef = get().mapRef;
        if (mapRef) {
            const center = mapRef.getCenter();
            const zoom = mapRef.getZoom();

            if (Math.round(center.lng) == initialViewState.longitude &&
                Math.round(center.lat) == initialViewState.latitude &&
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
    setSelectedDistrict: (newDistrict) => set({ selectedDistrict: newDistrict })
}));

export default useMapStore;
