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

<<<<<<< HEAD
export default useMissedJustifyState;
=======
export default useMissedJustifyState;
>>>>>>> 31c8cc2704c4650f3fc610d422bc97b625fc87c7
