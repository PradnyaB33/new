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

    return response?.data;
  },

  getEmployeePerformance: async ({ id, authToken }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getEmployeeDashboard/${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

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
