import axios from "axios";
import { create } from "zustand";

const usePerformanceApi = create((set) => ({
  isTimeFinish: undefined,
  setIsTimeFinish: (isTimeFinish) => set({ isTimeFinish }),

  fetchPerformanceSetup: async ({ user, authToken }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getSetup/${user.organizationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    if (!response.ok) {
      const error = new Error("An error occurred while fetching the response.");
      if (response.status === 404) {
        error.status = 404;
        error.message = "TDS details not found";
      }
      throw error;
    }
    return response?.data;
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
