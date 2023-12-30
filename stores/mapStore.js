import create from 'zustand';

const useMapStore = create((set, get) => ({
  mapRef: null,
  setMapRef: (ref) => set({ mapRef: ref }),
  doSomethingInMap: () => {
    console.log("do the thing")
    const mapRef = get().mapRef;
    if (mapRef) {
      // Your function logic here
      console.log('Doing something in the map component');
    }
  },
}));

export default useMapStore;
