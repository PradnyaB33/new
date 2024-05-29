import { create } from "zustand";

const useNotificationCount = create((set) => ({
  notificationCount: 0,
  setNotificationCount: (notificationCount) => {
    set((state) => ({
      notificationCount: state.notificationCount + notificationCount,
    }));
  },
}));

export default useNotificationCount;
