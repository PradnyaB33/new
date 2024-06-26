import { create } from "zustand";

export const useEmployeeListStore = create((set) => ({
  employeeList: [],
  setEmployeeList: (employeeList) => set({ employeeList }),
}));

export default useEmployeeListStore;
