import { create } from "zustand";

const useCustomStates = create((set) => ({
  newAppliedLeaveEvents: [],
  setNewAppliedLeaveEvents: (newLeave) =>
    set((state) => ({
      newAppliedLeaveEvents: [...(state.newAppliedLeaveEvents || []), newLeave],
    })),

  updateLeaveEvent: (id, value) =>
    set((state) => ({
      newAppliedLeaveEvents: state.newAppliedLeaveEvents.map((item, index) =>
        id === index
          ? { ...item, leaveTypeDetailsId: value?.value, title: value?.label }
          : item
      ),
    })),

  emptyAppliedLeaveEvents: () => set({ newAppliedLeaveEvents: [] }),

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
