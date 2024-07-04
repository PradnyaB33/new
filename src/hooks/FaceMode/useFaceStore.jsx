import { create } from "zustand";

export const useFaceStore = create((set) => ({
  descriptor: null,
  setDescriptor: (descriptor) =>
    set({
      descriptor,
    }),
}));

export default useFaceStore;
