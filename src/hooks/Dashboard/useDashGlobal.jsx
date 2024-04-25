import create from "zustand";

const useDashGlobal = create((set) => ({
  selectedYear: {
    label: new Date().getFullYear(),
    value: new Date().getFullYear(),
  },
  setSelectedYear: (year) => set({ selectedYear: year }),
}));

export default useDashGlobal;
