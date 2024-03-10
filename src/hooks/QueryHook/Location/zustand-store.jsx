import { create } from "zustand";

const useSelfieStore = create((set) => ({
  open: false,
  media: null,
  punchObjectId: null,
  start: false,
  count: 0,
  locationArray: [
    {
      lng: parseFloat(73.7595417),
      lat: parseFloat(18.6019794),
      _id: "65edf534aeda17befde7f80d",
      updatedAt: "2024-03-10T18:00:20.953Z",
      createdAt: "2024-03-10T18:00:20.953Z",
    },
    {
      lng: parseFloat(73.7595417),
      lat: parseFloat(18.6019794),
      _id: "65edf534aeda17befde7f80d",
      updatedAt: "2024-03-10T18:00:20.953Z",
      createdAt: "2024-03-10T18:00:20.953Z",
    },
  ],
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
