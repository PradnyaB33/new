import { create } from "zustand";

const useSelfieStore = create((set) => ({
  open: false,
  media: null,
  punchObjectId: null,
  start: false,
  count: 0,
  locationArray: [],
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
}));

export default useSelfieStore;
