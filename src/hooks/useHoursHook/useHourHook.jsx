import { create } from "zustand";

const useHourHook = create((set) => ({
    justify: "",
 

  setJustify: (justify) => set({ justify }),
  
}));

export default useHourHook;
