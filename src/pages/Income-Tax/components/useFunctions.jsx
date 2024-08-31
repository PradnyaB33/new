import { create } from "zustand";

const useFunctions = create((set) => ({
  page: 1,
  setPage: (page) => set({ page }),
  search: "",
  setSearch: (search) => set({ search }),
  deleteConfirm: null,
  setDeleteConfirm: (deleteConfirm) => set({ deleteConfirm }),
  editOpen: null,
  setEditOpen: (editOpen) => set({ editOpen }),
  isOpenCalculation: [],
  setIsOpenCalculation: (section) =>
    set((state) => {
      if (state.isOpenCalculation.includes(section)) {
        return {
          isOpenCalculation: state.isOpenCalculation.filter(
            (item) => item !== section
          ),
        };
      } else {
        return {
          isOpenCalculation: [...state.isOpenCalculation, section],
        };
      }
    }),
}));

export default useFunctions;
