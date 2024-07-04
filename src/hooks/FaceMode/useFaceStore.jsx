import { create } from "zustand";

export const useFaceStore = create((set) => ({
  descriptor: null,
  setDescriptor: (descriptor) =>
    set({
      descriptor,
    }),
  userDescriptor: null,
  setUserDescriptor: (userDescriptor) =>
    set({
      userDescriptor,
    }),
}));

export default useFaceStore;
