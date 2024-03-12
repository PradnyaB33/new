import { create } from "zustand";

const useSelfieStore = create((set) => ({
  open: false,
  media: null,
  punchObjectId: null,
  start: false,
  count: 0,
  locationArray: [],
  temporaryArray: [],
  id: null,
  setOpen: (open) => {
    set({ open });
  },
  setMedia: (media) => {
    set({ media });
  },
  setPunchObjectId: (punchObjectId) => {
    set({ punchObjectId });
  },
  setStart: (start) => {
    set({ start });
  },
  setCount: (count) => {
    set((state) => ({ count: state.count + count }));
  },
  setLocation: (locationObject) => {
    set((state) => ({
      locationArray: [...state.locationArray, locationObject],
    }));
  },
  setTemporaryArray: ({ latitude, longitude }) => {
    console.log(`🚀 ~ file: zustand-store.jsx:33 ~ { latitude, longitude }:`, {
      latitude,
      longitude,
    });
    set((state) => ({
      temporaryArray: [
        ...state.temporaryArray,
        { lat: latitude, lng: longitude },
      ],
    }));
  },
  clearTemporaryArray: () => {
    set({ temporaryArray: [] });
  },
  setId: (id) => set({ id }),
}));

export default useSelfieStore;
