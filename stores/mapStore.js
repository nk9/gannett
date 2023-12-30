import create from 'zustand';
import { initialViewState, zoomDuration } from "@/constants";

const useMapStore = create((set, get) => ({
    mapRef: null,
    setMapRef: (ref) => set({ mapRef: ref }),
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
    }
}));

export default useMapStore;
