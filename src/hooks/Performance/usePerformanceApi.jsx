import axios from "axios";
import { create } from "zustand";

const usePerformanceApi = create((set) => ({
  isTimeFinish: undefined,
  setIsTimeFinish: (isTimeFinish) => set({ isTimeFinish }),

  fetchPerformanceSetup: async ({ user, authToken }) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getSetup/${user.organizationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  },

  getPerformanceDashboardTable: async ({ role, authToken }) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getPerformanceDashboard/${role}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  },
}));

export default usePerformanceApi;
