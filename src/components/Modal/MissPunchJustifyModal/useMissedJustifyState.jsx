import { create } from "zustand";

const useMissedJustifyState = create((set) => {
  return {
    recordDate: undefined,
    punchInTime: undefined,
    punchOutTime: undefined,
    status: undefined,
    totalHours: undefined,
    justify: undefined,

    setJustify: (justify) => set({ justify }),
  };
});

export default useMissedJustifyState;
