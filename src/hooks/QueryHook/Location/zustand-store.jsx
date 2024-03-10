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
  setLocation: (locationArray) => {
    console.log(
      `🚀 ~ file: zustand-store.jsx:26 ~ locationArray:`,
      locationArray
    );
    set({ locationArray });
  },
}));

export default useSelfieStore;
