import { create } from "zustand";

const useCustomStates = create((set) => ({
  newAppliedLeaveEvents: [],
  setNewAppliedLeaveEvents: (newLeave) =>
    set((state) => ({
      newAppliedLeaveEvents: [...(state.newAppliedLeaveEvents || []), newLeave],
    })),
  removeNewAppliedLeaveEvents: (id) =>
    set((state) => ({
      newAppliedLeaveEvents: state.newAppliedLeaveEvents.filter(
        (item, index) => index !== id
      ),
    })),
  selectedLeave: {},
  setSelectedLeave: (selectedLeave) => set({ selectedLeave }),
  changeTable: false,
  setChangeTable: (changeTable) => set({ changeTable }),
  selectEvent: false,
  setSelectEvent: (selectEvent) => set({ selectEvent }),
}));

export default useCustomStates;
